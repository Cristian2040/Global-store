'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, MapPin, Star, Store as StoreIcon } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface StoreAddress {
    street?: string;
    number?: string;
    neighborhood?: string;
    municipality?: string;
    state?: string;
}

interface Store {
    _id: string;
    storeName: string;
    description: string;
    address: StoreAddress;
    rating: number;
    logo: string;
    active: boolean;
}

export default function BrowseStoresPage() {
    const router = useRouter();
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Simple debounce implementation
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchStores();
    }, [debouncedSearchTerm]);

    const fetchStores = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);

            const response = await api.get(`/stores?${params.toString()}`);
            if (response.data.success) {
                setStores(response.data.data); // Based on paginated response: { data: [], pagination: {} } - handled by responseHandler.js? 
                // Let's re-check responseHandler structure. Usually res.data is the payload. 
                // paginated helper returns { success: true, data: [...], pagination: {...} }
            }
        } catch (error) {
            console.error('Error fetching stores:', error);
            toast.error('Error al cargar tiendas');
        } finally {
            setLoading(false);
        }
    };

    const formatAddress = (addr?: StoreAddress) => {
        if (!addr) return 'Dirección no disponible';
        return `${addr.street || ''} ${addr.number || ''}, ${addr.neighborhood || ''}, ${addr.municipality || ''}`;
    };

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
                                placeholder="Buscar tiendas por nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Stores Grid */}
                {loading ? (
                    <div className="text-center py-12 text-gray-400">Cargando tiendas...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stores.map((store) => (
                            <Card
                                key={store._id}
                                className="hover:shadow-lg hover:shadow-cyan-500/10 transition-all cursor-pointer group"
                                onClick={() => router.push(`/customer/stores/${store._id}`)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-cyan-900/30 rounded-lg group-hover:bg-cyan-900/50 transition-colors">
                                            <StoreIcon className="w-8 h-8 text-cyan-400" />
                                        </div>
                                        <div className="flex items-center text-yellow-400 text-sm font-medium bg-yellow-900/20 px-2 py-1 rounded-full">
                                            <Star className="w-3 h-3 mr-1 fill-current" />
                                            {store.rating?.toFixed(1) || '5.0'}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2">{store.storeName}</h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">
                                        {store.description || 'Sin descripción'}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-start text-gray-500 text-xs">
                                            <MapPin className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="line-clamp-1">{formatAddress(store.address)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                                        <span className="text-xs text-cyan-400 font-medium group-hover:underline">
                                            Ver productos disponibles
                                        </span>
                                        <Button size="sm" variant="outline" className="border-cyan-700 text-cyan-400 hover:bg-cyan-900/20">
                                            Ver Tienda
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {!loading && stores.length === 0 && (
                    <div className="text-center py-12">
                        <StoreIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-300">No se encontraron tiendas</h3>
                        <p className="text-gray-500">Intenta con otros términos de búsqueda.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
