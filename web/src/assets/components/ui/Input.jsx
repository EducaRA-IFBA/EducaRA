export function Input({ label, type, placeholder, error, ...props }) {
    return (
        <div className="flex flex-col gap-4 w-full mb-4">
        {label && <label className="text-sm font-medium text-black-700">{label}</label>}
        <input
            type={type}
            placeholder={placeholder}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#389137] focus:border-transparent transition-all"
            {...props} 
        />
        {error && (
            <span className="text-red-500 text-sm font-bold">
                {error}
            </span>
        )}
        </div>
    );
}
