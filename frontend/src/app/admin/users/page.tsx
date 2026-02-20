'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Users, UserCheck, UserX } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface User {
    _id: string;
    username: string;
    email: string;
    role: 'customer' | 'store' | 'supplier' | 'admin' | 'company';
    active: boolean;
    createdAt: string;
}

export default function UsersManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            // The paginated utility returns data in response.data.data
            setUsers(response.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeactivate = async (id: string, name: string) => {
        try {
            await api.delete(`/users/${id}`);
            toast.success(`Usuario ${name} suspendido correctamente`);
            fetchUsers();
        } catch (error) {
            console.error('Error deactivating user:', error);
            toast.error('Error al suspender usuario');
        }
    };

    const handleReactivate = async (id: string, name: string) => {
        try {
            await api.post(`/users/${id}/reactivate`);
            toast.success(`Usuario ${name} activado correctamente`);
            fetchUsers();
        } catch (error) {
            console.error('Error reactivating user:', error);
            toast.error('Error al activar usuario');
        }
    };

    const roleColors: Record<string, string> = {
        customer: 'bg-blue-900/50 border-blue-700 text-blue-300',
        store: 'bg-purple-900/50 border-purple-700 text-purple-300',
        supplier: 'bg-orange-900/50 border-orange-700 text-orange-300',
        admin: 'bg-cyan-900/50 border-cyan-700 text-cyan-300',
        company: 'bg-emerald-900/50 border-emerald-700 text-emerald-300',
    };

    const roleLabels: Record<string, string> = {
        customer: 'Cliente',
        store: 'Tienda',
        supplier: 'Proveedor',
        admin: 'Admin',
        company: 'Empresa',
    };

    // Helper to determine status style based on active boolean
    const getStatusStyle = (active: boolean) => active
        ? 'bg-green-900/50 border-green-700 text-green-300'
        : 'bg-red-900/50 border-red-700 text-red-300';

    const getStatusLabel = (active: boolean) => active ? 'Activo' : 'Suspendido';

    const columns = [
        { key: 'username', header: 'Nombre' },
        { key: 'email', header: 'Correo Electrónico' },
        {
            key: 'role',
            header: 'Rol',
            render: (user: User) => (
                <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${roleColors[user.role] || 'bg-gray-800'}`}>
                    {roleLabels[user.role] || user.role}
                </span>
            ),
        },
        {
            key: 'active',
            header: 'Estado',
            render: (user: User) => (
                <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${getStatusStyle(user.active)}`}>
                    {getStatusLabel(user.active)}
                </span>
            ),
        },
        {
            key: 'createdAt',
            header: 'Fecha de Registro',
            render: (user: User) => new Date(user.createdAt).toLocaleDateString()
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (user: User) => (
                <div className="flex gap-2">
                    {user.active ? (
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-red-400 border-red-700 hover:bg-red-900/20"
                            onClick={() => handleDeactivate(user._id, user.username)}
                        >
                            <UserX className="w-4 h-4 mr-1" />
                            Suspender
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-green-400 border-green-700 hover:bg-green-900/20"
                            onClick={() => handleReactivate(user._id, user.username)}
                        >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Activar
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const activeCount = users.filter(u => u.active).length;
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
                        {loading ? (
                            <div className="text-center py-8 text-gray-400">Cargando usuarios...</div>
                        ) : (
                            <Table data={users} columns={columns} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
