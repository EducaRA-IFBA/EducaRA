<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\
{
    AliveController,
    DisciplinaController,
    ConteudoController,
    AulaController,
    UsuarioController
};

Route::middleware('api')->prefix('v1')->group(function () {

    Route::get('/alive', [AliveController::class, 'index']);
    Route::post('/login', [UsuarioController::class, 'login']);
    Route::post('/register', [UsuarioController::class, 'register']);

    Route::middleware('read.bypass')->group(function () {
        Route::get('/conteudos/comunidade', [ConteudoController::class, 'getConteudosComunidade']);
        Route::post('/conteudos/{id}/clonar', [ConteudoController::class, 'clonar']);

        Route::apiResources([
            'disciplinas' => DisciplinaController::class,
            'conteudos'   => ConteudoController::class,
            'aulas'       => AulaController::class,
        ]);

        Route::get('/aulas/disciplina/{disciplina_id}', [AulaController::class, 'getAulas'])->name('v1.aulas.show');
        Route::get('/conteudos/aula/{aula_id}', [ConteudoController::class, 'getConteudos'])->name('v1.conteudos.show');
        Route::get('/conteudos/{codigo}/download', [ConteudoController::class, 'downloadConteudo'])->name('v1.conteudos.download');

        Route::post('/logout', [UsuarioController::class, 'logout']);

        Route::get('/user', function (Request $request) {
            return $request->user();
        });
    });   
});
