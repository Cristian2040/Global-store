'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Users, UserCheck, UserX } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'customer' | 'store' | 'supplier' | 'admin';
    status: 'active' | 'inactive' | 'suspended';
    joinDate: string;
}

export default function UsersManagementPage() {
    const users: User[] = [
        { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'customer', status: 'active', joinDate: '2024-01-15' },
        { id: 2, name: 'María García', email: 'maria@example.com', role: 'store', status: 'active', joinDate: '2024-01-20' },
        { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'supplier', status: 'active', joinDate: '2024-02-01' },
        { id: 4, name: 'Ana Martínez', email: 'ana@example.com', role: 'customer', status: 'inactive', joinDate: '2024-01-10' },
        { id: 5, name: 'Luis Rodríguez', email: 'luis@example.com', role: 'admin', status: 'active', joinDate: '2023-12-01' },
    ];

    const roleColors = {
        customer: 'bg-blue-900/50 border-blue-700 text-blue-300',
        store: 'bg-purple-900/50 border-purple-700 text-purple-300',
        supplier: 'bg-orange-900/50 border-orange-700 text-orange-300',
        admin: 'bg-cyan-900/50 border-cyan-700 text-cyan-300',
    };

    const roleLabels = {
        customer: 'Cliente',
        store: 'Tienda',
        supplier: 'Proveedor',
        admin: 'Administrador',
    };

    const statusColors = {
        active: 'bg-green-900/50 border-green-700 text-green-300',
        inactive: 'bg-gray-800 border-gray-700 text-gray-400',
        suspended: 'bg-red-900/50 border-red-700 text-red-300',
    };

    const statusLabels = {
        active: 'Activo',
        inactive: 'Inactivo',
        suspended: 'Suspendido',
    };

    const columns = [
        { key: 'name', header: 'Nombre' },
        { key: 'email', header: 'Correo Electrónico' },
        {
            key: 'role',
            header: 'Rol',
            render: (user: User) => (
                <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${roleColors[user.role]}`}>
                    {roleLabels[user.role]}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Estado',
            render: (user: User) => (
                <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${statusColors[user.status]}`}>
                    {statusLabels[user.status]}
                </span>
            ),
        },
        { key: 'joinDate', header: 'Fecha de Registro' },
        {
            key: 'actions',
            header: 'Acciones',
            render: (user: User) => (
                <div className="flex gap-2">
                    {user.status === 'active' ? (
                        <Button size="sm" variant="outline" className="text-red-400 border-red-700 hover:bg-red-900/20">
                            <UserX className="w-4 h-4 mr-1" />
                            Suspender
                        </Button>
                    ) : (
                        <Button size="sm" variant="outline">
                            <UserCheck className="w-4 h-4 mr-1" />
                            Activar
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const activeCount = users.filter(u => u.status === 'active').length;
    const customerCount = users.filter(u => u.role === 'customer').length;
    const storeCount = users.filter(u => u.role === 'store').length;

    return (
        <DashboardLayout role="admin" title="Gestión de Usuarios">
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Total Usuarios</p>
                                    <p className="text-3xl font-bold text-white">{users.length}</p>
                                </div>
                                <Users className="w-8 h-8 text-cyan-400" />
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
                                <UserCheck className="w-8 h-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Clientes</p>
                                    <p className="text-3xl font-bold text-blue-400">{customerCount}</p>
                                </div>
                                <Users className="w-8 h-8 text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Tiendas</p>
                                    <p className="text-3xl font-bold text-purple-400">{storeCount}</p>
                                </div>
                                <Users className="w-8 h-8 text-purple-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Users className="w-6 h-6 mr-2 text-cyan-400" />
                            Todos los Usuarios
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table data={users} columns={columns} />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
