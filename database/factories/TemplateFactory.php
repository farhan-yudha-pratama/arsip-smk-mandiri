<?php

namespace Database\Factories;

use App\Models\Template;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Template>
 */
class TemplateFactory extends Factory
{
    protected $model = Template::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'url'  => 'templates/' . $this->faker->uuid() . '.docx',
            'meta_data' => [
                'category'    => $this->faker->word(),
                'description' => $this->faker->paragraph(),
                'file_type'   => 'docx',
                'uploaded_at' => now()->toIso8601String(),
            ],
        ];
    }
}
