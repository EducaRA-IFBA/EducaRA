<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\Disciplina;
use Validator;
use App\Http\Resources\DisciplinaResource;

class DisciplinaController extends BaseController
{
    public function index()
    {
        $disciplinas = Disciplina::all();

        return $this->sendResponse(DisciplinaResource::collection($disciplinas), 'disciplinas');
    }

    public function store(Request $request)
    {
        $input = $request->all();

        $validator = Validator::make($input, [
            'name' => 'required',
            'initial' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $disciplina = Disciplina::create($input);

        return $this->sendResponse(new DisciplinaResource($disciplina), 'cadastro');
    }

    public function show($id)
    {
        $disciplina = Disciplina::with('aulas.objetos3d')->find($id);

        if (is_null($disciplina)) {
            return $this->sendError('Disciplina não encontrada.');
        }

        return $this->sendResponse(new DisciplinaResource($disciplina), 'disciplina');
    }

    public function update(Request $request, Disciplina $disciplina)
    {
        $input = $request->all();

        $validator = Validator::make($input, [
            'name' => 'required',
            'initial' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $disciplina->name = $input['name'];
        $disciplina->initial = $input['initial'];
        $disciplina->save();

        return $this->sendResponse(new DisciplinaResource($disciplina), 'atualizacao');
    }

    public function destroy(Disciplina $disciplina)
    {
        $disciplina->delete();

        return $this->sendResponse([], 'remocao');
    }
}