'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    cost: number;
    stock: number;
    unit: string;
    active: boolean;
}

export default function ProductsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const products: Product[] = [
        { id: 1, name: 'Manzanas Rojas', category: 'Frutas', price: 2.50, cost: 1.50, stock: 45, unit: 'kg', active: true },
        { id: 2, name: 'Leche Entera', category: 'Lácteos', price: 1.80, cost: 1.20, stock: 12, unit: 'litro', active: true },
        { id: 3, name: 'Pan Integral', category: 'Panadería', price: 1.20, cost: 0.80, stock: 8, unit: 'unidad', active: true },
        { id: 4, name: 'Tomates', category: 'Verduras', price: 3.00, cost: 2.00, stock: 30, unit: 'kg', active: true },
        { id: 5, name: 'Pollo Fresco', category: 'Carnes', price: 5.50, cost: 4.00, stock: 25, unit: 'kg', active: false },
    ];

    const columns = [
        { key: 'name', header: 'Producto' },
        { key: 'category', header: 'Categoría' },
        {
            key: 'price',
            header: 'Precio Venta',
            render: (product: Product) => `$${product.price.toFixed(2)}`,
        },
        {
            key: 'cost',
            header: 'Costo',
            render: (product: Product) => `$${product.cost.toFixed(2)}`,
        },
        {
            key: 'margin',
            header: 'Margen',
            render: (product: Product) => {
                const margin = ((product.price - product.cost) / product.price * 100).toFixed(0);
                return `${margin}%`;
            },
        },
        {
            key: 'stock',
            header: 'Stock',
            render: (product: Product) => `${product.stock} ${product.unit}`,
        },
        {
            key: 'active',
            header: 'Estado',
            render: (product: Product) =>
                product.active ? (
                    <span className="px-3 py-1 text-xs font-semibold text-green-300 bg-green-900/50 border border-green-700 rounded-full">
                        Activo
                    </span>
                ) : (
                    <span className="px-3 py-1 text-xs font-semibold text-gray-400 bg-gray-800 border border-gray-700 rounded-full">
                        Inactivo
                    </span>
                ),
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (product: Product) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setEditingProduct(product);
                            setIsModalOpen(true);
                        }}
                        className="p-2 text-cyan-400 hover:bg-cyan-900/20 rounded-lg transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <DashboardLayout role="store" title="Gestión de Productos">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Package className="w-6 h-6 mr-2 text-cyan-400" />
                            Mis Productos
                        </div>
                        <Button onClick={() => {
                            setEditingProduct(null);
                            setIsModalOpen(true);
                        }}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Producto
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table data={products} columns={columns} />
                </CardContent>
            </Card>

            {/* Product Form Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button>Guardar</Button>
                    </>
                }
            >
                <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Nombre del Producto
                            </label>
                            <input
                                type="text"
                                defaultValue={editingProduct?.name}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Categoría
                            </label>
                            <select
                                defaultValue={editingProduct?.category}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option>Frutas</option>
                                <option>Verduras</option>
                                <option>Lácteos</option>
                                <option>Carnes</option>
                                <option>Panadería</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Precio de Venta
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                defaultValue={editingProduct?.price}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Costo
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                defaultValue={editingProduct?.cost}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Stock Inicial
                            </label>
                            <input
                                type="number"
                                defaultValue={editingProduct?.stock}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Unidad
                            </label>
                            <select
                                defaultValue={editingProduct?.unit}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option>kg</option>
                                <option>litro</option>
                                <option>unidad</option>
                                <option>paquete</option>
                            </select>
                        </div>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
}
