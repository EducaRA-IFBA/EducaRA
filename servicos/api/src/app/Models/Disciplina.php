<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Disciplina extends Model
{
    use HasFactory;

    protected $fillable = [
        'codigo', 'sigla', 'nome', 'imagem', 'dono_id'
    ];

    public function aulas()
    {
        return $this->hasMany(Aula::class);
    }

    public function conteudos() 
    {
        return $this->hasManyThrough(Conteudo::class, Aula::class);
    }

    public function dono()
    {
        return $this->belongsTo(Usuario::class, 'dono_id');
    }
}
