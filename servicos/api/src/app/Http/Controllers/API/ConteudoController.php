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

        $validator = Validator::make($request->all(), [
            'nome' => 'required',
            'descricao' => 'required',
            'escala' => 'required',
            'aula_id' => 'required|exists:aulas,id',
            'ar_file' => 'required|file'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $conteudo = Conteudo::create($input);

        $conteudo->filehash = hash_file('md5', $request->ar_file);
        $conteudo->size = $request->ar_file->getSize();
        $conteudo->extension = $request->ar_file->getClientOriginalExtension();
        $conteudo->caminho = $conteudo->filehash . '.' . $conteudo->extension;

        $folderPath = 'public/' . $this->upload_folder . '/' . $conteudo->id;
        $fullDirectoryPath = storage_path('app/' . $folderPath);
        $fileName = $conteudo->filehash . '.' . $conteudo->extension;

        if (!File::exists($fullDirectoryPath)) {
            File::makeDirectory($fullDirectoryPath, 0755, true, true);
        }

        $request->ar_file->storeAs($folderPath, $fileName);

        chmod($fullDirectoryPath . '/' . $fileName, 0644);
        
        chmod($fullDirectoryPath, 0755);

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

    public function update(Request $request, $id)
    {
        $conteudo = Conteudo::find($id);

        if (is_null($conteudo)) {
            return $this->sendError('Objeto 3D não encontrado');
        }

        $validator = Validator::make($request->all(), [
            'nome' => 'sometimes|required',
            'descricao' => 'sometimes|required',
            'escala' => 'sometimes|required',
            'ar_file' => 'sometimes|file'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $conteudo->nome = $request->input('nome') ?? $conteudo->nome;
        $conteudo->descricao = $request->input('descricao') ?? $conteudo->descricao;
        $conteudo->escala = $request->input('escala') ?? $conteudo->escala;

        if ($request->hasFile('ar_file')) {
            $file = $request->file('ar_file');
            
            $conteudo->filehash = hash_file('md5', $file);
            $conteudo->size = $file->getSize();
            $conteudo->extension = $file->getClientOriginalExtension();
            $fileName = $conteudo->filehash . '.' . $conteudo->extension;
            
            $conteudo->caminho = $fileName;

            $folderPath = 'public/' . $this->upload_folder . '/' . $conteudo->id;
            $fullDirectoryPath = storage_path('app/' . $folderPath);

            if (!File::exists($fullDirectoryPath)) {
                File::makeDirectory($fullDirectoryPath, 0755, true, true);
            }

            $file->storeAs($folderPath, $fileName);

            chmod($fullDirectoryPath, 0755);
            chmod($fullDirectoryPath . '/' . $fileName, 0644);
        }

        $conteudo->save();

        return $this->sendResponse(new ConteudoResource($conteudo), 'atualizacao');
    }

    public function destroy($id)
    {
        $conteudo = Conteudo::find($id);

        if (is_null($conteudo)) {
            return $this->sendError('Objeto 3D não encontrado');
        }

        $directoryPath = storage_path('app/public/' . $this->upload_folder . '/' . $conteudo->id);

        if (File::exists($directoryPath)) {
            File::deleteDirectory($directoryPath);
        }

        if ($conteudo->delete()) {
            return $this->sendResponse([], 'remocao');
        }

        return $this->sendError('Erro de Remoção', 'Não foi possível remover o registro do banco.', 500);
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

    public function comunidade()
    {
        $meuId = auth()->id();

        $conteudos = Conteudo::whereHas('aula.disciplina', function ($query) use ($meuId) {
            $query->where('dono_id', '!=', $meuId);
        })
        ->with(['aula.disciplina.dono'])
        ->get();

        return $this->sendResponse(ConteudoResource::collection($conteudos), 'conteudos');
    }

    public function clone(Request $request, $id)
    {
        try {
            $original = Conteudo::findOrFail($id);
            
            $novoConteudo = $original->replicate();
            $novoConteudo->aula_id = $request->aula_id;
            
            $novoConteudo->save(); 

            $caminhoOriginal = storage_path('app/public/objetos/' . $original->id);
            $caminhoNovo = storage_path('app/public/objetos/' . $novoConteudo->id);

            if (File::exists($caminhoOriginal)) {
                File::makeDirectory($caminhoNovo, 0755, true);
                
                $nomeArquivo = $original->filehash . '.' . $original->extension;
                $arquivoOrigem = $caminhoOriginal . '/' . $nomeArquivo;
                $arquivoDestino = $caminhoNovo . '/' . $nomeArquivo;
                
                if (File::exists($arquivoOrigem)) {
                    link($arquivoOrigem, $arquivoDestino);
                    
                    chmod($caminhoNovo, 0755);
                    chmod($arquivoDestino, 0644);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Objeto clonado com sucesso!',
                'data' => [
                    'id' => $novoConteudo->id,
                    'nome' => $novoConteudo->nome,
                    'aula_id' => $novoConteudo->aula_id 
                ]
            ], 201);

        } catch (\Exception $e) {
            return $this->sendError('Erro ao clonar: ' . $e->getMessage());
        }
    }
}
