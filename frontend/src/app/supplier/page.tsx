'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Package, Truck, FileText, TrendingUp } from 'lucide-react';

export default function SupplierDashboard() {
    const stats = [
        { icon: <FileText className="w-8 h-8" />, label: 'Pedidos Pendientes', value: '8', color: 'from-blue-500 to-cyan-500' },
        { icon: <Truck className="w-8 h-8" />, label: 'Entregas Hoy', value: '5', color: 'from-orange-500 to-red-500' },
        { icon: <Package className="w-8 h-8" />, label: 'Productos Activos', value: '45', color: 'from-purple-500 to-pink-500' },
        { icon: <TrendingUp className="w-8 h-8" />, label: 'Ventas del Mes', value: '$8,750', color: 'from-green-500 to-emerald-500' },
    ];

    return (
        <DashboardLayout role="supplier" title="Panel de Proveedor">
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-8 text-white">
                    <h2 className="text-3xl font-bold mb-2">Panel de Proveedor</h2>
                    <p className="text-orange-100">Gestiona tus productos y entregas a tiendas</p>
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
                    {/* Pending Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pedidos Pendientes</CardTitle>
                            <CardDescription>Órdenes de tiendas por procesar</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-gray-900">Pedido #{3000 + i}</p>
                                            <p className="text-sm text-gray-600">Tienda Local {i}</p>
                                        </div>
                                        <span className="inline-block px-3 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                                            Pendiente
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Today's Deliveries */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Entregas de Hoy</CardTitle>
                            <CardDescription>Pedidos programados para entrega</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-gray-900">Entrega #{4000 + i}</p>
                                            <p className="text-sm text-gray-600">Tienda Local {i}</p>
                                        </div>
                                        <span className="inline-block px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                            En ruta
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
