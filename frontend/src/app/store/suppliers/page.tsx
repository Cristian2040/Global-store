'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Building2, Search, ShoppingCart, Package } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Supplier {
    id: number;
    name: string;
    description: string;
    productsCount: number;
    rating: number;
    deliveryTime: string;
}

interface SupplierProduct {
    _id: string;
    productId: string;
    name: string;
    category: string;
    price: number;
    minOrder: number;
    unit: string;
    available: boolean;
    availableQuantity: number;
}

export default function SuppliersPage() {
    const { user } = useAuth();
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch suppliers on mount and when search changes (with debounce ideally, but effect dep is simple for now)
    useEffect(() => {
        const fetchSuppliers = async () => {
            setLoading(true);
            try {
                // Use a query param for search if it exists
                const endpoint = searchQuery
                    ? `/suppliers?search=${encodeURIComponent(searchQuery)}`
                    : '/suppliers';

                const response = await api.get(endpoint);
                if (response.data.success) {
                    // data.data is the array from paginated response? 
                    // Wait, controller returns paginated response: { suppliers, pagination }
                    // So response.data.data.suppliers is the array if using 'paginated' helper?
                    // Let's check controller. 
                    // Controller calls: paginated(res, result.suppliers, result.pagination, ...)
                    // responseHandler.paginated structure: { success: true, message: ..., data: { docs: [], ... } } OR similar?
                    // Let's assume standard structure: data: { docs: suppliers, ... } or just data: suppliers if plain?
                    // Actually, let's look at `paginated` helper generally used here.
                    // Usually it returns `data: { docs: [...], page: ... }` or `data: [...]`.
                    // The service returns `{ suppliers, pagination }`.
                    // The controller passes `result.suppliers` as first arg to `paginated`.
                    // Let's assume response.data.data IS the array based on typical usage, 
                    // OR response.data.data.docs. 
                    // Check previous successful fetch in other files? 
                    // Let's just log and see, or handle both.
                    // For now, let's assume response.data.data is the list or try to destructure.

                    // Actually, looking at previous artifacts/logs, `paginated` usually wraps it. 
                    // If I look at `StoreService.getAll` it returns { stores, pagination }.
                    // StoreController uses `paginated(res, result.stores, ...)`
                    // If standard `paginated` is used, the response.data.data might be the array directly? 
                    // No, usually paginated returns an object with `docs` or `items`.
                    // To be safe: 
                    const data = response.data.data;
                    if (Array.isArray(data)) {
                        setSuppliers(data);
                    } else if (data && Array.isArray(data.suppliers)) {
                        setSuppliers(data.suppliers);
                    } else if (data && Array.isArray(data.docs)) {
                        setSuppliers(data.docs);
                    } else {
                        setSuppliers([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchSuppliers();
        }, 500); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const [supplierProducts, setSupplierProducts] = useState<SupplierProduct[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // Fetch supplier products when a supplier is selected
    useEffect(() => {
        if (selectedSupplier?._id) {
            const fetchProducts = async () => {
                setLoadingProducts(true);
                try {
                    const response = await api.get(`/suppliers/${selectedSupplier._id}/products`);
                    if (response.data.success) {
                        setSupplierProducts(response.data.data);
                    }
                } catch (error) {
                    console.error('Error fetching supplier products:', error);
                    setSupplierProducts([]);
                } finally {
                    setLoadingProducts(false);
                }
            };
            fetchProducts();
        } else {
            setSupplierProducts([]);
        }
    }, [selectedSupplier]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <DashboardLayout role="store" title="Catálogo de Proveedores">
            <div className="space-y-6">
                {/* Search Bar */}
                <Card>
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Buscar por nombre, empresa o ID..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Suppliers Grid */}
                {loading ? (
                    <div className="text-center py-12">Cargando proveedores...</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {suppliers.map((supplier) => (
                            <Card key={supplier._id} className="hover:border-cyan-500 transition-colors cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Building2 className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white mb-1">{supplier.name}</h3>
                                            <p className="text-sm text-gray-400">{supplier.companyName}</p>
                                            <p className="text-xs text-gray-500 mt-1">ID: {supplier._id}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        {/* Placeholder stats since they are not in backend yet */}
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">Categorías</span>
                                            <span className="text-white font-semibold flex flex-wrap gap-1 justify-end">
                                                {supplier.categories?.length > 0
                                                    ? supplier.categories.slice(0, 2).join(', ') + (supplier.categories.length > 2 ? '...' : '')
                                                    : 'General'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">Teléfono</span>
                                            <span className="text-gray-200 font-semibold">{supplier.phone}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">Email</span>
                                            <span className="text-gray-200 font-semibold truncate max-w-[150px]" title={supplier.email}>{supplier.email}</span>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full"
                                        onClick={() => setSelectedSupplier(supplier)}
                                    >
                                        <Package className="w-4 h-4 mr-2" />
                                        Ver Detalles
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {!loading && suppliers.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No se encontraron proveedores</h3>
                            <p className="text-gray-400">Intenta con otra búsqueda</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Supplier Products Modal */}
            <Modal
                isOpen={!!selectedSupplier}
                onClose={() => setSelectedSupplier(null)}
                title={`Catálogo de ${selectedSupplier?.name}`}
                size="xl"
            >
                {selectedSupplier && (
                    <div className="space-y-4">
                        {loadingProducts ? (
                            <div className="text-center py-8">Cargando productos...</div>
                        ) : supplierProducts.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                Este proveedor no tiene productos disponibles.
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {supplierProducts.map((product) => (
                                    <div key={product._id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="text-white font-semibold">{product.name}</h4>
                                                <p className="text-sm text-gray-400">{product.category}</p>
                                            </div>
                                            {product.available ? (
                                                <span className="px-2 py-1 text-xs font-semibold text-green-300 bg-green-900/50 border border-green-700 rounded-full">
                                                    Disponible
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-semibold text-gray-400 bg-gray-800 border border-gray-700 rounded-full">
                                                    Agotado
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <p className="text-2xl font-bold text-cyan-400">
                                                    ${product.price.toFixed(2)}
                                                </p>
                                                <p className="text-xs text-gray-500">por {product.unit}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-400">Disponibles</p>
                                                <p className="text-white font-semibold">{product.availableQuantity}</p>
                                            </div>
                                        </div>

                                        <Button
                                            size="sm"
                                            className="w-full"
                                            disabled={!product.available}
                                        >
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            Agregar al Pedido
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="border-t border-gray-700 pt-4 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setSelectedSupplier(null)}>
                                Cerrar
                            </Button>
                            <Button disabled={supplierProducts.length === 0}>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Crear Pedido
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
}
