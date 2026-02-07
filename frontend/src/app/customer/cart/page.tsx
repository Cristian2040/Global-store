'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    unit: string;
    store: string;
    image: string;
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        { id: 1, name: 'Manzanas Rojas', price: 2.50, quantity: 2, unit: 'kg', store: 'Tienda Local 1', image: '🍎' },
        { id: 2, name: 'Leche Entera', price: 1.80, quantity: 3, unit: 'litro', store: 'Supermercado Central', image: '🥛' },
        { id: 3, name: 'Pan Integral', price: 1.20, quantity: 1, unit: 'unidad', store: 'Tienda del Barrio', image: '🍞' },
    ]);

    const updateQuantity = (id: number, delta: number) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const removeItem = (id: number) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
                            <Card key={item.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="text-5xl">{item.image}</div>

                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white">{item.name}</h3>
                                            <p className="text-sm text-gray-400">{item.store}</p>
                                            <p className="text-cyan-400 font-semibold mt-1">
                                                ${item.price} / {item.unit}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                            >
                                                <Minus className="w-4 h-4 text-white" />
                                            </button>
                                            <span className="text-white font-semibold w-8 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                            >
                                                <Plus className="w-4 h-4 text-white" />
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xl font-bold text-white">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
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
                                <Button className="w-full" size="lg">
                                    Proceder al Pago
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Continuar Comprando
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
