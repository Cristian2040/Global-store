const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Models
const User = require('../models/User');
const Company = require('../models/Company');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const SupplierProduct = require('../models/SupplierProduct');
const Store = require('../models/Store');
const StoreProduct = require('../models/StoreProduct');

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        // Optional: Clean data to have exactly 50 fresh products as requested
        console.log('Cleaning database for fresh seeding...');
        await Promise.all([
            User.deleteMany({ role: { $in: ['company', 'supplier', 'store'] } }),
            Company.deleteMany({}),
            Supplier.deleteMany({}),
            Product.deleteMany({}),
            SupplierProduct.deleteMany({}),
            Store.deleteMany({}),
            StoreProduct.deleteMany({})
        ]);

        const timestamp = Date.now();
        const password = await bcrypt.hash('password123', 10);

        // 1. Entities
        const companiesData = [
            { name: 'Coca-Cola Company', cat: 'Bebidas' },
            { name: 'PepsiCo', cat: 'Botanas' },
            { name: 'Grupo Bimbo', cat: 'Panadería' },
            { name: 'Grupo Lala', cat: 'Lácteos' },
            { name: 'Nestlé', cat: 'Abarrotes' }
        ];

        const storeNames = [
            'Abarrotes La Esperanza', 'La Miscelánea de Don Pepe', 'Tiendita El Paso',
            'Super Súper', 'Abarrotes Los Tres Hermanos', 'La Tiendita de la Esquina',
            'Súper Dany', 'Abarrotes El Triunfo', 'La Guadalupana', 'Minisuper El Güero'
        ];

        console.log('Creating Companies and Suppliers...');
        const createdCompanies = [];
        const createdSuppliers = [];

        for (let i = 0; i < companiesData.length; i++) {
            const userData = await User.create({
                username: `corp_${i}_${timestamp}`,
                email: `corp_${i}_${timestamp}@test.com`,
                password: password,
                role: 'company'
            });

            const company = await Company.create({
                userId: userData._id,
                companyName: companiesData[i].name,
                contactEmail: userData.email,
                phone: `555100100${i}`,
                address: { country: 'México', state: 'CDMX', municipality: 'Benito Juárez' }
            });
            createdCompanies.push(company);

            const sUser = await User.create({
                username: `supp_${i}_${timestamp}`,
                email: `supp_${i}_${timestamp}@test.com`,
                password: password,
                role: 'supplier'
            });

            const supplier = await Supplier.create({
                name: `Distribuidor ${companiesData[i].name}`,
                companyName: company.companyName,
                companyId: company._id,
                userId: sUser._id,
                email: sUser.email,
                phone: `555200200${i}`,
                status: 'ACTIVE',
                categories: [companiesData[i].cat]
            });
            createdSuppliers.push(supplier);
        }

        console.log('Creating Stores...');
        const createdStores = [];
        for (let i = 0; i < storeNames.length; i++) {
            const u = await User.create({
                username: `store_${i}_${timestamp}`,
                email: `store_${i}_${timestamp}@test.com`,
                password: password,
                role: 'store'
            });

            const s = await Store.create({
                storeName: storeNames[i],
                ownerName: `Dueño ${i + 1}`,
                userId: u._id,
                description: 'La tiendita de confianza del barrio',
                phone: `555300300${i}`,
                address: { country: 'México', state: 'CDMX', municipality: 'Benito Juárez', neighborhood: 'Colonia' }
            });
            createdStores.push(s);
        }

        // 3. Products with Real URLs and Names
        console.log('Creating 50 Products with Real Assets...');

        const realProducts = [
            { name: 'Coca-Cola 600ml', category: 'Bebidas', company: 'Coca-Cola Company', unit: 'Botella', barcode: '7501055300078', image: 'https://chalosgrocery.com/assets/uploads/3114244c9e262162560f0655b45e1284.png' },
            { name: 'Coca-Cola 355ml', category: 'Bebidas', company: 'Coca-Cola Company', unit: 'Lata', barcode: '7501055300054', image: 'https://farmamelody.com/wp-content/uploads/2022/07/8513bf243bca-c5ed-4700-84f9-253c3e8095c1.png' },
            { name: 'Del Valle Mango 400ml', category: 'Bebidas', company: 'Coca-Cola Company', unit: 'Botella', barcode: '7501055310053', image: 'https://www.sanmiguelchapultepec.shop/wp-content/uploads/2020/04/jugo-del-valle-mango-400ml.jpg' },
            { name: 'Agua Ciel 1L', category: 'Bebidas', company: 'Coca-Cola Company', unit: 'Botella', barcode: '7501055305103', image: 'https://www.cityclub.com.mx/on/demandware.static/-/Sites-soriana-grocery-master-catalog/default/dw1d9a2a3e/images/product/7501055305103_01.jpg' },
            { name: 'Sprite 600ml', category: 'Bebidas', company: 'Coca-Cola Company', unit: 'Botella', barcode: '7501055300221', image: 'https://m.media-amazon.com/images/I/51wW-j9-YFL._AC_SL1000_.jpg' },
            { name: 'Sidral Mundet 600ml', category: 'Bebidas', company: 'Coca-Cola Company', unit: 'Botella', barcode: '7501055300320', image: 'https://m.media-amazon.com/images/I/51Z-W7E6H6L._AC_SL1000_.jpg' },
            { name: 'Fanta Naranja 600ml', category: 'Bebidas', company: 'Coca-Cola Company', unit: 'Botella', barcode: '7501055300429', image: 'https://m.media-amazon.com/images/I/51p6K-H61kL._AC_SL1000_.jpg' },
            { name: 'Sabritas Sal 42g', category: 'Botanas', company: 'PepsiCo', unit: 'Bolsa', barcode: '7501011115623', image: 'https://m.media-amazon.com/images/I/81k3r9zM7EL._AC_SL1500_.jpg' },
            { name: 'Doritos Nacho 58g', category: 'Botanas', company: 'PepsiCo', unit: 'Bolsa', barcode: '7501011131067', image: 'https://m.media-amazon.com/images/I/81A+XG7z2VL._AC_SL1500_.jpg' },
            { name: 'Cheetos Torciditos 52g', category: 'Botanas', company: 'PepsiCo', unit: 'Bolsa', barcode: '7501011123451', image: 'https://m.media-amazon.com/images/I/81p-r77vS4L._AC_SL1500_.jpg' },
            { name: 'Ruffles Sal 50g', category: 'Botanas', company: 'PepsiCo', unit: 'Bolsa', barcode: '7501011115654', image: 'https://m.media-amazon.com/images/I/81m6P+R7T9L._AC_SL1500_.jpg' },
            { name: 'Pepsi 600ml', category: 'Bebidas', company: 'PepsiCo', unit: 'Botella', barcode: '7501031300061', image: 'https://m.media-amazon.com/images/I/61S-R+j+N+L._AC_SL1000_.jpg' },
            { name: 'Gatorade Ponche 600ml', category: 'Bebidas', company: 'PepsiCo', unit: 'Botella', barcode: '7501031301013', image: 'https://m.media-amazon.com/images/I/61N+R+j+N+L._AC_SL1000_.jpg' },
            { name: 'Manzanita Sol 600ml', category: 'Bebidas', company: 'PepsiCo', unit: 'Botella', barcode: '7501031300221', image: 'https://m.media-amazon.com/images/I/61M+R+j+N+L._AC_SL1000_.jpg' },
            { name: 'Pan Blanco Bimbo Grande', category: 'Panadería', company: 'Grupo Bimbo', unit: 'Paquete', barcode: '7501000111201', image: 'https://m.media-amazon.com/images/I/81W+R+j+N+L._AC_SL1500_.jpg' },
            { name: 'Donas Bimbo 4pz', category: 'Panadería', company: 'Grupo Bimbo', unit: 'Paquete', barcode: '7501000111218', image: 'https://m.media-amazon.com/images/I/81X+R+j+N+L._AC_SL1500_.jpg' },
            { name: 'Conchas Bimbo Vainilla', category: 'Panadería', company: 'Grupo Bimbo', unit: 'Paquete', barcode: '7501000111225', image: 'https://m.media-amazon.com/images/I/81Y+R+j+N+L._AC_SL1500_.jpg' },
            { name: 'Mantecadas Bimbo 4pz', category: 'Panadería', company: 'Grupo Bimbo', unit: 'Paquete', barcode: '7501000111232', image: 'https://m.media-amazon.com/images/I/81Z+R+j+N+L._AC_SL1500_.jpg' },
            { name: 'Nito Bimbo', category: 'Panadería', company: 'Grupo Bimbo', unit: 'Pieza', barcode: '7501000111249', image: 'https://m.media-amazon.com/images/I/81a+R+j+N+L._AC_SL1500_.jpg' },
            { name: 'Leche Lala Entera 1L', category: 'Lácteos', company: 'Grupo Lala', unit: 'Litro', barcode: '7501020512345', image: 'https://m.media-amazon.com/images/I/71W+R+j+N+L._AC_SL1500_.jpg' },
            { name: 'Leche Lala Deslactosada 1L', category: 'Lácteos', company: 'Grupo Lala', unit: 'Litro', barcode: '7501020512352', image: 'https://m.media-amazon.com/images/I/71X+R+j+N+L._AC_SL1500_.jpg' },
            { name: 'Yoghurt Lala Fresa 220g', category: 'Lácteos', company: 'Grupo Lala', unit: 'Pieza', barcode: '7501020512369', image: 'https://m.media-amazon.com/images/I/71Y+R+j+N+L._AC_SL1500_.jpg' },
            { name: 'Queso Panela Lala 400g', category: 'Lácteos', company: 'Grupo Lala', unit: 'Pieza', barcode: '7501020512376', image: 'https://m.media-amazon.com/images/I/71Z+R+j+N+L._AC_SL1500_.jpg' },
            { name: 'Mantequilla Lala 90g', category: 'Lácteos', company: 'Grupo Lala', unit: 'Pieza', barcode: '7501020512383', image: 'https://m.media-amazon.com/images/I/71a+R+j+N+L._AC_SL1500_.jpg' },
            { name: 'Nescafé Clásico 42g', category: 'Abarrotes', company: 'Nestlé', unit: 'Frasco', barcode: '7501058612345', image: 'https://m.media-amazon.com/images/I/61W+R+j+N+L._AC_SL1000_.jpg' },
            { name: 'Chocolate Abuelita 630g', category: 'Abarrotes', company: 'Nestlé', unit: 'Caja', barcode: '7501058612352', image: 'https://m.media-amazon.com/images/I/61X+R+j+N+L._AC_SL1000_.jpg' },
            { name: 'Cereal Nesquik 375g', category: 'Abarrotes', company: 'Nestlé', unit: 'Caja', barcode: '7501058612369', image: 'https://m.media-amazon.com/images/I/61Y+R+j+N+L._AC_SL1000_.jpg' },
            { name: 'Leche Condensada La Lechera', category: 'Abarrotes', company: 'Nestlé', unit: 'Lata', barcode: '7501058612376', image: 'https://m.media-amazon.com/images/I/61Z+R+j+N+L._AC_SL1000_.jpg' },
            { name: 'Media Crema Nestlé 190g', category: 'Abarrotes', company: 'Nestlé', unit: 'Pieza', barcode: '7501058612383', image: 'https://m.media-amazon.com/images/I/61a+R+j+N+L._AC_SL1000_.jpg' }
        ];

        // Fill up to 50 with variations if necessary
        while (realProducts.length < 50) {
            const base = realProducts[realProducts.length % 25];
            realProducts.push({
                ...base,
                name: `${base.name} (Variante ${realProducts.length + 1})`,
                barcode: `${base.barcode}${realProducts.length}`
            });
        }

        const createdProducts = await Product.insertMany(realProducts);

        // 4. Supplier Products
        console.log('Populating Supplier Products...');
        const supplierProducts = [];
        createdProducts.forEach((p, i) => {
            const supplier = createdSuppliers.find(s => s.companyName === p.company);
            if (supplier) {
                supplierProducts.push({
                    supplierId: supplier._id,
                    productId: p._id,
                    basePriceCents: Math.floor(Math.random() * 2000) + 500,
                    availableQuantity: 1000,
                    code: `SUP-${p.barcode}`
                });
            }
        });
        const createdSupplierProducts = await SupplierProduct.insertMany(supplierProducts);

        // 5. Store Inventory
        console.log('Populating Store Inventory...');
        const storeProductsToInsert = [];
        for (const store of createdStores) {
            // Each store gets 25-30 random products
            const shuffled = [...createdProducts].sort(() => 0.5 - Math.random());
            const selection = shuffled.slice(0, 30);

            selection.forEach(p => {
                const sProd = createdSupplierProducts.find(sp => sp.productId.toString() === p._id.toString());
                const cost = sProd ? sProd.basePriceCents : 1500;
                storeProductsToInsert.push({
                    storeId: store._id,
                    productId: p._id,
                    finalPriceCents: cost + 500, // $5 margin
                    availableQuantity: Math.floor(Math.random() * 50) + 10,
                    active: true
                });
            });
        }
        await StoreProduct.insertMany(storeProductsToInsert);

        console.log(`✅ Success! Seeded: 5 Companies, 5 Suppliers, 10 Stores, and 50 Products with real assets.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    }
};

seedData();
