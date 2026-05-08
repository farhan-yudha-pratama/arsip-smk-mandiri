<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Template;
use App\Services\S3StorageService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Mockery\MockInterface;
use Tests\TestCase;
use Spatie\Permission\Models\Role;

class TemplateControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Setup role
        Role::create(['name' => 'operator']);
    }

    /**
     * Test store success with mocked service.
     */
    public function test_store_uploads_file_and_saves_to_db()
    {
        $user = User::factory()->create();
        $user->assignRole('operator');

        $this->instance(
            S3StorageService::class,
            Mockery::mock(S3StorageService::class, function (MockInterface $mock) {
                $mock->shouldReceive('uploadBase64')
                    ->once()
                    ->with('base64content', 'templates', 'document')
                    ->andReturn('templates/fake-path.docx');
            })
        );

        $response = $this->actingAs($user)->post(route('templates.store'), [
            'title'       => 'Test Template',
            'category'    => 'Legal',
            'description' => 'Test Description',
            'document'    => 'base64content',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('templates', [
            'name' => 'Test Template',
            'url'  => 'templates/fake-path.docx',
        ]);

        $template = Template::where('name', 'Test Template')->first();
        $this->assertEquals('Legal', $template->meta_data['category']);
    }

    /**
     * Test store requires authentication and operator role.
     */
    public function test_store_requires_operator_role()
    {
        $user = User::factory()->create(); // No role

        $response = $this->actingAs($user)->post(route('templates.store'), [
            'title' => 'Fail',
        ]);

        $response->assertStatus(403);
    }

    /**
     * Test store validation errors.
     */
    public function test_store_validation_errors()
    {
        $user = User::factory()->create();
        $user->assignRole('operator');

        $response = $this->actingAs($user)->post(route('templates.store'), []);

        $response->assertSessionHasErrors(['title', 'category', 'document']);
    }

    /**
     * Test store handles service exceptions.
     */
    public function test_store_handles_service_exceptions()
    {
        $user = User::factory()->create();
        $user->assignRole('operator');

        $this->instance(
            S3StorageService::class,
            Mockery::mock(S3StorageService::class, function (MockInterface $mock) {
                $mock->shouldReceive('uploadBase64')
                    ->andThrow(new \Exception('Upload failed'));
            })
        );

        $response = $this->actingAs($user)->post(route('templates.store'), [
            'title'       => 'Test Template',
            'category'    => 'Legal',
            'document'    => 'base64content',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors(['document']);
        $this->assertStringContainsString('Upload failed', session('errors')->first('document'));
    }
}
