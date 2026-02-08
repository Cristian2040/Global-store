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
    _id: string;
    name: string;
    companyName: string;
    email: string;
    phone: string;
    categories: string[];
    route?: {
        street?: string;
        neighborhood?: string;
        municipality?: string;
        state?: string;
        country?: string;
    };
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
    image?: string;
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
    const [activeTab, setActiveTab] = useState<'info' | 'products'>('info');

    // Fetch supplier products when a supplier is selected
    useEffect(() => {
        if (selectedSupplier?._id) {
            setActiveTab('info'); // Reset to info tab on open
            const fetchProducts = async () => {
                setLoadingProducts(true);
                try {
                    // ... (rest of fetch logic)
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

            {/* Supplier Details Modal */}
            <Modal
                isOpen={!!selectedSupplier}
                onClose={() => setSelectedSupplier(null)}
                title={selectedSupplier ? `Detalles de ${selectedSupplier.name}` : 'Detalles del Proveedor'}
                size="xl"
            >
                {selectedSupplier && (
                    <div className="space-y-6">
                        {/* Tabs */}
                        <div className="flex space-x-4 border-b border-gray-700 pb-2">
                            <button
                                className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'info'
                                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                                onClick={() => setActiveTab('info')}
                            >
                                Información General
                            </button>
                            <button
                                className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'products'
                                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                                onClick={() => setActiveTab('products')}
                            >
                                Catálogo de Productos
                            </button>
                        </div>

                        {/* Content */}
                        {activeTab === 'info' && (
                            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-400">Nombre del Encargado</h4>
                                            <p className="text-lg text-white font-semibold">{selectedSupplier.name}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-400">Empresa</h4>
                                            <p className="text-lg text-white font-semibold flex items-center">
                                                <Building2 className="w-4 h-4 mr-2 text-cyan-400" />
                                                {selectedSupplier.companyName}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-400">Categorías</h4>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {selectedSupplier.categories?.length > 0 ? (
                                                    selectedSupplier.categories.map((cat: string, i: number) => (
                                                        <span key={i} className="px-2 py-1 text-xs bg-gray-800 text-cyan-300 rounded-full border border-gray-700">
                                                            {cat}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 italic">Sin categorías</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-400">Información de Contacto</h4>
                                            <div className="mt-2 space-y-2">
                                                <p className="text-gray-300 flex items-center">
                                                    <span className="w-20 text-gray-500 text-xs uppercase">Email:</span>
                                                    {selectedSupplier.email}
                                                </p>
                                                <p className="text-gray-300 flex items-center">
                                                    <span className="w-20 text-gray-500 text-xs uppercase">Teléfono:</span>
                                                    {selectedSupplier.phone}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-400">Ubicación / Ruta</h4>
                                            <p className="text-gray-300 mt-1">
                                                {(() => {
                                                    const route = selectedSupplier.route;
                                                    if (!route) return 'Dirección no disponible';
                                                    const parts = [route.street, route.neighborhood, route.municipality, route.state, route.country];
                                                    return parts.filter(Boolean).join(', ');
                                                })()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button onClick={() => setActiveTab('products')}>
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Ver Productos Disponibles
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'products' && (
                            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                                {loadingProducts ? (
                                    <div className="text-center py-8">Cargando productos...</div>
                                ) : supplierProducts.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-800/50 rounded-lg">
                                        <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                        <p className="text-gray-400">Este proveedor no tiene productos disponibles actualmente.</p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                                        {supplierProducts.map((product) => (
                                            <div key={product._id} className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                                                <div className="flex gap-4">
                                                    <div className="w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
                                                        {product.image ? (
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                                <Package className="w-8 h-8 opacity-50" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <h4 className="text-white font-semibold line-clamp-1">{product.name}</h4>
                                                                <p className="text-sm text-gray-400">{product.category}</p>
                                                            </div>
                                                            {product.available ? (
                                                                <span className="px-2 py-1 text-xs font-semibold text-green-300 bg-green-900/50 border border-green-700 rounded-full whitespace-nowrap">
                                                                    Disponible
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-1 text-xs font-semibold text-gray-400 bg-gray-800 border border-gray-700 rounded-full whitespace-nowrap">
                                                                    Agotado
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center justify-between mb-3 mt-2">
                                                            <div>
                                                                <p className="text-2xl font-bold text-cyan-400">
                                                                    ${product.price ? product.price.toFixed(2) : '0.00'}
                                                                </p>
                                                                <p className="text-xs text-gray-500">por {product.unit}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm text-gray-400">Stock</p>
                                                                <p className="text-white font-semibold">{product.availableQuantity}</p>
                                                            </div>
                                                        </div>

                                                        <Button
                                                            size="sm"
                                                            className="w-full"
                                                            disabled={!product.available}
                                                        >
                                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                                            Agregar
                                                        </Button>
                                                    </div>
                                                </div>
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
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
}
