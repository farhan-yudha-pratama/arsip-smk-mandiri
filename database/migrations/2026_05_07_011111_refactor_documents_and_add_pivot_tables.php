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
        // 1. Refactor documents table
        Schema::table('documents', function (Blueprint $table) {
            // Remove old foreign keys
            $table->dropConstrainedForeignId('student_id');
            $table->dropConstrainedForeignId('teacher_id');

            // Add indexes
            $table->index('status');
            $table->index('created_at');
            // document_number is already unique from creation migration
        });

        // 2. Create document_students table
        Schema::create('document_students', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignUuid('document_id')->constrained('documents')->cascadeOnDelete();
            $table->foreignUuid('student_id')->constrained('students')->cascadeOnDelete();
            
            $table->unique(['document_id', 'student_id']);
        });

        // 3. Create document_teachers table
        Schema::create('document_teachers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignUuid('document_id')->constrained('documents')->cascadeOnDelete();
            $table->foreignUuid('teacher_id')->constrained('teachers')->cascadeOnDelete();
            
            $table->unique(['document_id', 'teacher_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_teachers');
        Schema::dropIfExists('document_students');

        Schema::table('documents', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['created_at']);
            
            $table->foreignUuid('student_id')->nullable()->constrained('students')->nullOnDelete();
            $table->foreignUuid('teacher_id')->nullable()->constrained('teachers')->nullOnDelete();
        });
    }
};
