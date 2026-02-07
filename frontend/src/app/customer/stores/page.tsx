'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, MapPin, Star } from 'lucide-react';

export default function BrowseStoresPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const stores = [
        { id: 1, name: 'Tienda Local 1', description: 'Productos frescos y de calidad', address: 'Calle Principal 123', rating: 4.5, products: 45 },
        { id: 2, name: 'Supermercado Central', description: 'Todo lo que necesitas en un solo lugar', address: 'Av. Central 456', rating: 4.8, products: 120 },
        { id: 3, name: 'Tienda del Barrio', description: 'Atención personalizada', address: 'Calle Secundaria 789', rating: 4.2, products: 30 },
        { id: 4, name: 'Mercado Express', description: 'Entregas rápidas', address: 'Av. Rápida 321', rating: 4.6, products: 80 },
        { id: 5, name: 'Tienda Orgánica', description: 'Productos orgánicos certificados', address: 'Calle Verde 654', rating: 4.9, products: 55 },
        { id: 6, name: 'Mini Market 24/7', description: 'Abierto las 24 horas', address: 'Av. Noche 987', rating: 4.3, products: 65 },
    ];

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="customer" title="Tiendas">
            <div className="space-y-6">
                {/* Search Bar */}
                <Card>
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar tiendas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Stores Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStores.map((store) => (
                        <Card key={store.id} className="hover:shadow-lg hover:shadow-cyan-500/10 transition-all cursor-pointer">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2">{store.name}</h3>
                                <p className="text-gray-400 text-sm mb-4">{store.description}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-gray-400 text-sm">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        {store.address}
                                    </div>
                                    <div className="flex items-center text-yellow-400 text-sm">
                                        <Star className="w-4 h-4 mr-2 fill-current" />
                                        {store.rating} / 5.0
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">{store.products} productos</span>
                                    <Button size="sm">Ver Tienda</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredStores.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No se encontraron tiendas</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
