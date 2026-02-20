'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Truck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface SupplierData {
    _id: string;
    companyName: string;
    name: string; // Contact name
    email: string;
    status: 'PENDING' | 'ACTIVE' | 'REJECTED';
    active: boolean;
    createdAt: string;
}

export default function SuppliersManagementPage() {
    const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/suppliers');
            setSuppliers(response.data.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            toast.error('Error al cargar proveedores');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleApprove = async (id: string, name: string) => {
        try {
            await api.put(`/suppliers/${id}`, { status: 'ACTIVE' });
            toast.success(`Proveedor ${name} aprobado correctamente`);
            fetchSuppliers();
        } catch (error) {
            console.error('Error approving supplier:', error);
            toast.error('Error al aprobar proveedor');
        }
    };

    const handleReject = async (id: string, name: string) => {
        try {
            await api.put(`/suppliers/${id}`, { status: 'REJECTED' });
            toast.success(`Proveedor ${name} rechazado`);
            fetchSuppliers();
        } catch (error) {
            console.error('Error rejecting supplier:', error);
            toast.error('Error al rechazar proveedor');
        }
    };

    const handleSuspend = async (id: string, name: string) => {
        try {
            await api.delete(`/suppliers/${id}`);
            toast.success(`Proveedor ${name} suspendido`);
            fetchSuppliers();
        } catch (error) {
            console.error('Error suspending supplier:', error);
            toast.error('Error al suspender proveedor');
        }
    };

    const handleReactivate = async (id: string, name: string) => {
        try {
            await api.put(`/suppliers/${id}`, { active: true });
            toast.success(`Proveedor ${name} reactivado`);
            fetchSuppliers();
        } catch (error) {
            console.error('Error reactivating supplier:', error);
            toast.error('Error al reactivar proveedor');
        }
    };

    const getStatusConfig = (status: string, active: boolean) => {
        if (!active) return { color: 'bg-red-900/50 border-red-700 text-red-300', label: 'Suspendido' };

        switch (status) {
            case 'ACTIVE': return { color: 'bg-green-900/50 border-green-700 text-green-300', label: 'Activo' };
            case 'PENDING': return { color: 'bg-yellow-900/50 border-yellow-700 text-yellow-300', label: 'Pendiente' };
            case 'REJECTED': return { color: 'bg-gray-800 border-gray-700 text-gray-400', label: 'Rechazado' };
            default: return { color: 'bg-gray-800', label: status };
        }
    };

    const columns = [
        { key: 'companyName', header: 'Empresa' },
        { key: 'name', header: 'Contacto' },
        { key: 'email', header: 'Correo' },
        {
            key: 'status',
            header: 'Estado',
            render: (supplier: SupplierData) => {
                const config = getStatusConfig(supplier.status, supplier.active);
                return (
                    <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${config.color}`}>
                        {config.label}
                    </span>
                );
            },
        },
        {
            key: 'createdAt',
            header: 'Fecha de Registro',
            render: (supplier: SupplierData) => new Date(supplier.createdAt).toLocaleDateString()
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (supplier: SupplierData) => (
                <div className="flex gap-2">
                    {/* Actions for Pending Suppliers */}
                    {supplier.status === 'PENDING' && (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-green-400 border-green-700 hover:bg-green-900/20"
                                onClick={() => handleApprove(supplier._id, supplier.companyName)}
                            >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Aprobar
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-red-400 border-red-700 hover:bg-red-900/20"
                                onClick={() => handleReject(supplier._id, supplier.companyName)}
                            >
                                <XCircle className="w-4 h-4 mr-1" />
                                Rechazar
                            </Button>
                        </>
                    )}

                    {/* Actions for Active Suppliers */}
                    {supplier.status === 'ACTIVE' && (
                        supplier.active ? (
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-red-400 border-red-700 hover:bg-red-900/20"
                                onClick={() => handleSuspend(supplier._id, supplier.companyName)}
                            >
                                <XCircle className="w-4 h-4 mr-1" />
                                Suspender
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-green-400 border-green-700 hover:bg-green-900/20"
                                onClick={() => handleReactivate(supplier._id, supplier.companyName)}
                            >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Reactivar
                            </Button>
                        )
                    )}
                </div>
            ),
        },
    ];

    const activeCount = suppliers.filter(s => s.status === 'ACTIVE' && s.active).length;
    const pendingCount = suppliers.filter(s => s.status === 'PENDING').length;

    return (
        <DashboardLayout role="admin" title="Gestión de Proveedores">
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Total Proveedores</p>
                                    <p className="text-3xl font-bold text-white">{suppliers.length}</p>
                                </div>
                                <Truck className="w-8 h-8 text-cyan-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Activos</p>
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
                                <AlertCircle className="w-8 h-8 text-yellow-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Suppliers Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Truck className="w-6 h-6 mr-2 text-cyan-400" />
                            Todos los Proveedores
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8 text-gray-400">Cargando proveedores...</div>
                        ) : (
                            <Table data={suppliers} columns={columns} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
