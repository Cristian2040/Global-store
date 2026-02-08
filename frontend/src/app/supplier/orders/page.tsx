'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { FileText, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
    id: number;
    orderNumber: string;
    store: string;
    date: string;
    items: number;
    total: number;
    status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'rejected';
}

export default function SupplierOrdersPage() {
    const orders: Order[] = [
        { id: 1, orderNumber: '#S001', store: 'Tienda Local 1', date: '2024-02-07', items: 5, total: 250.00, status: 'pending' },
        { id: 2, orderNumber: '#S002', store: 'Supermercado Central', date: '2024-02-07', items: 8, total: 420.50, status: 'accepted' },
        { id: 3, orderNumber: '#S003', store: 'Tienda del Barrio', date: '2024-02-06', items: 3, total: 180.00, status: 'preparing' },
        { id: 4, orderNumber: '#S004', store: 'Mercado Express', date: '2024-02-06', items: 6, total: 310.75, status: 'ready' },
        { id: 5, orderNumber: '#S005', store: 'Tienda Orgánica', date: '2024-02-05', items: 4, total: 220.00, status: 'rejected' },
    ];

    const statusColors = {
        pending: 'bg-yellow-900/50 border-yellow-700 text-yellow-300',
        accepted: 'bg-blue-900/50 border-blue-700 text-blue-300',
        preparing: 'bg-purple-900/50 border-purple-700 text-purple-300',
        ready: 'bg-cyan-900/50 border-cyan-700 text-cyan-300',
        rejected: 'bg-red-900/50 border-red-700 text-red-300',
    };

    const statusLabels = {
        pending: 'Pendiente',
        accepted: 'Aceptado',
        preparing: 'Preparando',
        ready: 'Listo',
        rejected: 'Rechazado',
    };

    const columns = [
        { key: 'orderNumber', header: 'Número' },
        { key: 'store', header: 'Tienda' },
        { key: 'date', header: 'Fecha' },
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
                            <Button size="sm" variant="outline" onClick={() => toast.success(`Pedido #${order.orderNumber} aceptado`)}>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Aceptar
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-400 border-red-700 hover:bg-red-900/20" onClick={() => toast.error(`Pedido #${order.orderNumber} rechazado`)}>
                                <XCircle className="w-4 h-4 mr-1" />
                                Rechazar
                            </Button>
                        </>
                    )}
                    {order.status === 'accepted' && (
                        <Button size="sm" onClick={() => toast.info(`Iniciando preparación de pedido #${order.orderNumber}`)}>Iniciar Preparación</Button>
                    )}
                    {order.status === 'preparing' && (
                        <Button size="sm" onClick={() => toast.success(`Pedido #${order.orderNumber} marcado como listo`)}>Marcar como Listo</Button>
                    )}
                    {order.status === 'ready' && (
                        <Button size="sm" variant="outline" onClick={() => toast.info(`Abriendo detalles de pedido #${order.orderNumber}`)}>Ver Detalles</Button>
                    )}
                </div>
            ),
        },
    ];

    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const preparingCount = orders.filter(o => o.status === 'preparing').length;

    return (
        <DashboardLayout role="supplier" title="Pedidos de Tiendas">
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
                                    <FileText className="w-6 h-6 text-yellow-400" />
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
                                    <FileText className="w-6 h-6 text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Total Hoy</p>
                                    <p className="text-3xl font-bold text-cyan-400">{orders.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-cyan-900/30 border border-cyan-700 rounded-lg flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-cyan-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <FileText className="w-6 h-6 mr-2 text-cyan-400" />
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
