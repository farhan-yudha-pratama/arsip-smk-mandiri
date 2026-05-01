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

    /**
     * 🔥 Upload & return PATH (bukan URL)
     */
    public function uploadBase64(string $base64, string $path, string $category = 'image'): string
    {
        try {
            [$binary, $mime, $extension] = $this->decodeBase64($base64);

            $this->validateSize($binary, $category);

            $filename = $path . '/' . Str::uuid() . '.' . $extension;

            $this->disk->put($filename, $binary);

            return $filename; // 🔥 SIMPAN INI KE DB

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

    /**
     * 🔥 Generate Temporary URL dari PATH
     */
    public function getTemporaryUrl(string $path, int $minutes = 10): string
    {
        try {
            if (!$this->disk->exists($path)) {
                throw new \Exception('File not found in S3');
            }

            return $this->disk->temporaryUrl(
                $path,
                Carbon::now()->addMinutes($minutes)
            );

        } catch (\Throwable $e) {
            Log::error('Generate Temporary URL Failed', [
                'path' => $path,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Optional: delete file
     */
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

    protected function validateSize(string $binary, string $category): void
    {
        $size = strlen($binary);

        $limits = [
            'image' => 2 * 1024 * 1024,
            'document' => 5 * 1024 * 1024,
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
            'image/png' => 'png',
            'image/webp' => 'webp',
            default => throw new \Exception('Unsupported MIME type'),
        };
    }
}