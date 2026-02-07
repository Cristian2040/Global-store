'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Search, Filter } from 'lucide-react';

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = ['all', 'Frutas', 'Verduras', 'Lácteos', 'Carnes', 'Panadería'];

    const products = [
        { id: 1, name: 'Manzanas Rojas', category: 'Frutas', price: 2.50, unit: 'kg', store: 'Tienda Local 1', image: '🍎' },
        { id: 2, name: 'Leche Entera', category: 'Lácteos', price: 1.80, unit: 'litro', store: 'Supermercado Central', image: '🥛' },
        { id: 3, name: 'Pan Integral', category: 'Panadería', price: 1.20, unit: 'unidad', store: 'Tienda del Barrio', image: '🍞' },
        { id: 4, name: 'Tomates', category: 'Verduras', price: 3.00, unit: 'kg', store: 'Mercado Express', image: '🍅' },
        { id: 5, name: 'Pollo Fresco', category: 'Carnes', price: 5.50, unit: 'kg', store: 'Tienda Orgánica', image: '🍗' },
        { id: 6, name: 'Plátanos', category: 'Frutas', price: 1.50, unit: 'kg', store: 'Mini Market 24/7', image: '🍌' },
        { id: 7, name: 'Yogurt Natural', category: 'Lácteos', price: 2.20, unit: 'unidad', store: 'Supermercado Central', image: '🥛' },
        { id: 8, name: 'Lechuga', category: 'Verduras', price: 1.00, unit: 'unidad', store: 'Tienda Orgánica', image: '🥬' },
    ];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <DashboardLayout role="customer" title="Productos">
            <div className="space-y-6">
                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-gray-400" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat === 'all' ? 'Todas las categorías' : cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <Card key={product.id} className="hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                            <CardContent className="p-6">
                                <div className="text-6xl text-center mb-4">{product.image}</div>
                                <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                                <p className="text-sm text-gray-400 mb-3">{product.store}</p>

                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-2xl font-bold text-cyan-400">${product.price}</p>
                                        <p className="text-xs text-gray-500">por {product.unit}</p>
                                    </div>
                                    <span className="px-2 py-1 text-xs bg-purple-900/50 border border-purple-700 text-purple-300 rounded-full">
                                        {product.category}
                                    </span>
                                </div>

                                <Button className="w-full" size="sm">
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Agregar
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No se encontraron productos</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
