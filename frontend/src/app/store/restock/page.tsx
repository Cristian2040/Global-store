'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Truck, Plus, Search, ShoppingCart, Trash2, ArrowRight } from 'lucide-react'; // Added icons
import { useAuth } from '@/contexts/AuthContext'; // Import Auth Context
import api from '@/lib/api'; // Import API client

interface RestockOrder {
    _id: string; // Changed id to _id
    folio?: string; // Add folio
    supplierId: { _id: string; name: string; companyName: string }; // Populated supplier
    createdAt: string; // Date from backend
    items: any[]; // items array
    totals: { totalCents: number }; // totals object
    status: 'CREADA' | 'ENVIADA' | 'ACEPTADA' | 'RECHAZADA' | 'EN_PREPARACION' | 'EN_RUTA' | 'ENTREGADA' | 'CANCELADA';
}

interface Supplier {
    _id: string;
    name: string;
    companyName: string;
}

interface Product {
    _id: string; // Product ID (or supplierProduct ID depending on endpoint)
    productId: string; // Real Product ID
    name: string;
    category: string; // Add category
    price: number; // Unit price
    unit: string;
    availableQuantity: number;
    image?: string;
}

interface CartItem extends Product {
    quantity: number;
}

export default function RestockPage() {
    const { user, relatedData } = useAuth(); // Get user and relatedData (Store)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Supplier, 2: Products, 3: Review

    // Data Loading States
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [restockOrders, setRestockOrders] = useState<RestockOrder[]>([]);

    // New Order States
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [supplierProducts, setSupplierProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [orderNotes, setOrderNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Details Modal State
    const [selectedOrder, setSelectedOrder] = useState<RestockOrder | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Fetch Orders on Mount
    useEffect(() => {
        if (relatedData?._id) {
            fetchOrders();
        }
    }, [relatedData]);

    // Fetch Suppliers when modal opens
    useEffect(() => {
        if (isModalOpen && step === 1) {
            fetchSuppliers();
        }
    }, [isModalOpen, step]);

    // Fetch Products when Supplier Selected
    useEffect(() => {
        if (selectedSupplier) {
            fetchSupplierProducts(selectedSupplier._id);
        }
    }, [selectedSupplier]);

    const fetchOrders = async () => {
        if (!relatedData?._id) return;

        setLoadingOrders(true);
        try {
            // Use relatedData._id which should be the Store ID for store users
            const response = await api.get(`/restock-orders/store/${relatedData._id}`);
            if (response.data.success) {
                // Controller returns paginated { orders, pagination }
                // But helper might wrap it in data: { orders: ..., pagination: ... }
                // Service returns { orders, pagination }
                // Controller calls paginated(res, result.orders, result.pagination)
                // Standard `paginated` response: { success: true, data: { docs: orders, ... } } usually.
                // Let's verify data structure.
                const docs = response.data.data.docs || response.data.data;
                setRestockOrders(Array.isArray(docs) ? docs : []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await api.get('/suppliers');
            if (response.data.success) {
                // Determine array location
                const data = response.data.data;
                const supplierList = Array.isArray(data) ? data : (data.docs || data.suppliers || []);
                setSuppliers(supplierList);
            }
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const fetchSupplierProducts = async (supplierId: string) => {
        setLoadingProducts(true);
        try {
            const response = await api.get(`/suppliers/${supplierId}/products`);
            if (response.data.success) {
                setSupplierProducts(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setSupplierProducts([]); // Empty on error
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleAddToCart = (product: Product, quantity: number) => {
        setCart(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                return prev.map(item => item._id === product._id ? { ...item, quantity } : item);
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const handleRemoveFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item._id !== productId));
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleCreateOrder = async () => {
        if (!selectedSupplier || cart.length === 0 || !relatedData?._id) return;
        setIsSubmitting(true);
        try {
            const payload = {
                storeId: relatedData._id, // Use Store ID from relatedData
                supplierId: selectedSupplier._id,
                items: cart.map(item => ({
                    productId: item.productId || item._id, // Handle if productId is populated or flat
                    quantity: item.quantity,
                    unitPriceCents: Math.round(item.price * 100), // Convert to cents
                    // Optional snapshots will be handled by backend
                })),
                delivery: {
                    notes: orderNotes || '' // Ensure string
                },
                // totals are calculated by backend
            };

            const response = await api.post('/restock-orders', payload);
            if (response.data.success) {
                setIsModalOpen(false);
                setCart([]);
                setStep(1);
                setSelectedSupplier(null);
                fetchOrders(); // Refresh list
            }
        } catch (error) {
            console.error('Error creating order:', error);
            // Handle error toast
        } finally {
            setIsSubmitting(false);
        }
    };

    // Columns for the Order List
    const columns = [
        { key: 'folio', header: 'Folio', render: (row: RestockOrder) => row.folio || row._id.slice(-6).toUpperCase() }, // Fallback to ID part if folio missing
        { key: 'supplier', header: 'Proveedor', render: (row: RestockOrder) => row.supplierId?.name || 'Desconocido' },
        { key: 'createdAt', header: 'Fecha', render: (row: RestockOrder) => new Date(row.createdAt).toLocaleDateString() },
        { key: 'items', header: 'Artículos', render: (row: RestockOrder) => `${row.items?.length || 0} items` },
        { key: 'total', header: 'Total', render: (row: RestockOrder) => `$${(row.totals?.totalCents / 100).toFixed(2)}` },
        {
            key: 'status',
            header: 'Estado',
            render: (order: RestockOrder) => {
                const colors: Record<string, string> = {
                    'CREADA': 'bg-blue-900/50 text-blue-300 border-blue-700',
                    'ENVIADA': 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
                    'ACEPTADA': 'bg-indigo-900/50 text-indigo-300 border-indigo-700',
                    'EN_RUTA': 'bg-purple-900/50 text-purple-300 border-purple-700',
                    'ENTREGADA': 'bg-green-900/50 text-green-300 border-green-700',
                    'CANCELADA': 'bg-red-900/50 text-red-300 border-red-700',
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[order.status] || 'bg-gray-800 text-gray-400'}`}>
                        {order.status}
                    </span>
                );
            },
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (order: RestockOrder) => (
                <Button size="sm" variant="outline" onClick={() => { setSelectedOrder(order); setIsDetailsOpen(true); }}>
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
                            <Button onClick={() => { setIsModalOpen(true); setStep(1); }}>
                                <Plus className="w-4 h-4 mr-2" />
                                Nueva Orden
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loadingOrders ? (
                            <div className="text-center py-8">Cargando órdenes...</div>
                        ) : (
                            <Table data={restockOrders} columns={columns} />
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
                                <p className="text-gray-400">Proveedor</p>
                                <p className="text-white font-medium">{selectedOrder.supplierId?.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Fecha</p>
                                <p className="text-white font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Estado</p>
                                <span className="inline-block px-2 py-1 mt-1 rounded-full text-xs font-medium border bg-gray-800 text-gray-300 border-gray-600">
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

            {/* New Restock Order Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={step === 1 ? "Seleccionar Proveedor" : step === 2 ? `Catálogo de ${selectedSupplier?.name}` : "Confirmar Orden"}
                size={step === 2 ? "xl" : "lg"}
            >
                <div className="space-y-6">
                    {/* Step 1: Select Supplier */}
                    {step === 1 && (
                        <div className="grid gap-4">
                            <p className="text-gray-400">Selecciona un proveedor para comenzar tu orden de reabastecimiento.</p>
                            <div className="grid md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                                {suppliers.map(supplier => (
                                    <div
                                        key={supplier._id}
                                        onClick={() => { setSelectedSupplier(supplier); setStep(2); }}
                                        className="p-4 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:border-cyan-500 hover:bg-gray-750 transition-all flex justify-between items-center group"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-white group-hover:text-cyan-400">{supplier.name}</h3>
                                            <p className="text-sm text-gray-500">{supplier.companyName}</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select Products (Cart) */}
                    {step === 2 && selectedSupplier && (
                        <div className="grid md:grid-cols-3 gap-6 h-[70vh]">
                            {/* Product List */}
                            <div className="md:col-span-2 flex flex-col h-full">
                                <h3 className="text-lg font-semibold text-white mb-4">Productos Disponibles</h3>
                                {loadingProducts ? (
                                    <div className="text-center py-10">Cargando productos...</div>
                                ) : (
                                    <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                                        {supplierProducts.map(product => {
                                            const inCart = cart.find(c => c._id === product._id);
                                            return (
                                                <div key={product._id} className="p-3 bg-gray-800 border border-gray-700 rounded-lg flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                                                        {product.image ? (
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-xl">
                                                                📦
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-white font-medium">{product.name}</h4>
                                                        <p className="text-sm text-gray-400">${product.price.toFixed(2)} / {product.unit}</p>
                                                    </div>
                                                    {inCart ? (
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm" variant="outline"
                                                                onClick={() => inCart.quantity > 1 ? handleAddToCart(product, inCart.quantity - 1) : handleRemoveFromCart(product._id)}
                                                            >
                                                                -
                                                            </Button>
                                                            <span className="w-8 text-center">{inCart.quantity}</span>
                                                            <Button
                                                                size="sm" variant="outline"
                                                                onClick={() => handleAddToCart(product, inCart.quantity + 1)}
                                                            >
                                                                +
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Button size="sm" onClick={() => handleAddToCart(product, 1)}>
                                                            Agregar
                                                        </Button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Cart Summary (Sidebar) */}
                            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col h-full">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Tu Pedido
                                </h3>

                                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                                    {cart.length === 0 ? (
                                        <p className="text-gray-500 text-sm text-center italic py-4">Tu carrito está vacío</p>
                                    ) : (
                                        cart.map(item => (
                                            <div key={item._id} className="text-sm border-b border-gray-700 pb-2 last:border-0">
                                                <div className="flex justify-between text-white">
                                                    <span className="line-clamp-1 flex-1">{item.name}</span>
                                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-gray-400 text-xs mt-1">
                                                    <span>{item.quantity} x ${item.price.toFixed(2)}</span>
                                                    <button onClick={() => handleRemoveFromCart(item._id)} className="text-red-400 hover:text-red-300">Eliminar</button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="border-t border-gray-600 pt-4 mt-auto">
                                    <div className="flex justify-between text-lg font-bold text-white mb-4">
                                        <span>Total</span>
                                        <span>${calculateTotal().toFixed(2)}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <Button className="w-full" onClick={() => setStep(3)} disabled={cart.length === 0}>
                                            Continuar
                                        </Button>
                                        <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
                                            Cambiar Proveedor
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review & Confirm */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <h3 className="font-semibold text-white mb-2">Resumen de la Orden</h3>
                                <p className="text-gray-400 text-sm mb-4">Proveedor: <span className="text-white">{selectedSupplier?.name}</span></p>

                                <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
                                    {cart.map(item => (
                                        <div key={item._id} className="flex justify-between text-sm py-1 border-b border-gray-700 last:border-0">
                                            <span className="text-gray-300">{item.quantity} x {item.name}</span>
                                            <span className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between text-xl font-bold text-cyan-400 pt-2 border-t border-gray-600">
                                    <span>Total a Pagar</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Notas para el proveedor (opcional)</label>
                                <textarea
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500"
                                    rows={3}
                                    placeholder="Instrucciones de entrega, horarios, etc."
                                    value={orderNotes}
                                    onChange={(e) => setOrderNotes(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setStep(2)}>
                                    Atrás
                                </Button>
                                <Button onClick={handleCreateOrder} disabled={isSubmitting} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
                                    {isSubmitting ? 'Procesando...' : 'Confirmar Orden'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </DashboardLayout>
    );
}
