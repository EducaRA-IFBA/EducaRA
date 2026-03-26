<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\
{
    AliveController,
    DisciplinaController,
    ConteudoController,
    AulaController
};

Route::middleware('api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('api')->group(function () {

    Route::apiResources([
        'disciplinas' => DisciplinaController::class,
        'conteudos' => ConteudoController::class,
        'aulas' => AulaController::class,
    ]);

    Route::get('conteudos/{codigo}/download', [ConteudoController::class, 'download'])->name('conteudos.download');

});

Route::prefix('v1')->group(function () {
    Route::get('/alive', [AliveController::class, 'index']);//->name('v1.alive.show');
    Route::get('/disciplinas', [DisciplinaController::class, 'index']);
    Route::get('/aulas/{disciplina_id}', [AulaController::class, 'getAulas'])->name('v1.disciplinas.aulas.show');
    Route::get('/conteudos/{aula_id}', [ConteudoController::class, 'getConteudos'])->name('v1.conteudos.show');
    Route::get('/conteudos/{codigo}/download', [ConteudoController::class, 'downloadConteudo'])->name('v1.conteudos.download');

});

