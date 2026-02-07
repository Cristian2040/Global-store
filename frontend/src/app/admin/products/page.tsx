'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Package, Eye, Trash2 } from 'lucide-react';

interface ProductData {
    id: number;
    name: string;
    category: string;
    store: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive' | 'flagged';
}

export default function ProductsManagementPage() {
    const products: ProductData[] = [
        { id: 1, name: 'Manzanas Rojas', category: 'Frutas', store: 'Tienda Local 1', price: 2.50, stock: 45, status: 'active' },
        { id: 2, name: 'Leche Entera', category: 'Lácteos', store: 'Supermercado Central', price: 1.80, stock: 120, status: 'active' },
        { id: 3, name: 'Pan Integral', category: 'Panadería', store: 'Tienda del Barrio', price: 1.20, stock: 30, status: 'active' },
        { id: 4, name: 'Tomates', category: 'Verduras', store: 'Mercado Express', price: 3.00, stock: 80, status: 'flagged' },
        { id: 5, name: 'Pollo Fresco', category: 'Carnes', store: 'Tienda Orgánica', price: 5.50, stock: 0, status: 'inactive' },
    ];

    const statusColors = {
        active: 'bg-green-900/50 border-green-700 text-green-300',
        inactive: 'bg-gray-800 border-gray-700 text-gray-400',
        flagged: 'bg-orange-900/50 border-orange-700 text-orange-300',
    };

    const statusLabels = {
        active: 'Activo',
        inactive: 'Inactivo',
        flagged: 'Marcado',
    };

    const columns = [
        { key: 'name', header: 'Producto' },
        { key: 'category', header: 'Categoría' },
        { key: 'store', header: 'Tienda' },
        { key: 'price', header: 'Precio', render: (product: ProductData) => `$${product.price.toFixed(2)}` },
        { key: 'stock', header: 'Stock', render: (product: ProductData) => `${product.stock} unidades` },
        {
            key: 'status',
            header: 'Estado',
            render: (product: ProductData) => (
                <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${statusColors[product.status]}`}>
                    {statusLabels[product.status]}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (product: ProductData) => (
                <div className="flex gap-2">
                    <button className="p-2 text-cyan-400 hover:bg-cyan-900/20 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    const activeCount = products.filter(p => p.status === 'active').length;
    const flaggedCount = products.filter(p => p.status === 'flagged').length;

    return (
        <DashboardLayout role="admin" title="Gestión de Productos">
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Total Productos</p>
                                    <p className="text-3xl font-bold text-white">{products.length}</p>
                                </div>
                                <Package className="w-8 h-8 text-cyan-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Activos</p>
                                    <p className="text-3xl font-bold text-green-400">{activeCount}</p>
                                </div>
                                <Package className="w-8 h-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Marcados</p>
                                    <p className="text-3xl font-bold text-orange-400">{flaggedCount}</p>
                                </div>
                                <Package className="w-8 h-8 text-orange-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Products Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Package className="w-6 h-6 mr-2 text-cyan-400" />
                            Todos los Productos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table data={products} columns={columns} />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
