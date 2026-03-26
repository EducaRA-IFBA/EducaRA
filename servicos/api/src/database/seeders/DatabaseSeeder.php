<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {

        \App\Models\User::factory(10)->create();

        \App\Models\User::factory()->create([
            'name' => 'EducaRA',
            'email' => 'educara@gmail.com',
            'password' => bcrypt('password')
        ]);

        \App\Models\Disciplina::factory(7)->create();

        \App\Models\Aula::factory(7)->create();

        \App\Models\Conteudo::factory(6)->create();
    }
}
