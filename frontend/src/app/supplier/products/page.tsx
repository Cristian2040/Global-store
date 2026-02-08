'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Product, Supplier } from '@/types';

interface SupplierProduct {
    _id: string;
    productId: Product;
    basePriceCents: number;
    availableQuantity: number;
    supplierId: string;
}

export default function SupplierProductsPage() {
    const { user, relatedData } = useAuth();
    // Safe cast since we are in a supplier protected route/layout
    const supplierData = user?.role === 'supplier' ? (relatedData as Supplier) : null;

    const [supplierProducts, setSupplierProducts] = useState<SupplierProduct[]>([]);
    const [companyProducts, setCompanyProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<SupplierProduct | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        productId: '',
        price: '',
        stock: '',
    });

    const fetchSupplierProducts = async () => {
        if (!supplierData?._id) return;
        try {
            const response = await api.get(`/supplier-products/supplier/${supplierData._id}`);
            if (response.data.success) {
                setSupplierProducts(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching supplier products:', error);
            // toast.error('Error al cargar sus productos'); // Suppress error if empty
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanyProducts = async () => {
        if (!supplierData?.companyName) return;
        try {
            const response = await api.get('/products', {
                params: { company: supplierData.companyName }
            });
            if (response.data.success) {
                setCompanyProducts(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching company products:', error);
        }
    };

    useEffect(() => {
        if (supplierData) {
            fetchSupplierProducts();
            fetchCompanyProducts();
        }
    }, [supplierData]);

    const handleSaveProduct = async () => {
        if (!supplierData?._id) {
            toast.error('Error de sesión');
            return;
        }

        if (!formData.productId && !editingProduct) {
            toast.error('Por favor seleccione un producto');
            return;
        }

        if (!formData.price || !formData.stock) {
            toast.error('Por favor complete precio y stock');
            return;
        }

        try {
            const payload = {
                supplierId: supplierData._id,
                productId: editingProduct ? editingProduct.productId._id : formData.productId,
                basePriceCents: Math.round(parseFloat(formData.price) * 100),
                availableQuantity: parseInt(formData.stock),
            };

            if (editingProduct) {
                await api.put(`/supplier-products/${editingProduct._id}`, payload);
                toast.success('Producto actualizado exitosamente');
            } else {
                await api.post('/supplier-products', payload);
                toast.success('Producto vinculado exitosamente');
            }

            setIsModalOpen(false);
            resetForm();
            fetchSupplierProducts();
        } catch (error: any) {
            console.error('Error saving product:', error);
            toast.error(error.response?.data?.message || 'Error al guardar el producto');
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('¿Está seguro de eliminar este producto de su catálogo?')) return;

        try {
            const response = await api.delete(`/supplier-products/${id}`);
            if (response.data.success) {
                toast.success('Producto eliminado');
                fetchSupplierProducts();
            }
        } catch (error: any) {
            console.error('Error deleting product:', error);
            toast.error(error.response?.data?.message || 'Error al eliminar producto');
        }
    };

    const openEditModal = (sp: SupplierProduct) => {
        setEditingProduct(sp);
        setFormData({
            productId: sp.productId._id,
            price: (sp.basePriceCents / 100).toFixed(2),
            stock: sp.availableQuantity.toString(),
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            productId: '',
            price: '',
            stock: '',
        });
        setEditingProduct(null);
    };

    const columns = [
        {
            key: 'name',
            header: 'Producto',
            render: (sp: SupplierProduct) => sp.productId.name
        },
        {
            key: 'category',
            header: 'Categoría',
            render: (sp: SupplierProduct) => sp.productId.category
        },
        {
            key: 'price',
            header: 'Precio',
            render: (sp: SupplierProduct) => `$${(sp.basePriceCents / 100).toFixed(2)}`
        },
        {
            key: 'stock',
            header: 'Stock',
            render: (sp: SupplierProduct) => sp.availableQuantity
        },
        {
            key: 'unit',
            header: 'Unidad',
            render: (sp: SupplierProduct) => sp.productId.unit
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (sp: SupplierProduct) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(sp)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-400 border-red-700 hover:bg-red-900/20" onClick={() => handleDeleteProduct(sp._id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    const getSelectedProductDetails = () => {
        if (editingProduct) return editingProduct.productId;
        return companyProducts.find(p => p._id === formData.productId);
    };

    const selectedProduct = getSelectedProductDetails();

    return (
        <DashboardLayout role="supplier" title="Catálogo de Productos">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Package className="w-6 h-6 mr-2 text-cyan-400" />
                            Mis Productos
                        </div>
                        <Button onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                        }}>
                            <Plus className="w-4 h-4 mr-2" />
                            Vincular Producto
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-gray-400">Cargando productos...</div>
                    ) : (
                        <Table data={supplierProducts} columns={columns} />
                    )}
                </CardContent>
            </Card>

            {/* Product Form Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); resetForm(); }}
                title={editingProduct ? 'Editar Producto' : 'Vincular Producto'}
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSaveProduct}>Guardar</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    {!editingProduct && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">
                                Seleccionar Producto de {supplierData?.companyName}
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full h-10 pl-4 pr-10 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white appearance-none cursor-pointer hover:border-slate-600 transition-colors"
                                    value={formData.productId}
                                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                >
                                    <option value="" className="bg-slate-900 text-gray-400">-- Seleccione un producto --</option>
                                    {companyProducts.map(product => (
                                        <option key={product._id} value={product._id} className="bg-slate-900 text-white py-2">
                                            {product.name} ({product.unit})
                                        </option>
                                    ))}
                                </select>
                                {/* Custom arrow icon */}
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {companyProducts.length === 0 && (
                                <div className="p-3 bg-yellow-900/20 border border-yellow-900/50 rounded-lg text-sm text-yellow-200 flex items-start mt-2">
                                    <span className="mr-2">⚠️</span>
                                    <div>
                                        <p className="font-medium">No se encontraron productos.</p>
                                        <p className="opacity-80 mt-1">Tu empresa ({supplierData?.companyName}) aún no ha registrado productos globales.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {selectedProduct && (
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <h4 className="font-semibold text-white">{selectedProduct.name}</h4>
                            <p className="text-sm text-gray-400">Categoría: {selectedProduct.category}</p>
                            <p className="text-sm text-gray-400">Unidad: {selectedProduct.unit}</p>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Input
                                label="Precio de Venta ($)"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Input
                                label="Stock Disponible"
                                type="number"
                                placeholder="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
