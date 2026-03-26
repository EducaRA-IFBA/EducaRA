<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\Usuario;
use Illuminate\Support\Facades\Auth;
use Validator;

class UsuarioController extends BaseController
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required',
            'email' => 'required|email',
            'senha' => 'required',
            'c_senha' => 'required|same:senha',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Erro de validação.', $validator->errors());
        }

        $input = $request->all();
        $input['senha'] = bcrypt($input['senha']);
        $usuario = Usuario::create($input);
        $success['token'] = $usuario->createToken('MyApp')->accessToken;
        $success['nome'] = $usuario->nome;

        return $this->sendResponse($success, 'usuario');
    }

    public function login(Request $request)
    {
        if (Auth::attempt(['email' => $request->email, 'senha' => $request->senha])) {
            $user = Auth::user();
            $success['token'] = $user->createToken('MyApp')->accessToken;
            $success['nome'] = $user->nome;

            return $this->sendResponse($success, 'login');
        } else {
            return $this->sendError('Não autorizado.', ['error' => 'Unauthorised']);
        }
    }
}