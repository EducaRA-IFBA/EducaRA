import React from "react";
import { useIsFetching } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";

export function SyncIndicator() {
    const isFetching = useIsFetching();

    if (isFetching === 0) return null;

    return (
        <div className="fixed bottom-5 left-5 z-50 flex items-center gap-3 bg-gray-700 text-white px-4 py-3 rounded-xl shadow-2xl border border-gray-600 animate-fade-in-up">
            <RefreshCw size={18} className="animate-spin text-[#389137]" />
            
            <div className="flex flex-col">
                <span className="text-sm font-bold">Sincronizando...</span>
                <span className="text-xs text-slate-400">Atualizando dados em segundo plano.</span>
            </div>
        </div>
    );
}
