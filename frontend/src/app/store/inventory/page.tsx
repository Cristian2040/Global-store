'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Package } from 'lucide-react';

interface InventoryItem {
    id: number;
    name: string;
    category: string;
    stock: number;
    minStock: number;
    unit: string;
    lastRestocked: string;
}

export default function InventoryPage() {
    const inventory: InventoryItem[] = [
        { id: 1, name: 'Manzanas Rojas', category: 'Frutas', stock: 45, minStock: 20, unit: 'kg', lastRestocked: '2024-02-05' },
        { id: 2, name: 'Leche Entera', category: 'Lácteos', stock: 12, minStock: 15, unit: 'litros', lastRestocked: '2024-02-06' },
        { id: 3, name: 'Pan Integral', category: 'Panadería', stock: 8, minStock: 10, unit: 'unidades', lastRestocked: '2024-02-07' },
        { id: 4, name: 'Tomates', category: 'Verduras', stock: 30, minStock: 15, unit: 'kg', lastRestocked: '2024-02-06' },
        { id: 5, name: 'Pollo Fresco', category: 'Carnes', stock: 25, minStock: 10, unit: 'kg', lastRestocked: '2024-02-07' },
    ];

    const lowStockItems = inventory.filter(item => item.stock < item.minStock);

    const columns = [
        { key: 'name', header: 'Producto' },
        { key: 'category', header: 'Categoría' },
        {
            key: 'stock',
            header: 'Stock Actual',
            render: (item: InventoryItem) => (
                <span className={item.stock < item.minStock ? 'text-orange-400 font-semibold' : 'text-white'}>
                    {item.stock} {item.unit}
                </span>
            ),
        },
        {
            key: 'minStock',
            header: 'Stock Mínimo',
            render: (item: InventoryItem) => `${item.minStock} ${item.unit}`,
        },
        { key: 'lastRestocked', header: 'Último Reabastecimiento' },
        {
            key: 'status',
            header: 'Estado',
            render: (item: InventoryItem) =>
                item.stock < item.minStock ? (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-orange-300 bg-orange-900/50 border border-orange-700 rounded-full">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Stock Bajo
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-green-300 bg-green-900/50 border border-green-700 rounded-full">
                        Normal
                    </span>
                ),
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (item: InventoryItem) => (
                <Button size="sm" variant="outline">
                    Reabastecer
                </Button>
            ),
        },
    ];

    return (
        <DashboardLayout role="store" title="Inventario">
            <div className="space-y-6">
                {/* Low Stock Alert */}
                {lowStockItems.length > 0 && (
                    <Card className="border-orange-700 bg-orange-900/20">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <AlertTriangle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">
                                        ⚠️ {lowStockItems.length} Producto{lowStockItems.length > 1 ? 's' : ''} con Stock Bajo
                                    </h3>
                                    <p className="text-orange-200 mb-3">
                                        Los siguientes productos necesitan reabastecimiento urgente:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {lowStockItems.map(item => (
                                            <span key={item.id} className="px-3 py-1 bg-orange-800 text-orange-100 rounded-full text-sm">
                                                {item.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Inventory Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Package className="w-6 h-6 mr-2 text-cyan-400" />
                                Inventario Completo
                            </div>
                            <Button>Agregar Producto</Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table data={inventory} columns={columns} />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
