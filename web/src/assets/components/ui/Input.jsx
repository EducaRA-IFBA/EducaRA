export function Input({ label, type, placeholder, error, multiline = false, rows, maxLength, value = "", ...props }) {
    return (
        <div className="flex flex-col gap-2 w-full mb-4">
            {label && (
                <label className="text-sm font-medium text-black">
                    {label}
                </label>
            )}

            {multiline ? (
                <textarea
                    rows={rows}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    value={value}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#389137] focus:border-transparent transition-all"
                    {...props}
                />
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    value={value}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#389137] focus:border-transparent transition-all"
                    {...props}
                />
            )}

            {maxLength && (
                <span className="text-sm text-gray-700 text-right">
                    {value.length}/{maxLength} caracteres
                </span>
            )}

            {error && (
                <span className="text-red-500 text-sm font-bold">
                    {error}
                </span>
            )}
        </div>
    );
}
