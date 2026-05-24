import { ZoomIn, ZoomOut } from "lucide-react";

export function ToolbarViewer({ onZoomIn, onZoomOut }) {
    return (
        <div className="absolute bottom-4 right-4 z-10 flex gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-lg border border-gray-200">
            <button 
                onClick={onZoomIn} 
                title="Aproximar (Zoom +)"
                className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-700 transition"
            >
                <ZoomIn size={20} />
            </button>
            <button 
                onClick={onZoomOut} 
                title="Afastar (Zoom -)"
                className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-700 transition"
            >
                <ZoomOut size={20} />
            </button>
        </div>
    );
}
