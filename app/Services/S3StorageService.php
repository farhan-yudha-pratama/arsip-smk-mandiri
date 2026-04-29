<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Contracts\Filesystem\Filesystem;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Imagick\Driver;
use Exception;

class S3StorageService
{
    /** @var Filesystem|\Illuminate\Filesystem\FilesystemAdapter */
    protected $disk;

    public function __construct()
    {
        // Menggunakan disk s3 dari config/filesystems.php
        $this->disk = Storage::disk('s3');
    }

    /**
     * Upload Base64 dengan Validasi, Kompresi, dan S3
     * * @param string $base64String
     * @param string $pathFolder
     * @param string $type
     * @return string
     * @throws Exception
     */
    public function uploadBase64(string $base64String, string $pathFolder, string $type = 'foto'): string
    {
        try {
            // 1. Validasi format Base64 & Decode
            if (!preg_match('/^data:(\w+\/[\w\-\.]+);base64,/', $base64String)) {
                throw new Exception("Format Base64 tidak valid.");
            }

            $fileData = explode(',', $base64String);
            $content  = base64_decode(end($fileData));

            if (!$content) {
                throw new Exception("Gagal melakukan decode Base64.");
            }

            // 2. Ambil Mime Type secara akurat
            $finfo    = finfo_open();
            $mimeType = (string) finfo_buffer($finfo, $content, FILEINFO_MIME_TYPE);
            finfo_close($finfo);

            // 3. Validasi Ukuran dan Tipe
            $this->validateFile($content, $mimeType, $type);

            // 4. Kompresi Khusus Foto
            if ($type === 'foto') {
                $content = $this->compressImage($content);
            }

            // 5. Penentuan Ekstensi File
            $extension = $this->getExtensions($mimeType);
            $fileName  = rtrim($pathFolder, '/') . '/' . Str::random(40) . '.' . $extension;

            // 6. Upload ke Garage S3
            $this->disk->put($fileName, $content);

            return $fileName;

        } catch (Exception $e) {
            throw new Exception("S3 Service Error: " . $e->getMessage());
        }
    }

    /**
     * Get Presigned URL (URL yang berubah secara dinamis)
     */
    public function getDynamicUrl(?string $path, int $expiresInMinutes = 5): ?string
    {
        if (!$path || !$this->disk->exists($path)) {
            return null;
        }

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = $this->disk;

        // Signature URL akan berubah setiap kali fungsi dipanggil
        return $disk->temporaryUrl(
            $path, 
            now()->addMinutes($expiresInMinutes)
        );
    }

    /**
     * Validasi File
     */
    private function validateFile(string $content, string $mimeType, string $type): void
    {
        $sizeInKb = strlen($content) / 1024;

        $rules = [
            'foto'    => ['mimes' => ['image/jpeg', 'image/png', 'image/webp'], 'max' => 2048], 
            'dokumen' => ['mimes' => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], 'max' => 10240], 
            'video'   => ['mimes' => ['video/mp4', 'video/quicktime', 'video/x-msvideo'], 'max' => 51200], 
        ];

        if (!isset($rules[$type])) {
            throw new Exception("Kategori validasi [$type] tidak ditemukan.");
        }

        if (!in_array($mimeType, $rules[$type]['mimes'])) {
            throw new Exception("Format file ($mimeType) tidak diizinkan untuk kategori $type.");
        }

        if ($sizeInKb > $rules[$type]['max']) {
            throw new Exception("File terlalu besar. Maksimal " . ($rules[$type]['max'] / 1024) . "MB.");
        }
    }

    /**
     * Kompresi Image (Intervention v3 style)
     */
    private function compressImage(string $content): string
    {
        $manager = new ImageManager(new Driver());
        
        // Membaca konten file
        $image = $manager->decode($content);

        // Encode ke Jpeg dengan kualitas 80%
        return (string) $image->encodeUsingFileExtension('jpeg',80);
    }

    /**
     * Mapping Mime Type ke Ekstensi
     */
    private function getExtensions(string $mimeType): string
    {
        $map = [
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp',
            'application/pdf' => 'pdf',
            'application/msword' => 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
            'video/mp4' => 'mp4',
            'video/quicktime' => 'mov',
        ];

        return $map[$mimeType] ?? 'bin';
    }

    /**
     * Hapus File
     */
    public function delete(?string $path): bool
    {
        if ($path && $this->disk->exists($path)) {
            return $this->disk->delete($path);
        }
        return false;
    }
}