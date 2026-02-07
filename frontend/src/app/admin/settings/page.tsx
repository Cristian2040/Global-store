'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Settings, DollarSign, Mail } from 'lucide-react';

export default function AdminSettingsPage() {
    const [formData, setFormData] = useState({
        platformName: 'GlobalStore',
        commissionRate: '5',
        taxRate: '15',
        supportEmail: 'support@globalstore.com',
        minOrderAmount: '10',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('System settings updated:', formData);
    };

    return (
        <DashboardLayout role="admin" title="Configuración del Sistema">
            <div className="max-w-4xl space-y-6">
                {/* Platform Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Settings className="w-6 h-6 mr-2 text-cyan-400" />
                            Configuración de la Plataforma
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Nombre de la Plataforma
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.platformName}
                                        onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Tasa de Comisión (%)
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.commissionRate}
                                            onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Tasa de Impuesto (%)
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.taxRate}
                                            onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Correo de Soporte
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="email"
                                            value={formData.supportEmail}
                                            onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Monto Mínimo de Pedido ($)
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.minOrderAmount}
                                            onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
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

                {/* Email Templates */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Mail className="w-6 h-6 mr-2 text-cyan-400" />
                            Plantillas de Correo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-white font-semibold">Bienvenida de Usuario</h4>
                                        <p className="text-sm text-gray-400">Enviado al registrarse un nuevo usuario</p>
                                    </div>
                                    <Button size="sm" variant="outline">Editar</Button>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-white font-semibold">Confirmación de Pedido</h4>
                                        <p className="text-sm text-gray-400">Enviado al confirmar un pedido</p>
                                    </div>
                                    <Button size="sm" variant="outline">Editar</Button>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-white font-semibold">Recuperación de Contraseña</h4>
                                        <p className="text-sm text-gray-400">Enviado al solicitar recuperación</p>
                                    </div>
                                    <Button size="sm" variant="outline">Editar</Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
