'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Store, Truck, Users, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const features = [
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: 'Compra Fácil',
      description: 'Encuentra productos de tiendas locales en un solo lugar',
    },
    {
      icon: <Store className="w-8 h-8" />,
      title: 'Gestiona tu Tienda',
      description: 'Administra inventario, pedidos y ventas eficientemente',
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Proveedores',
      description: 'Conecta con tiendas y gestiona entregas fácilmente',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Comunidad',
      description: 'Únete a miles de usuarios, tiendas y proveedores',
    },
  ];

  const benefits = [
    'Gestión de inventario en tiempo real',
    'Pedidos y entregas rastreables',
    'Múltiples métodos de pago',
    'Reportes y analíticas',
    'Soporte 24/7',
    'Interfaz intuitiva',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Image src="/logo.png" alt="GlobalStore" width={40} height={40} />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GlobalStore
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary">Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Tu plataforma de
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}comercio local
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Conectamos clientes, tiendas y proveedores en un ecosistema digital completo
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Comenzar Gratis
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Conocer Más
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/logo.png"
                  alt="GlobalStore Platform"
                  fill
                  className="object-contain p-12 bg-gradient-to-br from-blue-100 to-purple-100"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-xl text-gray-600">
              Una plataforma completa para cada tipo de usuario
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                ¿Por qué GlobalStore?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                La solución completa para modernizar tu negocio
              </p>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-1" />
                    <span className="text-blue-50">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Comienza hoy</h3>
              <p className="text-blue-100 mb-6">
                Únete a miles de usuarios que ya confían en GlobalStore
              </p>
              <Link href="/register">
                <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-gray-100">
                  Crear Cuenta Gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Image src="/logo.png" alt="GlobalStore" width={32} height={32} />
              <span className="text-xl font-bold">GlobalStore</span>
            </div>
            <p className="text-gray-400">
              © 2026 GlobalStore. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
