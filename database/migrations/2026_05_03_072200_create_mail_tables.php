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
        Schema::create('incoming_mail', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('document_id')->constrained('documents')->cascadeOnDelete();
            $table->string('sender_origin');
            $table->timestamp('received_at');
            $table->timestamps();

            $table->index('document_id');
            $table->index('received_at');
        });

        Schema::create('outgoing_mail', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('document_id')->constrained('documents')->cascadeOnDelete();
            $table->string('recipient_name');
            $table->timestamp('sent_at');
            $table->timestamps();

            $table->index('document_id');
            $table->index('sent_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('outgoing_mail');
        Schema::dropIfExists('incoming_mail');
    }
};
