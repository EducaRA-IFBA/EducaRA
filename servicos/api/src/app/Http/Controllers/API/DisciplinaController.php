<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\Disciplina;
use Validator;
use App\Http\Resources\DisciplinaResource;
use Illuminate\Support\Str;

class DisciplinaController extends BaseController
{
    public function index()
    {
        $userId = auth()->id();
        if ($userId) {
            $disciplinas = Disciplina::where('dono_id', $userId)
                ->withCount(['aulas', 'conteudos'])
                ->orderBy('nome', 'asc')
                ->get();
        } else {
            $disciplinas = Disciplina::withCount(['aulas', 'conteudos'])
                ->orderBy('nome', 'asc')
                ->get();
        }

        return $this->sendResponse(DisciplinaResource::collection($disciplinas), 'disciplinas');
    }

    public function store(Request $request)
    {
        $input = $request->all();

        $validator = Validator::make($input, [
            'name' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $nomeDisciplina = $input['name'];
        $siglaAutomatica = Str::upper(Str::substr(trim($nomeDisciplina), 0, 3));

        $disciplina = Disciplina::create([
            'nome'   => $nomeDisciplina,
            'sigla'  => $siglaAutomatica,
            'codigo' => (string) Str::uuid(),
            'imagem' => $input['imagem'] ?? "Padrão",
            'dono_id' => auth()->id()
        ]);

        return $this->sendResponse(new DisciplinaResource($disciplina), 'cadastro');
    }

    public function show($id)
    {
        $disciplina = Disciplina::where('dono_id', auth()->id())
            ->withCount('conteudos')
            ->with(['aulas' => function($query) {
                $query->orderBy('id', 'desc');
            }])
            ->find($id);

        if (is_null($disciplina)) {
            return $this->sendError('Disciplina não encontrada.');
        }

        return $this->sendResponse(new DisciplinaResource($disciplina), 'disciplina');
    }

    public function update(Request $request, Disciplina $disciplina)
    {
        if ($disciplina->dono_id !== auth()->id()) {
            return $this->sendError('sem permissão para editar esta disciplina.');
        }

        $input = $request->all();

        $validator = Validator::make($input, [
            'name' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $novoNome = $input['name'];
        $siglaAutomatica = Str::upper(Str::substr(trim($novoNome), 0, 3));

        $disciplina->update([
            'nome'   => $novoNome,
            'sigla'  => $siglaAutomatica,
            'imagem' => $input['imagem'] ?? $disciplina->imagem,
        ]);

        return $this->sendResponse(new DisciplinaResource($disciplina), 'atualizacao');
    }

    public function destroy(Disciplina $disciplina)
    {
        if ($disciplina->dono_id !== auth()->id()) {
            return $this->sendError('sem permissão para excluir esta disciplina.');
        }

        $disciplina->delete();

        return $this->sendResponse([], 'remocao');
    }


}
