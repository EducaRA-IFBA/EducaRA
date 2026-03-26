<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class Conteudo extends Model
{
    use HasFactory;
    protected $table = 'conteudos';

    protected $fillable = [
        'nome', 'descricao', 'imagem','size', 'extension', 'caminho', 'escala', 'filehash', 'codigo', 'aula_id'
    ];

    protected static function booted()
    {
        static::creating(fn (Conteudo $conteudo) => $conteudo->codigo = (string) Uuid::uuid4());
    }

    public function aula(): BelongsTo
    {
        return $this->belongsTo(Aula::class);
    }
    
}
