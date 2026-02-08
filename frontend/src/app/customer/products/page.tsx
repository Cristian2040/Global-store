'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, ShoppingCart, Filter, Plus, Minus } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useDebounce } from '@/hooks/useDebounce';

interface StoreProduct {
    _id: string;
    storeId: {
        _id: string;
        storeName: string;
    };
    productId: {
        _id: string;
        name: string;
        category: string;
        unit: string;
        image?: string;
    };
    finalPriceCents: number;
    availableQuantity: number;
}

export default function ProductsPage() {
    const { addItem } = useCart();
    const [products, setProducts] = useState<StoreProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('Todas las categorías');
    const [debouncedSearch] = useDebounce(searchTerm, 500);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

    const categories = ['Todas las categorías', 'Frutas', 'Verduras', 'Lácteos', 'Carnes', 'Panadería', 'Bebidas', 'Limpieza'];

    useEffect(() => {
        fetchProducts();
    }, [debouncedSearch, category]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (debouncedSearch) params.append('search', debouncedSearch);
            if (category !== 'Todas las categorías') params.append('category', category);

            const response = await api.get(`/store-products?${params.toString()}`);
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Error al cargar productos');
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

    const handleAddToCart = (product: StoreProduct) => {
        const quantity = quantities[product._id] || 0;
        if (quantity === 0) {
            toast.error('Selecciona una cantidad');
            return;
        }

        addItem({
            id: product.productId._id,
            storeProductId: product._id,
            storeId: product.storeId._id,
            name: product.productId.name,
            price: product.finalPriceCents / 100,
            quantity: quantity,
            unit: product.productId.unit,
            image: product.productId.image,
            storeName: product.storeId.storeName
        });

        toast.success(`${quantity} ${product.productId.unit} de ${product.productId.name} agregado al carrito`);
        setQuantities(prev => ({ ...prev, [product._id]: 0 }));
    };

    return (
        <DashboardLayout role="customer" title="Productos">
            <div className="space-y-6">
                {/* Filters and Search */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                            <div className="relative w-full md:w-64">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-12 text-gray-400">Cargando productos...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Card key={product._id} className="overflow-hidden hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                                <div className="h-40 bg-gray-800 flex items-center justify-center relative group">
                                    {product.productId.image ? (
                                        <img
                                            src={product.productId.image}
                                            alt={product.productId.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    ) : (
                                        <span className="text-4xl">📦</span>
                                    )}
                                    {product.availableQuantity < 5 && (
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-orange-600/90 text-white text-xs font-bold rounded z-10">
                                            ¡Pocas unidades!
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-5">
                                    <div className="mb-4">
                                        <h3 className="font-bold text-white text-lg mb-1 line-clamp-1">{product.productId.name}</h3>
                                        <p className="text-xs text-cyan-400 mb-2">{product.storeId.storeName}</p>

                                        <div className="flex justify-between items-end">
                                            <span className="text-2xl font-bold text-cyan-400">
                                                ${(product.finalPriceCents / 100).toFixed(2)}
                                            </span>
                                            <span className="text-xs text-gray-400 px-2 py-1 bg-gray-700 rounded-full">
                                                {product.productId.category}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            por {product.productId.unit}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between bg-gray-900 rounded-lg p-1 border border-gray-700">
                                            <button
                                                onClick={() => handleQuantityChange(product._id, -1, product.availableQuantity)}
                                                className="p-2 hover:text-cyan-400 transition-colors"
                                                disabled={(quantities[product._id] || 0) <= 0}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="flex-1 text-center font-mono font-medium">
                                                {quantities[product._id] || 0}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(product._id, 1, product.availableQuantity)}
                                                className="p-2 hover:text-cyan-400 transition-colors"
                                                disabled={(quantities[product._id] || 0) >= product.availableQuantity}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <Button
                                            className={`w-full ${quantities[product._id] ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-gray-700 text-gray-400'}`}
                                            onClick={() => handleAddToCart(product)}
                                            disabled={!quantities[product._id]}
                                        >
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            Agregar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No se encontraron productos disponibles</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
