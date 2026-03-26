<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Ramsey\Uuid\Uuid;

class Aula extends Model
{
    use SoftDeletes;
    use HasFactory;

    protected $table = 'aulas';
    protected $fillable = [
        'codigo', 'dono_id', 'nome', 'observacao', 'turma', 'disciplina_id'
    ];

    protected static function booted()
    {
        static::creating(fn (Aula $aula) => $aula->codigo = (string) Uuid::uuid4());
    }

    public function conteudo()
    {
        return $this->hasMany(Conteudo::class);
    }

    public function disciplina()
    {
        return $this->belongsTo(Disciplina::class);
    }

    public function dono()
    {
        return $this->hasOne(Usuario::class, 'id', 'dono_id');
    }
}
