'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Store, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function StoreSettingsPage() {
    const [formData, setFormData] = useState({
        name: 'Mi Tienda Local',
        description: 'Productos frescos y de calidad para toda la familia',
        address: 'Calle Principal 123',
        city: 'Ciudad',
        phone: '+1 234 567 8900',
        email: 'tienda@example.com',
        openTime: '08:00',
        closeTime: '20:00',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Store settings updated:', formData);
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
                                        Descripción
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Dirección
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                                <Button variant="outline" type="button">
                                    Cancelar
                                </Button>
                                <Button type="submit">
                                    Guardar Cambios
                                </Button>
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
                            <Button>Actualizar Horario</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
