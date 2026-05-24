import { useEffect, useRef, useState } from "react";

export function Card({ title, subtitle, value, colorClass, children, variant = "default" }) {
    const [ expandido, setExpandido ] = useState(false);
    const [ lerMais, setLerMais ] = useState(false);
    const textoRef = useRef(null);

    useEffect(() => {
        if(textoRef.current) {
            const texto = textoRef.current.scrollHeight > textoRef.current.clientHeight;
            setLerMais(texto);
        }
    }, [subtitle]);

    return (
        <div 
            style={{ borderLeftColor : colorClass }}
            className={`w-full p-6 rounded-2xl border-l-8 bg-white shadow-sm
                ${variant === "row" ? "flex flex-col md:flex-row justify-between items-start gap-4 md:gap-10" : "flex flex-col gap-1"}`}
        >
            {variant === "row" ? (
                <>
                    <div className="flex flex-col flex-1 min-w-0 w-full">
                        <h2 className="text-2xl md:text-3xl font-bold wrap-break-word max-w-full">
                            {title}
                        </h2>

                       {subtitle && (
                            <div className="mt-2">
                                <p  
                                    ref={textoRef}
                                    className={
                                        `text-base text-[#767474] font-bold
                                        wrap-break-word text-justify
                                        ${expandido ? "" : (variant === "row" ? "line-clamp-2" : "line-clamp-1")}
                                    `}
                                >
                                    {subtitle}
                                </p>

                                {lerMais && variant === "row" && (
                                    <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandido(!expandido);
                                    }}
                                        className="text-sm font-bold text-[#389137] mt-1 hover:underline cursor-pointer block"
                                    >
                                        {expandido ? "Ler menos ↑" : "Ler mais ↓"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-auto">
                        {children}
                    </div>
                </>
            ) : (
                <>
                    <span 
                        className="text-gray-500 font-medium text-lg"
                    >
                        {title}
                    </span>
                    <span
                        style={{ color : colorClass }}
                        className="text-2xl font-bold"
                    >
                        {value}
                    </span>
                </>
            )}
            
        </div>
    );
}
