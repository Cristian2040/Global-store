'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Users, Store, Truck, Package, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface DashboardStats {
    totalUsers: number;
    activeStores: number;
    totalSuppliers: number;
    totalProducts: number;
    revenue: {
        total: number;
        commissions: number;
    };
}

interface Activity {
    type: string;
    title: string;
    at: string;
    color: 'blue' | 'green' | 'purple' | 'orange';
}

export default function AdminDashboard() {
    const [statsData, setStatsData] = useState<DashboardStats | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, activityRes] = await Promise.all([
                api.get('/admin/dashboard/stats'),
                api.get('/admin/dashboard/recent-activity')
            ]);
            setStatsData(statsRes.data.data);
            setActivities(activityRes.data.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const statCards = statsData ? [
        { icon: <Users className="w-8 h-8" />, label: 'Total Usuarios', value: statsData.totalUsers.toLocaleString(), color: 'from-blue-500 to-cyan-500' },
        { icon: <Store className="w-8 h-8" />, label: 'Tiendas Activas', value: statsData.activeStores.toLocaleString(), color: 'from-purple-500 to-pink-500' },
        { icon: <Truck className="w-8 h-8" />, label: 'Proveedores', value: statsData.totalSuppliers.toLocaleString(), color: 'from-orange-500 to-red-500' },
        { icon: <Package className="w-8 h-8" />, label: 'Productos', value: statsData.totalProducts.toLocaleString(), color: 'from-green-500 to-emerald-500' },
    ] : [];

    if (loading) {
        return (
            <DashboardLayout role="admin" title="Panel de Administración">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

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
                    {statCards.map((stat, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow bg-gray-800/50 border-gray-700">
                            <CardContent className="p-6">
                                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                                    {stat.icon}
                                </div>
                                <p className="text-sm text-gray-400 mb-1 font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Revenue Section */}
                    <Card className="bg-gray-800/50 border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white">
                                <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                                Ingresos del Sistema
                            </CardTitle>
                            <CardDescription>Resumen financiero acumulado</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
                                    <span className="text-gray-300">Ingresos Totales</span>
                                    <span className="text-2xl font-bold text-green-400">
                                        {formatCurrency(statsData?.revenue.total || 0)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                                    <span className="text-gray-300">Comisiones (Est. 5%)</span>
                                    <span className="text-2xl font-bold text-blue-400">
                                        {formatCurrency(statsData?.revenue.commissions || 0)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="bg-gray-800/50 border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white">
                                <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
                                Actividad Reciente
                            </CardTitle>
                            <CardDescription>Últimas acciones en la plataforma</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {activities.length > 0 ? activities.map((activity, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-900/40 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${activity.color === 'blue' ? 'bg-blue-500' :
                                                activity.color === 'green' ? 'bg-green-500' :
                                                    activity.color === 'orange' ? 'bg-orange-500' : 'bg-purple-500'
                                            }`}></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                                            <p className="text-xs text-gray-400">
                                                {formatDistanceToNow(new Date(activity.at), { addSuffix: true, locale: es })}
                                            </p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-center text-gray-400 py-4 text-sm italic">Sin actividad reciente</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
