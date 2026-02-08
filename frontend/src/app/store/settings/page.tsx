'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Store, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Store as StoreType } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function StoreSettingsPage() {
    const { user, relatedData } = useAuth();
    const storeData = user?.role === 'store' ? (relatedData as StoreType) : null;
    const [loading, setLoading] = useState(false);

    const [deliveryOptions, setDeliveryOptions] = useState({
        pickupEnabled: true,
        deliveryEnabled: false
    });

    const [paymentMethods, setPaymentMethods] = useState<{ method: string, enabled: boolean, label: string }[]>([
        { method: 'CASH', enabled: false, label: 'Efectivo' },
        { method: 'CARD', enabled: false, label: 'Tarjeta de Crédito/Débito' },
        { method: 'TRANSFER', enabled: false, label: 'Transferencia Bancaria' }
    ]);

    const [formData, setFormData] = useState({
        name: '',
        ownerName: '',
        description: '',
        address: '',
        city: '',
        phone: '',
        email: '',
        openTime: '08:00',
        closeTime: '20:00',
    });

    useEffect(() => {
        if (storeData) {
            // Parse schedule if exists (format expected: "HH:mm - HH:mm")
            let open = '08:00';
            let close = '20:00';
            if (storeData.schedule && storeData.schedule.includes('-')) {
                const parts = storeData.schedule.split('-').map(s => s.trim());
                if (parts.length === 2) {
                    open = parts[0];
                    close = parts[1];
                }
            }

            setFormData({
                name: storeData.storeName || '',
                ownerName: storeData.ownerName || '',
                description: storeData.description || '',
                address: storeData.address?.street || '',
                city: storeData.address?.municipality || '',
                phone: storeData.phone || '', // Now using the field added to backend
                email: user?.email || '', // User email, read-only usually
                openTime: open,
                closeTime: close,
            });

            // Initialize Delivery Options
            if (storeData.orderOptions) {
                setDeliveryOptions({
                    pickupEnabled: storeData.orderOptions.pickupEnabled ?? true,
                    deliveryEnabled: storeData.orderOptions.deliveryEnabled ?? false
                });
            }

            // Initialize Payment Methods
            if (storeData.paymentMethods && storeData.paymentMethods.length > 0) {
                const currentMethods = storeData.paymentMethods;
                const newMethods = [
                    { method: 'CASH', label: 'Efectivo', enabled: currentMethods.find(m => m.method === 'CASH')?.enabled ?? false },
                    { method: 'CARD', label: 'Tarjeta de Crédito/Débito', enabled: currentMethods.find(m => m.method === 'CARD')?.enabled ?? false },
                    { method: 'TRANSFER', label: 'Transferencia Bancaria', enabled: currentMethods.find(m => m.method === 'TRANSFER')?.enabled ?? false },
                ];
                setPaymentMethods(newMethods);
            }
        }
    }, [storeData, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!storeData?._id) return;

        setLoading(true);
        try {
            const payload: any = {
                storeName: formData.name,
                ownerName: formData.ownerName,
                // Only send description if it's not empty, or send empty string if that's intended
                description: formData.description,
                phone: formData.phone,
                schedule: `${formData.openTime} - ${formData.closeTime}`
            };

            // Only include address if there is at least some data, otherwise it might be better to skip it
            // or send it with empty strings since we now allow them.
            // But to be cleaner, let's checking if we have valid address data or if we are just clearing it.
            // Given the user removed the inputs, they probably don't want to change address at all?
            // No, the user said "remove fields that have nothing", implying they were empty/useless.
            // Sending them as empty strings is fine now that backend allows it.

            if (formData.address || formData.city || storeData.address) {
                payload.address = {
                    street: formData.address,
                    municipality: formData.city,
                    country: storeData.address?.country || '',
                    state: storeData.address?.state || '',
                    neighborhood: storeData.address?.neighborhood || '',
                    number: storeData.address?.number || ''
                };
            }

            const response = await api.put(`/stores/${storeData._id}`, payload);

            if (response.data.success) {
                toast.success('Información básica y horario actualizados');

                // Update local storage to reflect changes immediately on reload
                if (response.data.data) {
                    localStorage.setItem('relatedData', JSON.stringify(response.data.data));
                }

                // Reload to update AuthContext
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error: any) {
            console.error('Error updating settings:', error);
            toast.error(error.response?.data?.message || 'Error al actualizar la configuración');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDelivery = async () => {
        if (!storeData?._id) return;
        setLoading(true);
        try {
            const payload = {
                pickupEnabled: deliveryOptions.pickupEnabled,
                deliveryEnabled: deliveryOptions.deliveryEnabled,
                // Pass existing config to avoid overwriting with nulls if backend logic requires it,
                // but based on validator, we can send just the flags + deliveryConfig object.
                // Validator expects deliveryConfig object. Let's send a basic one if missing.
                deliveryConfig: storeData.orderOptions?.deliveryConfig || {}
            };

            const response = await api.put(`/stores/${storeData._id}/order-options`, payload);
            if (response.data.success) {
                toast.success('Opciones de entrega actualizadas');
                if (response.data.data) {
                    localStorage.setItem('relatedData', JSON.stringify(response.data.data));
                    setTimeout(() => window.location.reload(), 1000);
                }
            }
        } catch (error: any) {
            console.error('Error updating delivery options:', error);
            toast.error('Error al actualizar opciones de entrega');
        } finally {
            setLoading(false);
        }
    };

    const handleSavePayment = async () => {
        if (!storeData?._id) return;
        setLoading(true);
        try {
            const payload = {
                paymentMethods: paymentMethods.map(pm => ({
                    method: pm.method,
                    enabled: pm.enabled,
                    label: pm.label
                }))
            };

            const response = await api.put(`/stores/${storeData._id}/payment-methods`, payload);
            if (response.data.success) {
                toast.success('Métodos de pago actualizados');
                if (response.data.data) {
                    localStorage.setItem('relatedData', JSON.stringify(response.data.data));
                    setTimeout(() => window.location.reload(), 1000);
                }
            }
        } catch (error: any) {
            console.error('Error updating payment methods:', error);
            toast.error('Error al actualizar métodos de pago');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="store" title="Configuración de Tienda">
            <div className="max-w-4xl space-y-6">
                {/* Store Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Store className="w-6 h-6 mr-2 text-cyan-400" />
                            Información de la Tienda
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Nombre de la Tienda
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
                                        Nombre del Propietario
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ownerName}
                                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
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
                                            disabled
                                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Business Hours */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Clock className="w-6 h-6 mr-2 text-cyan-400" />
                            Horario de Atención
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Hora de Apertura
                                </label>
                                <input
                                    type="time"
                                    value={formData.openTime}
                                    onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Hora de Cierre
                                </label>
                                <input
                                    type="time"
                                    value={formData.closeTime}
                                    onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button onClick={handleSubmit} disabled={loading}>
                                {loading ? 'Actualizar Todo' : 'Actualizar Horario y Datos'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Delivery Options */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Store className="w-6 h-6 mr-2 text-cyan-400" />
                            Métodos de Entrega
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-white">Retiro en Tienda (Pickup)</h4>
                                    <p className="text-sm text-gray-400">Permitir que los clientes recojan sus pedidos.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={deliveryOptions.pickupEnabled}
                                        onChange={(e) => setDeliveryOptions({ ...deliveryOptions, pickupEnabled: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-white">Entrega a Domicilio</h4>
                                    <p className="text-sm text-gray-400">Ofrecer servicio de entrega a tus clientes.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={deliveryOptions.deliveryEnabled}
                                        onChange={(e) => setDeliveryOptions({ ...deliveryOptions, deliveryEnabled: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                </label>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <Button onClick={handleSaveDelivery} disabled={loading} variant="secondary">
                                    Guardar Opciones de Entrega
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Store className="w-6 h-6 mr-2 text-cyan-400" />
                            Métodos de Pago
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {paymentMethods.map((pm, index) => (
                                <div key={pm.method} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-white">{pm.label}</h4>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={pm.enabled}
                                            onChange={(e) => {
                                                const newMethods = [...paymentMethods];
                                                newMethods[index].enabled = e.target.checked;
                                                setPaymentMethods(newMethods);
                                            }}
                                        />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                    </label>
                                </div>
                            ))}

                            <div className="mt-4 flex justify-end">
                                <Button onClick={handleSavePayment} disabled={loading} variant="secondary">
                                    Guardar Métodos de Pago
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </DashboardLayout>
    );
}
