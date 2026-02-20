'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Building2, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Supplier } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function SupplierSettingsPage() {
    const { user, relatedData } = useAuth();
    // Safe cast since we are in a supplier protected route/layout
    const supplierData = user?.role === 'supplier' ? (relatedData as Supplier) : null;
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        street: '',
        city: '', // mapping to municipality or state depending on preference, let's use municipality
        country: '',
        description: '', // Note: Description is not in Supplier interface but was in the UI. Checked interface, it is NOT in Supplier. Excluding for now or adding if backend supports it.
        // Actually, looking at types, Company has description, Supplier doesn't explicitly have it in the Interface but likely in Schema?
        // Let's check Schema... userValidators says description is usually strictly for Store/Company.
        // Let's stick to valid fields: name, companyName, email, phone, address.
    });

    useEffect(() => {
        if (supplierData) {
            setFormData({
                name: supplierData.name || '',
                companyName: supplierData.companyName || '',
                email: supplierData.email || '',
                phone: supplierData.phone || '',
                street: supplierData.address?.street || '',
                city: supplierData.address?.municipality || '',
                country: supplierData.address?.country || '',
                description: '', // Placeholder as it's not in the interface
            });
        }
    }, [supplierData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supplierData?._id) return;

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                companyName: formData.companyName,
                email: formData.email,
                phone: formData.phone,
                address: {
                    street: formData.street,
                    municipality: formData.city,
                    country: formData.country
                }
            };

            const response = await api.put(`/suppliers/${supplierData._id}`, payload);

            if (response.data.success) {
                toast.success('Configuración actualizada exitosamente');
            }
        } catch (error: any) {
            console.error('Error updating settings:', error);
            toast.error(error.response?.data?.message || 'Error al actualizar la configuración');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="supplier" title="Configuración de Proveedor">
            <div className="max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Building2 className="w-6 h-6 mr-2 text-cyan-400" />
                            Información de la Empresa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Nombre del Contacto
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Nombre de la Empresa (Representada)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        disabled // Usually shouldn't change this easily as it links to Company
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Dirección (Calle y Número)
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={formData.street}
                                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Ciudad
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Teléfono
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button variant="outline" type="button" onClick={() => window.location.reload()}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
