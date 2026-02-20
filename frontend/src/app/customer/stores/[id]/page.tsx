'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Star, ArrowLeft, ShoppingCart, Info, Clock, Plus, Minus } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

interface Store {
    _id: string;
    storeName: string;
    description: string;
    address: {
        street?: string;
        number?: string;
        neighborhood?: string;
        municipality?: string;
        state?: string;
    };
    rating: number;
    logo: string;
    schedule?: string;
    phone?: string;
}

interface Product {
    _id: string; // StoreProduct ID
    productId: {
        _id: string;
        name: string;
        description?: string;
        category: string;
        unit: string;
        image?: string;
    };
    finalPriceCents: number;
    availableQuantity: number;
    active: boolean;
}

export default function StoreDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { addItem } = useCart(); // We'll assume this hook handles cart logic
    const [store, setStore] = useState<Store | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

    const storeId = params.id as string;

    useEffect(() => {
        if (storeId) {
            fetchStoreData();
        }
    }, [storeId]);

    const fetchStoreData = async () => {
        setLoading(true);
        try {
            const [storeRes, productsRes] = await Promise.all([
                api.get(`/stores/${storeId}`),
                api.get(`/store-products/store/${storeId}?active=true`)
            ]);

            if (storeRes.data.success) {
                setStore(storeRes.data.data);
            }
            if (productsRes.data.success) {
                setProducts(productsRes.data.data);
            }
        } catch (error) {
            console.error('Error fetching store data:', error);
            toast.error('Error al cargar la información de la tienda');
            router.push('/customer/stores');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (productId: string, delta: number, max: number) => {
        setQuantities(prev => {
            const current = prev[productId] || 0;
            const newValue = Math.max(0, Math.min(max, current + delta));
            return { ...prev, [productId]: newValue };
        });
    };

    const handleAddToCart = (product: Product) => {
        const quantity = quantities[product._id] || 0;
        if (quantity === 0) {
            toast.error('Selecciona una cantidad');
            return;
        }

        addItem({
            id: product.productId._id, // Or StoreProduct ID? Usually we track StoreProduct for specific pricing
            storeProductId: product._id,
            storeId: storeId,
            name: product.productId.name,
            price: product.finalPriceCents / 100,
            quantity: quantity,
            unit: product.productId.unit,
            image: product.productId.image,
            storeName: store?.storeName
        });

        toast.success(`${quantity} ${product.productId.unit} de ${product.productId.name} agregado al carrito`);
        setQuantities(prev => ({ ...prev, [product._id]: 0 }));
    };

    if (loading) {
        return (
            <DashboardLayout role="customer" title="Cargando...">
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-400">Cargando información de la tienda...</div>
                </div>
            </DashboardLayout>
        );
    }

    if (!store) return null;

    return (
        <DashboardLayout role="customer" title={store.storeName}>
            <div className="space-y-6">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="flex items-center text-gray-400 hover:text-white mb-4 pl-0"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver a Tiendas
                </Button>

                {/* Store Header Info */}
                <Card className="border-none bg-gradient-to-r from-gray-900 to-gray-800">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-3xl font-bold text-cyan-400 border-2 border-cyan-500/30">
                                {store.storeName.charAt(0)}
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">{store.storeName}</h1>
                                    <p className="text-gray-300 text-lg">{store.description}</p>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
                                        <span>{store.address?.street} {store.address?.number}, {store.address?.neighborhood}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                                        <span>{store.rating?.toFixed(1)} / 5.0</span>
                                    </div>
                                    {store.schedule && (
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-2 text-green-400" />
                                            <span>{store.schedule}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Grid */}
                <h2 className="text-xl font-bold text-white mt-8 mb-4 flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2 text-cyan-400" />
                    Productos Disponibles
                </h2>

                {products.length === 0 ? (
                    <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
                        <Info className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">Esta tienda aún no tiene productos disponibles.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Card key={product._id} className="overflow-hidden hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                                <CardHeader className="p-0 h-40 bg-gray-800/50 relative overflow-hidden group">
                                    {product.productId.image ? (
                                        <img
                                            src={product.productId.image}
                                            alt={product.productId.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-600 bg-gray-800">
                                            <ShoppingBagIcon className="w-12 h-12 opacity-20" />
                                        </div>
                                    )}
                                    {product.availableQuantity < 5 && (
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-orange-600/90 text-white text-xs font-bold rounded z-10">
                                            ¡Pocas unidades!
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-white text-lg line-clamp-1">{product.productId.name}</h3>
                                            <span className="text-cyan-400 font-bold">
                                                ${(product.finalPriceCents / 100).toFixed(2)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400">{product.productId.category} • {product.productId.unit}</p>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 pt-2">
                                        <div className="flex items-center bg-gray-900 rounded-lg p-1 border border-gray-700">
                                            <button
                                                onClick={() => handleQuantityChange(product._id, -1, product.availableQuantity)}
                                                className="p-1 hover:text-cyan-400 transition-colors"
                                                disabled={(quantities[product._id] || 0) <= 0}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-mono text-sm">
                                                {quantities[product._id] || 0}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(product._id, 1, product.availableQuantity)}
                                                className="p-1 hover:text-cyan-400 transition-colors"
                                                disabled={(quantities[product._id] || 0) >= product.availableQuantity}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleAddToCart(product)}
                                            disabled={(quantities[product._id] || 0) === 0}
                                            className={quantities[product._id] ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
                                        >
                                            Agregar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

function ShoppingBagIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    );
}
