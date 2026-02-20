const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });
const { MONGO_URI } = require('./backend/src/config/environment/env');

const Product = require('./backend/src/models/Product');

async function check() {
    try {
        console.log('Connecting to:', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const count = await Product.countDocuments({ company: 'Coca Cola Conpany' });
        console.log("Count exact match 'Coca Cola Conpany':", count);

        const regexCount = await Product.countDocuments({ company: { $regex: 'Coca Cola Conpany', $options: 'i' } });
        console.log("Count regex match 'Coca Cola Conpany':", regexCount);

        const companies = await Product.distinct('company');
        console.log('Distinct Companies:', companies);

        // Check for any company with 'Coca'
        const cocaProducts = await Product.find({ company: /Coca/i }, 'company');
        console.log('Products matching /Coca/i company:', cocaProducts);

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

check();
