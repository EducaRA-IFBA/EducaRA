<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DisciplinaFactory extends Factory
{

    public function definition(): array
    {
        return [
            'nome' => $this->faker->randomElement(['Português', 'Matemática', 'Química', 'Física', 'Biologia', 'Geografia', 'Geometria']),
            'sigla' => $this->faker->randomElement(['POR', 'MAT', 'HIS', 'GEO', 'BIO', 'FIS']),
            'imagem' => "https://definicion.de/wp-content/uploads/2023/08/acido-acetico.png"
        ];
    }
}
