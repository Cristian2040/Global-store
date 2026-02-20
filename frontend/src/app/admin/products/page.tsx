'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Package, Trash2, Tag, Building2, Eye } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface ProductData {
    _id: string;
    name: string;
    category: string;
    company: string;
    unit: string;
    barcode: string;
    image?: string;
    createdAt: string;
}

export default function ProductsManagementPage() {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [companies, setCompanies] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes, companiesRes] = await Promise.all([
                api.get('/products'),
                api.get('/products/categories'),
                api.get('/products/companies')
            ]);

            setProducts(productsRes.data.data);
            setTotalProducts(productsRes.data.pagination.total);
            setCategories(categoriesRes.data.data);
            setCompanies(companiesRes.data.data);
        } catch (error) {
            console.error('Error fetching product data:', error);
            toast.error('Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de eliminar el producto "${name}"? Esto podría afectar a las tiendas que lo tienen en inventario.`)) {
            return;
        }

        try {
            await api.delete(`/products/${id}`);
            toast.success(`Producto ${name} eliminado correctamente`);
            fetchData();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Error al eliminar producto');
        }
    };

    const columns = [
        {
            key: 'image',
            header: 'Imagen',
            render: (product: ProductData) => (
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                    {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <Package className="w-5 h-5 text-gray-500" />
                    )}
                </div>
            )
        },
        { key: 'name', header: 'Producto' },
        {
            key: 'category',
            header: 'Categoría',
            render: (product: ProductData) => (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-900/30 text-blue-400 rounded-md">
                    {product.category || 'Sin categoría'}
                </span>
            )
        },
        {
            key: 'company',
            header: 'Empresa / Marca',
            render: (product: ProductData) => (
                <div className="flex items-center text-sm text-gray-300">
                    <Building2 className="w-3 h-3 mr-1 text-gray-500" />
                    {product.company || 'N/A'}
                </div>
            )
        },
        { key: 'unit', header: 'Unidad' },
        {
            key: 'createdAt',
            header: 'Creado',
            render: (product: ProductData) => new Date(product.createdAt).toLocaleDateString()
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (product: ProductData) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-red-400 border-red-700 hover:bg-red-900/20 p-2 h-8 w-8"
                        onClick={() => handleDelete(product._id, product.name)}
                        title="Eliminar del catálogo global"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <DashboardLayout role="admin" title="Gestión de Productos (Catálogo Global)">
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Total Productos</p>
                                    <p className="text-3xl font-bold text-white">{totalProducts}</p>
                                </div>
                                <Package className="w-8 h-8 text-cyan-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Categorías</p>
                                    <p className="text-3xl font-bold text-blue-400">{categories.length}</p>
                                </div>
                                <Tag className="w-8 h-8 text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Marcas / Empresas</p>
                                    <p className="text-3xl font-bold text-purple-400">{companies.length}</p>
                                </div>
                                <Building2 className="w-8 h-8 text-purple-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Products Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Package className="w-6 h-6 mr-2 text-cyan-400" />
                            Catálogo de Productos Globales
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8 text-gray-400">Cargando catálogo...</div>
                        ) : (
                            <Table data={products} columns={columns} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
