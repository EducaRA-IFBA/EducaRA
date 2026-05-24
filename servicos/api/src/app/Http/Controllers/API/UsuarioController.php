<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\Usuario;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Validator;

class UsuarioController extends BaseController
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required',
            'email' => 'required|email|unique:users,email',
            'senha' => 'required',
            'c_senha' => 'required|same:senha',
        ], [
            'email.unique' => 'Este e-mail já está em uso.'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Erro de validação.', $validator->errors());
        }

        $usuario = Usuario::create([
            'name' => $request->nome,
            'email' => $request->email,
            'password' => Hash::make($request->senha),
            'type' => 'Aluno' 
        ]);

        $success['token'] = $usuario->createToken('EducaRA_Auth')->plainTextToken;
        $success['nome'] = $usuario->name;

        return $this->sendResponse($success, 'usuario');
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'senha' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Erro de validação.', $validator->errors());
        }

        $user = Usuario::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->senha, $user->password)) {

            return $this->sendError(
                'Não autorizado.',
                ['error' => 'E-mail ou senha incorretos.'],
                401
            );
        }

        $success['token'] = $user->createToken('EducaRA_Auth')->plainTextToken;
        $success['nome'] = $user->name;

        return $this->sendResponse($success, 'login');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'sucess' => true,
            'message' => 'sessão encerrada'
        ]);
    }
}
