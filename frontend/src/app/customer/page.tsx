'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ShoppingBag, Store, Package, TrendingUp, MapPin } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import api from '@/lib/api';
import { ChatBot } from '@/components/common/ChatBot';

export default function CustomerDashboard() {
    const { totalItems } = useCart();
    const [stats, setStats] = useState({
        activeOrders: 0,
        favoriteStores: 0,
        totalSpent: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/customer-orders/my/orders?limit=100');
                if (response.data.success) {
                    const orders = response.data.data;

                    // Calculate Active Orders
                    const active = orders.filter((o: any) =>
                        !['ENTREGADA', 'CANCELADA', 'REEMBOLSADA'].includes(o.status)
                    ).length;

                    // Calculate Total Spent
                    const spent = orders.reduce((acc: number, o: any) => acc + (o.totalAmount || 0), 0);

                    // Calculate Unique Stores (Favorite Stores approximation)
                    const uniqueStores = new Set(orders.map((o: any) => o.store?._id || o.store)).size;

                    setStats({
                        activeOrders: active,
                        favoriteStores: uniqueStores,
                        totalSpent: spent
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { icon: <ShoppingBag className="w-8 h-8" />, label: 'Pedidos Activos', value: stats.activeOrders.toString(), color: 'from-blue-500 to-cyan-500' },
        { icon: <Store className="w-8 h-8" />, label: 'Tiendas Visitadas', value: stats.favoriteStores.toString(), color: 'from-purple-500 to-pink-500' },
        { icon: <Package className="w-8 h-8" />, label: 'Productos en Carrito', value: totalItems.toString(), color: 'from-orange-500 to-red-500' },
        { icon: <TrendingUp className="w-8 h-8" />, label: 'Total Gastado', value: `$${stats.totalSpent.toFixed(2)}`, color: 'from-green-500 to-emerald-500' },
    ];

    return (
        <DashboardLayout role="customer" title="Inicio">
            <div className="space-y-6 relative">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-xl p-8 text-white shadow-lg shadow-blue-500/20">
                    <h2 className="text-3xl font-bold mb-2">¡Bienvenido de vuelta!</h2>
                    <p className="text-cyan-100">Descubre nuevos productos y ofertas de tus tiendas favoritas</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow border-gray-700 bg-gray-800">
                            <CardContent className="p-6">
                                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                                    {stat.icon}
                                </div>
                                <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-white">
                                    {loading ? '...' : stat.value}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Map Section */}
                <div className="grid grid-cols-1 gap-6">
                    <Card className="border-gray-700 bg-gray-800 overflow-hidden">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white">
                                <MapPin className="w-5 h-5 mr-2 text-cyan-400" />
                                Mapa de Tiendas Cercanas
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Explorar tiendas y ofertas en tu zona (Simulado)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="w-full h-96 bg-gray-700 relative overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d363.8426411157147!2d-100.01301856177925!3d20.368471635700292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2smx!4v1770592678436!5m2!1ses-419!2smx"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="absolute inset-0 invert hue-rotate-180 brightness-90 contrast-[1.2]"
                                ></iframe>

                                {/* Overlay Pins (Decorative) */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <div className="relative">
                                        <div className="w-4 h-4 bg-cyan-500 rounded-full animate-ping absolute"></div>
                                        <div className="w-4 h-4 bg-cyan-500 rounded-full border-2 border-white relative z-10"></div>
                                        <div className="absolute -top-10 -left-12 bg-white text-gray-900 px-3 py-1 rounded-lg shadow-xl text-xs font-bold whitespace-nowrap z-20">
                                            Tu Ubicación
                                        </div>
                                    </div>
                                </div>

                                {/* Simulated Store Pins - Restored to colorful style */}
                                <div className="absolute top-[30%] left-[20%] pointer-events-none">
                                    <MapPin className="w-8 h-8 text-purple-500 drop-shadow-2xl animate-bounce" />
                                </div>
                                <div className="absolute top-[60%] left-[70%] pointer-events-none">
                                    <MapPin className="w-8 h-8 text-orange-500 drop-shadow-2xl animate-bounce delay-75" />
                                </div>
                                <div className="absolute top-[25%] left-[80%] pointer-events-none">
                                    <MapPin className="w-8 h-8 text-green-500 drop-shadow-2xl animate-bounce delay-150" />
                                </div>
                                <div className="absolute top-[75%] left-[30%] pointer-events-none">
                                    <MapPin className="w-8 h-8 text-pink-500 drop-shadow-2xl animate-bounce delay-300" />
                                </div>
                                <div className="absolute top-[40%] left-[55%] pointer-events-none">
                                    <MapPin className="w-8 h-8 text-yellow-500 drop-shadow-2xl animate-bounce delay-500" />
                                </div>
                                <div className="absolute top-[15%] left-[45%] pointer-events-none">
                                    <MapPin className="w-8 h-8 text-blue-500 drop-shadow-2xl animate-bounce delay-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ChatBot Integration */}
                <ChatBot />
            </div>
        </DashboardLayout>
    );
}
