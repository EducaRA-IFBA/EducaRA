<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\Disciplina;
use App\Models\Aula;
use Validator;
use Illuminate\Http\Response;
use App\Http\Resources\AulaResource;

class AulaController extends BaseController
{
    public function index()
    {
        $aulas = Aula::all();
        
        return $this->sendResponse(AulaResource::collection($aulas), 'aulas');
    }

    public function store(Request $request)
    {
        $input = $request->all();

        $validator = Validator::make($input, [
            'codigo' => 'required',
            'dono' => 'required'
        ]);

        if ($validator->fails()) {
            return response(content: $validator->errors(),status: Response::HTTP_BAD_REQUEST);
        }

        $aula = Aula::create($input);

        return response()->json($aula, Response::HTTP_CREATED);
    }

    public function show($id)
    {
        $aula = Aula::find($id);

        if (is_null($aula)) {
            return response(status: Response::HTTP_NOT_FOUND);
        }

        return $this->sendResponse(new AulaResource($aula), 'aula');
    }

    public function update(Request $request, Aula $aula)
    {
        $input = $request->all();

        $validator = Validator::make($input, [
            'code' => 'required',
            'owner' => 'required'
        ]);

        if ($validator->fails()) {
            return response(content: $validator->errors(), status: Response::HTTP_BAD_REQUEST);
        }

        $aula->code = $input['code'];
        $aula->owner = $input['owner'];
        $aula->name = $input['name'];
        $aula->save();

        return $this->sendResponse(new AulaResource($aula), 'atualizacao');
    }

    public function destroy(Aula $aula)
    {
        $aula->delete();

        return $this->sendResponse([], 'remocao');
    }

    public function getAula($codigo)
    {
        
        if (is_null($codigo)) {
            return response(content: 'Codigo da sala não informado', status: Response::HTTP_BAD_REQUEST);
        }

        if (!$this->_is_valid_uuid($codigo)) {
            return response(content: 'Codigo da sala Inválido', status: Response::HTTP_BAD_REQUEST);
        }

        $aula = Aula::where('codigo', $codigo)->with('objetos3d')->get();

        if (is_null($aula)) {
            return $this->sendError('Aula não encontrada.');
        }

        return $this->sendResponse(new AulaResource($aula), 'aula');
    }

    private function _is_valid_uuid($uuid) {
        $pattern = '/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i';
        return preg_match($pattern, $uuid) === 1;
    }

    public function getAulas($id)
    {
        $disciplina = Disciplina::find($id);
        if (is_null($disciplina)) {
            return response()->json(['message' => 'Disciplina não encontrada.'], Response::HTTP_NOT_FOUND);
        }

        $aulas = Aula::where('disciplina_id', $disciplina->id)->get();
        if ($aulas->isEmpty()) {
            return response()->json(['message' => 'Nenhuma aula encontrada para esta disciplina.'], Response::HTTP_NOT_FOUND);
        }

        return $this->sendResponse(AulaResource::collection($aulas), 'aulas');
    }

}
