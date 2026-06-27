<?php

namespace Tests\Feature;

use App\Models\Student;
use App\Models\Template;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Spatie\Permission\Models\Role;

use Illuminate\Foundation\Testing\WithoutMiddleware;

class DocumentGenerationTest extends TestCase
{
    use RefreshDatabase, WithoutMiddleware;

    public function test_can_generate_document_from_template()
    {
        Storage::fake('s3');
        
        // Create SUPERADMIN role if it doesn't exist (assuming role middleware is used)
        Role::create(['name' => 'SUPERADMIN']);
        
        $user = User::factory()->create();
        $user->assignRole('SUPERADMIN');
        $this->actingAs($user);

        // Create a dummy template file (needs to be a valid docx for TemplateProcessor)
        // For simplicity in testing, we might need a real small docx or just verify the controller logic
        // but let's try with a dummy first.
        $templatePath = 'templates/test.docx';
        
        // Use PHPWord to create a real empty docx for the test
        $phpWord = new \PhpOffice\PhpWord\PhpWord();
        $section = $phpWord->addSection();
        $section->addText('Hello ${name}');
        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
        
        $tempFile = tempnam(sys_get_temp_dir(), 'test');
        $objWriter->save($tempFile);
        
        Storage::disk('s3')->put($templatePath, file_get_contents($tempFile));
        unlink($tempFile);

        $template = Template::create([
            'name' => 'Test Template',
            'url' => $templatePath,
            'meta_data' => ['name']
        ]);

        $student = Student::create([
            'name' => 'John Doe',
            'nis' => '12345',
            'nisn' => '54321'
        ]);

        $response = $this->post('/documents', [
            'template_id' => $template->id,
            'title' => 'Test Generated Doc',
            'recipient_type' => 'STUDENT',
            'student_id' => $student->id,
            'meta_data_values' => [
                'name' => 'John Doe'
            ]
        ]);

        $response->assertStatus(302); // Redirect back
        $this->assertDatabaseHas('documents', [
            'title' => 'Test Generated Doc',
        ]);

        $this->assertDatabaseHas('document_students', [
            'document_id' => \App\Models\Document::first()->id,
            'student_id' => $student->id,
        ]);
        $this->assertDatabaseHas('document_history', [
            'version_name' => 'GENERATED',
        ]);
        
        // Verify file was uploaded
        $doc = \App\Models\Document::first();
        Storage::disk('s3')->assertExists($doc->current_url);
    }
}
