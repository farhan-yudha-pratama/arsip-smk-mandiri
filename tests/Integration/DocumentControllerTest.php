<?php

namespace Tests\Integration;

use App\Enums\StatusDocument;
use App\Models\Document;
use App\Models\DocumentHistory;
use App\Models\Template;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use App\Jobs\GenerateDocumentJob;
use App\Jobs\ProcessIncomingMailJob;
use App\Services\DocumentGenerationService;

class DocumentControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['filesystems.document_generation_sync' => true]);
        Storage::fake('local');
        Storage::fake('public');
    }

    public function test_store_creates_db_records_and_dispatches_job_when_queue_enabled()
    {
        Queue::fake();
        $_ENV['USE_QUEUE'] = true;

        $user = User::factory()->create(['is_active' => true]);
        $template = Template::factory()->create();

        $response = $this->actingAs($user)->post('/documents', [
            'template_id' => $template->id,
            'title' => 'Integration Test Document',
            'recipient_type' => 'EXTERNAL',
            'is_draft' => false,
        ]);

        $response->assertSessionHas('success');
        
        $this->assertDatabaseHas('documents', [
            'title' => 'Integration Test Document',
            'status' => StatusDocument::PROCESSING,
        ]);

        Queue::assertPushed(GenerateDocumentJob::class);
    }

    public function test_store_uses_service_directly_when_queue_disabled()
    {
        $_ENV['USE_QUEUE'] = false;
        
        // We will mock the DocumentGenerationService since we don't want to actually generate a Word doc here.
        $mockService = \Mockery::mock(DocumentGenerationService::class);
        $mockService->shouldReceive('generate')->once()->andReturn(true);
        $this->instance(DocumentGenerationService::class, $mockService);

        $user = User::factory()->create(['is_active' => true]);
        $template = Template::factory()->create();

        $response = $this->actingAs($user)->post('/documents', [
            'template_id' => $template->id,
            'title' => 'Direct Generation Test',
            'recipient_type' => 'EXTERNAL',
            'is_draft' => false,
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('documents', [
            'title' => 'Direct Generation Test',
            'status' => StatusDocument::PROCESSING,
        ]);
    }

    public function test_update_modifies_db_and_dispatches_job_if_not_draft()
    {
        Queue::fake();
        $_ENV['USE_QUEUE'] = true;

        $user = User::factory()->create(['is_active' => true]);
        $document = Document::factory()->create([
            'status' => StatusDocument::DRAFT,
            'title' => 'Old Title'
        ]);

        $response = $this->actingAs($user)->put("/documents/{$document->id}", [
            'title' => 'New Title',
            'is_draft' => false,
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'title' => 'New Title',
            'status' => StatusDocument::PROCESSING,
        ]);

        Queue::assertPushed(GenerateDocumentJob::class);
    }

    public function test_destroy_removes_records_and_deletes_files_from_storage()
    {
        $user = User::factory()->create(['is_active' => true]);
        
        Storage::disk('public')->put('documents/test.pdf', 'dummy content');
        
        $document = Document::factory()->create([
            'current_url' => 'documents/test.pdf'
        ]);
        
        DocumentHistory::create([
            'document_id' => $document->id,
            'file_path' => 'documents/test.pdf',
            'version_name' => StatusDocument::GENERATED,
            'note' => 'test',
            'created_by' => $user->id
        ]);

        $response = $this->actingAs($user)->delete("/documents/{$document->id}");

        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('documents', ['id' => $document->id]);
        $this->assertDatabaseMissing('document_history', ['document_id' => $document->id]);
        Storage::disk('local')->assertMissing('documents/test.pdf');
    }

    public function test_upload_signed_uploads_file_and_updates_status()
    {
        $user = User::factory()->create(['is_active' => true]);
        $document = Document::factory()->create([
            'status' => StatusDocument::GENERATED,
        ]);

        $file = UploadedFile::fake()->create('signed.pdf', 100, 'application/pdf');

        $response = $this->actingAs($user)->post("/documents/{$document->id}/signed", [
            'file' => $file
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'status' => StatusDocument::SIGNED,
        ]);

        $document->refresh();
        Storage::disk('local')->assertExists($document->current_url);
    }

    public function test_archive_updates_status_and_creates_history()
    {
        $user = User::factory()->create(['is_active' => true]);
        $document = Document::factory()->create([
            'status' => StatusDocument::SIGNED,
            'current_url' => 'documents/signed.pdf'
        ]);

        $response = $this->actingAs($user)->post("/documents/{$document->id}/archive");

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'status' => StatusDocument::ARCHIVED,
        ]);
        $this->assertDatabaseHas('document_history', [
            'document_id' => $document->id,
            'version_name' => StatusDocument::ARCHIVED,
        ]);
    }

    public function test_store_incoming_creates_records_and_dispatches_job()
    {
        Queue::fake();
        $_ENV['USE_QUEUE'] = true;

        $user = User::factory()->create(['is_active' => true]);
        $file = UploadedFile::fake()->create('incoming.pdf', 100, 'application/pdf');

        $response = $this->actingAs($user)->post('/documents/incoming', [
            'title' => 'Incoming Letter',
            'sender_origin' => 'Company XYZ',
            'received_at' => now()->toDateString(),
            'file' => $file,
        ]);

        $response->assertSessionHas('success');
        Queue::assertPushed(ProcessIncomingMailJob::class);
    }
}
