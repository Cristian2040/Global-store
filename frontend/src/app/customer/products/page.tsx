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

    // Advanced Filters State
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [company, setCompany] = useState('Todas las compañías');
    const [sort, setSort] = useState('newest');
    const [companies, setCompanies] = useState<string[]>(['Todas las compañías']);

    const categories = ['Todas las categorías', 'Frutas', 'Verduras', 'Lácteos', 'Carnes', 'Panadería', 'Bebidas', 'Limpieza', 'Electrónica', 'Hogar', 'Deportes', 'Moda'];

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [debouncedSearch, category, company, sort]);

    const fetchCompanies = async () => {
        try {
            const response = await api.get('/products/companies');
            if (response.data.success) {
                setCompanies(['Todas las compañías', ...response.data.data]);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (debouncedSearch) params.append('search', debouncedSearch);
            if (category !== 'Todas las categorías') params.append('category', category);
            if (company !== 'Todas las compañías') params.append('company', company);
            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice) params.append('maxPrice', maxPrice);
            if (sort) params.append('sort', sort);

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

    const handleClearFilters = () => {
        setSearchTerm('');
        setCategory('Todas las categorías');
        setCompany('Todas las compañías');
        setMinPrice('');
        setMaxPrice('');
        setSort('newest');
        toast.info('Filtros limpiados');
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
                <div className="space-y-4">
                    <Card className="bg-gray-800/80 border-gray-700 shadow-xl backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre o descripción..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setShowAdvanced(!showAdvanced)}
                                        variant="outline"
                                        className={`h-full border-gray-700 ${showAdvanced ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'text-gray-400'}`}
                                    >
                                        <Filter className="w-4 h-4 mr-2" />
                                        Filtros {showAdvanced ? 'v' : '>'}
                                    </Button>
                                    <Button onClick={fetchProducts} className="bg-cyan-600 hover:bg-cyan-500 text-white">
                                        Buscar
                                    </Button>
                                    <Button variant="ghost" onClick={handleClearFilters} className="text-gray-500 hover:text-white">
                                        Limpiar
                                    </Button>
                                </div>
                            </div>

                            {/* Advanced Panel */}
                            {showAdvanced && (
                                <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Categoría</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 appearance-none cursor-pointer"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Empresa / Marca</label>
                                        <select
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 appearance-none cursor-pointer"
                                        >
                                            {companies.map((comp) => (
                                                <option key={comp}>{comp}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Rango de Precio</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg text-sm focus:ring-1 focus:ring-cyan-500"
                                            />
                                            <span className="text-gray-600">-</span>
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg text-sm focus:ring-1 focus:ring-cyan-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Ordenar por</label>
                                        <select
                                            value={sort}
                                            onChange={(e) => setSort(e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 appearance-none cursor-pointer"
                                        >
                                            <option value="newest">Más recientes</option>
                                            <option value="price_asc">Menor precio</option>
                                            <option value="price_desc">Mayor precio</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

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
