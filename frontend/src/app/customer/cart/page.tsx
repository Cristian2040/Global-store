'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, Truck, Store } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import api from '@/lib/api';
import { toast } from 'sonner';

interface StoreDetails {
    _id: string;
    storeName: string;
    paymentMethods: {
        method: string;
        enabled: boolean;
        label?: string;
    }[];
    orderOptions: {
        pickupEnabled: boolean;
        deliveryEnabled: boolean;
        deliveryConfig?: {
            feeCents: number;
        };
    };
}

export default function CartPage() {
    const { items: cartItems, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
    const [storeDetails, setStoreDetails] = useState<Record<string, StoreDetails>>({});
    const [loadingStores, setLoadingStores] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Checkout State
    const [deliveryMethod, setDeliveryMethod] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [address, setAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchStoreDetails = async () => {
            const uniqueStoreIds = Array.from(new Set(cartItems.map(item => item.storeId).filter(Boolean)));
            const missingStores = uniqueStoreIds.filter(id => !storeDetails[id]);

            if (missingStores.length === 0) return;

            setLoadingStores(true);
            try {
                const newDetails: Record<string, StoreDetails> = {};
                await Promise.all(missingStores.map(async (id) => {
                    try {
                        const response = await api.get(`/stores/${id}`);
                        if (response.data.success) {
                            newDetails[id] = response.data.data;
                        }
                    } catch (err) {
                        console.error(`Failed to fetch store ${id}`, err);
                    }
                }));
                setStoreDetails(prev => ({ ...prev, ...newDetails }));
            } catch (error) {
                console.error('Error fetching store details:', error);
            } finally {
                setLoadingStores(false);
            }
        };

        if (cartItems.length > 0) {
            fetchStoreDetails();
        }
    }, [cartItems]);

    const getCommonPaymentMethods = () => {
        const storeIds = Array.from(new Set(cartItems.map(item => item.storeId).filter(Boolean)));
        if (storeIds.length === 0) return [];

        const firstStore = storeDetails[storeIds[0]];
        if (!firstStore) return [];

        let common = firstStore.paymentMethods.filter(pm => pm.enabled);

        for (let i = 1; i < storeIds.length; i++) {
            const store = storeDetails[storeIds[i]];
            if (!store) continue;
            common = common.filter(c => store.paymentMethods.some(pm => pm.method === c.method && pm.enabled));
        }

        return common;
    };

    const getCommonOrderOptions = () => {
        const storeIds = Array.from(new Set(cartItems.map(item => item.storeId).filter(Boolean)));
        if (storeIds.length === 0) return { pickup: false, delivery: false };

        let pickup = true;
        let delivery = true;

        storeIds.forEach(id => {
            const store = storeDetails[id];
            if (store) {
                if (!store.orderOptions.pickupEnabled) pickup = false;
                if (!store.orderOptions.deliveryEnabled) delivery = false;
            }
        });

        return { pickup, delivery };
    };

    const handleCreateOrder = () => {
        const commonMethods = getCommonPaymentMethods();
        const commonOptions = getCommonOrderOptions();

        if (!commonOptions.pickup && !commonOptions.delivery) {
            toast.error('No hay métodos de entrega compatibles entre estas tiendas.');
            return;
        }

        if (commonMethods.length === 0) {
            toast.error('No hay métodos de pago compatibles entre estas tiendas.');
            return;
        }

        // Reset state for new checkout
        if (commonOptions.pickup && !commonOptions.delivery) setDeliveryMethod('PICKUP');
        else if (!commonOptions.pickup && commonOptions.delivery) setDeliveryMethod('DELIVERY');
        else setDeliveryMethod('PICKUP'); // Default

        setPaymentMethod('');
        setIsCheckoutOpen(true);
    };

    const submitOrder = async () => {
        if (!paymentMethod) {
            toast.error('Selecciona un método de pago');
            return;
        }
        if (deliveryMethod === 'DELIVERY' && !address.trim()) {
            toast.error('Ingresa una dirección de entrega');
            return;
        }

        setIsSubmitting(true);

        try {
            // Group items by store
            const itemsByStore: Record<string, typeof cartItems> = {};
            cartItems.forEach(item => {
                if (!itemsByStore[item.storeId]) {
                    itemsByStore[item.storeId] = [];
                }
                itemsByStore[item.storeId].push(item);
            });

            // Create orders for each store
            const orderPromises = Object.entries(itemsByStore).map(async ([storeId, items]) => {
                const payload = {
                    storeId,
                    items: items.map(item => ({
                        storeProductId: item.storeProductId,
                        quantity: item.quantity
                    })),
                    fulfillment: {
                        type: deliveryMethod,
                        address: deliveryMethod === 'DELIVERY' ? { notes: address } : undefined
                    },
                    payment: {
                        method: paymentMethod
                    },
                    notes: `Pedido multi-tienda via web`
                };

                return api.post('/customer-orders', payload);
            });

            await Promise.all(orderPromises);

            toast.success('¡Pedidos creados exitosamente!');
            clearCart();
            setIsCheckoutOpen(false);
        } catch (error) {
            console.error('Error creating orders:', error);
            toast.error('Error al procesar algunos pedidos. Por favor intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const subtotal = totalPrice;
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    return (
        <DashboardLayout role="customer" title="Carrito de Compras">
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Tu carrito está vacío</h3>
                                <p className="text-gray-400 mb-6">Agrega productos para comenzar tu compra</p>
                                <Button>Explorar Productos</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        cartItems.map((item) => (
                            <Card key={item.storeProductId}>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl">
                                                    📦
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white">{item.name}</h3>
                                            <p className="text-sm text-gray-400">{item.storeName || 'Tienda'}</p>
                                            <p className="text-cyan-400 font-semibold mt-1">
                                                ${item.price.toFixed(2)} / {item.unit}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.storeProductId, item.quantity - 1)}
                                                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                            >
                                                <Minus className="w-4 h-4 text-white" />
                                            </button>
                                            <span className="text-white font-semibold w-8 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.storeProductId, item.quantity + 1)}
                                                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                            >
                                                <Plus className="w-4 h-4 text-white" />
                                            </button>
                                        </div>

                                        <div className="text-right w-24">
                                            <p className="text-xl font-bold text-white">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.storeProductId)}
                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Order Summary */}
                {cartItems.length > 0 && (
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>Resumen del Pedido</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Impuestos (15%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-700 pt-4">
                                    <div className="flex justify-between text-xl font-bold text-white">
                                        <span>Total</span>
                                        <span className="text-cyan-400">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <Button
                                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                                    size="lg"
                                    onClick={handleCreateOrder}
                                    disabled={loadingStores}
                                >
                                    {loadingStores ? 'Cargando opciones...' : 'Crear Pedido'}
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Continuar Comprando
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Checkout Modal */}
            <Modal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                title="Completar Pedido"
                size="lg"
            >
                <div className="space-y-6">
                    {/* Delivery Method */}
                    <div>
                        <h3 className="text-white font-semibold mb-3 flex items-center">
                            <Truck className="w-5 h-5 mr-2 text-cyan-400" />
                            Método de Entrega
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {getCommonOrderOptions().pickup && (
                                <button
                                    onClick={() => setDeliveryMethod('PICKUP')}
                                    className={`p-4 rounded-lg border flex flex-col items-center justify-center transition-all ${deliveryMethod === 'PICKUP'
                                        ? 'bg-cyan-900/30 border-cyan-500 text-cyan-400'
                                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                                        }`}
                                >
                                    <Store className="w-8 h-8 mb-2" />
                                    <span className="font-semibold">Recoger en Tienda</span>
                                </button>
                            )}
                            {getCommonOrderOptions().delivery && (
                                <button
                                    onClick={() => setDeliveryMethod('DELIVERY')}
                                    className={`p-4 rounded-lg border flex flex-col items-center justify-center transition-all ${deliveryMethod === 'DELIVERY'
                                        ? 'bg-cyan-900/30 border-cyan-500 text-cyan-400'
                                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                                        }`}
                                >
                                    <Truck className="w-8 h-8 mb-2" />
                                    <span className="font-semibold">Envío a Domicilio</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Address Input (if delivery) */}
                    {deliveryMethod === 'DELIVERY' && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Dirección de Entrega</label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Calle, número, colonia, referencias..."
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500"
                                rows={3}
                            />
                        </div>
                    )}

                    {/* Payment Method */}
                    <div>
                        <h3 className="text-white font-semibold mb-3 flex items-center">
                            <CreditCard className="w-5 h-5 mr-2 text-cyan-400" />
                            Método de Pago
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {getCommonPaymentMethods().map((pm) => (
                                <button
                                    key={pm.method}
                                    onClick={() => setPaymentMethod(pm.method)}
                                    className={`p-3 rounded-lg border text-left transition-all ${paymentMethod === pm.method
                                        ? 'bg-cyan-900/30 border-cyan-500 text-white'
                                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                                        }`}
                                >
                                    <div className="font-semibold">{pm.label || pm.method}</div>
                                    {pm.enabled && <div className="text-xs opacity-70">Disponible</div>}
                                </button>
                            ))}
                        </div>
                        {getCommonPaymentMethods().length === 0 && (
                            <p className="text-red-400 text-sm mt-2">
                                No hay métodos de pago compatibles entre las tiendas seleccionadas.
                            </p>
                        )}
                    </div>

                    {/* Summary & Submit */}
                    <div className="pt-4 border-t border-gray-700 flex justify-between items-center">
                        <div>
                            <p className="text-gray-400 text-sm">Total a Pagar</p>
                            <p className="text-2xl font-bold text-white">${total.toFixed(2)}</p>
                        </div>
                        <Button
                            onClick={submitOrder}
                            disabled={isSubmitting || !paymentMethod || (deliveryMethod === 'DELIVERY' && !address)}
                            className="bg-green-600 hover:bg-green-700 text-white px-8"
                        >
                            {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
