import logo from '../images/logo-educara-simbolo.png';

export function Loading() {
    return(
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 border-4 border-[#ECFEEB] border-t-[#389137] rounded-full animate-spin"></div>
                
                <div className="absolute flex items-center justify-center">
                    <img 
                        src={logo}
                        alt="Logo EducaRA"
                        className="w-18 h-18 object-contain"
                    />
                </div>
            </div>
        </div>
    );
}
