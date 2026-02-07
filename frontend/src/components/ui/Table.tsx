'use client';

import { ReactNode } from 'react';

interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (item: T) => ReactNode;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
}

export function Table<T extends Record<string, any>>({ data, columns, onRowClick }: TableProps<T>) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-700">
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {data.map((item, rowIndex) => (
                        <tr
                            key={rowIndex}
                            onClick={() => onRowClick?.(item)}
                            className={`${onRowClick ? 'cursor-pointer hover:bg-gray-800' : ''} transition-colors`}
                        >
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {column.render
                                        ? column.render(item)
                                        : String(item[column.key as keyof T] ?? '')}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {data.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No hay datos disponibles
                </div>
            )}
        </div>
    );
}
