import { useState } from "react";
import { Button } from "./ui/Button";
import { Search, Filter, ChevronDown } from "lucide-react";

export function Toolbar({ onOpenModal, searchPlaceholder, buttonLabel, onSearchChange, searchValue, showFilter = false, abaAtiva, onFilterChange }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSelect = (filtro) => {
        onFilterChange(filtro);
        setIsMenuOpen(false);
    };

    return (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 w-full relative">
            <div className="relative flex-1 flex items-center bg-[#389137]/15 rounded-xl px-4 w-full">
                <Search size={20} className="text-gray-500" />
                <input
                    type="search"
                    value={searchValue}
                    onChange={onSearchChange}
                    placeholder={searchPlaceholder}
                    className="w-full bg-transparent pl-3 py-3 outline-none text-gray-700 placeholder-gray-500"
                />
                
                {showFilter && (
                    <div className="relative border-l border-gray-300 ml-2 pl-2">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-1 text-gray-500 hover:text-[#389137] transition-colors cursor-pointer"
                        >
                            <Filter size={20} />
                            <ChevronDown size={16} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                <button 
                                    onClick={() => handleSelect('meus')}
                                    className={`
                                        w-full text-left px-4 py-3 text-sm font-bold border-b border-gray-100 cursor-pointer transition-colors
                                        ${
                                            abaAtiva === 'meus'
                                                ? 'bg-gray-50 text-[#389137]'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }
                                    `}>
                                    Meus conteúdos
                                </button>
                                <button 
                                    onClick={() => handleSelect('comunidade')}
                                    className={`
                                        w-full text-left px-4 py-3 text-sm font-bold cursor-pointer transition-colors
                                        ${
                                            abaAtiva === 'comunidade'
                                                ? 'bg-gray-50 text-[#389137]'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }
                                    `}>
                                    Comunidade
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Button 
                variant="primary" 
                className="w-full md:w-43 px-6 py-3 flex items-center justify-center gap-2 whitespace-nowrap"
                onClick={onOpenModal}
            >
                {buttonLabel}
            </Button>
        </div>
    );
}
