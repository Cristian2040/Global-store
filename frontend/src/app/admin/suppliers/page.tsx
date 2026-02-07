'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Truck, CheckCircle, XCircle } from 'lucide-react';

interface SupplierData {
    id: number;
    companyName: string;
    contact: string;
    products: number;
    status: 'active' | 'pending' | 'suspended';
    joinDate: string;
}

export default function SuppliersManagementPage() {
    const suppliers: SupplierData[] = [
        { id: 1, companyName: 'Distribuidora ABC', contact: 'Carlos López', products: 45, status: 'active', joinDate: '2024-02-01' },
        { id: 2, companyName: 'Proveedor XYZ', contact: 'Ana Martínez', products: 60, status: 'active', joinDate: '2024-01-28' },
        { id: 3, companyName: 'Alimentos Frescos SA', contact: 'Jorge Ramírez', products: 35, status: 'pending', joinDate: '2024-02-06' },
        { id: 4, companyName: 'Distribuciones Norte', contact: 'Elena Torres', products: 50, status: 'active', joinDate: '2024-01-22' },
    ];

    const statusColors = {
        active: 'bg-green-900/50 border-green-700 text-green-300',
        pending: 'bg-yellow-900/50 border-yellow-700 text-yellow-300',
        suspended: 'bg-red-900/50 border-red-700 text-red-300',
    };

    const statusLabels = {
        active: 'Activo',
        pending: 'Pendiente',
        suspended: 'Suspendido',
    };

    const columns = [
        { key: 'companyName', header: 'Empresa' },
        { key: 'contact', header: 'Contacto' },
        { key: 'products', header: 'Productos', render: (supplier: SupplierData) => `${supplier.products} items` },
        {
            key: 'status',
            header: 'Estado',
            render: (supplier: SupplierData) => (
                <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${statusColors[supplier.status]}`}>
                    {statusLabels[supplier.status]}
                </span>
            ),
        },
        { key: 'joinDate', header: 'Fecha de Registro' },
        {
            key: 'actions',
            header: 'Acciones',
            render: (supplier: SupplierData) => (
                <div className="flex gap-2">
                    {supplier.status === 'pending' && (
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
                    {supplier.status === 'active' && (
                        <Button size="sm" variant="outline">
                            Ver Detalles
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const activeCount = suppliers.filter(s => s.status === 'active').length;
    const pendingCount = suppliers.filter(s => s.status === 'pending').length;

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
                                <XCircle className="w-8 h-8 text-yellow-400" />
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
                        <Table data={suppliers} columns={columns} />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
