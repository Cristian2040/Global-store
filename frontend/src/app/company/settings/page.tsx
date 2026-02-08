'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Save, User as UserIcon, Building2 } from 'lucide-react';

export default function CompanySettingsPage() {
    const { user, relatedData } = useAuth();
    const company = relatedData as any;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Building2 className="w-8 h-8 text-cyan-500" />
                    Configuración de Empresa
                </h1>
                <p className="text-gray-400">Gestiona tu perfil y preferencias</p>
            </div>

            <div className="grid gap-6">
                {/* Profile Card */}
                <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <UserIcon className="w-5 h-5 mr-2 text-cyan-500" />
                            Perfil de Usuario
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-gray-300">Usuario</Label>
                                <Input value={user?.username} disabled className="bg-gray-900 border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Email</Label>
                                <Input value={user?.email} disabled className="bg-gray-900 border-gray-700" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Company Info Card */}
                <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Building2 className="w-5 h-5 mr-2 text-purple-500" />
                            Datos de la Empresa
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-gray-300">Nombre de la Empresa</Label>
                                <Input defaultValue={company?.companyName} className="bg-gray-900 border-gray-700 focus:border-purple-500" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Email de Contacto</Label>
                                <Input defaultValue={company?.contactEmail} className="bg-gray-900 border-gray-700 focus:border-purple-500" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Teléfono</Label>
                                <Input defaultValue={company?.phone} className="bg-gray-900 border-gray-700 focus:border-purple-500" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Dirección</Label>
                                <Input defaultValue={company?.address?.street} className="bg-gray-900 border-gray-700 focus:border-purple-500" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-300">Descripción</Label>
                            <textarea
                                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:border-purple-500 focus:outline-none"
                                rows={3}
                                defaultValue={company?.description}
                            />
                        </div>
                        <div className="pt-2 flex justify-end">
                            <Button className="bg-purple-600 hover:bg-purple-500">
                                <Save className="w-4 h-4 mr-2" />
                                Guardar Cambios
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
