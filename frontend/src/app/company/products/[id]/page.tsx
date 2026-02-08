'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { ArrowLeft, Save, Package, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import Link from 'next/link';

export default function EditGlobalProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        unit: '',
        barcode: '',
        image: '',
        description: ''
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${productId}`);
                if (response.data.success) {
                    const product = response.data.data;
                    setFormData({
                        name: product.name,
                        category: product.category || '',
                        unit: product.unit || '',
                        barcode: product.barcode || '',
                        image: product.image || '',
                        description: product.description || ''
                    });
                }
            } catch (error: any) {
                console.error('Error fetching product:', error);
                toast.error('Error al cargar el producto');
                router.push('/company/products');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (!formData.name || !formData.category || !formData.unit) {
                toast.error('Por favor completa los campos obligatorios');
                return;
            }

            const response = await api.put(`/products/${productId}`, formData);

            if (response.data.success) {
                toast.success('Producto actualizado exitosamente');
                router.push('/company/products');
            }
        } catch (error: any) {
            console.error('Error updating product:', error);
            const message = error.response?.data?.message || 'Error al actualizar producto';
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/company/products">
                    <Button variant="ghost" className="text-gray-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Volver
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Package className="w-6 h-6 text-cyan-500" />
                        Editar Producto
                    </h1>
                    <p className="text-gray-400 text-sm">Actualiza la información de tu producto global</p>
                </div>
            </div>

            <Card className="max-w-2xl mx-auto bg-gray-800/50 border-gray-700">
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-300">Nombre del Producto *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ej. Coca-Cola 355ml"
                                    className="bg-gray-900 border-gray-700 focus:border-cyan-500"
                                    required
                                />
                            </div>

                            {/* Category & Unit */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-gray-300">Categoría *</Label>
                                    <Input
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="Ej. Bebidas"
                                        className="bg-gray-900 border-gray-700 focus:border-cyan-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="unit" className="text-gray-300">Unidad *</Label>
                                    <Input
                                        id="unit"
                                        name="unit"
                                        value={formData.unit}
                                        onChange={handleChange}
                                        placeholder="Ej. Lata, Botella, Paquete"
                                        className="bg-gray-900 border-gray-700 focus:border-cyan-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Barcode */}
                            <div className="space-y-2">
                                <Label htmlFor="barcode" className="text-gray-300">Código de Barras (Opcional)</Label>
                                <Input
                                    id="barcode"
                                    name="barcode"
                                    value={formData.barcode}
                                    onChange={handleChange}
                                    placeholder="Escanea o ingresa el código"
                                    className="bg-gray-900 border-gray-700 focus:border-cyan-500"
                                />
                            </div>

                            {/* Image URL */}
                            <div className="space-y-2">
                                <Label htmlFor="image" className="text-gray-300">URL de Imagen (Opcional)</Label>
                                <Input
                                    id="image"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    className="bg-gray-900 border-gray-700 focus:border-cyan-500"
                                />
                                {formData.image && (
                                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                                        <div className="w-8 h-8 relative rounded overflow-hidden bg-gray-700">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                        <span>Vista previa</span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-gray-300">Descripción (Opcional)</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Detalles adicionales del producto..."
                                    className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                                isLoading={saving}
                            >
                                <Save className="w-5 h-5 mr-2" />
                                Actualizar Producto
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
