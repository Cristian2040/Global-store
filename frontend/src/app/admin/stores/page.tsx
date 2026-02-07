'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Store, CheckCircle, XCircle } from 'lucide-react';

interface StoreData {
    id: number;
    name: string;
    owner: string;
    address: string;
    products: number;
    status: 'active' | 'pending' | 'suspended';
    joinDate: string;
}

export default function StoresManagementPage() {
    const stores: StoreData[] = [
        { id: 1, name: 'Tienda Local 1', owner: 'María García', address: 'Calle Principal 123', products: 45, status: 'active', joinDate: '2024-01-20' },
        { id: 2, name: 'Supermercado Central', owner: 'Pedro Sánchez', address: 'Av. Central 456', products: 120, status: 'active', joinDate: '2024-01-15' },
        { id: 3, name: 'Tienda del Barrio', owner: 'Laura Díaz', address: 'Calle Secundaria 789', products: 30, status: 'pending', joinDate: '2024-02-05' },
        { id: 4, name: 'Mercado Express', owner: 'Roberto Gómez', address: 'Av. Rápida 321', products: 80, status: 'active', joinDate: '2024-01-25' },
    ];

    const statusColors = {
        active: 'bg-green-900/50 border-green-700 text-green-300',
        pending: 'bg-yellow-900/50 border-yellow-700 text-yellow-300',
        suspended: 'bg-red-900/50 border-red-700 text-red-300',
    };

    const statusLabels = {
        active: 'Activa',
        pending: 'Pendiente',
        suspended: 'Suspendida',
    };

    const columns = [
        { key: 'name', header: 'Nombre de Tienda' },
        { key: 'owner', header: 'Propietario' },
        { key: 'address', header: 'Dirección' },
        { key: 'products', header: 'Productos', render: (store: StoreData) => `${store.products} items` },
        {
            key: 'status',
            header: 'Estado',
            render: (store: StoreData) => (
                <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${statusColors[store.status]}`}>
                    {statusLabels[store.status]}
                </span>
            ),
        },
        { key: 'joinDate', header: 'Fecha de Registro' },
        {
            key: 'actions',
            header: 'Acciones',
            render: (store: StoreData) => (
                <div className="flex gap-2">
                    {store.status === 'pending' && (
                        <>
                            <Button size="sm" variant="outline">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Aprobar
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-400 border-red-700 hover:bg-red-900/20">
                                <XCircle className="w-4 h-4 mr-1" />
                                Rechazar
                            </Button>
                        </>
                    )}
                    {store.status === 'active' && (
                        <Button size="sm" variant="outline">
                            Ver Detalles
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const activeCount = stores.filter(s => s.status === 'active').length;
    const pendingCount = stores.filter(s => s.status === 'pending').length;

    return (
        <DashboardLayout role="admin" title="Gestión de Tiendas">
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Total Tiendas</p>
                                    <p className="text-3xl font-bold text-white">{stores.length}</p>
                                </div>
                                <Store className="w-8 h-8 text-cyan-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Activas</p>
                                    <p className="text-3xl font-bold text-green-400">{activeCount}</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Pendientes</p>
                                    <p className="text-3xl font-bold text-yellow-400">{pendingCount}</p>
                                </div>
                                <XCircle className="w-8 h-8 text-yellow-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stores Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Store className="w-6 h-6 mr-2 text-cyan-400" />
                            Todas las Tiendas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table data={stores} columns={columns} />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
