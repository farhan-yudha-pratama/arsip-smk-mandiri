<?php

namespace Tests\Feature;

use App\Enums\StatusDocument;
use App\Models\Document;
use App\Models\DocumentHistory;
use App\Models\Template;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use App\Contracts\StorageServiceInterface;
use Inertia\Testing\AssertableInertia;

class DocumentControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        Storage::fake('public');
    }

    public function test_incoming_index_renders_inertia_view_with_filters()
    {
        $user = User::factory()->create(['is_active' => true]);

        $response = $this->actingAs($user)->get('/document-incoming?search=test&status=' . StatusDocument::ARCHIVED->value);

        $response->assertStatus(200);
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('documents/incoming')
            ->has('documents')
            ->has('filters.search')
            ->has('filters.status')
        );
    }

    public function test_outgoing_index_renders_inertia_view_with_props()
    {
        $user = User::factory()->create(['is_active' => true]);

        $response = $this->actingAs($user)->get('/document-outgoing');

        $response->assertStatus(200);
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('documents/outgoing')
            ->has('documents')
            ->has('templates')
            ->has('students')
            ->has('teachers')
            ->has('categoryNumbering')
            ->has('recipientTypes')
            ->has('headmasterName')
        );
    }

    public function test_store_validates_required_fields()
    {
        $user = User::factory()->create(['is_active' => true]);

        $response = $this->actingAs($user)->post('/documents', []);

        $response->assertStatus(302);
        $response->assertSessionHasErrors(['template_id', 'title', 'recipient_type']);
    }

    public function test_update_validates_required_fields()
    {
        $user = User::factory()->create(['is_active' => true]);
        
        $document = Document::factory()->create([
            'status' => StatusDocument::DRAFT,
        ]);

        $response = $this->actingAs($user)->put("/documents/{$document->id}", []);

        $response->assertStatus(302);
        $response->assertSessionHasErrors(['title']);
    }

    public function test_view_redirects_to_temporary_url_for_s3()
    {
        $user = User::factory()->create(['is_active' => true]);
        $document = Document::factory()->create([
            'current_url' => 'documents/test.pdf'
        ]);

        $this->mock(StorageServiceInterface::class, function ($mock) {
            $mock->shouldReceive('getDiskName')->andReturn('s3');
            $mock->shouldReceive('getTemporaryUrl')->andReturn('http://s3.aws.com/documents/test.pdf');
        });

        $this->withoutExceptionHandling();
        $response = $this->actingAs($user)->get("/documents/{$document->id}/view", ['X-Inertia' => 'true']);
        
        // As learned from TemplateControllerTest, Inertia::location handles the redirection
        $response->assertStatus(409);
    }

    public function test_download_redirects_to_temporary_url_for_s3()
    {
        $user = User::factory()->create(['is_active' => true]);
        $document = Document::factory()->create([
            'current_url' => 'documents/test.pdf'
        ]);

        $this->mock(StorageServiceInterface::class, function ($mock) {
            $mock->shouldReceive('getDiskName')->andReturn('s3');
            $mock->shouldReceive('getTemporaryUrl')->andReturn('http://s3.aws.com/documents/test.pdf');
        });

        $this->withoutExceptionHandling();
        $response = $this->actingAs($user)->get("/documents/{$document->id}/download", ['X-Inertia' => 'true']);
        
        $response->assertStatus(409);
    }

    public function test_download_history_redirects_to_temporary_url_for_s3()
    {
        $user = User::factory()->create(['is_active' => true]);
        $document = Document::factory()->create();
        $history = DocumentHistory::create([
            'document_id' => $document->id,
            'version_name' => StatusDocument::DRAFT,
            'file_path' => 'documents/history.pdf',
            'created_by' => $user->id,
            'note' => 'test'
        ]);

        $this->mock(StorageServiceInterface::class, function ($mock) {
            $mock->shouldReceive('getDiskName')->andReturn('s3');
            $mock->shouldReceive('getTemporaryUrl')->andReturn('http://s3.aws.com/documents/history.pdf');
        });

        $this->withoutExceptionHandling();
        $response = $this->actingAs($user)->get("/documents/{$document->id}/history/{$history->id}/download", ['X-Inertia' => 'true']);
        
        $response->assertStatus(409);
    }
}
