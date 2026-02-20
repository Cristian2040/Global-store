'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShoppingBag, Store, Truck, Building2, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import type { RegisterFormData } from '@/types';

import api from '@/lib/api';

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<RegisterFormData>({
        role: 'customer',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState<{ _id: string, companyName: string }[]>([]);
    const { register } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Fetch companies for supplier registration
        const fetchCompanies = async () => {
            try {
                const response = await api.get('/companies');
                if (response.data.success) {
                    setCompanies(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching companies:', err);
            }
        };
        fetchCompanies();
    }, []);

    const roles = [
        {
            value: 'customer' as const,
            title: 'Cliente',
            description: 'Compra productos de tiendas locales',
            icon: <ShoppingBag className="w-10 h-10" />,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            value: 'store' as const,
            title: 'Tienda',
            description: 'Vende productos y gestiona inventario',
            icon: <Store className="w-10 h-10" />,
            color: 'from-purple-500 to-pink-500',
        },
        {
            value: 'supplier' as const,
            title: 'Proveedor',
            description: 'Distribuye productos a tiendas',
            icon: <Truck className="w-10 h-10" />,
            color: 'from-orange-500 to-red-500',
        },
        {
            value: 'company' as const,
            title: 'Empresa',
            description: 'Dueña de marca y productos globales',
            icon: <Building2 className="w-10 h-10" />,
            color: 'from-emerald-500 to-teal-500',
        },
    ];

    const handleRoleSelect = (roleId: string) => {
        setFormData({ ...formData, role: roleId as any });
    };

    const handleNext = () => {
        setError('');

        if (step === 1 && !formData.role) {
            toast.error('Por favor selecciona un rol');
            return;
        }

        if (step === 2) {
            if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
                toast.error('Todos los campos son obligatorios');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error('Las contraseñas no coinciden');
                return;
            }
            if (formData.password.length < 6) {
                toast.error('La contraseña debe tener al menos 6 caracteres');
                return;
            }
        }

        if (step === 3) {
            // Validate step 3 based on role
            if (formData.role === 'store') {
                if (!formData.storeName || !formData.ownerName) {
                    toast.error('Por favor completa todos los campos obligatorios de la tienda');
                    return;
                }
            } else if (formData.role === 'supplier') {
                if (!formData.supplierName || !formData.companyId || !formData.supplierEmail || !formData.supplierPhone) {
                    toast.error('Por favor completa todos los campos del proveedor y selecciona una empresa');
                    return;
                }
            } else if (formData.role === 'company') {
                if (!formData.companyName || !formData.companyEmail || !formData.companyPhone) {
                    toast.error('Por favor completa todos los campos de la empresa');
                    return;
                }
            }
        }

        setStep(step + 1);
    };

    const handleBack = () => {
        setError('');
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            // Prepare data based on role
            let submitData: any = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            };

            if (formData.role === 'customer' && formData.address) {
                submitData.address = formData.address;
            } else if (formData.role === 'store') {
                submitData.storeName = formData.storeName;
                submitData.ownerName = formData.ownerName;
                submitData.storePhone = formData.storePhone;
                submitData.storeAddress = formData.storeAddress;
            } else if (formData.role === 'supplier') {
                submitData.supplierName = formData.supplierName;
                submitData.companyId = formData.companyId;
                // Find company name for complete data if needed locally, though backend doesn't strictly need it if we use companyId
                const selectedCompany = companies.find(c => c._id === formData.companyId);
                if (selectedCompany) {
                    submitData.companyName = selectedCompany.companyName;
                }
                submitData.supplierEmail = formData.supplierEmail || formData.email;
                submitData.supplierPhone = formData.supplierPhone;
                submitData.categories = formData.categories || [];
            } else if (formData.role === 'company') {
                submitData.companyName = formData.companyName;
                submitData.companyEmail = formData.companyEmail;
                submitData.companyPhone = formData.companyPhone;
                submitData.companyAddress = formData.companyAddress;
                submitData.description = formData.description;
            }

            await register(submitData);
            toast.success('¡Cuenta creada exitosamente!');
        } catch (err: any) {
            toast.error(err.message || 'Error al crear la cuenta');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-3 mb-4">
                        <Image src="/logo.png" alt="GlobalStore" width={48} height={48} />
                        <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                            GlobalStore
                        </span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
                    <p className="text-gray-300">Únete a nuestra comunidad</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-15 w-full">
                    <div className="relative flex justify-between">
                        {[
                            { id: 1, label: 'Rol' },
                            { id: 2, label: 'Datos' },
                            { id: 3, label: 'Detalles' },
                            { id: 4, label: 'Confirmar' }
                        ].map((s, index, array) => (
                            <div key={s.id} className="flex items-center flex-1 last:flex-none">
                                {/* Contenedor Vertical: Círculo + Texto */}
                                <div className="flex flex-col items-center relative min-w-[64px]">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all z-10 ${s.id <= step
                                            ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                                            : 'bg-slate-900 text-gray-500 border-2 border-gray-600'
                                            }`}
                                    >
                                        {s.id < step ? <Check className="w- h-5" /> : s.id}
                                    </div>

                                    {/* Etiqueta del paso */}
                                    <span className={`absolute -bottom-8 whitespace-nowrap text-sm transition-colors ${s.id <= step ? 'text-white font-medium' : 'text-gray-500'
                                        }`}>
                                        {s.label}
                                    </span>
                                </div>

                                {/* Línea conectora */}
                                {index < array.length - 1 && (
                                    <div className="flex-1 h-0.5 mx-2 bg-gray-700">
                                        <div
                                            className={`h-full transition-all duration-500 ${s.id < step ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600' : 'w-0'
                                                }`}
                                            style={{ width: s.id < step ? '100%' : '0%' }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <Card className="p-8">


                    {/* Step 1: Role Selection */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Selecciona tu rol</h2>
                                <p className="text-gray-400">¿Cómo quieres usar GlobalStore?</p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {roles.map((role) => (
                                    <div
                                        key={role.value}
                                        onClick={() => setFormData({ ...formData, role: role.value })}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${formData.role === role.value
                                            ? 'border-cyan-500 bg-cyan-500/10'
                                            : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${role.color} flex items-center justify-center text-white mb-4 mx-auto`}>
                                            {role.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2 text-center">{role.title}</h3>
                                        <p className="text-xs text-center text-gray-400">{role.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Basic Information */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Información básica</h2>
                                <p className="text-gray-400">Crea tu cuenta de usuario</p>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    label="Nombre de usuario"
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    placeholder="Tu nombre de usuario"
                                />

                                <Input
                                    label="Correo electrónico"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    placeholder="tu@email.com"
                                />

                                <Input
                                    label="Contraseña"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    placeholder="Mínimo 6 caracteres"
                                    helperText="Debe tener al menos 6 caracteres"
                                />

                                <Input
                                    label="Confirmar contraseña"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    placeholder="Repite tu contraseña"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Role-Specific Data */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {formData.role === 'customer' && 'Información adicional'}
                                    {formData.role === 'store' && 'Datos de tu tienda'}
                                    {formData.role === 'supplier' && 'Datos de tu empresa'}
                                    {formData.role === 'company' && 'Datos de tu empresa'}
                                </h2>
                                <p className="text-gray-400">Completa tu perfil</p>
                            </div>

                            <div className="space-y-4">
                                {formData.role === 'customer' && (
                                    <>
                                        <Input
                                            label="Dirección (Opcional)"
                                            type="text"
                                            value={formData.address?.street || ''}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    address: { ...formData.address, street: e.target.value },
                                                })
                                            }
                                            placeholder="Calle y número"
                                        />
                                    </>
                                )}

                                {formData.role === 'store' && (
                                    <>
                                        <Input
                                            label="Nombre de la tienda"
                                            type="text"
                                            value={formData.storeName || ''}
                                            onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                            required
                                            placeholder="Mi Tienda"
                                        />
                                        <Input
                                            label="Nombre del propietario"
                                            type="text"
                                            value={formData.ownerName || ''}
                                            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                            required
                                            placeholder="Juan Pérez"
                                        />
                                        <Input
                                            label="Teléfono (Opcional)"
                                            type="tel"
                                            value={formData.storePhone || ''}
                                            onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
                                            placeholder="555-1234"
                                        />
                                    </>
                                )}

                                {formData.role === 'supplier' && (
                                    <>
                                        <Input
                                            label="Nombre del Proveedor / Vendedor"
                                            value={formData.supplierName || ''}
                                            onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                                            required
                                            placeholder="Tu nombre o nombre comercial"
                                        />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Empresa a la que representas
                                            </label>
                                            <select
                                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                                                value={formData.companyId || ''}
                                                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                                                required
                                            >
                                                <option value="">Selecciona una empresa</option>
                                                {companies.map((company) => (
                                                    <option key={company._id} value={company._id}>
                                                        {company.companyName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <Input
                                            label="Email de Contacto"
                                            type="email"
                                            value={formData.supplierEmail || ''}
                                            onChange={(e) => setFormData({ ...formData, supplierEmail: e.target.value })}
                                            required
                                            placeholder="contacto@proveedor.com"
                                        />
                                        <Input
                                            label="Teléfono"
                                            value={formData.supplierPhone || ''}
                                            onChange={(e) => setFormData({ ...formData, supplierPhone: e.target.value })}
                                            required
                                            placeholder="+52 555 123 4567"
                                        />
                                    </>
                                )}

                                {formData.role === 'company' && (
                                    <>
                                        <Input
                                            label="Nombre de la Empresa / Marca"
                                            type="text"
                                            value={formData.companyName || ''}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                            required
                                            placeholder="Coca-Cola, Nestlé, etc."
                                        />
                                        <Input
                                            label="Correo de Contacto"
                                            type="email"
                                            value={formData.companyEmail || ''}
                                            onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                                            required
                                            placeholder="contacto@empresa.com"
                                        />
                                        <Input
                                            label="Teléfono"
                                            type="tel"
                                            value={formData.companyPhone || ''}
                                            onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                                            required
                                            placeholder="555-0000"
                                        />
                                        <Input
                                            label="Descripción"
                                            type="text"
                                            value={formData.description || ''}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Descripción breve de la empresa"
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Confirmation */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Confirma tu información</h2>
                                <p className="text-gray-400">Revisa que todo esté correcto</p>
                            </div>

                            <div className="bg-gray-900/50 rounded-lg p-6 space-y-4 border border-gray-700">
                                <div>
                                    <p className="text-sm text-gray-500">Rol</p>
                                    <p className="font-semibold text-white capitalize">{formData.role}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Usuario</p>
                                    <p className="font-semibold text-white">{formData.username}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold text-white">{formData.email}</p>
                                </div>
                                {formData.role === 'store' && (
                                    <>
                                        <div>
                                            <p className="text-sm text-gray-500">Tienda</p>
                                            <p className="font-semibold text-white">{formData.storeName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Propietario</p>
                                            <p className="font-semibold text-white">{formData.ownerName}</p>
                                        </div>
                                    </>
                                )}
                                {formData.role === 'supplier' && (
                                    <>
                                        <div>
                                            <p className="text-sm text-gray-500">Empresa Dist.</p>
                                            <p className="font-semibold text-white">{formData.companyName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Contacto</p>
                                            <p className="font-semibold text-white">{formData.supplierName}</p>
                                        </div>
                                    </>
                                )}
                                {formData.role === 'company' && (
                                    <>
                                        <div>
                                            <p className="text-sm text-gray-500">Marca/Empresa</p>
                                            <p className="font-semibold text-white">{formData.companyName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email Contacto</p>
                                            <p className="font-semibold text-white">{formData.companyEmail}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        {step > 1 ? (
                            <Button variant="outline" onClick={handleBack}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Atrás
                            </Button>
                        ) : (
                            <div className="text-gray-400">
                                ¿Ya tienes cuenta?{' '}
                                <Link href="/login" className="font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent hover:from-cyan-300 hover:via-blue-400 hover:to-purple-400">
                                    Iniciar Sesión
                                </Link>
                            </div>
                        )}

                        {step < 4 ? (
                            <Button onClick={handleNext}>
                                Siguiente
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} isLoading={loading}>
                                Crear Cuenta
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
