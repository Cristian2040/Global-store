'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ShoppingBag, Store, Package, TrendingUp } from 'lucide-react';

export default function CustomerDashboard() {
    const stats = [
        { icon: <ShoppingBag className="w-8 h-8" />, label: 'Pedidos Activos', value: '3', color: 'from-blue-500 to-cyan-500' },
        { icon: <Store className="w-8 h-8" />, label: 'Tiendas Favoritas', value: '5', color: 'from-purple-500 to-pink-500' },
        { icon: <Package className="w-8 h-8" />, label: 'Productos en Carrito', value: '8', color: 'from-orange-500 to-red-500' },
        { icon: <TrendingUp className="w-8 h-8" />, label: 'Total Gastado', value: '$1,234', color: 'from-green-500 to-emerald-500' },
    ];

    return (
        <DashboardLayout role="customer" title="Inicio">
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-xl p-8 text-white shadow-lg shadow-blue-500/20">
                    <h2 className="text-3xl font-bold mb-2">¡Bienvenido de vuelta!</h2>
                    <p className="text-cyan-100">Descubre nuevos productos y ofertas de tus tiendas favoritas</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-4`}>
                                    {stat.icon}
                                </div>
                                <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pedidos Recientes</CardTitle>
                        <CardDescription>Tus últimas compras</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
                                    <div>
                                        <p className="font-semibold text-white">Pedido #{1000 + i}</p>
                                        <p className="text-sm text-gray-400">Tienda Local {i}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-white">$150.00</p>
                                        <span className="inline-block px-3 py-1 text-xs font-semibold text-green-300 bg-green-900/50 border border-green-700 rounded-full">
                                            En camino
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
