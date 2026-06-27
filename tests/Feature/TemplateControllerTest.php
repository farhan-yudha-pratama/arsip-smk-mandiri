<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Template;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Illuminate\Support\Facades\Storage;
use App\Contracts\StorageServiceInterface;
use Spatie\Permission\Models\Role;
use Mockery;

class TemplateControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Setup role needed for templates routes (SUPERADMIN or ADMIN)
        Role::create(['name' => 'ADMIN']);
    }

    public function test_index_renders_inertia_view_with_templates()
    {
        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole('ADMIN');
        
        Template::factory()->count(3)->create();

        $response = $this->actingAs($user)->get('/templates');
        
        if ($response->status() === 302) {
            dump($response->headers->get('Location'));
        }

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('templates/index')
            ->has('templates.data', 3)
            ->has('filters')
        );
    }

    public function test_index_applies_search_filter()
    {
        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole('ADMIN');
        
        Template::factory()->create(['name' => 'Surat Pengantar']);
        Template::factory()->create(['name' => 'Surat Cuti']);

        $response = $this->actingAs($user)->get('/templates?search=Cuti');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('templates/index')
            ->has('templates.data', 1)
            ->where('templates.data.0.name', 'Surat Cuti')
        );
    }

    public function test_store_validates_required_fields()
    {
        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole('ADMIN');

        $response = $this->actingAs($user)->post('/templates', []);

        $response->assertSessionHasErrors(['title', 'document']);
    }

    public function test_update_validates_required_fields()
    {
        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole('ADMIN');
        
        $template = Template::factory()->create();

        $response = $this->actingAs($user)->post("/templates/{$template->id}", []); // wait, routes list says POST /templates/{template} for update? No, the routes list shows: `Route::post('/templates/{template}', [TemplateController::class, 'update'])`. It uses POST for update!

        $response->assertSessionHasErrors(['title']);
    }

    public function test_preview_redirects_to_storage_url()
    {
        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole('ADMIN');
        
        $template = Template::factory()->create([
            'url' => 'templates/test.docx'
        ]);

        $this->mock(StorageServiceInterface::class, function ($mock) {
            $mock->shouldReceive('getDiskName')->andReturn('public');
            $mock->shouldReceive('getUrl')->with('templates/test.docx')->andReturn('http://localhost/storage/templates/test.docx');
        });

        $this->withoutExceptionHandling();
        $response = $this->actingAs($user)->get("/templates/{$template->id}/preview", [
            'X-Inertia' => 'true'
        ]);
        
        $response->assertStatus(409); // Inertia::location returns a 409 status code with X-Inertia-Location header
    }

    public function test_download_redirects_for_non_local_disk()
    {
        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole('ADMIN');
        
        $template = Template::factory()->create([
            'url' => 'templates/test.docx',
            'name' => 'Test'
        ]);

        $this->mock(StorageServiceInterface::class, function ($mock) {
            $mock->shouldReceive('getDiskName')->andReturn('s3');
            $mock->shouldReceive('getTemporaryUrl')->andReturn('http://s3.aws.com/templates/test.docx');
        });

        $this->withoutExceptionHandling();
        $response = $this->actingAs($user)->get("/templates/{$template->id}/download", ['X-Inertia' => 'true']);

        $response->assertStatus(409);
    }
}
