<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReadOnlyBypassToken
{
    public function handle(Request $request, Closure $next)
    {
        $bypassToken = env('READ_ONLY_API_TOKEN', null);

        if ($this->hasValidBypassToken($request, $bypassToken)) {
            return $next($request);
        }

        if (Auth::guard('sanctum')->check()) {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized.'], 401);
    }

    protected function hasValidBypassToken(Request $request, ?string $token): bool
    {
        if (!$request->isMethod('GET') || empty($token)) {
            return false;
        }

        $authorization = $request->bearerToken();
        if ($authorization && hash_equals($token, $authorization)) {
            return true;
        }

        $headerToken = $request->header('X-READ-BYPASS-TOKEN');
        return $headerToken && hash_equals($token, $headerToken);
    }
}
