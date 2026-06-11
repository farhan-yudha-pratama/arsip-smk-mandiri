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
        Schema::table('documents', function (Blueprint $table) {
            $table->string('status')->change();
        });

        Schema::table('document_history', function (Blueprint $table) {
            $table->string('version_name')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->enum('status', ['DRAFT', 'GENERATED', 'SIGNED', 'ARCHIVED'])->change();
        });

        Schema::table('document_history', function (Blueprint $table) {
            $table->enum('version_name', ['DRAFT', 'GENERATED', 'SIGNED', 'ARCHIVED'])->change();
        });
    }
};
