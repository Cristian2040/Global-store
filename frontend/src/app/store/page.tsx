'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { DollarSign, Package, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';

export default function StoreDashboard() {
    const stats = [
        { icon: <DollarSign className="w-8 h-8" />, label: 'Ventas Hoy', value: '$2,450', color: 'from-green-500 to-emerald-500' },
        { icon: <ShoppingCart className="w-8 h-8" />, label: 'Pedidos Pendientes', value: '12', color: 'from-blue-500 to-cyan-500' },
        { icon: <Package className="w-8 h-8" />, label: 'Productos en Stock', value: '156', color: 'from-purple-500 to-pink-500' },
        { icon: <TrendingUp className="w-8 h-8" />, label: 'Crecimiento', value: '+15%', color: 'from-orange-500 to-red-500' },
    ];

    return (
        <DashboardLayout role="store" title="Panel de Control">
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
                    <h2 className="text-3xl font-bold mb-2">Panel de Gestión</h2>
                    <p className="text-purple-100">Administra tu tienda y mantén el control de tus ventas</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-4`}>
                                    {stat.icon}
                                </div>
                                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Low Stock Alert */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                                Stock Bajo
                            </CardTitle>
                            <CardDescription>Productos que necesitan reabastecimiento</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {['Leche', 'Pan', 'Huevos'].map((product, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                        <span className="font-medium text-gray-900">{product}</span>
                                        <span className="text-sm text-orange-600 font-semibold">{5 - i} unidades</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pedidos Recientes</CardTitle>
                            <CardDescription>Últimas órdenes de clientes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-gray-900">Pedido #{2000 + i}</p>
                                            <p className="text-sm text-gray-600">Cliente {i}</p>
                                        </div>
                                        <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                                            Nuevo
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
