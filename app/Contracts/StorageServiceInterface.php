<?php

namespace App\Contracts;

interface StorageServiceInterface
{
    public function getDiskName(): string;
    public function get(string $path): ?string;
    public function exists(string $path): bool;
    public function uploadBase64(string $base64, string $path, string $category = 'image'): string;
    public function uploadFile(string $filePath, string $path, string $category = 'document', ?string $originalExtension = null): string;
    public function getUrl(string $path): string;
    public function getTemporaryUrl(string $path, ?int $minutes = null, bool $download = false, ?string $filename = null): string;
    public function delete(string $path): bool;
}
