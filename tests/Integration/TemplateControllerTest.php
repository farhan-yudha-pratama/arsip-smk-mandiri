<?php

namespace Tests\Integration;

use Tests\TestCase;
use App\Models\User;
use App\Models\Template;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use App\Jobs\ProcessTemplateUploadJob;
use Spatie\Permission\Models\Role;

class TemplateControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        Storage::fake('public');
        Role::create(['name' => 'ADMIN']);
    }

    public function test_store_dispatches_job_when_queue_enabled()
    {
        Queue::fake();
        config(['app.env' => 'testing']); // Just to be safe
        putenv('USE_QUEUE=true'); // Ensure controller reads this as true, wait, env() might read from cache if config cached, but getenv/env in tests might be tricky. Let's assume env('USE_QUEUE', true) returns true by default or if we set it.
        // Laravel's env() function only reads from the real environment if config is not cached.
        // A safer way is to manipulate config if the controller was using config('app.use_queue'). 
        // But the controller uses env('USE_QUEUE', true). 
        $_ENV['USE_QUEUE'] = true;

        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole('ADMIN');

        // Valid base64 docx
        $base64 = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' . base64_encode('dummy content');

        $response = $this->actingAs($user)->post('/templates', [
            'title' => 'Integration Template',
            'document' => $base64,
            'metadata' => ['key' => 'value']
        ]);

        $response->assertSessionHas('success');
        
        Queue::assertPushed(ProcessTemplateUploadJob::class, function ($job) {
            return $job->title === 'Integration Template';
        });
    }

    public function test_destroy_removes_template_from_database()
    {
        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole('ADMIN');
        $template = Template::factory()->create([
            'name' => 'To Be Deleted',
            'url' => 'templates/dummy.docx'
        ]);

        // We assume StorageServiceInterface uses Storage facade under the hood
        $response = $this->actingAs($user)->delete("/templates/{$template->id}");

        $response->assertRedirect();
        $response->assertSessionHas('success');
        
        $this->assertDatabaseMissing('templates', [
            'id' => $template->id
        ]);
    }

    public function test_update_modifies_template_metadata_in_database()
    {
        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole('ADMIN');
        $template = Template::factory()->create([
            'name' => 'Old Name',
            'meta_data' => ['placeholders' => []]
        ]);

        $response = $this->actingAs($user)->post("/templates/{$template->id}", [
            'title' => 'New Name',
            'metadata' => ['new_key' => 'new_value']
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('templates', [
            'id' => $template->id,
            'name' => 'New Name',
        ]);
        
        $template->refresh();
        $this->assertEquals(['new_key' => 'new_value'], $template->meta_data['placeholders']);
    }
}
