'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Package, Eye } from 'lucide-react';

interface Order {
    id: number;
    orderNumber: string;
    date: string;
    store: string;
    items: number;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export default function OrdersPage() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const orders: Order[] = [
        { id: 1, orderNumber: '#1001', date: '2024-02-07', store: 'Tienda Local 1', items: 3, total: 25.50, status: 'delivered' },
        { id: 2, orderNumber: '#1002', date: '2024-02-06', store: 'Supermercado Central', items: 5, total: 42.30, status: 'shipped' },
        { id: 3, orderNumber: '#1003', date: '2024-02-05', store: 'Tienda del Barrio', items: 2, total: 15.80, status: 'processing' },
        { id: 4, orderNumber: '#1004', date: '2024-02-04', store: 'Mercado Express', items: 4, total: 38.90, status: 'pending' },
        { id: 5, orderNumber: '#1005', date: '2024-02-03', store: 'Tienda Orgánica', items: 6, total: 55.20, status: 'delivered' },
    ];

    const statusColors = {
        pending: 'bg-yellow-900/50 border-yellow-700 text-yellow-300',
        processing: 'bg-blue-900/50 border-blue-700 text-blue-300',
        shipped: 'bg-purple-900/50 border-purple-700 text-purple-300',
        delivered: 'bg-green-900/50 border-green-700 text-green-300',
        cancelled: 'bg-red-900/50 border-red-700 text-red-300',
    };

    const statusLabels = {
        pending: 'Pendiente',
        processing: 'Procesando',
        shipped: 'Enviado',
        delivered: 'Entregado',
        cancelled: 'Cancelado',
    };

    const columns = [
        { key: 'orderNumber', header: 'Número' },
        { key: 'date', header: 'Fecha' },
        { key: 'store', header: 'Tienda' },
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
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedOrder(order)}
                >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                </Button>
            ),
        },
    ];

    return (
        <DashboardLayout role="customer" title="Mis Pedidos">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Package className="w-6 h-6 mr-2 text-cyan-400" />
                        Historial de Pedidos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table data={orders} columns={columns} />
                </CardContent>
            </Card>

            {/* Order Details Modal */}
            <Modal
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                title={`Detalles del Pedido ${selectedOrder?.orderNumber}`}
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                            Cerrar
                        </Button>
                        <Button>Reordenar</Button>
                    </>
                }
            >
                {selectedOrder && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-400">Fecha</p>
                                <p className="text-white font-semibold">{selectedOrder.date}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Tienda</p>
                                <p className="text-white font-semibold">{selectedOrder.store}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Estado</p>
                                <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${statusColors[selectedOrder.status]}`}>
                                    {statusLabels[selectedOrder.status]}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Total</p>
                                <p className="text-white font-semibold text-xl">${selectedOrder.total.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-700 pt-4">
                            <h4 className="text-white font-semibold mb-3">Artículos del Pedido</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between p-3 bg-gray-800 rounded-lg">
                                    <span className="text-gray-300">Manzanas Rojas (2 kg)</span>
                                    <span className="text-white">$5.00</span>
                                </div>
                                <div className="flex justify-between p-3 bg-gray-800 rounded-lg">
                                    <span className="text-gray-300">Leche Entera (3 litros)</span>
                                    <span className="text-white">$5.40</span>
                                </div>
                                <div className="flex justify-between p-3 bg-gray-800 rounded-lg">
                                    <span className="text-gray-300">Pan Integral (1 unidad)</span>
                                    <span className="text-white">$1.20</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
}
