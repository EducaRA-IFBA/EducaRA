import { useEffect, useRef, useState } from "react";
import molecule from "../images/molecule.png";
import { Button } from "./ui/Button";

export function ContentCard({ title, subtitle, onAction, variant = "default", professorName, isCommunity }) {
    const [ expandido, setExpandido ] = useState(false);
    const [ lerMais, setLerMais ] = useState(false);
    const textoRef = useRef(null);

    useEffect(() => {
        if(textoRef.current) {
            const texto = textoRef.current.scrollHeight > textoRef.current.clientHeight;
            setLerMais(texto);
        }
    }, [subtitle]);

    return(
        <div className={`
            relative w-full rounded-2xl p-4 bg-white shadow-sm border border-transparent
            ${variant === "detail" ? "my-0 flex items-start" : "mb-4 mt-6 flex items-center justify-between gap-4"}
            `}>

            {variant === "default" && (
                <button
                    onClick={onAction}
                    className="absolute inset-0 z-10 md:hidden"
                />
            )}
            
            <div className="flex items-center gap-4 pr-4"> 
                <div className="w-16 h-16 p-2 shrink-0">
                    <img
                        src={molecule}
                        alt='Objeto 3D'
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="flex flex-col items-start min-w-0 flex-1">
                    <div className="flex items-center gap-3 w-full justify-start">
                        <p className="text-xl font-bold [overflow-wrap:anywhere] text-gray-800">
                            {title}
                        </p>
                        {variant === "default" && professorName && isCommunity && (
                            <span className="hidden md:inline-flex text-xs font-bold text-[#389137] bg-[#ECFEEB] px-2.5 py-1 rounded-md shrink-0 border border-green-200 shadow-sm">
                                Professor: {professorName}
                            </span>
                        )}
                    </div>
                    <p 
                        ref={textoRef}
                        className={`
                            text-base text-[#767474] font-bold [overflow-wrap:anywhere] text-justify pt-2
                            ${expandido ? "" : (variant === "detail" ? "line-clamp-2" : "line-clamp-1")}
                        `}
                    >
                        {subtitle}
                    </p>

                    {lerMais && variant === "detail" && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpandido(!expandido);
                            }}
                            className="text-sm font-bold text-[#389137] mt-1 hover:underline cursor-pointer"
                        >
                            {expandido ? "Ler menos ↑" : "Ler mais ↓"}
                        </button>
                    )}
                    {professorName && isCommunity && (
                        <span className="inline-flex md:hidden text-xs font-bold text-[#389137] bg-[#ECFEEB] px-2.5 py-1 rounded-md border border-green-200 shadow-sm mt-3 max-w-full wrap-break-word whitespace-normal text-left">
                            Professor: {professorName}
                        </span>
                    )}
                </div>
            </div>
            {variant === "detail" && professorName && isCommunity && (
                <span className="hidden md:flex absolute top-3 right-4 text-xs font-black text-[#389137] bg-[#ECFEEB] px-2.5 py-1 rounded-md border border-green-200 shadow-sm z-30 items-center gap-1 wrap-break-word whitespace-normal">
                    Professor: {professorName}
                </span>
            )}
            {variant === "default" && (
                <Button
                    onClick={onAction}
                    className="hidden md:flex text-sm w-40 relative z-20 shrink-0"
                >
                    Ver Conteúdo
                </Button>
            )}
        </div>
    );
}
