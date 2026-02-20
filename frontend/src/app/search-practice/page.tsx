'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, X } from 'lucide-react';

// Types
interface Product {
    _id: string;
    name: string;
    description?: string;
    category?: string;
    company?: string;
    price: number;
    tags?: string[];
    image?: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
}

// API Client (Simplified for this page)
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

export default function SearchPracticePage() {
    // State
    const [mode, setMode] = useState<'simple' | 'advanced'>('simple');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0 });

    // Filters
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [tags, setTags] = useState('');
    const [sort, setSort] = useState('newest');

    // Debounce for query
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(handler);
    }, [query]);

    // Search Effect
    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery, pagination.page, sort, mode]); // Trigger search when these change

    // For Advanced mode w/ explicit button, we might want to disable auto-search on filters
    // but for "reactive" feel, we leave it. Or strictly follow instructions for "Button"

    const fetchProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const params: any = {
                page: pagination.page,
                limit: pagination.limit,
                sort,
            };

            if (debouncedQuery) params.search = debouncedQuery;

            if (mode === 'advanced') {
                if (category) params.category = category;
                if (minPrice) params.min = minPrice;
                if (maxPrice) params.max = maxPrice;
                if (tags) params.tags = tags;
            }

            const res = await api.get('/products', { params });
            setProducts(res.data.data || []);
            setPagination(res.data.pagination);
        } catch (err) {
            console.error(err);
            setError('Error al buscar productos');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchClick = () => {
        // Force re-fetch manually if needed, or just let effects handle it
        fetchProducts();
    };

    const clearFilters = () => {
        setQuery('');
        setCategory('');
        setMinPrice('');
        setMaxPrice('');
        setTags('');
        setSort('newest');
        setPagination({ ...pagination, page: 1 });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Práctica de Búsqueda
                    </h1>
                    <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
                        <button
                            onClick={() => { setMode('simple'); clearFilters(); }}
                            className={`px-4 py-2 rounded-md transition-colors ${mode === 'simple' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-400'}`}
                        >
                            Simple
                        </button>
                        <button
                            onClick={() => { setMode('advanced'); clearFilters(); }}
                            className={`px-4 py-2 rounded-md transition-colors ${mode === 'advanced' ? 'bg-purple-600 text-white' : 'hover:bg-gray-700 text-gray-400'}`}
                        >
                            Avanzada
                        </button>
                    </div>
                </div>

                {/* Search Controls */}
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm space-y-6">

                    {/* Main Search Input (Common) */}
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, descripción o tags..."
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleSearchClick}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                        >
                            Buscar
                        </button>
                    </div>

                    {/* Advanced Filters */}
                    {mode === 'advanced' && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">

                            <select
                                className="bg-gray-900 border border-gray-700 rounded-lg p-2"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Todas las Categorías</option>
                                <option value="Electrónica">Electrónica</option>
                                <option value="Computación">Computación</option>
                                <option value="Hogar">Hogar</option>
                                <option value="Ropa">Ropa</option>
                                <option value="Libros">Libros</option>
                            </select>

                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min $"
                                    className="w-1/2 bg-gray-900 border border-gray-700 rounded-lg p-2"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder="Max $"
                                    className="w-1/2 bg-gray-900 border border-gray-700 rounded-lg p-2"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </div>

                            <input
                                type="text"
                                placeholder="Tags (ej: oferta, nuevo)"
                                className="bg-gray-900 border border-gray-700 rounded-lg p-2"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />

                            <select
                                className="bg-gray-900 border border-gray-700 rounded-lg p-2"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="newest">Más Nuevos</option>
                                <option value="oldest">Más Antiguos</option>
                                <option value="price_asc">Precio: Menor a Mayor</option>
                                <option value="price_desc">Precio: Mayor a Menor</option>
                            </select>

                            <div className="col-span-full flex justify-end">
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                                >
                                    <X size={16} /> Limpiar Filtros
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Area */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <h2 className="text-xl font-semibold">Resultados ({pagination.total})</h2>
                        {loading && <span className="text-blue-400 animate-pulse">Buscando...</span>}
                    </div>

                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg">
                            {error}
                        </div>
                    )}

                    {!loading && products.length === 0 && !error && (
                        <div className="text-center py-12 text-gray-500 bg-gray-800/30 rounded-xl">
                            <p className="text-lg">No se encontraron resultados</p>
                            <p className="text-sm">Intenta con otros términos o filtros</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div key={product._id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group">
                                <div className="h-40 bg-gray-700 relative overflow-hidden">
                                    {/* Placeholder image logic */}
                                    <img
                                        src={product.image || "https://placehold.co/400?text=No+Image"}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs">
                                        {product.category || 'General'}
                                    </div>
                                </div>
                                <div className="p-4 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
                                        <span className="text-green-400 font-mono font-bold">${product.price}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm line-clamp-2">{product.description || 'Sin descripción'}</p>

                                    {product.tags && product.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {product.tags.map(tag => (
                                                <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {pagination.total > 0 && (
                        <div className="flex justify-center gap-4 mt-8">
                            <button
                                disabled={pagination.page === 1}
                                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700"
                            >
                                Anterior
                            </button>
                            <span className="flex items-center text-gray-400">
                                Página {pagination.page} de {Math.ceil(pagination.total / pagination.limit)}
                            </span>
                            <button
                                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
