<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class Aula extends Model
{
    use HasFactory;

    protected $table = 'aulas';
    protected $fillable = [
        'codigo', 'dono_id', 'nome', 'observacao', 'turma', 'disciplina_id'
    ];

    protected static function booted()
    {
        static::creating(fn (Aula $aula) => $aula->codigo = (string) Uuid::uuid4());
    }

    public function conteudos()
    {
        return $this->hasMany(Conteudo::class);
    }

    public function disciplina()
    {
        return $this->belongsTo(Disciplina::class);
    }

    public function dono()
    {
        return $this->disciplina->dono();
    }
}
