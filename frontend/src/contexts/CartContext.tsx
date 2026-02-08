'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface CartItem {
    id: string; // Product ID (Global)
    storeProductId: string; // StoreProduct ID
    storeId: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
    image?: string;
    storeName?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (storeProductId: string) => void;
    updateQuantity: (storeProductId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                setItems(JSON.parse(storedCart));
            } catch (error) {
                console.error('Error parsing cart from local storage', error);
                localStorage.removeItem('cart');
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (item: CartItem) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((i) => i.storeProductId === item.storeProductId);

            // Check if adding item from a different store (optional logic, for now allow mixed carts or warn)
            // If we want to restrict cart to single store:
            // Store check removed to allow mixed carts per user request
            // We will handle splitting orders in checkout logic


            if (existingItem) {
                return prevItems.map((i) =>
                    i.storeProductId === item.storeProductId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prevItems, item];
        });
    };

    const removeItem = (storeProductId: string) => {
        setItems((prevItems) => prevItems.filter((i) => i.storeProductId !== storeProductId));
        toast.success('Producto eliminado del carrito');
    };

    const updateQuantity = (storeProductId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(storeProductId);
            return;
        }
        setItems((prevItems) =>
            prevItems.map((i) =>
                i.storeProductId === storeProductId ? { ...i, quantity } : i
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
