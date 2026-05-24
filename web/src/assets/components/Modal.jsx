import { useEffect } from "react";

export function Modal({ isOpen, onClose, title, subtitle, children }) {

    const hasHeader = title || subtitle;

    useEffect(() => {
        if(isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
        }

    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" 
                onClick={onClose}
            />

            <div className="relative w-full bg-white max-w-md md:max-w-md rounded-2xl shadow-2xl overflow-hidden">
                {hasHeader && (
                    <header className={`flex flex-col justify-start p-6 ${subtitle ? "gap-5" : "gap-0"}`}>
                        {title && <h1 className="text-2xl font-bold">{title}</h1>}
                        {subtitle && <h2 className="text-base text-[#8D8D8D]">{subtitle}</h2>}
                </header>
                )}
                
                <div className="px-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
