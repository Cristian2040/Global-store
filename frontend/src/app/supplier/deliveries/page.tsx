'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Truck, MapPin, Package, CheckCircle, Navigation } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import api from '@/lib/api';

interface RestockOrder {
    _id: string;
    folio?: string;
    storeId: { name: string; address?: { street?: string; number?: string; municipality?: string }; _id: string };
    createdAt: string;
    items: any[];
    totals: { totalCents: number };
    status: 'CREADA' | 'ENVIADA' | 'ACEPTADA' | 'RECHAZADA' | 'EN_PREPARACION' | 'EN_RUTA' | 'ENTREGADA' | 'CANCELADA';
    delivery?: {
        requestedDeliveryDate?: string;
    };
}

export default function DeliveriesPage() {
    const { relatedData } = useAuth();
    const [deliveries, setDeliveries] = useState<RestockOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<RestockOrder | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        if (relatedData?._id) {
            fetchDeliveries();
        }
    }, [relatedData]);

    const fetchDeliveries = async () => {
        setLoading(true);
        try {
            // Fetch all orders and filter client-side for now
            const response = await api.get(`/restock-orders/supplier/${relatedData?._id}?limit=100`);
            if (response.data.success) {
                const docs = response.data.data.docs || response.data.data;
                // Filter only relevant delivery statuses
                const activeDeliveries = Array.isArray(docs) ? docs.filter((o: RestockOrder) =>
                    ['EN_PREPARACION', 'EN_RUTA', 'ENTREGADA'].includes(o.status)
                ) : [];
                setDeliveries(activeDeliveries);
            }
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            toast.error('Error al cargar entregas');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        try {
            const response = await api.patch(`/restock-orders/${orderId}/status`, { status: newStatus });
            if (response.data.success) {
                toast.success(`Entrega actualizada: ${newStatus}`);
                fetchDeliveries();
            }
        } catch (error) {
            console.error('Error updating delivery status:', error);
            toast.error('Error al actualizar entrega');
        }
    };

    const statusColors: Record<string, string> = {
        'EN_PREPARACION': 'bg-blue-900/50 border-blue-700 text-blue-300',
        'EN_RUTA': 'bg-purple-900/50 border-purple-700 text-purple-300',
        'ENTREGADA': 'bg-green-900/50 border-green-700 text-green-300',
    };

    const statusLabels: Record<string, string> = {
        'EN_PREPARACION': 'Programado', // Mapping for UI consistency
        'EN_RUTA': 'En Tránsito',
        'ENTREGADA': 'Entregado',
    };

    const formatAddress = (store: any) => {
        if (!store?.address) return 'Dirección no disponible';
        return `${store.address.street || ''} ${store.address.number || ''}, ${store.address.municipality || ''}`;
    };

    const columns = [
        { key: 'folio', header: 'Número', render: (row: RestockOrder) => row.folio || row._id.slice(-6).toUpperCase() },
        { key: 'store', header: 'Tienda', render: (row: RestockOrder) => row.storeId?.name || 'Desconocida' },
        {
            key: 'address',
            header: 'Dirección',
            render: (row: RestockOrder) => (
                <div className="flex items-center text-gray-300 text-xs">
                    <MapPin className="w-3 h-3 mr-1 text-gray-500" />
                    {formatAddress(row.storeId)}
                </div>
            ),
        },
        { key: 'createdAt', header: 'Fecha', render: (row: RestockOrder) => new Date(row.createdAt).toLocaleDateString() },
        { key: 'items', header: 'Artículos', render: (row: RestockOrder) => `${row.items?.length || 0} items` },
        {
            key: 'status',
            header: 'Estado',
            render: (row: RestockOrder) => (
                <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${statusColors[row.status] || 'bg-gray-800'}`}>
                    {statusLabels[row.status] || row.status}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (row: RestockOrder) => (
                <div className="flex gap-2">
                    {row.status === 'EN_PREPARACION' && (
                        <Button size="sm" onClick={() => handleUpdateStatus(row._id, 'EN_RUTA')} className="bg-blue-600 hover:bg-blue-700">
                            <Navigation className="w-4 h-4 mr-1" /> Iniciar Ruta
                        </Button>
                    )}
                    {row.status === 'EN_RUTA' && (
                        <Button size="sm" onClick={() => handleUpdateStatus(row._id, 'ENTREGADA')} className="bg-purple-600 hover:bg-purple-700">
                            <CheckCircle className="w-4 h-4 mr-1" /> Confirmar Entrega
                        </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => { setSelectedOrder(row); setIsDetailsOpen(true); }}>
                        Ver Detalles
                    </Button>
                </div>
            ),
        },
    ];

    const scheduledCount = deliveries.filter(d => d.status === 'EN_PREPARACION').length;
    const inTransitCount = deliveries.filter(d => d.status === 'EN_RUTA').length;
    const deliveredCount = deliveries.filter(d => d.status === 'ENTREGADA').length;

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
                                    <Package className="w-6 h-6 text-blue-400" />
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
                                    <Navigation className="w-6 h-6 text-purple-400" />
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
                                    <CheckCircle className="w-6 h-6 text-green-400" />
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
                        {loading ? (
                            <div className="text-center py-10">Cargando entregas...</div>
                        ) : (
                            <Table data={deliveries} columns={columns} />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* View Order Details Modal */}
            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title={`Detalles de Entrega ${selectedOrder?.folio || selectedOrder?._id?.slice(-6)?.toUpperCase() || ''}`}
                size="lg"
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-400">Tienda</p>
                                <p className="text-white font-medium">{selectedOrder.storeId?.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{formatAddress(selectedOrder.storeId)}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Estado</p>
                                <span className={`inline-block px-2 py-1 mt-1 rounded-full text-xs font-medium border ${statusColors[selectedOrder.status]}`}>
                                    {statusLabels[selectedOrder.status] || selectedOrder.status}
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Productos</h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {selectedOrder.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between text-sm py-2 border-b border-gray-700 last:border-0">
                                        <div>
                                            <p className="text-white">{item.nameSnapshot || 'Producto'}</p>
                                            <p className="text-xs text-gray-500">{item.quantity} x ${(item.unitPriceCents / 100).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
}
