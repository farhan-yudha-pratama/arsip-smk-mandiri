<?php

namespace Tests\Unit;

use App\Enums\StatusDocument;
use App\Models\Document;
use App\Models\DocumentHistory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DocumentControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_incoming_handles_exception_and_returns_error()
    {
        $user = User::factory()->create(['is_active' => true]);

        $_ENV['USE_QUEUE'] = false; // Disable queue to test direct upload

        $this->mock(\App\Contracts\StorageServiceInterface::class, function ($mock) {
            $mock->shouldReceive('uploadFile')->andThrow(new \Exception('Upload Error'));
        });

        $file = UploadedFile::fake()->create('incoming.pdf', 100, 'application/pdf');

        $response = $this->actingAs($user)->post('/documents/incoming', [
            'title' => 'Test Doc',
            'sender_origin' => 'Company',
            'received_at' => now()->toDateString(),
            'file' => $file,
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors('error');
        $this->assertStringContainsString('Gagal mendaftar surat masuk', session('errors')->first('error'));
    }

    public function test_update_fails_for_unallowed_document_status()
    {
        $user = User::factory()->create(['is_active' => true]);
        
        $document = Document::factory()->create([
            'status' => StatusDocument::SIGNED,
        ]);

        $response = $this->actingAs($user)->put("/documents/{$document->id}", [
            'title' => 'Updated Title'
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors('error');
        $this->assertStringContainsString('Hanya dokumen draf, gagal, atau yang sudah dibuat yang dapat diubah', session('errors')->first('error'));
    }

    public function test_view_returns_error_when_no_current_url()
    {
        $user = User::factory()->create(['is_active' => true]);
        
        $document = Document::factory()->create([
            'current_url' => '', // Empty URL
        ]);

        $response = $this->actingAs($user)->get("/documents/{$document->id}/view");

        $response->assertStatus(302);
        $response->assertSessionHasErrors('error');
        $this->assertStringContainsString('Dokumen belum memiliki file', session('errors')->first('error'));
    }

    public function test_download_returns_error_when_no_current_url()
    {
        $user = User::factory()->create(['is_active' => true]);
        
        $document = Document::factory()->create([
            'current_url' => '', // Empty string instead of null
        ]);

        $response = $this->actingAs($user)->get("/documents/{$document->id}/download");

        $response->assertStatus(302);
        $response->assertSessionHasErrors('error');
        $this->assertStringContainsString('Dokumen belum memiliki file', session('errors')->first('error'));
    }

    public function test_download_history_returns_error_when_no_file_path()
    {
        $user = User::factory()->create(['is_active' => true]);
        
        $document = Document::factory()->create();
        $history = DocumentHistory::create([
            'document_id' => $document->id,
            'version_name' => StatusDocument::DRAFT,
            'file_path' => '', // Empty file path
            'created_by' => $user->id,
            'note' => 'test'
        ]);

        $response = $this->actingAs($user)->get("/documents/{$document->id}/history/{$history->id}/download");

        $response->assertStatus(302);
        $response->assertSessionHasErrors('error');
        $this->assertStringContainsString('File tidak ditemukan untuk versi riwayat ini', session('errors')->first('error'));
    }

    public function test_destroy_handles_exception_and_returns_error()
    {
        $user = User::factory()->create(['is_active' => true]);
        $document = Document::factory()->create([
            'current_url' => 'documents/test.pdf'
        ]);
        
        $history = DocumentHistory::create([
            'document_id' => $document->id,
            'version_name' => StatusDocument::DRAFT,
            'file_path' => 'documents/test.pdf',
            'created_by' => $user->id,
            'note' => 'test'
        ]);

        $this->mock(\App\Contracts\StorageServiceInterface::class, function ($mock) {
            $mock->shouldReceive('delete')->andThrow(new \Exception('Storage Delete Error'));
        });

        $response = $this->actingAs($user)->delete("/documents/{$document->id}");

        $response->assertStatus(302);
        $response->assertSessionHasErrors('error');
        $this->assertStringContainsString('Gagal menghapus dokumen', session('errors')->first('error'));
    }

    public function test_upload_signed_handles_exception_and_returns_error()
    {
        $user = User::factory()->create(['is_active' => true]);
        $document = Document::factory()->create();

        $this->mock(\App\Contracts\StorageServiceInterface::class, function ($mock) {
            $mock->shouldReceive('uploadFile')->andThrow(new \Exception('Storage Upload Error'));
        });

        $file = UploadedFile::fake()->create('signed.pdf', 100, 'application/pdf');

        $response = $this->actingAs($user)->post("/documents/{$document->id}/signed", [
            'file' => $file
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors('error');
        $this->assertStringContainsString('Gagal mengunggah dokumen yang ditandatangani', session('errors')->first('error'));
    }

    public function test_archive_handles_exception_and_returns_error()
    {
        $user = User::factory()->create(['is_active' => true]);
        $document = Document::factory()->create();

        // Trigger exception on save
        Document::saving(function () {
            throw new \Exception('DB Error on Archive');
        });

        $response = $this->actingAs($user)->post("/documents/{$document->id}/archive");

        $response->assertStatus(302);
        $response->assertSessionHasErrors('error');
        $this->assertStringContainsString('Gagal mengarsipkan dokumen', session('errors')->first('error'));
    }
}
