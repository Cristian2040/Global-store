'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Package, Plus, Search, Edit, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Product } from '@/types';
import Image from 'next/image';

export default function CompanyProductsPage() {
    const { user, relatedData } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const companyName = (relatedData as any)?.companyName;

    const fetchProducts = useCallback(async () => {
        if (!companyName) return;

        try {
            setLoading(true);
            // Fetch products filtered by this company
            const response = await api.get('/products', {
                params: {
                    company: companyName,
                    search: searchTerm
                }
            });

            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (error: any) {
            console.error('Error fetching products:', error);
            toast.error('Error al cargar productos');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [companyName, searchTerm]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts();
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

        try {
            await api.delete(`/products/${productId}`);
            toast.success('Producto eliminado correctamente');
            fetchProducts();
        } catch (error: any) {
            console.error('Error deleting product:', error);
            toast.error('Error al eliminar producto');
        }
    };

    const columns = [
        {
            key: 'image',
            header: 'Imagen',
            render: (product: Product) => (
                <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-800">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <Package className="w-6 h-6" />
                        </div>
                    )}
                </div>
            )
        },
        { key: 'name', header: 'Nombre' },
        { key: 'category', header: 'Categoría' },
        {
            key: 'barcode',
            header: 'Código de Barras',
            render: (product: Product) => product.barcode || 'N/A'
        },
        {
            key: 'unit',
            header: 'Unidad',
            render: (product: Product) => product.unit || 'Unidad'
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (product: Product) => (
                <div className="flex gap-2">
                    <Link href={`/company/products/${product._id}`}>
                        <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20">
                            <Edit className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => handleDelete(product._id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    if (!companyName && !loading) {
        return (
            <div className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Error de Perfil</h2>
                <p className="text-gray-400">No se pudo identificar tu empresa. Por favor contacta a soporte.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Package className="w-8 h-8 text-cyan-500" />
                        Catálogo Global
                    </h1>
                    <p className="text-gray-400">Gestiona los productos de tu marca visibles para todos los proveedores</p>
                </div>
                <Link href="/company/products/new">
                    <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
                        <Plus className="w-5 h-5 mr-2" />
                        Nuevo Producto
                    </Button>
                </Link>
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <form onSubmit={handleSearch} className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Buscar por nombre o código..."
                                className="pl-10 bg-gray-900 border-gray-700 focus:border-cyan-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                        <Button
                            variant="outline"
                            onClick={() => { setRefreshing(true); fetchProducts(); }}
                            disabled={refreshing}
                            className="border-gray-600 hover:bg-gray-700"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            Actualizar
                        </Button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                        </div>
                    ) : products.length > 0 ? (
                        <Table data={products} columns={columns} />
                    ) : (
                        <div className="text-center py-12 px-4 rounded-lg border-2 border-dashed border-gray-700">
                            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-white mb-2">No hay productos registrados</h3>
                            <p className="text-gray-400 mb-6">Comienza agregando los productos de tu marca al catálogo global.</p>
                            <Link href="/company/products/new">
                                <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-950">
                                    Registrar Primer Producto
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
