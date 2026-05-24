export function PageHeader({ onBack, actions }) {
    return(
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pt-4 w-full">
            <button
                onClick={onBack}
                className="text-lg font-bold hover:text-xl cursor-pointer"
            >
                ← Voltar
            </button>

            <div className="flex flex-wrap md:flex-nowrap gap-2 w-full md:w-auto justify-end">
                {actions}
            </div>
        </div>
    );
}
