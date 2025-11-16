const mongoose = require('mongoose');
const Product = require('./models/product');
require('dotenv').config();

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.DB_LOCAL_URI || 'mongodb://localhost:27017/lumiscents');
        console.log('Connected to MongoDB...');

        const count = await Product.countDocuments();
        console.log('Total products in database:', count);
        
        if (count > 0) {
            const products = await Product.find({}, 'name price category');
            console.log('Products found:');
            products.forEach(p => console.log(`- ${p.name} ($${p.price})`));
        } else {
            console.log('No products found in database');
        }
        
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkProducts();
