'use client';

import { Sidebar } from './Sidebar';
import { DashboardNavbar } from './DashboardNavbar';

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: 'customer' | 'store' | 'supplier' | 'admin';
    title: string;
    showSearch?: boolean;
}

export function DashboardLayout({ children, role, title, showSearch }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar role={role} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardNavbar title={title} showSearch={showSearch} />
                <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
