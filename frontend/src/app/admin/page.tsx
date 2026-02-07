'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Users, Store, Truck, Package, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const stats = [
        { icon: <Users className="w-8 h-8" />, label: 'Total Usuarios', value: '1,234', color: 'from-blue-500 to-cyan-500' },
        { icon: <Store className="w-8 h-8" />, label: 'Tiendas Activas', value: '45', color: 'from-purple-500 to-pink-500' },
        { icon: <Truck className="w-8 h-8" />, label: 'Proveedores', value: '23', color: 'from-orange-500 to-red-500' },
        { icon: <Package className="w-8 h-8" />, label: 'Productos', value: '567', color: 'from-green-500 to-emerald-500' },
    ];

    return (
        <DashboardLayout role="admin" title="Panel de Administración">
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-xl p-8 text-white shadow-lg shadow-blue-500/20">
                    <h2 className="text-3xl font-bold mb-2">Panel de Administración</h2>
                    <p className="text-cyan-100">Gestiona todo el sistema GlobalStore</p>
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

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                                Ingresos del Sistema
                            </CardTitle>
                            <CardDescription>Resumen financiero del mes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-green-900/30 border border-green-700 rounded-lg">
                                    <span className="text-gray-300">Ingresos Totales</span>
                                    <span className="text-2xl font-bold text-green-400">$45,678</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                                    <span className="text-gray-300">Comisiones</span>
                                    <span className="text-2xl font-bold text-blue-400">$4,567</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
                                Actividad Reciente
                            </CardTitle>
                            <CardDescription>Últimas acciones en el sistema</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Nueva tienda registrada</p>
                                        <p className="text-xs text-gray-400">Hace 5 minutos</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Nuevo proveedor aprobado</p>
                                        <p className="text-xs text-gray-400">Hace 15 minutos</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                    <div>
                                        <p className="text-sm font-medium text-white">50 nuevos productos agregados</p>
                                        <p className="text-xs text-gray-400">Hace 1 hora</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
