import { Button } from "./ui/Button";

export function Table({ columns, data = [], actionLabel, onAction }) {

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-300">
            <table className="w-full text-left border-collapse table-fixed">
                <thead className="bg-[#EEEEEE]">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className={`px-5 py-2.5 font-bold ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}
                                style={{ width: col.width || 'auto' }}
                            >
                                {col.header}
                            </th>
                        ))}

                        {actionLabel && <th className="px-5 py-2.5 w-[15%]"></th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-400">
                    {data?.length === 0 ? (
                        <tr>
                            <td 
                                colSpan={columns.length + (actionLabel ? 1 : 0)}
                                className="text-center py-10"
                            >
                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                <span className="text-lg font-bold">
                                    Nenhum item encontrado
                                </span>
                                </div>
                            </td>
                        </tr>
                        ) : (
                        data.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                {columns.map((col, index) => (
                                <td
                                    key={index} 
                                    className={`px-5 py-2.5 ${
                                    col.align === 'center' ? 'text-center' : ''
                                    }`}
                                    style={{ width: col.width || "auto" }}
                                >
                                    {col.truncate ? (
                                        <span
                                            className="block truncate"
                                            title={item[col.accessor] ?? ""}
                                        >
                                            {item[col.accessor] ?? "-"}
                                        </span>
                                    ) : (
                                        item[col.accessor] ?? "-"
                                    )}
                                </td>
                            ))}

                            {actionLabel && (
                                <td className="px-5 py-2.5 flex justify-end">
                                    <Button 
                                        onClick={() => onAction(item)}
                                        className="px-4 py-1.5 text-sm w-40 mt-0 whitespace-nowrap"
                                    >
                                        {actionLabel}
                                    </Button>
                                </td>
                            )}
                        </tr>
                        ))
                    )}
                    </tbody>
            </table>
        </div>
    );
}
