'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Truck, MapPin } from 'lucide-react';

interface Delivery {
    id: number;
    deliveryNumber: string;
    store: string;
    address: string;
    date: string;
    time: string;
    items: number;
    status: 'scheduled' | 'in_transit' | 'delivered' | 'failed';
}

export default function DeliveriesPage() {
    const deliveries: Delivery[] = [
        { id: 1, deliveryNumber: '#D001', store: 'Tienda Local 1', address: 'Calle Principal 123', date: '2024-02-07', time: '10:00', items: 5, status: 'scheduled' },
        { id: 2, deliveryNumber: '#D002', store: 'Supermercado Central', address: 'Av. Central 456', date: '2024-02-07', time: '14:00', items: 8, status: 'in_transit' },
        { id: 3, deliveryNumber: '#D003', store: 'Tienda del Barrio', address: 'Calle Secundaria 789', date: '2024-02-06', time: '11:30', items: 3, status: 'delivered' },
        { id: 4, deliveryNumber: '#D004', store: 'Mercado Express', address: 'Av. Rápida 321', date: '2024-02-06', time: '16:00', items: 6, status: 'delivered' },
    ];

    const statusColors = {
        scheduled: 'bg-blue-900/50 border-blue-700 text-blue-300',
        in_transit: 'bg-purple-900/50 border-purple-700 text-purple-300',
        delivered: 'bg-green-900/50 border-green-700 text-green-300',
        failed: 'bg-red-900/50 border-red-700 text-red-300',
    };

    const statusLabels = {
        scheduled: 'Programado',
        in_transit: 'En Tránsito',
        delivered: 'Entregado',
        failed: 'Fallido',
    };

    const columns = [
        { key: 'deliveryNumber', header: 'Número' },
        { key: 'store', header: 'Tienda' },
        {
            key: 'address',
            header: 'Dirección',
            render: (delivery: Delivery) => (
                <div className="flex items-center text-gray-300">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    {delivery.address}
                </div>
            ),
        },
        {
            key: 'datetime',
            header: 'Fecha y Hora',
            render: (delivery: Delivery) => `${delivery.date} ${delivery.time}`,
        },
        { key: 'items', header: 'Artículos', render: (delivery: Delivery) => `${delivery.items} items` },
        {
            key: 'status',
            header: 'Estado',
            render: (delivery: Delivery) => (
                <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${statusColors[delivery.status]}`}>
                    {statusLabels[delivery.status]}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (delivery: Delivery) => (
                <div className="flex gap-2">
                    {delivery.status === 'scheduled' && (
                        <Button size="sm">Iniciar Entrega</Button>
                    )}
                    {delivery.status === 'in_transit' && (
                        <Button size="sm">Confirmar Entrega</Button>
                    )}
                    {delivery.status === 'delivered' && (
                        <Button size="sm" variant="outline">Ver Detalles</Button>
                    )}
                </div>
            ),
        },
    ];

    const scheduledCount = deliveries.filter(d => d.status === 'scheduled').length;
    const inTransitCount = deliveries.filter(d => d.status === 'in_transit').length;
    const deliveredCount = deliveries.filter(d => d.status === 'delivered').length;

    return (
        <DashboardLayout role="supplier" title="Gestión de Entregas">
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Programadas</p>
                                    <p className="text-3xl font-bold text-blue-400">{scheduledCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-900/30 border border-blue-700 rounded-lg flex items-center justify-center">
                                    <Truck className="w-6 h-6 text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">En Tránsito</p>
                                    <p className="text-3xl font-bold text-purple-400">{inTransitCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-900/30 border border-purple-700 rounded-lg flex items-center justify-center">
                                    <Truck className="w-6 h-6 text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Entregadas Hoy</p>
                                    <p className="text-3xl font-bold text-green-400">{deliveredCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-900/30 border border-green-700 rounded-lg flex items-center justify-center">
                                    <Truck className="w-6 h-6 text-green-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Deliveries Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Truck className="w-6 h-6 mr-2 text-cyan-400" />
                            Todas las Entregas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table data={deliveries} columns={columns} />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
