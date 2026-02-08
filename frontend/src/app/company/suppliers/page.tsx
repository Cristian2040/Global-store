'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Truck, Search, Eye, Mail, Phone, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Supplier } from '@/types';

export default function CompanySuppliersPage() {
    const { user, relatedData } = useAuth();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const companyName = (relatedData as any)?.companyName;

    const fetchSuppliers = useCallback(async () => {
        try {
            setLoading(true);
            // Fetch suppliers linked to this company
            const response = await api.get('/companies/suppliers', {
                params: { search: searchTerm }
            });

            if (response.data.success) {
                setSuppliers(response.data.data);
            }
        } catch (error: any) {
            console.error('Error fetching suppliers:', error);
            // If 404 or empty, it might just mean no suppliers yet
            if (error.response?.status !== 404) {
                toast.error('Error al cargar proveedores');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [searchTerm]); // Added searchTerm dependency

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchSuppliers();
    };

    const handleStatusUpdate = async (supplierId: string, status: 'ACTIVE' | 'REJECTED') => {
        try {
            const response = await api.put(`/companies/suppliers/${supplierId}/status`, { status });
            if (response.data.success) {
                toast.success(`Proveedor ${status === 'ACTIVE' ? 'aceptado' : 'rechazado'} exitosamente`);
                fetchSuppliers();
            }
        } catch (error: any) {
            console.error('Error updating supplier status:', error);
            toast.error(error.response?.data?.message || 'Error al actualizar estado');
        }
    };

    const columns = [
        { key: 'name', header: 'Nombre' },
        {
            key: 'contact',
            header: 'Contacto',
            render: (supplier: Supplier) => (
                <div className="flex flex-col text-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-4 h-4 text-cyan-500" />
                        <span className="text-gray-300">{supplier.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-cyan-500" />
                        <span className="text-gray-300">{supplier.phone}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'address',
            header: 'Ubicación',
            render: (supplier: Supplier) => (
                <div className="flex items-start gap-2 text-sm max-w-xs">
                    <MapPin className="w-4 h-4 text-cyan-500 mt-1 shrink-0" />
                    <span className="text-gray-300">
                        {supplier.address ? `${supplier.address.street || ''} ${supplier.address.number || ''}, ${supplier.address.neighborhood || ''}` : 'Sin dirección'}
                    </span>
                </div>
            )
        },
        {
            key: 'categories',
            header: 'Categorías',
            render: (supplier: Supplier) => (
                <div className="flex flex-wrap gap-1">
                    {supplier.categories?.slice(0, 3).map((cat, idx) => (
                        <span key={idx} className="bg-gray-700 text-xs px-2 py-1 rounded-full text-gray-300">
                            {cat}
                        </span>
                    ))}
                    {(supplier.categories?.length || 0) > 3 && (
                        <span className="bg-gray-700 text-xs px-2 py-1 rounded-full text-gray-300">
                            +{supplier.categories!.length - 3}
                        </span>
                    )}
                </div>
            )
        },
        {
            key: 'status',
            header: 'Estado',
            render: (supplier: Supplier) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${supplier.status === 'ACTIVE'
                        ? 'bg-green-900/30 text-green-400 border-green-900'
                        : supplier.status === 'PENDING'
                            ? 'bg-yellow-900/30 text-yellow-400 border-yellow-900'
                            : 'bg-red-900/30 text-red-400 border-red-900'
                    }`}>
                    {supplier.status === 'ACTIVE' ? 'Activo' : supplier.status === 'PENDING' ? 'Pendiente' : 'Rechazado'}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (supplier: Supplier) => (
                <div className="flex gap-2">
                    {supplier.status === 'PENDING' && (
                        <>
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleStatusUpdate(supplier._id, 'ACTIVE')}
                            >
                                Aceptar
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-500/10"
                                onClick={() => handleStatusUpdate(supplier._id, 'REJECTED')}
                            >
                                Rechazar
                            </Button>
                        </>
                    )}
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

    const pendingSuppliers = suppliers.filter(s => s.status === 'PENDING');
    const activeSuppliers = suppliers.filter(s => s.status === 'ACTIVE');
    const rejectedSuppliers = suppliers.filter(s => s.status === 'REJECTED'); // Keep if we want to show rejected ones too

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Truck className="w-8 h-8 text-purple-500" />
                        Red de Proveedores
                    </h1>
                    <p className="text-gray-400">Distribuidores autorizados y solicitudes</p>
                </div>
            </div>

            {/* Pending Requests Section */}
            {pendingSuppliers.length > 0 && (
                <Card className="bg-yellow-900/10 border-yellow-700/50 mb-8">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            Solicitudes Pendientes ({pendingSuppliers.length})
                        </h2>
                        <Table data={pendingSuppliers} columns={columns} />
                    </CardContent>
                </Card>
            )}

            <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <h2 className="text-xl font-bold text-white">Proveedores Activos</h2>
                        <div className="flex gap-2">
                            <form onSubmit={handleSearch} className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar por nombre, email..."
                                    className="pl-10 bg-gray-900 border-gray-700 focus:border-cyan-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </form>
                            <Button
                                variant="outline"
                                onClick={() => { setRefreshing(true); fetchSuppliers(); }}
                                disabled={refreshing}
                                className="border-gray-600 hover:bg-gray-700"
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                        </div>
                    ) : activeSuppliers.length > 0 ? (
                        <Table data={activeSuppliers} columns={columns.filter(c => c.key !== 'status')} />
                    ) : (
                        <div className="text-center py-12 px-4 rounded-lg border-2 border-dashed border-gray-700">
                            <Truck className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-white mb-2">No hay proveedores activos</h3>
                            <p className="text-gray-400">Acepta las solicitudes pendientes para verlos aquí.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
