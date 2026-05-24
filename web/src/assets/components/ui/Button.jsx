export function Button({ children, className = "", variant = "primary", ...props }) {

    const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all shadow-sm flex items-center justify-center cursor-pointer";
  
  const variants = {
    primary: "bg-[#389137] text-white hover:bg-[#48BD47] shadow-md",
    secondary: "bg-[#D9D9D9] text-black hover:bg-[#E8E1E1]",
    tertiary: "bg-[#FBFBFB] text-black hover:bg-[#F21818] hover:text-white",
    delete: "bg-[#F21818] text-white hover:bg-[#F25252]",
    ghost: "bg-[#FBFBFB] text-black hover:bg-[#48BD47] hover:text-white"
  };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
