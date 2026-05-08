<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;

class S3StorageService
{
    protected $disk;

    public function __construct()
    {
        $this->disk = Storage::disk('s3');
    }
    
    public function uploadBase64(string $base64, string $path, string $category = 'image'): string
    {
        try {
            [$binary, $mime, $extension] = $this->decodeBase64($base64);

            $this->validateSize(strlen($binary), $category);

            $filename = $path . '/' . Str::uuid() . '.' . $extension;

            $this->disk->put($filename, $binary);

            return $filename; //SIMPAN I NI KE DB

        } catch (\Throwable $e) {
            Log::error('S3 Upload Failed', [
                'error_type' => get_class($e),
                'message' => $e->getMessage(),
                'category' => $category,
                'path' => $path,
            ]);

            throw $e;
        }
    }

    public function uploadFile(string $filePath, string $path, string $category = 'document', ?string $originalExtension = null): string
    {
        try {
            if (!file_exists($filePath)) {
                throw new \Exception('File not found: ' . $filePath);
            }

            $this->validateSize(filesize($filePath), $category);

            $extension = $originalExtension ?? pathinfo($filePath, PATHINFO_EXTENSION);
            $filename = $path . '/' . Str::uuid() . '.' . $extension;

            $stream = fopen($filePath, 'r');
            $this->disk->put($filename, $stream);
            fclose($stream);

            return $filename;

        } catch (\Throwable $e) {
            Log::error('S3 File Upload Failed', [
                'error_type' => get_class($e),
                'message' => $e->getMessage(),
                'category' => $category,
                'path' => $path,
            ]);

            throw $e;
        }
    }

    public function getTemporaryUrl(string $path, int $minutes = 10, bool $download = false, ?string $filename = null): string
    {
        try {
            if (!$this->disk->exists($path)) {
                throw new \Exception('File not found in S3');
            }

            if (!config('filesystems.disks.s3.bucket') || !config('filesystems.disks.s3.key')) {
                return $this->disk->url($path);
            }

            
            $externalEndpoint = env('AWS_EXTERNAL_ENDPOINT', 'http://localhost:3900');
            
            $client = new \Aws\S3\S3Client([
                'version'                 => 'latest',
                'region'                  => config('filesystems.disks.s3.region', 'garage'),
                'credentials'             => [
                    'key'    => config('filesystems.disks.s3.key'),
                    'secret' => config('filesystems.disks.s3.secret'),
                ],
                'endpoint'                => $externalEndpoint,
                'use_path_style_endpoint' => config('filesystems.disks.s3.use_path_style_endpoint', true),
            ]);

            $params = [
                'Bucket' => config('filesystems.disks.s3.bucket'),
                'Key'    => $path,
            ];

            if ($download) {
                $disposition = 'attachment';
                if ($filename) {
                    $disposition .= '; filename="' . $filename . '"';
                }
                $params['ResponseContentDisposition'] = $disposition;
            }

            $command = $client->getCommand('GetObject', $params);

            $request = $client->createPresignedRequest($command, Carbon::now()->addMinutes($minutes));

            return (string) $request->getUri();

        } catch (\Throwable $e) {
            Log::error('Generate Temporary URL Failed', [
                'path' => $path,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    public function delete(string $path): bool
    {
        try {
            return $this->disk->delete($path);
        } catch (\Throwable $e) {
            Log::error('S3 Delete Failed', [
                'path' => $path,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    protected function decodeBase64(string $base64): array
    {
        if (!str_contains($base64, 'base64,')) {
            throw new \Exception('Invalid Base64 format');
        }

        [$meta, $data] = explode(',', $base64, 2);

        if (!preg_match('/data:(.*?);base64/', $meta, $matches)) {
            throw new \Exception('Invalid MIME type in Base64');
        }

        $mime = $matches[1];

        $binary = base64_decode($data, true);

        if ($binary === false) {
            throw new \Exception('Base64 decode failed');
        }

        $extension = $this->mimeToExtension($mime);

        return [$binary, $mime, $extension];
    }

    protected function validateSize(int $size, string $category): void
    {

        $limits = [
            'image' => 2 * 1024 * 1024,
            'document' => 100 * 1024 * 1024,
            'video' => 20 * 1024 * 1024,
        ];

        if (!isset($limits[$category])) {
            throw new \Exception('Invalid category');
        }

        if ($size > $limits[$category]) {
            throw new \Exception('File size exceeds limit');
        }
    }

    protected function mimeToExtension(string $mime): string
    {
        return match ($mime) {
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'application/pdf' => 'pdf',
        '@file/pdf' => 'pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
        '@file/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
        'application/msword' => 'doc',
        default => throw new \Exception('Unsupported MIME type: ' . $mime),
    };
    }
}