<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('template_id')->nullable()->constrained('templates')->nullOnDelete();
            $table->string('document_number')->unique()->nullable();
            $table->string('title');
            $table->enum('status', ['DRAFT', 'PROCESSING', 'GENERATED', 'SIGNED', 'ARCHIVED', 'FAILED']);
            $table->enum('recipient_type', ['STUDENT', 'TEACHER', 'EXTERNAL']);
            $table->foreignUuid('student_id')->nullable()->constrained('students')->nullOnDelete();
            $table->foreignUuid('teacher_id')->nullable()->constrained('teachers')->nullOnDelete();
            $table->json('meta_data_values');
            $table->string('current_url');
            $table->boolean('is_batch')->default(false);
            $table->foreignUuid('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
