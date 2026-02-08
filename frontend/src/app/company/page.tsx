'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Package, Truck, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';

export default function CompanyDashboardPage() {
    const { user, relatedData } = useAuth();
    // TODO: Fetch real stats from API
    // const [stats, setStats] = useState({ products: 0, suppliers: 0, orders: 0 });

    const companyName = (relatedData as any)?.companyName || user?.username;

    const stats = [
        {
            title: 'Productos Globales',
            value: '0',
            icon: <Package className="w-8 h-8 text-cyan-500" />,
            change: '+0 nuevos',
            color: 'bg-cyan-500/10 border-cyan-500'
        },
        {
            title: 'Proveedores Activos',
            value: '0',
            icon: <Truck className="w-8 h-8 text-purple-500" />,
            change: '0 pendientes',
            color: 'bg-purple-500/10 border-purple-500'
        },
        {
            title: 'Ventas Totales (Est.)',
            value: '$0.00',
            icon: <TrendingUp className="w-8 h-8 text-green-500" />,
            change: '+0% vs mes anterior',
            color: 'bg-green-500/10 border-green-500'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Hola, {companyName}</h1>
                    <p className="text-gray-400">Bienvenido a tu panel de control de empresa</p>
                </div>
                <div className="flex space-x-3">
                    <Link
                        href="/company/products/new"
                        className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuevo Producto</span>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className={`p-6 border ${stat.color} bg-gray-800/50 backdrop-blur`}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
                            </div>
                            <div className="p-3 rounded-lg bg-gray-900/50">
                                {stat.icon}
                            </div>
                        </div>
                        <div className="flex items-center text-sm">
                            <span className="text-green-400 font-medium">{stat.change}</span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Recent Activity / Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Acciones Rápidas</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link href="/company/products/new" className="p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all border border-gray-700 hover:border-cyan-500 group">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-full bg-cyan-900/50 group-hover:bg-cyan-900 text-cyan-400">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Registrar Producto</h3>
                                    <p className="text-xs text-gray-400">Añadir al catálogo global</p>
                                </div>
                            </div>
                        </Link>
                        <Link href="/company/suppliers/invite" className="p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all border border-gray-700 hover:border-purple-500 group">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-full bg-purple-900/50 group-hover:bg-purple-900 text-purple-400">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Invitar Proveedor</h3>
                                    <p className="text-xs text-gray-400">Vincular nuevo distribuidor</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Estado del Sistema</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                            <div className="flex items-center space-x-3">
                                <Package className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-200">Catálogo de Productos</span>
                            </div>
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-900">Activo</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                            <div className="flex items-center space-x-3">
                                <Truck className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-200">Red de Proveedores</span>
                            </div>
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-900">Operativo</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
