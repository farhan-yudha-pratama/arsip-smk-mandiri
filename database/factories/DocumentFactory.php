<?php

namespace Database\Factories;

use App\Models\Document;
use App\Models\Template;
use App\Models\User;
use App\Enums\StatusDocument;
use App\Enums\RecipientType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Document>
 */
class DocumentFactory extends Factory
{
    protected $model = Document::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'template_id' => Template::factory(),
            'document_number' => $this->faker->unique()->numerify('DOC-####'),
            'title' => $this->faker->sentence(3),
            'status' => StatusDocument::DRAFT,
            'recipient_type' => RecipientType::EXTERNAL,
            'recipient_name' => $this->faker->name,
            'meta_data_values' => [],
            'current_url' => 'documents/' . $this->faker->uuid() . '.pdf',
            'is_batch' => false,
            'created_by' => User::factory(),
        ];
    }
}
