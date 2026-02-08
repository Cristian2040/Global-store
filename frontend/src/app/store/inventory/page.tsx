'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { AlertTriangle, Package, Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';
import { StoreProduct, Product } from '@/types';

// Extended interface for the form
interface ProductFormData {
    productId: string;
    finalPrice: string;
    availableQuantity: string;
    expiryDate?: string;
}

export default function InventoryPage() {
    const { user, relatedData } = useAuth();
    const [products, setProducts] = useState<StoreProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);

    // Form states
    const [formData, setFormData] = useState<ProductFormData>({
        productId: '',
        finalPrice: '',
        availableQuantity: '',
    });

    // Search global products state
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedGlobalProduct, setSelectedGlobalProduct] = useState<Product | null>(null);

    // Create product state
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [newProductData, setNewProductData] = useState({
        name: '',
        category: '',
        unit: '',
        description: ''
    });

    const fetchProducts = async () => {
        if (!relatedData?._id) return;
        try {
            const response = await api.get(`/api/store-products/store/${relatedData._id}`);
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
            toast.error('Error al cargar el inventario');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [relatedData]);

    const handleSearchGlobalProducts = async (term: string) => {
        setSearchTerm(term);
        if (term.length < 3) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            // Assuming this endpoint exists and returns { data: { products: [] } } or similar
            const response = await api.get(`/api/products?search=${term}&limit=5`);
            if (response.data.success) {
                // The structure is response.data.data based on pagination helper
                setSearchResults(response.data.data || []);
            }
        } catch (error) {
            console.error('Error searching products:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleCreateAndAddProduct = async () => {
        if (!relatedData?._id) return;

        // Validate basic fields
        if (!newProductData.name || !newProductData.category || !newProductData.unit || !formData.finalPrice || !formData.availableQuantity) {
            toast.error('Por favor completa todos los campos obligatorios');
            return;
        }

        try {
            // 1. Create Global Product
            const productResponse = await api.post('/api/products', newProductData);
            if (!productResponse.data.success) {
                throw new Error('Error al crear el producto global');
            }
            const newProductId = productResponse.data.data._id;

            // 2. Add to Store Inventory
            const payload = {
                storeId: relatedData._id,
                productId: newProductId,
                finalPriceCents: Math.round(parseFloat(formData.finalPrice) * 100),
                availableQuantity: parseInt(formData.availableQuantity),
                expiryDate: formData.expiryDate
            };

            const response = await api.post('/api/store-products', payload);
            if (response.data.success) {
                toast.success('Producto creado y agregado al inventario');
                setIsAddModalOpen(false);
                resetForm();
                fetchProducts();
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Error al procesar la solicitud');
        }
    };

    const handleAddProduct = async () => {
        if (!relatedData?._id || !selectedGlobalProduct) return;

        try {
            const payload = {
                storeId: relatedData._id,
                productId: selectedGlobalProduct._id,
                finalPriceCents: Math.round(parseFloat(formData.finalPrice) * 100),
                availableQuantity: parseInt(formData.availableQuantity),
                expiryDate: formData.expiryDate
            };

            const response = await api.post('/api/store-products', payload);
            if (response.data.success) {
                toast.success('Producto agregado al inventario');
                setIsAddModalOpen(false);
                resetForm();
                fetchProducts();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al agregar producto');
        }
    };

    const handleUpdateProduct = async () => {
        if (!selectedProduct) return;

        try {
            const payload = {
                finalPriceCents: Math.round(parseFloat(formData.finalPrice) * 100),
                availableQuantity: parseInt(formData.availableQuantity),
                expiryDate: formData.expiryDate
            };

            const response = await api.put(`/api/store-products/${selectedProduct._id}`, payload);
            if (response.data.success) {
                toast.success('Producto actualizado');
                setIsEditModalOpen(false);
                resetForm();
                fetchProducts();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al actualizar producto');
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este producto del inventario?')) return;

        try {
            const response = await api.delete(`/api/store-products/${id}`);
            if (response.data.success) {
                toast.success('Producto eliminado');
                fetchProducts();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al eliminar producto');
        }
    };

    const openEditModal = (product: StoreProduct) => {
        setSelectedProduct(product);
        setFormData({
            productId: product.productId._id,
            finalPrice: (product.finalPriceCents / 100).toString(),
            availableQuantity: product.availableQuantity.toString(),
            expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : ''
        });
        setIsEditModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            productId: '',
            finalPrice: '',
            availableQuantity: '',
            expiryDate: ''
        });
        setNewProductData({
            name: '',
            category: '',
            unit: '',
            description: ''
        });
        setSearchTerm('');
        setSearchResults([]);
        setSelectedGlobalProduct(null);
        setSelectedProduct(null);
        setIsCreatingNew(false);
    };

    const lowStockItems = products.filter(item => item.availableQuantity < 10); // Assuming 10 is global min stock or fetch from settings

    const columns = [
        {
            key: 'name',
            header: 'Producto',
            render: (item: StoreProduct) => item.productId.name
        },
        {
            key: 'category',
            header: 'Categoría',
            render: (item: StoreProduct) => item.productId.category
        },
        {
            key: 'stock',
            header: 'Stock Actual',
            render: (item: StoreProduct) => (
                <span className={item.availableQuantity < 10 ? 'text-orange-400 font-semibold' : 'text-white'}>
                    {item.availableQuantity} {item.productId.unit}
                </span>
            ),
        },
        {
            key: 'price',
            header: 'Precio',
            render: (item: StoreProduct) => `$${(item.finalPriceCents / 100).toFixed(2)}`
        },
        {
            key: 'status',
            header: 'Estado',
            render: (item: StoreProduct) =>
                item.availableQuantity < 10 ? (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-orange-300 bg-orange-900/50 border border-orange-700 rounded-full">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Stock Bajo
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-green-300 bg-green-900/50 border border-green-700 rounded-full">
                        Normal
                    </span>
                ),
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (item: StoreProduct) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(item)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-400 border-red-700 hover:bg-red-900/20" onClick={() => handleDeleteProduct(item._id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <DashboardLayout role="store" title="Inventario">
            <div className="space-y-6">
                {/* Low Stock Alert */}
                {lowStockItems.length > 0 && (
                    <Card className="border-orange-700 bg-orange-900/20">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <AlertTriangle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">
                                        ⚠️ {lowStockItems.length} Producto{lowStockItems.length > 1 ? 's' : ''} con Stock Bajo
                                    </h3>
                                    <p className="text-orange-200 mb-3">
                                        Los siguientes productos necesitan reabastecimiento urgente:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {lowStockItems.map(item => (
                                            <span key={item._id} className="px-3 py-1 bg-orange-800 text-orange-100 rounded-full text-sm">
                                                {item.productId.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Inventory Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Package className="w-6 h-6 mr-2 text-cyan-400" />
                                Inventario Completo
                            </div>
                            <Button onClick={() => setIsAddModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar Producto
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8 text-gray-400">Cargando inventario...</div>
                        ) : (
                            <Table data={products} columns={columns} />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Add Product Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => { setIsAddModalOpen(false); resetForm(); }}
                title="Agregar Nuevo Producto al Inventario"
                size={isCreatingNew ? 'xl' : undefined}
            >
                <div className="space-y-4">
                    {/* Toggle between Search and Create */}
                    {!selectedGlobalProduct && !isCreatingNew && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Buscar Producto Global</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        placeholder="Escribe para buscar (ej. Manzanas)..."
                                        className="pl-9"
                                        value={searchTerm}
                                        onChange={(e) => handleSearchGlobalProducts(e.target.value)}
                                    />
                                </div>
                                {isSearching && <div className="text-sm text-gray-400">Buscando...</div>}
                                <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                                    {searchResults.map(product => (
                                        <div
                                            key={product._id}
                                            className="p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors flex justify-between items-center"
                                            onClick={() => setSelectedGlobalProduct(product)}
                                        >
                                            <div>
                                                <p className="font-semibold text-white">{product.name}</p>
                                                <p className="text-sm text-gray-400">{product.category} • {product.unit}</p>
                                            </div>
                                            <Plus className="w-4 h-4 text-cyan-400" />
                                        </div>
                                    ))}
                                    {searchResults.length === 0 && searchTerm.length >= 3 && !isSearching && (
                                        <div className="text-center py-4 text-gray-400">
                                            No se encontraron productos.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-700">
                                <p className="text-sm text-gray-400 mb-3">¿No encuentras el producto que buscas?</p>
                                <Button variant="outline" className="w-full" onClick={() => setIsCreatingNew(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Crear Nuevo Producto en la Plataforma
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Create New Product Form */}
                    {isCreatingNew && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">Detalles del Producto</h3>
                                <Button size="sm" variant="ghost" onClick={() => setIsCreatingNew(false)}>
                                    Volver al buscador
                                </Button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <Input
                                        label="Nombre del Producto"
                                        placeholder="ej. Pan Integral Artesanal"
                                        value={newProductData.name}
                                        onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Categoría (Escríbela)"
                                        placeholder="ej. Panadería"
                                        value={newProductData.category}
                                        onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Unidad de Medida"
                                        placeholder="ej. pza, kg, lt"
                                        value={newProductData.unit}
                                        onChange={(e) => setNewProductData({ ...newProductData, unit: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Input
                                        label="Precio de Venta ($)"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.finalPrice}
                                        onChange={(e) => setFormData({ ...formData, finalPrice: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Cantidad Inicial"
                                        type="number"
                                        placeholder="0"
                                        value={formData.availableQuantity}
                                        onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Fecha de Caducidad (Opcional)"
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Input
                                label="Descripción (Opcional)"
                                placeholder="Detalles adicionales del producto..."
                                value={newProductData.description}
                                onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })}
                            />

                            <div className="pt-4 flex justify-end gap-2">
                                <Button variant="outline" onClick={() => { setIsCreatingNew(false); resetForm(); }}>Cancelar</Button>
                                <Button onClick={handleCreateAndAddProduct}>Crear y Agregar</Button>
                            </div>
                        </div>
                    )}

                    {/* Add Existing Product Details Form */}
                    {selectedGlobalProduct && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-cyan-900/20 border border-cyan-800 rounded-lg">
                                <div>
                                    <p className="font-bold text-white">{selectedGlobalProduct.name}</p>
                                    <p className="text-sm text-cyan-300">{selectedGlobalProduct.category}</p>
                                </div>
                                <Button size="sm" variant="ghost" onClick={() => setSelectedGlobalProduct(null)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <Input
                                label="Precio de Venta ($)"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.finalPrice}
                                onChange={(e) => setFormData({ ...formData, finalPrice: e.target.value })}
                            />
                            <Input
                                label="Cantidad Inicial"
                                type="number"
                                placeholder="0"
                                value={formData.availableQuantity}
                                onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                            />
                            <Input
                                label="Fecha de Caducidad (Opcional)"
                                type="date"
                                value={formData.expiryDate}
                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                            />

                            <div className="pt-4 flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
                                <Button onClick={handleAddProduct}>Guardar Producto</Button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Edit Product Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); resetForm(); }}
                title="Editar Producto del Inventario"
            >
                <div className="space-y-4">
                    {selectedProduct && (
                        <>
                            <div className="p-3 bg-gray-800 rounded-lg mb-4">
                                <p className="font-bold text-white">{selectedProduct.productId.name}</p>
                                <p className="text-sm text-gray-400">{selectedProduct.productId.category}</p>
                            </div>

                            <Input
                                label="Precio de Venta ($)"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.finalPrice}
                                onChange={(e) => setFormData({ ...formData, finalPrice: e.target.value })}
                            />
                            <Input
                                label="Cantidad Disponible"
                                type="number"
                                placeholder="0"
                                value={formData.availableQuantity}
                                onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                            />
                            <Input
                                label="Fecha de Caducidad (Opcional)"
                                type="date"
                                value={formData.expiryDate}
                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                            />

                            <div className="pt-4 flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                                <Button onClick={handleUpdateProduct}>Actualizar Producto</Button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </DashboardLayout>
    );
}
