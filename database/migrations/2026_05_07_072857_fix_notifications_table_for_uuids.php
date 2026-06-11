<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Use raw SQL for PostgreSQL to handle the type conversion properly
        if (config('database.default') === 'pgsql') {
            DB::statement('ALTER TABLE notifications ALTER COLUMN notifiable_id TYPE uuid USING notifiable_id::text::uuid');
        } else {
            Schema::table('notifications', function (Blueprint $table) {
                $table->uuid('notifiable_id')->change();
            });
        }
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->bigInteger('notifiable_id')->change();
        });
    }
};
