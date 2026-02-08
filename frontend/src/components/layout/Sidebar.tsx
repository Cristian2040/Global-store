'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
    ChevronLeft,
    ChevronRight,
    Home,
    ShoppingBag,
    Store,
    Package,
    ShoppingCart,
    FileText,
    Users,
    Truck,
    Settings,
    LogOut,
    LayoutDashboard,
    ClipboardList,
} from 'lucide-react';

interface SidebarProps {
    role: 'customer' | 'store' | 'supplier' | 'admin' | 'company';
}

export function Sidebar({ role }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const menuItems = {
        customer: [
            { icon: <Home className="w-5 h-5" />, label: 'Inicio', href: '/customer' },
            { icon: <Store className="w-5 h-5" />, label: 'Tiendas', href: '/customer/stores' },
            { icon: <ShoppingBag className="w-5 h-5" />, label: 'Productos', href: '/customer/products' },
            { icon: <ShoppingCart className="w-5 h-5" />, label: 'Carrito', href: '/customer/cart' },
            { icon: <FileText className="w-5 h-5" />, label: 'Mis Pedidos', href: '/customer/orders' },
            { icon: <Settings className="w-5 h-5" />, label: 'Configuración', href: '/customer/settings' },
        ],
        store: [
            { icon: <Home className="w-5 h-5" />, label: 'Inicio', href: '/store' },
            { icon: <Package className="w-5 h-5" />, label: 'Inventario', href: '/store/inventory' },
            { icon: <ShoppingBag className="w-5 h-5" />, label: 'Productos', href: '/store/products' },
            { icon: <FileText className="w-5 h-5" />, label: 'Pedidos', href: '/store/orders' },
            { icon: <Truck className="w-5 h-5" />, label: 'Proveedores', href: '/store/suppliers' },
            { icon: <ClipboardList className="w-5 h-5" />, label: 'Reabastecimiento', href: '/store/restock' },
            { icon: <Settings className="w-5 h-5" />, label: 'Configuración', href: '/store/settings' },
        ],
        supplier: [
            { icon: <Home className="w-5 h-5" />, label: 'Inicio', href: '/supplier' },
            { icon: <Package className="w-5 h-5" />, label: 'Productos', href: '/supplier/products' },
            { icon: <FileText className="w-5 h-5" />, label: 'Pedidos', href: '/supplier/orders' },
            { icon: <Truck className="w-5 h-5" />, label: 'Entregas', href: '/supplier/deliveries' },
            { icon: <Settings className="w-5 h-5" />, label: 'Configuración', href: '/supplier/settings' },
        ],
        company: [
            { icon: <Home className="w-5 h-5" />, label: 'Inicio', href: '/company' },
            { icon: <Package className="w-5 h-5" />, label: 'Catálogo Global', href: '/company/products' },
            { icon: <Truck className="w-5 h-5" />, label: 'Proveedores', href: '/company/suppliers' },
            { icon: <Settings className="w-5 h-5" />, label: 'Configuración', href: '/company/settings' },
        ],
        admin: [
            { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', href: '/admin' },
            { icon: <Users className="w-5 h-5" />, label: 'Usuarios', href: '/admin/users' },
            { icon: <Store className="w-5 h-5" />, label: 'Tiendas', href: '/admin/stores' },
            { icon: <Truck className="w-5 h-5" />, label: 'Proveedores', href: '/admin/suppliers' },
            { icon: <Package className="w-5 h-5" />, label: 'Productos', href: '/admin/products' },
            { icon: <Settings className="w-5 h-5" />, label: 'Configuración', href: '/admin/settings' },
        ],
    };

    const items = menuItems[role] || [];

    return (
        <div
            className={cn(
                'bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen sticky top-0 transition-all duration-300 flex flex-col',
                collapsed ? 'w-20' : 'w-64'
            )}
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-700">
                {!collapsed && (
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src="/logo.png" alt="GlobalStore" width={32} height={32} />
                        <span className="font-bold text-lg">GlobalStore</span>
                    </Link>
                )}
                {collapsed && (
                    <Link href="/" className="mx-auto">
                        <Image src="/logo.png" alt="GlobalStore" width={32} height={32} />
                    </Link>
                )}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 bg-blue-600 rounded-full p-1 hover:bg-blue-700 transition-colors z-10"
            >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Navigation */}
            <nav className="flex-1 py-6 overflow-y-auto">
                <ul className="space-y-2 px-3">
                    {items.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={index}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all',
                                        isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        collapsed && 'justify-center'
                                    )}
                                    title={collapsed ? item.label : undefined}
                                >
                                    {item.icon}
                                    {!collapsed && <span className="font-medium">{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Section */}
            <div className="border-t border-gray-700 p-4">
                <div className={cn('flex items-center', collapsed ? 'justify-center' : 'space-x-3')}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{user?.username}</p>
                            <p className="text-xs text-gray-400 capitalize">{role}</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={logout}
                    className={cn(
                        'mt-3 w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all',
                        collapsed && 'justify-center'
                    )}
                    title={collapsed ? 'Cerrar Sesión' : undefined}
                >
                    <LogOut className="w-5 h-5" />
                    {!collapsed && <span>Cerrar Sesión</span>}
                </button>
            </div>
        </div>
    );
}
