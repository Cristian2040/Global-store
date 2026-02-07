'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Truck, Plus } from 'lucide-react';

interface RestockOrder {
    id: number;
    orderNumber: string;
    supplier: string;
    date: string;
    items: number;
    total: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
}

export default function RestockPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const restockOrders: RestockOrder[] = [
        { id: 1, orderNumber: '#R001', supplier: 'Proveedor A', date: '2024-02-07', items: 5, total: 250.00, status: 'pending' },
        { id: 2, orderNumber: '#R002', supplier: 'Proveedor B', date: '2024-02-06', items: 3, total: 180.50, status: 'confirmed' },
        { id: 3, orderNumber: '#R003', supplier: 'Proveedor C', date: '2024-02-05', items: 8, total: 420.00, status: 'shipped' },
        { id: 4, orderNumber: '#R004', supplier: 'Proveedor A', date: '2024-02-04', items: 4, total: 310.75, status: 'delivered' },
    ];

    const statusColors = {
        pending: 'bg-yellow-900/50 border-yellow-700 text-yellow-300',
        confirmed: 'bg-blue-900/50 border-blue-700 text-blue-300',
        shipped: 'bg-purple-900/50 border-purple-700 text-purple-300',
        delivered: 'bg-green-900/50 border-green-700 text-green-300',
    };

    const statusLabels = {
        pending: 'Pendiente',
        confirmed: 'Confirmado',
        shipped: 'En Camino',
        delivered: 'Entregado',
    };

    const columns = [
        { key: 'orderNumber', header: 'Número' },
        { key: 'supplier', header: 'Proveedor' },
        { key: 'date', header: 'Fecha' },
        { key: 'items', header: 'Artículos', render: (order: RestockOrder) => `${order.items} items` },
        { key: 'total', header: 'Total', render: (order: RestockOrder) => `$${order.total.toFixed(2)}` },
        {
            key: 'status',
            header: 'Estado',
            render: (order: RestockOrder) => (
                <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (order: RestockOrder) => (
                <Button size="sm" variant="outline">
                    Ver Detalles
                </Button>
            ),
        },
    ];

    return (
        <DashboardLayout role="store" title="Reabastecimiento">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Truck className="w-6 h-6 mr-2 text-cyan-400" />
                                Órdenes de Reabastecimiento
                            </div>
                            <Button onClick={() => setIsModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Nueva Orden
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table data={restockOrders} columns={columns} />
                    </CardContent>
                </Card>
            </div>

            {/* New Restock Order Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nueva Orden de Reabastecimiento"
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button>Crear Orden</Button>
                    </>
                }
            >
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Proveedor
                        </label>
                        <select className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                            <option>Seleccionar proveedor...</option>
                            <option>Proveedor A</option>
                            <option>Proveedor B</option>
                            <option>Proveedor C</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Productos a Reabastecer
                        </label>
                        <div className="space-y-3 max-h-64 overflow-y-auto p-4 bg-gray-800 rounded-lg border border-gray-700">
                            {['Manzanas Rojas', 'Leche Entera', 'Pan Integral', 'Tomates', 'Pollo Fresco'].map((product, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
                                    <input type="checkbox" className="w-5 h-5" />
                                    <span className="flex-1 text-white">{product}</span>
                                    <input
                                        type="number"
                                        placeholder="Cantidad"
                                        className="w-24 px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Notas Adicionales
                        </label>
                        <textarea
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Instrucciones especiales..."
                        />
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
}
