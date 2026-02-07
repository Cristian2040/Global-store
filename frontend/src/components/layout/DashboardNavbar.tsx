'use client';

import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface DashboardNavbarProps {
    title: string;
    showSearch?: boolean;
}

export function DashboardNavbar({ title, showSearch = true }: DashboardNavbarProps) {
    return (
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">{title}</h1>

                <div className="flex items-center space-x-4">
                    {showSearch && (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 w-64"
                            />
                        </div>
                    )}

                    <button className="relative p-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
                        <Bell className="w-6 h-6" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>
            </div>
        </div>
    );
}
