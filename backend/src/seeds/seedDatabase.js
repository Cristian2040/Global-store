const mongoose = require('mongoose');
const User = require('../models/User');
const Store = require('../models/Store');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');

/**
 * Database Seeder
 * 
 * Script para poblar la base de datos con datos de prueba
 * Útil para desarrollo y testing
 * 
 * Uso: node src/seeds/seedDatabase.js
 */

const seedDatabase = async () => {
    try {
        console.log('🌱 Iniciando seed de la base de datos...');

        // Limpiar datos existentes (opcional - comentar si no quieres borrar)
        // await User.deleteMany({});
        // await Store.deleteMany({});
        // await Supplier.deleteMany({});
        // await Product.deleteMany({});

        // 1. Crear usuarios de prueba
        console.log('👤 Creando usuarios...');
        const hashedPassword = await bcrypt.hash('password123', 10);

        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@globalstore.com',
            password: hashedPassword,
            role: 'admin',
            active: true
        });

        const storeUser = await User.create({
            username: 'store_owner',
            email: 'store@globalstore.com',
            password: hashedPassword,
            role: 'store',
            active: true
        });

        const supplierUser = await User.create({
            username: 'supplier_user',
            email: 'supplier@globalstore.com',
            password: hashedPassword,
            role: 'supplier',
            active: true
        });

        const customerUser = await User.create({
            username: 'customer',
            email: 'customer@globalstore.com',
            password: hashedPassword,
            role: 'customer',
            active: true
        });

        console.log('✅ Usuarios creados');

        // 2. Crear tiendas
        console.log('🏪 Creando tiendas...');
        const store = await Store.create({
            userId: storeUser._id,
            storeName: 'Mi Tienda Demo',
            ownerName: 'Juan Pérez',
            address: 'Calle Principal 123',
            phone: '555-0100',
            paymentMethods: [
                { method: 'CASH', active: true },
                { method: 'CARD', active: true }
            ],
            active: true
        });

        console.log('✅ Tienda creada');

        // 3. Crear proveedores
        console.log('📦 Creando proveedores...');
        const supplier = await Supplier.create({
            userId: supplierUser._id,
            name: 'Proveedor Demo',
            companyName: 'Distribuidora ABC',
            address: 'Av. Industrial 456',
            phone: '555-0200',
            email: 'contacto@proveedordemo.com',
            active: true
        });

        console.log('✅ Proveedor creado');

        // 4. Crear productos
        console.log('📱 Creando productos...');
        const products = await Product.insertMany([
            {
                name: 'iPhone 15 Pro',
                category: 'Electrónicos',
                company: 'Apple',
                barcode: '1234567890123',
                description: 'Smartphone de última generación'
            },
            {
                name: 'Samsung Galaxy S24',
                category: 'Electrónicos',
                company: 'Samsung',
                barcode: '1234567890124',
                description: 'Smartphone Android premium'
            },
            {
                name: 'MacBook Pro M3',
                category: 'Computadoras',
                company: 'Apple',
                barcode: '1234567890125',
                description: 'Laptop profesional'
            },
            {
                name: 'Coca Cola 2L',
                category: 'Bebidas',
                company: 'Coca Cola',
                barcode: '1234567890126',
                description: 'Refresco de cola'
            },
            {
                name: 'Doritos Nacho',
                category: 'Snacks',
                company: 'Sabritas',
                barcode: '1234567890127',
                description: 'Botana de maíz'
            }
        ]);

        console.log('✅ Productos creados');

        console.log('\n🎉 Seed completado exitosamente!');
        console.log('\n📊 Datos creados:');
        console.log(`   - ${4} usuarios`);
        console.log(`   - ${1} tienda`);
        console.log(`   - ${1} proveedor`);
        console.log(`   - ${products.length} productos`);

        console.log('\n🔐 Credenciales de prueba:');
        console.log('   Admin:    admin@globalstore.com / password123');
        console.log('   Store:    store@globalstore.com / password123');
        console.log('   Supplier: supplier@globalstore.com / password123');
        console.log('   Customer: customer@globalstore.com / password123');

    } catch (error) {
        console.error('❌ Error en seed:', error);
        throw error;
    }
};

// Si se ejecuta directamente
if (require.main === module) {
    const { MONGODB_URI } = require('../config/environment/env');

    mongoose.connect(MONGODB_URI)
        .then(() => {
            console.log('✅ Conectado a MongoDB');
            return seedDatabase();
        })
        .then(() => {
            console.log('\n✅ Proceso completado');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Error:', error);
            process.exit(1);
        });
}

module.exports = seedDatabase;
