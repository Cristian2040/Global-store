'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Package, Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import api from '@/lib/api';

interface StoreProduct {
    _id: string;
    productId: {
        _id: string;
        name: string;
        category: string;
        unit: string;
        image?: string;
    };
    basePriceCents: number;
    finalPriceCents: number;
    availableQuantity: number;
    active: boolean;
}

export default function ProductsPage() {
    const { relatedData } = useAuth();
    const [products, setProducts] = useState<StoreProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);

    // Form states
    const [finalPrice, setFinalPrice] = useState('');
    const [stock, setStock] = useState('');

    useEffect(() => {
        if (relatedData?._id) {
            fetchProducts();
        }
    }, [relatedData]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/store-products/store/${relatedData?._id}`);
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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                const response = await api.put(`/store-products/${editingProduct._id}`, {
                    finalPriceCents: Math.round(parseFloat(finalPrice) * 100),
                    availableQuantity: parseInt(stock),
                    active: editingProduct.active
                });
                if (response.data.success) {
                    toast.success('Producto actualizado');
                    setIsModalOpen(false);
                    fetchProducts();
                }
            } else {
                // Creation flow - simplified for now or redirect to catalog
                toast.info('Para agregar productos, usa el Catálogo de Proveedores o Reabastecimiento');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Error al guardar producto');
        }
    };

    const handleToggleActive = async (product: StoreProduct) => {
        try {
            const response = await api.put(`/store-products/${product._id}`, {
                active: !product.active
            });
            if (response.data.success) {
                toast.success(`Producto ${!product.active ? 'activado' : 'desactivado'}`);
                fetchProducts();
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Error al actualizar estado');
        }
    };

    const openEditModal = (product: StoreProduct) => {
        setEditingProduct(product);
        setFinalPrice((product.finalPriceCents / 100).toFixed(2));
        setStock(product.availableQuantity.toString());
        setIsModalOpen(true);
    };

    const columns = [
        {
            key: 'name',
            header: 'Producto',
            render: (row: StoreProduct) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                        {/* Access image from productId if available. Note: interface might need update if strict, but API sends it */}
                        {(row.productId as any).image ? (
                            <img
                                src={(row.productId as any).image}
                                alt={row.productId?.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <Package className="w-5 h-5 opacity-50" />
                            </div>
                        )}
                    </div>
                    <span>{row.productId?.name || 'Producto Desconocido'}</span>
                </div>
            )
        },
        { key: 'category', header: 'Categoría', render: (row: StoreProduct) => row.productId?.category || '-' },
        {
            key: 'price',
            header: 'Precio Venta',
            render: (row: StoreProduct) => `$${(row.finalPriceCents / 100).toFixed(2)}`,
        },
        {
            key: 'cost',
            header: 'Costo Prom.',
            render: (row: StoreProduct) => `$${(row.basePriceCents / 100).toFixed(2)}`,
        },
        {
            key: 'margin',
            header: 'Margen',
            render: (row: StoreProduct) => {
                const price = row.finalPriceCents;
                const cost = row.basePriceCents;
                if (price === 0) return '0%';
                const margin = ((price - cost) / price * 100).toFixed(1);
                return `${margin}%`;
            },
        },
        {
            key: 'stock',
            header: 'Stock',
            render: (row: StoreProduct) => `${row.availableQuantity} ${row.productId?.unit || 'univ.'}`,
        },
        {
            key: 'active',
            header: 'Estado',
            render: (row: StoreProduct) =>
                row.active ? (
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
            render: (row: StoreProduct) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => openEditModal(row)}
                        className="p-2 text-cyan-400 hover:bg-cyan-900/20 rounded-lg transition-colors"
                        title="Editar Precio/Stock"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleToggleActive(row)}
                        className={`p-2 rounded-lg transition-colors ${row.active ? 'text-red-400 hover:bg-red-900/20' : 'text-green-400 hover:bg-green-900/20'}`}
                        title={row.active ? "Desactivar" : "Activar"}
                    >
                        {row.active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
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
                        <Button onClick={() => toast.info('Para agregar productos, realiza un pedido de reabastecimiento.')}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Producto
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-10">Cargando productos...</div>
                    ) : (
                        <Table data={products} columns={columns} />
                    )}
                </CardContent>
            </Card>

            {/* Product Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProduct ? `Editar ${editingProduct.productId?.name}` : 'Nuevo Producto'}
                size="md"
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Costo Base (Referencia)
                            </label>
                            <input
                                type="text"
                                disabled
                                value={`$${(editingProduct ? editingProduct.basePriceCents / 100 : 0).toFixed(2)}`}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-gray-500 rounded-lg cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Precio de Venta ($)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                value={finalPrice}
                                onChange={(e) => setFinalPrice(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Stock Actual
                            </label>
                            <input
                                type="number"
                                min="0"
                                required
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">El stock se actualiza automáticamente con los pedidos, pero puedes ajustarlo manualmente aquí.</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">Guardar Cambios</Button>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
}
