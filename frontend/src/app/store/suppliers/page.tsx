'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Building2, Search, ShoppingCart, Package } from 'lucide-react';

interface Supplier {
    id: number;
    name: string;
    description: string;
    productsCount: number;
    rating: number;
    deliveryTime: string;
}

interface SupplierProduct {
    id: number;
    name: string;
    category: string;
    price: number;
    minOrder: number;
    unit: string;
    available: boolean;
}

export default function SuppliersPage() {
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const suppliers: Supplier[] = [
        { id: 1, name: 'Distribuidora ABC', description: 'Frutas y verduras frescas', productsCount: 45, rating: 4.8, deliveryTime: '24-48h' },
        { id: 2, name: 'Lácteos del Norte', description: 'Productos lácteos de calidad', productsCount: 30, rating: 4.9, deliveryTime: '12-24h' },
        { id: 3, name: 'Carnes Premium', description: 'Carnes frescas y embutidos', productsCount: 25, rating: 4.7, deliveryTime: '24h' },
        { id: 4, name: 'Panadería Central', description: 'Pan y productos de panadería', productsCount: 40, rating: 4.6, deliveryTime: '6-12h' },
    ];

    const supplierProducts: SupplierProduct[] = [
        { id: 1, name: 'Manzanas Rojas Premium', category: 'Frutas', price: 1.50, minOrder: 10, unit: 'kg', available: true },
        { id: 2, name: 'Tomates Orgánicos', category: 'Verduras', price: 2.00, minOrder: 15, unit: 'kg', available: true },
        { id: 3, name: 'Lechuga Fresca', category: 'Verduras', price: 1.20, minOrder: 20, unit: 'unidad', available: true },
        { id: 4, name: 'Naranjas Valencianas', category: 'Frutas', price: 1.80, minOrder: 10, unit: 'kg', available: true },
    ];

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                placeholder="Buscar proveedores..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Suppliers Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSuppliers.map((supplier) => (
                        <Card key={supplier.id} className="hover:border-cyan-500 transition-colors cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Building2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white mb-1">{supplier.name}</h3>
                                        <p className="text-sm text-gray-400">{supplier.description}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Productos</span>
                                        <span className="text-white font-semibold">{supplier.productsCount} items</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Calificación</span>
                                        <span className="text-yellow-400 font-semibold">⭐ {supplier.rating}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Entrega</span>
                                        <span className="text-cyan-400 font-semibold">{supplier.deliveryTime}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full"
                                    onClick={() => setSelectedSupplier(supplier)}
                                >
                                    <Package className="w-4 h-4 mr-2" />
                                    Ver Catálogo
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredSuppliers.length === 0 && (
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
                        <div className="grid md:grid-cols-2 gap-4">
                            {supplierProducts.map((product) => (
                                <div key={product.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
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
                                            <p className="text-sm text-gray-400">Pedido mínimo</p>
                                            <p className="text-white font-semibold">{product.minOrder} {product.unit}</p>
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

                        <div className="border-t border-gray-700 pt-4 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setSelectedSupplier(null)}>
                                Cerrar
                            </Button>
                            <Button>
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
