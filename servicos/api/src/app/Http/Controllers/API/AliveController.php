<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\BaseController as BaseController;

class AliveController extends BaseController
{
    private $alive = true;

    public function index()
    {
        return $this->sendResponse($this->alive, 'alive');
    }

}