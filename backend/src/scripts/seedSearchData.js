const mongoose = require('mongoose');
const Product = require('../models/Product');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const products = [
    {
        name: "Arduino Uno R3",
        description: "Placa microcontroladora basada en ATmega328P. Ideal para principiantes en electrónica y programación.",
        category: "Electrónica",
        company: "Arduino",
        tags: ["arduino", "microcontrolador", "hardware", "educación"],
        price: 450,
        barcode: "ARD001",
        image: "https://placehold.co/400"
    },
    {
        name: "Raspberry Pi 4 Model B",
        description: "Ordenador de placa única de alto rendimiento. 4GB RAM, WiFi dual band.",
        category: "Computación",
        company: "Raspberry Pi Foundation",
        tags: ["raspberry", "computadora", "linux", "iot"],
        price: 1200,
        barcode: "RPI004",
        image: "https://placehold.co/400"
    },
    {
        name: "Sensor de Temperatura DHT11",
        description: "Sensor digital de temperatura y humedad básico. Bajo costo.",
        category: "Sensores",
        company: "Generic",
        tags: ["sensor", "temperatura", "humedad", "arduino"],
        price: 85,
        barcode: "SEN001",
        image: "https://placehold.co/400"
    },
    {
        name: "Kit de Resistencias",
        description: "Pack de 500 resistencias de varios valores (1/4W).",
        category: "Componentes",
        company: "Generic",
        tags: ["resistencias", "componentes", "electrónica"],
        price: 150,
        barcode: "CMP001",
        image: "https://placehold.co/400"
    },
    {
        name: "Curso de Desarrollo Web",
        description: "Curso completo de HTML, CSS y JavaScript. Aprende frontend y backend.",
        category: "Educación",
        company: "GlobalLearning",
        tags: ["curso", "web", "programación", "frontend"],
        price: 2500,
        barcode: "EDU001",
        image: "https://placehold.co/400"
    },
    {
        name: "Laptop Gamer X",
        description: "Laptop potente para juegos y diseño. RTX 3060, 16GB RAM.",
        category: "Computación",
        company: "TechBrand",
        tags: ["laptop", "gamer", "computadora", "windows"],
        price: 25000,
        barcode: "LAP001",
        image: "https://placehold.co/400"
    },
    {
        name: "Libro: Inteligencia Artificial",
        description: "Introducción a la IA y Machine Learning. Conceptos básicos y avanzados.",
        category: "Libros",
        company: "Editorial Tech",
        tags: ["ia", "libro", "datos", "programación"],
        price: 600,
        barcode: "LIB001",
        image: "https://placehold.co/400"
    },
    {
        name: "Cámara de Seguridad WiFi",
        description: "Cámara IP 1080p con visión nocturna y detección de movimiento.",
        category: "Seguridad",
        company: "SafeHome",
        tags: ["seguridad", "cámara", "wifi", "hogar"],
        price: 899,
        barcode: "SEG001",
        image: "https://placehold.co/400"
    },
    {
        name: "Teclado Mecánico RGB",
        description: "Teclado mecánico switches azules, retroiluminación RGB configurable.",
        category: "Periféricos",
        company: "GameGear",
        tags: ["teclado", "gamer", "periféricos"],
        price: 1100,
        barcode: "PER001",
        image: "https://placehold.co/400"
    },
    {
        name: "Mouse Inalámbrico Ergonómico",
        description: "Mouse vertical para reducir fatiga en la muñeca.",
        category: "Periféricos",
        company: "ErgoTech",
        tags: ["mouse", "ergonomía", "periféricos", "oficina"],
        price: 450,
        barcode: "PER002",
        image: "https://placehold.co/400"
    }
];

// Generate more dynamic data to reach ~50
const categories = ["Electrónica", "Hogar", "Ropa", "Deportes", "Juguetes"];
const adjectives = ["Pro", "Max", "Ultra", "Lite", "Basic", "Super"];
const nouns = ["Gadget", "Device", "Tool", "Item", "Widget", "Gizmo"];

for (let i = 0; i < 40; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const name = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]} ${i + 1}`;
    price = Math.floor(Math.random() * 5000) + 50;

    products.push({
        name: name,
        description: `Descripción generada para ${name}. Producto de alta calidad en la categoría ${cat}.`,
        category: cat,
        company: `Company ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
        tags: [cat.toLowerCase(), "genérico", `tag${i}`],
        price: price,
        barcode: `GEN${1000 + i}`,
        image: "https://placehold.co/400"
    });
}

const seedTrace = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Optional: clear existing products or just upsert
        // await Product.deleteMany({}); 
        // console.log('Cleared existing products');

        for (const p of products) {
            await Product.findOneAndUpdate(
                { barcode: p.barcode },
                p,
                { upsert: true, new: true }
            );
        }

        console.log(`Seeded ${products.length} products`);
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedTrace();
