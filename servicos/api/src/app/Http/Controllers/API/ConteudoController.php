<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\{Conteudo, Aula};
use Validator;
use App\Http\Resources\ConteudoResource;
use Illuminate\Support\Facades\File;

class ConteudoController extends BaseController
{
    private $upload_folder = "objetos";

    public function index()
    {
        $objeto3d = Conteudo::all();

        return $this->sendResponse(ConteudoResource::collection($objeto3d), 'conteudos');
    }

    public function store(Request $request)
    {
        $input = $request->except('ar_file');

        $validator = Validator::make($input, [
            'nome' => 'required',
            'descricao' => 'required',
            'escala' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $conteudo = Conteudo::create($input);

        $conteudo->filehash = hash_file('md5', $request->ar_file);
        $conteudo->size = $request->ar_file->getSize();
        $conteudo->extension = $request->ar_file->getClientOriginalExtension();
        $conteudo->path = $conteudo->filehash . '.' . $conteudo->extension;
        $request->ar_file->storeAs($this->upload_folder . '/' . $conteudo->id, $conteudo->filehash . '.' . $conteudo->extension);
        $conteudo->save();

        return $this->sendResponse(new ConteudoResource($conteudo), 'cadastro');
    }

    public function show($id)
    {
        $conteudo = Conteudo::find($id);

        if (is_null($conteudo)) {
            return $this->sendError('Objeto 3D não encontrado');
        }

        return $this->sendResponse(new ConteudoResource($conteudo), 'conteudo');
    }

    public function update(Request $request, Conteudo $conteudo)
    {
        $input = $request->except('ar_file');

        $validator = Validator::make($input, [
            'name' => 'required',
            'description' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $conteudo->name = $input['name'];
        $conteudo->description = $input['description'];

        if (isset($request->ar_file) && $request->ar_file->getSize() > 0) {
            $conteudo->filehash = hash_file('md5', $request->ar_file);
            $conteudo->size = $request->ar_file->getSize();
            $conteudo->extension = $request->ar_file->getClientOriginalExtension();
            $caminho = $request->ar_file->storeAs($this->upload_folder . '/' . $conteudo->id, $conteudo->filehash . '.' . $conteudo->extension);
            $conteudo->caminho = $caminho;
        }

        $conteudo->update();

        return $this->sendResponse(new ConteudoResource($conteudo), 'atualizacao');
    }

    public function destroy(Conteudo $conteudo)
    {

        if (File::deleteDirectory(storage_path('app/' . $this->upload_folder) . '/' . $conteudo->id)) {
            $conteudo->delete();
            return $this->sendResponse([], 'remocao');
        } else
            return $this->sendError('Erro de Remoção', 'Não foi possível remover o arquivo', 400);
    }

    public function download($conteudo)
    {
        $path = 'app/' . $this->upload_folder . $conteudo->id . '/' . $conteudo->filehash . '.' . $conteudo->extension;
        $file_path = storage_path($path);

        return response()->download($file_path);
    }

    public function getConteudo($codigo)
    {
        if (is_null($codigo)) {
            return $this->sendError('Código do conteúdo não informado');
        }

        $conteudo = Conteudo::where('codigo', $codigo)->get();
        if (is_null($conteudo)) {
            return $this->sendError('Conteúdo não encontrado.');
        }

        return $this->sendResponse(ConteudoResource::collection($conteudo), 'conteudo');
    }

    public function getConteudos($aulaId)
    {
        $aula = Aula::find($aulaId);
        if (is_null($aula)) {
            return response()->json(['message' => 'Aula não encontrada.'], Response::HTTP_NOT_FOUND);
        }

        $conteudos = Conteudo::where('aula_id', $aula->id)
                    ->get();
        if ($conteudos->isEmpty()) {
            return response()->json(['message' => 'Nenhuma aula encontrada para esta disciplina.'], Response::HTTP_NOT_FOUND);
        }

        return $this->sendResponse(ConteudoResource::collection($conteudos), 'conteudos');
    }

    public function downloadConteudo($codigo)
    {
        if (is_null($codigo)) {
            return $this->sendError('Código do Objeto 3D não informado');
        }

        $conteudo = Conteudo::where('codigo', $codigo)->get();

        if (is_null($codigo)) {
            return $this->sendError('Objeto 3D não encontrado');
        }

        $path = 'app/' . $this->upload_folder . $conteudo->id . '/' . $conteudo->filehash . '.' . $conteudo->extension;
        $file_path = storage_path($path);

        return response()->download($file_path);
    }
}
