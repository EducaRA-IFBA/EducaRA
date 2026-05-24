<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Disciplina;
use App\Models\Aula;
use App\Models\Usuario;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {

        $usuario = Usuario::create([
            'name' => 'EducaRA',
            'email' => 'educara@gmail.com',
            'password' => bcrypt('password') 
        ]);

        $donoId = $usuario->id;

        $quimica = Disciplina::create([
            'nome' => 'Química Orgânica',
            'sigla' => 'QUI',
            'codigo' => (string) Str::uuid(),
            'imagem' => 'Padrão',
            'dono_id' => $donoId
        ]);

        Aula::create([
            'nome' => 'Introdução aos Hidrocarbonetos',
            'dono_id' => $donoId,
            'disciplina_id' => $quimica->id,
            'observacao' => 'Estudo das estruturas moleculares de carbono e hidrogênio.',
            'turma' => '3º Ano A'
        ]);
    }
}
