'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, CheckCircle, XCircle } from 'lucide-react';

interface Order {
    id: number;
    orderNumber: string;
    customer: string;
    date: string;
    items: number;
    total: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
}

export default function OrdersPage() {
    const orders: Order[] = [
        { id: 1, orderNumber: '#2001', customer: 'Juan Pérez', date: '2024-02-07 10:30', items: 3, total: 25.50, status: 'pending' },
        { id: 2, orderNumber: '#2002', customer: 'María García', date: '2024-02-07 11:15', items: 5, total: 42.30, status: 'confirmed' },
        { id: 3, orderNumber: '#2003', customer: 'Carlos López', date: '2024-02-07 12:00', items: 2, total: 15.80, status: 'preparing' },
        { id: 4, orderNumber: '#2004', customer: 'Ana Martínez', date: '2024-02-07 13:45', items: 4, total: 38.90, status: 'ready' },
        { id: 5, orderNumber: '#2005', customer: 'Luis Rodríguez', date: '2024-02-06 16:20', items: 6, total: 55.20, status: 'completed' },
    ];

    const statusColors = {
        pending: 'bg-yellow-900/50 border-yellow-700 text-yellow-300',
        confirmed: 'bg-blue-900/50 border-blue-700 text-blue-300',
        preparing: 'bg-purple-900/50 border-purple-700 text-purple-300',
        ready: 'bg-cyan-900/50 border-cyan-700 text-cyan-300',
        completed: 'bg-green-900/50 border-green-700 text-green-300',
        cancelled: 'bg-red-900/50 border-red-700 text-red-300',
    };

    const statusLabels = {
        pending: 'Pendiente',
        confirmed: 'Confirmado',
        preparing: 'Preparando',
        ready: 'Listo',
        completed: 'Completado',
        cancelled: 'Cancelado',
    };

    const columns = [
        { key: 'orderNumber', header: 'Número' },
        { key: 'customer', header: 'Cliente' },
        { key: 'date', header: 'Fecha y Hora' },
        { key: 'items', header: 'Artículos', render: (order: Order) => `${order.items} items` },
        { key: 'total', header: 'Total', render: (order: Order) => `$${order.total.toFixed(2)}` },
        {
            key: 'status',
            header: 'Estado',
            render: (order: Order) => (
                <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (order: Order) => (
                <div className="flex gap-2">
                    {order.status === 'pending' && (
                        <>
                            <Button size="sm" variant="outline">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Confirmar
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-400 border-red-700 hover:bg-red-900/20">
                                <XCircle className="w-4 h-4 mr-1" />
                                Rechazar
                            </Button>
                        </>
                    )}
                    {order.status === 'confirmed' && (
                        <Button size="sm">Iniciar Preparación</Button>
                    )}
                    {order.status === 'preparing' && (
                        <Button size="sm">Marcar como Listo</Button>
                    )}
                    {order.status === 'ready' && (
                        <Button size="sm">Completar Entrega</Button>
                    )}
                </div>
            ),
        },
    ];

    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const preparingCount = orders.filter(o => o.status === 'preparing').length;

    return (
        <DashboardLayout role="store" title="Pedidos de Clientes">
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Pedidos Pendientes</p>
                                    <p className="text-3xl font-bold text-yellow-400">{pendingCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-900/30 border border-yellow-700 rounded-lg flex items-center justify-center">
                                    <ShoppingCart className="w-6 h-6 text-yellow-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">En Preparación</p>
                                    <p className="text-3xl font-bold text-purple-400">{preparingCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-900/30 border border-purple-700 rounded-lg flex items-center justify-center">
                                    <ShoppingCart className="w-6 h-6 text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Hoy</p>
                                    <p className="text-3xl font-bold text-cyan-400">{orders.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-cyan-900/30 border border-cyan-700 rounded-lg flex items-center justify-center">
                                    <ShoppingCart className="w-6 h-6 text-cyan-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <ShoppingCart className="w-6 h-6 mr-2 text-cyan-400" />
                            Todos los Pedidos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table data={orders} columns={columns} />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
