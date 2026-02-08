'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FileText, CheckCircle, XCircle, Truck, Package, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

interface StartPrepResponse {
    success: boolean;
    data: RestockOrder;
    message: string;
}

interface RestockOrder {
    _id: string;
    folio?: string;
    storeId: { name: string; _id: string }; // Populated store
    createdAt: string;
    items: any[];
    totals: { totalCents: number };
    status: 'CREADA' | 'ENVIADA' | 'ACEPTADA' | 'RECHAZADA' | 'EN_PREPARACION' | 'EN_RUTA' | 'ENTREGADA' | 'CANCELADA';
}

export default function SupplierOrdersPage() {
    const { relatedData } = useAuth(); // relatedData is the Supplier object
    const [orders, setOrders] = useState<RestockOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<RestockOrder | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [orderToReject, setOrderToReject] = useState<RestockOrder | null>(null);

    useEffect(() => {
        if (relatedData?._id) {
            fetchOrders();
        }
    }, [relatedData]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/restock-orders/supplier/${relatedData?._id}`);
            if (response.data.success) {
                const docs = response.data.data.docs || response.data.data;
                setOrders(Array.isArray(docs) ? docs : []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Error al cargar pedidos');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (orderId: string) => {
        try {
            const response = await api.post(`/restock-orders/${orderId}/accept`);
            if (response.data.success) {
                toast.success('Pedido aceptado');
                fetchOrders();
            }
        } catch (error) {
            console.error('Error accepting order:', error);
            toast.error('Error al aceptar el pedido');
        }
    };

    const handleReject = async () => {
        if (!orderToReject) return;

        if (!rejectReason.trim()) {
            toast.error('Por favor indica el motivo del rechazo');
            return;
        }

        try {
            const response = await api.post(`/restock-orders/${orderToReject._id}/reject`, { reason: rejectReason });
            if (response.data.success) {
                toast.success('Pedido rechazado');
                setIsRejectModalOpen(false);
                setRejectReason('');
                setOrderToReject(null);
                fetchOrders();
            }
        } catch (error) {
            console.error('Error rejecting order:', error);
            toast.error('Error al rechazar el pedido');
        }
    };

    const openRejectModal = (order: RestockOrder) => {
        setOrderToReject(order);
        setRejectReason('');
        setIsRejectModalOpen(true);
    };

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        try {
            const response = await api.patch(`/restock-orders/${orderId}/status`, { status: newStatus });
            if (response.data.success) {
                toast.success(`Estado actualizado a ${newStatus}`);
                fetchOrders();
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Error al actualizar estado');
        }
    };

    const statusColors: Record<string, string> = {
        'CREADA': 'bg-yellow-900/50 border-yellow-700 text-yellow-300',
        'ENVIADA': 'bg-yellow-900/50 border-yellow-700 text-yellow-300', // Same as CREADA for supplier view usually
        'ACEPTADA': 'bg-blue-900/50 border-blue-700 text-blue-300',
        'EN_PREPARACION': 'bg-purple-900/50 border-purple-700 text-purple-300',
        'EN_RUTA': 'bg-cyan-900/50 border-cyan-700 text-cyan-300',
        'ENTREGADA': 'bg-green-900/50 border-green-700 text-green-300',
        'RECHAZADA': 'bg-red-900/50 border-red-700 text-red-300',
        'CANCELADA': 'bg-gray-800 border-gray-600 text-gray-400',
    };

    const columns = [
        { key: 'folio', header: 'Número', render: (row: RestockOrder) => row.folio || row._id.slice(-6).toUpperCase() },
        { key: 'store', header: 'Tienda', render: (row: RestockOrder) => row.storeId?.name || 'Desconocida' },
        { key: 'createdAt', header: 'Fecha', render: (row: RestockOrder) => new Date(row.createdAt).toLocaleDateString() },
        { key: 'items', header: 'Artículos', render: (row: RestockOrder) => `${row.items?.length || 0} items` },
        { key: 'total', header: 'Total', render: (row: RestockOrder) => `$${(row.totals?.totalCents / 100).toFixed(2)}` },
        {
            key: 'status',
            header: 'Estado',
            render: (order: RestockOrder) => (
                <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${statusColors[order.status] || 'bg-gray-800 text-gray-400'}`}>
                    {order.status}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (order: RestockOrder) => (
                <div className="flex gap-2">
                    {(order.status === 'CREADA' || order.status === 'ENVIADA') && (
                        <>
                            <Button size="sm" variant="outline" onClick={() => handleAccept(order._id)} className="text-green-400 border-green-700 hover:bg-green-900/20">
                                <CheckCircle className="w-4 h-4 mr-1" /> Aceptar
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => openRejectModal(order)} className="text-red-400 border-red-700 hover:bg-red-900/20">
                                <XCircle className="w-4 h-4 mr-1" /> Rechazar
                            </Button>
                        </>
                    )}
                    {order.status === 'ACEPTADA' && (
                        <Button size="sm" onClick={() => handleUpdateStatus(order._id, 'EN_PREPARACION')} className="bg-purple-600 hover:bg-purple-700">
                            <Package className="w-4 h-4 mr-1" /> Iniciar Preparación
                        </Button>
                    )}
                    {order.status === 'EN_PREPARACION' && (
                        <Button size="sm" onClick={() => handleUpdateStatus(order._id, 'EN_RUTA')} className="bg-cyan-600 hover:bg-cyan-700">
                            <Truck className="w-4 h-4 mr-1" /> Marcar como Listo/En Ruta
                        </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => { setSelectedOrder(order); setIsDetailsOpen(true); }}>
                        Ver Detalles
                    </Button>
                </div>
            ),
        },
    ];

    const pendingCount = orders.filter(o => o.status === 'CREADA' || o.status === 'ENVIADA').length;
    const preparingCount = orders.filter(o => o.status === 'EN_PREPARACION').length;
    const todayCount = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;

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
                                    <Clock className="w-6 h-6 text-yellow-400" />
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
                                    <Package className="w-6 h-6 text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Total Hoy</p>
                                    <p className="text-3xl font-bold text-cyan-400">{todayCount}</p>
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
                        {loading ? (
                            <div className="text-center py-10">Cargando pedidos...</div>
                        ) : (
                            <Table data={orders} columns={columns} />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* View Order Details Modal */}
            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title={`Detalles de Orden ${selectedOrder?.folio || selectedOrder?._id?.slice(-6)?.toUpperCase() || ''}`}
                size="lg"
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-400">Tienda</p>
                                <p className="text-white font-medium">{selectedOrder.storeId?.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Fecha</p>
                                <p className="text-white font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Estado</p>
                                <span className={`inline-block px-2 py-1 mt-1 rounded-full text-xs font-medium border ${statusColors[selectedOrder.status]}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-400">Total</p>
                                <p className="text-cyan-400 font-bold text-lg">${(selectedOrder.totals.totalCents / 100).toFixed(2)}</p>
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
                                        <div className="text-white font-medium">
                                            ${(item.subtotalCents / 100).toFixed(2)}
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

            {/* Reject Modal */}
            <Modal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                title="Rechazar Pedido"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-gray-300">¿Estás seguro de que deseas rechazar este pedido? Esta acción no se puede deshacer.</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Motivo del rechazo</label>
                        <textarea
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500"
                            rows={3}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Ej: Fuera de stock, zona no cubierta..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleReject} className="bg-red-600 hover:bg-red-700">Confirmar Rechazo</Button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
