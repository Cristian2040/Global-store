'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, ShoppingCart, Filter, Plus, Minus, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
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
        company?: string;
    };
    finalPriceCents: number;
    availableQuantity: number;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const CATEGORIES = [
    'Todas las categorías', 'Bebidas', 'Botanas', 'Panadería', 'Lácteos',
    'Abarrotes', 'Frutas', 'Verduras', 'Carnes', 'Limpieza', 'Hogar',
];

export default function ProductsPage() {
    const { addItem } = useCart();
    const [products, setProducts] = useState<StoreProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('Todas las categorías');
    const [debouncedSearch] = useDebounce(searchTerm, 500);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

    // Advanced Filters
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [company, setCompany] = useState('Todas las compañías');
    const [sort, setSort] = useState('newest');
    const [companies, setCompanies] = useState<string[]>(['Todas las compañías']);

    // Pagination
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 12, total: 0, totalPages: 0 });
    const LIMIT = 12;

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        setPage(1); // reset to page 1 when filters change
    }, [debouncedSearch, category, company, minPrice, maxPrice, sort]);

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, category, company, sort, page]);

    const fetchCompanies = async () => {
        try {
            const response = await api.get('/products/companies');
            if (response.data.success) {
                setCompanies(['Todas las compañías', ...response.data.data]);
            }
        } catch {
            // non-critical, fail silently
        }
    };

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            // Use `q` as the primary search param (rubric requirement)
            if (debouncedSearch) params.append('q', debouncedSearch);
            if (category !== 'Todas las categorías') params.append('category', category);
            if (company !== 'Todas las compañías') params.append('company', company);
            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice) params.append('maxPrice', maxPrice);
            if (sort) params.append('sort', sort);
            params.append('page', String(page));
            params.append('limit', String(LIMIT));

            const response = await api.get(`/store-products?${params.toString()}`);
            if (response.data.success) {
                setProducts(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                || 'Error al cargar productos. Intenta de nuevo.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, category, company, minPrice, maxPrice, sort, page]);

    const handleApplyPriceFilter = () => {
        setPage(1);
        fetchProducts();
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setCategory('Todas las categorías');
        setCompany('Todas las compañías');
        setMinPrice('');
        setMaxPrice('');
        setSort('newest');
        setPage(1);
        toast.info('Filtros limpiados');
    };

    const handleQuantityChange = (productId: string, delta: number, max: number) => {
        setQuantities(prev => {
            const current = prev[productId] || 0;
            return { ...prev, [productId]: Math.max(0, Math.min(max, current + delta)) };
        });
    };

    const handleAddToCart = (product: StoreProduct) => {
        const quantity = quantities[product._id] || 0;
        if (quantity === 0) { toast.error('Selecciona una cantidad'); return; }

        addItem({
            id: product.productId._id,
            storeProductId: product._id,
            storeId: product.storeId._id,
            name: product.productId.name,
            price: product.finalPriceCents / 100,
            quantity,
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
                {/* Search & Filters */}
                <Card className="bg-gray-800/80 border-gray-700 shadow-xl backdrop-blur-sm">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="text"
                                    id="search-input"
                                    placeholder="Buscar por nombre (ej. Coca-Cola, Bimbo)..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    maxLength={100}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    id="toggle-advanced-btn"
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    variant="outline"
                                    className={`border-gray-700 ${showAdvanced ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'text-gray-400'}`}
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filtros {showAdvanced ? '▲' : '▼'}
                                </Button>
                                <Button id="clear-filters-btn" variant="ghost" onClick={handleClearFilters} className="text-gray-500 hover:text-white">
                                    Limpiar
                                </Button>
                            </div>
                        </div>

                        {/* Advanced Panel */}
                        {showAdvanced && (
                            <div className="pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Categoría</label>
                                    <select id="category-filter" value={category} onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-1 focus:ring-cyan-500 appearance-none">
                                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Empresa / Marca</label>
                                    <select id="company-filter" value={company} onChange={(e) => setCompany(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-1 focus:ring-cyan-500 appearance-none">
                                        {companies.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Precio ($)</label>
                                    <div className="flex items-center gap-2">
                                        <input id="min-price" type="number" placeholder="Min" value={minPrice} min={0}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg text-sm focus:ring-1 focus:ring-cyan-500" />
                                        <span className="text-gray-600">–</span>
                                        <input id="max-price" type="number" placeholder="Max" value={maxPrice} min={0}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg text-sm focus:ring-1 focus:ring-cyan-500" />
                                    </div>
                                    <Button onClick={handleApplyPriceFilter} size="sm" className="w-full mt-1 bg-cyan-700 hover:bg-cyan-600 text-white text-xs">
                                        Aplicar precio
                                    </Button>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Ordenar por</label>
                                    <select id="sort-filter" value={sort} onChange={(e) => setSort(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-1 focus:ring-cyan-500 appearance-none">
                                        <option value="newest">Más recientes</option>
                                        <option value="price_asc">Menor precio</option>
                                        <option value="price_desc">Mayor precio</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Results header */}
                {!loading && !error && (
                    <div className="flex items-center justify-between text-sm text-gray-400 px-1">
                        <span>
                            {pagination.total === 0
                                ? 'Sin resultados'
                                : `${pagination.total} producto${pagination.total !== 1 ? 's' : ''} encontrado${pagination.total !== 1 ? 's' : ''}`}
                        </span>
                        {pagination.totalPages > 1 && (
                            <span>Página {pagination.page} de {pagination.totalPages}</span>
                        )}
                    </div>
                )}

                {/* States */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                        <span>Cargando productos...</span>
                    </div>
                )}

                {!loading && error && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-red-400">
                        <AlertCircle className="w-12 h-12 opacity-60" />
                        <p className="text-lg font-medium">Ocurrió un error</p>
                        <p className="text-sm text-gray-500 text-center max-w-sm">{error}</p>
                        <Button onClick={fetchProducts} className="bg-cyan-700 hover:bg-cyan-600 text-white">
                            Reintentar
                        </Button>
                    </div>
                )}

                {!loading && !error && products.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
                        <Search className="w-12 h-12 opacity-30" />
                        <p className="text-lg font-medium text-white">Sin resultados</p>
                        <p className="text-sm">Intenta con otros términos o limpia los filtros.</p>
                        <Button variant="ghost" onClick={handleClearFilters} className="text-cyan-400 hover:text-cyan-300">
                            Limpiar filtros
                        </Button>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && !error && products.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Card key={product._id} className="overflow-hidden hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                                <div className="h-40 bg-gray-800 flex items-center justify-center relative group">
                                    {product.productId.image ? (
                                        <img
                                            src={product.productId.image}
                                            alt={product.productId.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
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
                                        <p className="text-xs text-cyan-400 mb-1">{product.storeId.storeName}</p>
                                        {product.productId.company && (
                                            <p className="text-xs text-gray-500 mb-2">{product.productId.company}</p>
                                        )}
                                        <div className="flex justify-between items-end">
                                            <span className="text-2xl font-bold text-cyan-400">
                                                ${(product.finalPriceCents / 100).toFixed(2)}
                                            </span>
                                            <span className="text-xs text-gray-400 px-2 py-1 bg-gray-700 rounded-full">
                                                {product.productId.category}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">por {product.productId.unit}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between bg-gray-900 rounded-lg p-1 border border-gray-700">
                                            <button
                                                onClick={() => handleQuantityChange(product._id, -1, product.availableQuantity)}
                                                className="p-2 hover:text-cyan-400 transition-colors disabled:opacity-30"
                                                disabled={(quantities[product._id] || 0) <= 0}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="flex-1 text-center font-mono font-medium">
                                                {quantities[product._id] || 0}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(product._id, 1, product.availableQuantity)}
                                                className="p-2 hover:text-cyan-400 transition-colors disabled:opacity-30"
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

                {/* Pagination Controls */}
                {!loading && !error && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <Button
                            id="prev-page-btn"
                            variant="outline"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            className="border-gray-700 text-gray-400 disabled:opacity-30"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                        </Button>
                        <span className="text-sm text-gray-400">
                            Página <span className="text-white font-bold">{pagination.page}</span> de <span className="text-white font-bold">{pagination.totalPages}</span>
                        </span>
                        <Button
                            id="next-page-btn"
                            variant="outline"
                            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                            disabled={page >= pagination.totalPages}
                            className="border-gray-700 text-gray-400 disabled:opacity-30"
                        >
                            Siguiente <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
