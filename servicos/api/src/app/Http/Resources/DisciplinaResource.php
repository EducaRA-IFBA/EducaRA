<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DisciplinaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'codigo' => $this->codigo,
            'nome' => $this->nome,
            'sigla' => $this->sigla,
            'imagem' => $this->imagem,
            'aulas' => AulaResource::collection($this->whenLoaded('aulas')),
            'aulas_count' => $this->aulas_count ?? 0,
            'conteudos_count' => $this->conteudos_count ?? 0,
            'created_at' => $this->created_at->format('Y-m-d\TH:i:s\Z'),
            'updated_at' => $this->updated_at->format('Y-m-d\TH:i:s\Z'),
        ];
    }
}
