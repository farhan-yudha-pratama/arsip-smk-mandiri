<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migration.
     */
    public function up(): void
    {
        Schema::table('category_numbering', function (Blueprint $table) {
            $table->string('letter_code', 10)->unique()->after('name_numbering_document');
            $table->string('abbreviation', 20)->after('letter_code');
            $table->string('description')->nullable()->after('abbreviation');
        });

        Schema::table('numbering_sequences', function (Blueprint $table) {
            $table->dropUnique(['category_numbering_id', 'year']);
        });

        Schema::table('numbering_sequences', function (Blueprint $table) {
            $table->dropColumn(['year', 'last_number']);
        });

        Schema::table('numbering_sequences', function (Blueprint $table) {
            $table->unsignedBigInteger('sequence_number')->after('category_numbering_id');
            $table->unsignedTinyInteger('month')->after('sequence_number');
            $table->unsignedSmallInteger('year')->after('month');
            $table->string('document_number')->unique()->after('year');
            $table->foreignUuid('document_id')
                ->nullable()
                ->constrained('documents')
                ->nullOnDelete()
                ->after('document_number');

            $table->timestamps();
            $table->index(['year', 'month']);
            $table->index('sequence_number');
        });

        Schema::create('numbering_counters', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('global_sequence')->default(0);
            $table->unsignedTinyInteger('month');
            $table->unsignedSmallInteger('year');

            $table->timestamps();
            $table->unique(['month', 'year']);
            $table->index('year');
        });
    }

    /**
     * Kembalikan migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('numbering_counters');

        Schema::table('numbering_sequences', function (Blueprint $table) {
            $table->dropForeign(['document_id']);
            $table->dropIndex(['year', 'month']);
            $table->dropIndex(['sequence_number']);
            $table->dropColumn(['sequence_number', 'month', 'year', 'document_number', 'document_id', 'created_at', 'updated_at']);
        });

        Schema::table('numbering_sequences', function (Blueprint $table) {
            $table->integer('year')->after('category_numbering_id');
            $table->integer('last_number')->default(0)->after('year');
            $table->unique(['category_numbering_id', 'year']);
        });

        Schema::table('category_numbering', function (Blueprint $table) {
            $table->dropUnique(['letter_code']);
            $table->dropColumn(['letter_code', 'abbreviation', 'description']);
        });
    }
};
