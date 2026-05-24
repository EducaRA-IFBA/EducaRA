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
        Schema::table('conteudos', function (Blueprint $table) {

            $table->dropForeign(['aula_id']);

            $table->foreign('aula_id')
                ->references('id')
                ->on('aulas')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('conteudos', function (Blueprint $table) {
            $table->dropForeign(['aula_id']);
            $table->foreign('aula_id')->references('id')->on('aulas');
        });
    }
};
