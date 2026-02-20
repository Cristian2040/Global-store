'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Store, CheckCircle, XCircle, MapPin } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface StoreData {
    _id: string;
    storeName: string;
    ownerName: string;
    address: {
        street: string;
        number: string;
        municipality: string;
        state: string;
    };
    active: boolean;
    createdAt: string;
}

export default function StoresManagementPage() {
    const [stores, setStores] = useState<StoreData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const response = await api.get('/stores');
            setStores(response.data.data);
        } catch (error) {
            console.error('Error fetching stores:', error);
            toast.error('Error al cargar tiendas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const handleSuspend = async (id: string, name: string) => {
        try {
            await api.delete(`/stores/${id}`);
            toast.success(`Tienda ${name} suspendida correctamente`);
            fetchStores();
        } catch (error) {
            console.error('Error suspending store:', error);
            toast.error('Error al suspender tienda');
        }
    };

    const handleReactivate = async (id: string, name: string) => {
        try {
            await api.put(`/stores/${id}`, { active: true });
            toast.success(`Tienda ${name} activada correctamente`);
            fetchStores();
        } catch (error) {
            console.error('Error reactivating store:', error);
            toast.error('Error al activar tienda');
        }
    };

    const statusColors = (active: boolean) => active
        ? 'bg-green-900/50 border-green-700 text-green-300'
        : 'bg-red-900/50 border-red-700 text-red-300';

    const statusLabel = (active: boolean) => active ? 'Activa' : 'Suspendida';

    const columns = [
        { key: 'storeName', header: 'Nombre de Tienda' },
        { key: 'ownerName', header: 'Propietario' },
        {
            key: 'address',
            header: 'Dirección',
            render: (store: StoreData) => (
                <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="w-3 h-3 mr-1" />
                    {store.address ? `${store.address.street} ${store.address.number}, ${store.address.municipality}` : 'Sin dirección'}
                </div>
            )
        },
        {
            key: 'active',
            header: 'Estado',
            render: (store: StoreData) => (
                <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${statusColors(store.active)}`}>
                    {statusLabel(store.active)}
                </span>
            ),
        },
        {
            key: 'createdAt',
            header: 'Fecha de Registro',
            render: (store: StoreData) => new Date(store.createdAt).toLocaleDateString()
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (store: StoreData) => (
                <div className="flex gap-2">
                    {store.active ? (
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-red-400 border-red-700 hover:bg-red-900/20"
                            onClick={() => handleSuspend(store._id, store.storeName)}
                        >
                            <XCircle className="w-4 h-4 mr-1" />
                            Suspender
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-green-400 border-green-700 hover:bg-green-900/20"
                            onClick={() => handleReactivate(store._id, store.storeName)}
                        >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Reactivar
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const activeCount = stores.filter(s => s.active).length;
    const suspendedCount = stores.filter(s => !s.active).length;

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
                                    <p className="text-sm text-gray-400 mb-1">Suspendidas</p>
                                    <p className="text-3xl font-bold text-red-400">{suspendedCount}</p>
                                </div>
                                <XCircle className="w-8 h-8 text-red-400" />
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
                        {loading ? (
                            <div className="text-center py-8 text-gray-400">Cargando tiendas...</div>
                        ) : (
                            <Table data={stores} columns={columns} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
