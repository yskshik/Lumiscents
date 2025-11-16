const mongoose = require('mongoose');
const Product = require('./models/product');
require('dotenv').config();

const fixProducts = async () => {
    try {
        await mongoose.connect(process.env.DB_LOCAL_URI || 'mongodb://localhost:27017/lumiscents');
        console.log('Connected to MongoDB...');

        // Update all products to have isActive: true
        const result = await Product.updateMany(
            {}, 
            { $set: { isActive: true } },
            { multi: true }
        );
        
        console.log(`Updated ${result.modifiedCount} products to be active`);
        
        // Verify the update
        const activeCount = await Product.countDocuments({ isActive: true });
        console.log(`Total active products: ${activeCount}`);
        
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixProducts();
