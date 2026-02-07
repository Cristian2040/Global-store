'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShoppingBag, Store, Truck, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { RegisterFormData } from '@/types';

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
    const { register } = useAuth();
    const router = useRouter();

    const roles = [
        {
            value: 'customer' as const,
            title: 'Cliente',
            description: 'Compra productos de tiendas locales',
            icon: <ShoppingBag className="w-12 h-12" />,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            value: 'store' as const,
            title: 'Tienda',
            description: 'Vende productos y gestiona inventario',
            icon: <Store className="w-12 h-12" />,
            color: 'from-purple-500 to-pink-500',
        },
        {
            value: 'supplier' as const,
            title: 'Proveedor',
            description: 'Suministra productos a tiendas',
            icon: <Truck className="w-12 h-12" />,
            color: 'from-orange-500 to-red-500',
        },
    ];

    const handleNext = () => {
        setError('');

        if (step === 2) {
            // Validate step 2
            if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
                setError('Todos los campos son obligatorios');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Las contraseñas no coinciden');
                return;
            }
            if (formData.password.length < 6) {
                setError('La contraseña debe tener al menos 6 caracteres');
                return;
            }
        }

        if (step === 3) {
            // Validate step 3 based on role
            if (formData.role === 'store') {
                if (!formData.storeName || !formData.ownerName) {
                    setError('Nombre de tienda y propietario son obligatorios');
                    return;
                }
            } else if (formData.role === 'supplier') {
                if (!formData.companyName || !formData.supplierName) {
                    setError('Nombre de empresa y contacto son obligatorios');
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
            const submitData: any = {
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
                submitData.phone = formData.storePhone;
                submitData.address = formData.storeAddress;
            } else if (formData.role === 'supplier') {
                submitData.name = formData.supplierName;
                submitData.companyName = formData.companyName;
                submitData.email = formData.supplierEmail || formData.email;
                submitData.phone = formData.supplierPhone;
                submitData.categories = formData.categories || [];
            }

            await register(submitData);
        } catch (err: any) {
            setError(err.message);
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
                <div className="mb-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <div className="flex justify-between items-center">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex items-center flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-lg ${s <= step
                                        ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white shadow-blue-500/50'
                                        : 'bg-gray-800 text-gray-500 border-2 border-gray-600'
                                        }`}
                                >
                                    {s < step ? <Check className="w-5 h-5" /> : s}
                                </div>
                                {s < 4 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 transition-all rounded-full ${s < step ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600' : 'bg-gray-700'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-3 text-sm font-medium text-gray-300">
                        <span>Rol</span>
                        <span>Datos</span>
                        <span>Detalles</span>
                        <span>Confirmar</span>
                    </div>
                </div>

                {/* Form Card */}
                <Card className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Role Selection */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Selecciona tu rol</h2>
                                <p className="text-gray-400">¿Cómo quieres usar GlobalStore?</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                {roles.map((role) => (
                                    <div
                                        key={role.value}
                                        onClick={() => setFormData({ ...formData, role: role.value })}
                                        className={`cursor-pointer p-6 rounded-xl border-2 transition-all ${formData.role === role.value
                                            ? 'border-cyan-500 bg-cyan-500/10'
                                            : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${role.color} flex items-center justify-center text-white mb-4`}>
                                            {role.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">{role.title}</h3>
                                        <p className="text-sm text-gray-400">{role.description}</p>
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
                                            label="Nombre de la empresa"
                                            type="text"
                                            value={formData.companyName || ''}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                            required
                                            placeholder="Mi Empresa S.A."
                                        />
                                        <Input
                                            label="Nombre de contacto"
                                            type="text"
                                            value={formData.supplierName || ''}
                                            onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                                            required
                                            placeholder="María García"
                                        />
                                        <Input
                                            label="Teléfono (Opcional)"
                                            type="tel"
                                            value={formData.supplierPhone || ''}
                                            onChange={(e) => setFormData({ ...formData, supplierPhone: e.target.value })}
                                            placeholder="555-5678"
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
                                            <p className="text-sm text-gray-500">Empresa</p>
                                            <p className="font-semibold text-white">{formData.companyName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Contacto</p>
                                            <p className="font-semibold text-white">{formData.supplierName}</p>
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
                            <Link href="/login">
                                <Button variant="ghost">¿Ya tienes cuenta? Iniciar Sesión</Button>
                            </Link>
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
