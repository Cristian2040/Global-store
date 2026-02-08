'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Package, Eye, Calendar, MapPin, DollarSign, Store } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface OrderItem {
    storeProductId: string;
    productId: string;
    nameSnapshot: string;
    quantity: number;
    unitPriceCents: number;
    subtotalCents: number;
    unitSnapshot: string;
}

interface Order {
    _id: string;
    folio?: string;
    createdAt: string;
    storeId: {
        _id: string;
        storeName: string;
    };
    status: 'CREADA' | 'PENDIENTE_PAGO' | 'PAGADA' | 'EN_PREPARACION' | 'LISTA_PARA_RECOGER' | 'EN_CAMINO' | 'ENTREGADA' | 'CANCELADA' | 'REEMBOLSADA';
    items: OrderItem[];
    totals: {
        totalCents: number;
        deliveryFeeCents: number;
    };
    fulfillment: {
        type: 'PICKUP' | 'DELIVERY';
        address?: {
            street: string;
            number: string;
            neighborhood: string;
        };
    };
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/customer-orders/my/orders');
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Error al cargar tus pedidos');
        } finally {
            setLoading(false);
        }
    };

    const statusColors: Record<string, string> = {
        CREADA: 'bg-gray-700 border-gray-600 text-gray-300',
        PENDIENTE_PAGO: 'bg-yellow-900/50 border-yellow-700 text-yellow-300',
        PAGADA: 'bg-blue-900/50 border-blue-700 text-blue-300',
        EN_PREPARACION: 'bg-indigo-900/50 border-indigo-700 text-indigo-300',
        LISTA_PARA_RECOGER: 'bg-orange-900/50 border-orange-700 text-orange-300',
        EN_CAMINO: 'bg-purple-900/50 border-purple-700 text-purple-300',
        ENTREGADA: 'bg-green-900/50 border-green-700 text-green-300',
        CANCELADA: 'bg-red-900/50 border-red-700 text-red-300',
        REEMBOLSADA: 'bg-pink-900/50 border-pink-700 text-pink-300',
    };

    const statusLabels: Record<string, string> = {
        CREADA: 'Creada',
        PENDIENTE_PAGO: 'Pendiente de Pago',
        PAGADA: 'Pagada',
        EN_PREPARACION: 'En Preparación',
        LISTA_PARA_RECOGER: 'Lista para Recoger',
        EN_CAMINO: 'En Camino',
        ENTREGADA: 'Entregada',
        CANCELADA: 'Cancelado',
        REEMBOLSADA: 'Reembolsado',
    };

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(cents / 100);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const columns = [
        {
            key: 'folio',
            header: 'Folio/ID',
            render: (order: Order) => <span className="font-mono text-sm">{order.folio || order._id.slice(-6).toUpperCase()}</span>
        },
        {
            key: 'createdAt',
            header: 'Fecha',
            render: (order: Order) => formatDate(order.createdAt)
        },
        {
            key: 'storeId',
            header: 'Tienda',
            render: (order: Order) => (
                <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-cyan-400" />
                    <span>{order.storeId?.storeName || 'Tienda Desconocida'}</span>
                </div>
            )
        },
        {
            key: 'items',
            header: 'Artículos',
            render: (order: Order) => `${order.items.length} artículos`
        },
        {
            key: 'totals',
            header: 'Total',
            render: (order: Order) => (
                <span className="font-bold text-white">
                    {formatCurrency(order.totals.totalCents)}
                </span>
            )
        },
        {
            key: 'status',
            header: 'Estado',
            render: (order: Order) => (
                <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${statusColors[order.status] || 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                    {statusLabels[order.status] || order.status}
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

    if (loading) {
        return (
            <DashboardLayout role="customer" title="Mis Pedidos">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                </div>
            </DashboardLayout>
        );
    }

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
                    {orders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Aún no tienes pedidos</h3>
                            <p className="text-gray-400">Tus compras aparecerán aquí.</p>
                        </div>
                    ) : (
                        <Table data={orders} columns={columns} />
                    )}
                </CardContent>
            </Card>

            {/* Order Details Modal */}
            <Modal
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                title={`Detalles del Pedido ${selectedOrder?.folio || selectedOrder?._id.slice(-6).toUpperCase()}`}
                size="lg"
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        {/* Header Info */}
                        <div className="grid grid-cols-2 gap-4 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Fecha de Compra</p>
                                <div className="flex items-center text-white font-medium">
                                    <Calendar className="w-4 h-4 mr-2 text-cyan-400" />
                                    {formatDate(selectedOrder.createdAt)}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Tienda</p>
                                <div className="flex items-center text-white font-medium">
                                    <Store className="w-4 h-4 mr-2 text-cyan-400" />
                                    {selectedOrder.storeId?.storeName}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Estado</p>
                                <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${statusColors[selectedOrder.status]}`}>
                                    {statusLabels[selectedOrder.status]}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Total</p>
                                <div className="flex items-center text-white font-bold text-lg">
                                    <DollarSign className="w-4 h-4 mr-1 text-green-400" />
                                    {formatCurrency(selectedOrder.totals.totalCents)}
                                </div>
                            </div>
                        </div>

                        {/* Fulfillment Info */}
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <h4 className="text-white font-semibold mb-3 flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
                                Información de Entrega
                            </h4>
                            <div className="text-sm">
                                <p className="text-gray-300">
                                    <span className="font-semibold text-white">Método:</span>{' '}
                                    {selectedOrder.fulfillment.type === 'DELIVERY' ? 'Envío a Domicilio' : 'Recoger en Tienda'}
                                </p>
                                {selectedOrder.fulfillment.type === 'DELIVERY' && selectedOrder.fulfillment.address && (
                                    <p className="text-gray-300 mt-1">
                                        <span className="font-semibold text-white">Dirección:</span>{' '}
                                        {selectedOrder.fulfillment.address.street} {selectedOrder.fulfillment.address.number}, {selectedOrder.fulfillment.address.neighborhood}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Items List */}
                        <div>
                            <h4 className="text-white font-semibold mb-3">Artículos del Pedido</h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-gray-700">
                                        <div>
                                            <p className="text-white font-medium">{item.nameSnapshot}</p>
                                            <p className="text-sm text-gray-400">
                                                {item.quantity} {item.unitSnapshot} x {formatCurrency(item.unitPriceCents)}
                                            </p>
                                        </div>
                                        <div className="text-white font-semibold">
                                            {formatCurrency(item.subtotalCents)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals Summary */}
                        <div className="border-t border-gray-700 pt-4 space-y-2">
                            {selectedOrder.totals.deliveryFeeCents > 0 && (
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Costo de Envío</span>
                                    <span>{formatCurrency(selectedOrder.totals.deliveryFeeCents)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-bold text-white pt-2">
                                <span>Total Pagado</span>
                                <span className="text-cyan-400">{formatCurrency(selectedOrder.totals.totalCents)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
}
