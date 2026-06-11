<?php

namespace App\Services;

use App\Contracts\StorageServiceInterface;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class LocalStorageService implements StorageServiceInterface
{
    protected $disk;

    public function __construct()
    {
        $this->disk = Storage::disk('local');
    }

    public function getDiskName(): string
    {
        return 'local';
    }

    public function get(string $path): ?string
    {
        try {
            if (!$this->disk->exists($path)) {
                return null;
            }
            return $this->disk->get($path);
        } catch (\Throwable $e) {
            Log::error('Local Storage Get Failed', ['path' => $path, 'error' => $e->getMessage()]);
            return null;
        }
    }

    public function exists(string $path): bool
    {
        return $this->disk->exists($path);
    }
    
    public function uploadBase64(string $base64, string $path, string $category = 'image'): string
    {
        try {
            [$binary, $mime, $extension] = $this->decodeBase64($base64);

            $this->validateSize(strlen($binary), $category);

            $filename = $path . '/' . Str::uuid() . '.' . $extension;

            $this->disk->put($filename, $binary);

            return $filename;

        } catch (\Throwable $e) {
            Log::error('Local Storage Upload Failed', [
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
            Log::error('Local Storage File Upload Failed', [
                'error_type' => get_class($e),
                'message' => $e->getMessage(),
                'category' => $category,
                'path' => $path,
            ]);

            throw $e;
        }
    }

    public function getUrl(string $path): string
    {
        return $this->disk->url($path);
    }

    public function getTemporaryUrl(string $path, int $minutes = 10, bool $download = false, ?string $filename = null): string
    {
        // For local storage we don't use Temporary URL, the controllers should bypass this.
        throw new \Exception('getTemporaryUrl is not supported for Local disk. Controllers should use direct download.');
    }

    public function delete(string $path): bool
    {
        try {
            return $this->disk->delete($path);
        } catch (\Throwable $e) {
            Log::error('Local Storage Delete Failed', [
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
