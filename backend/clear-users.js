const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

const clearUsers = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('Connected to MongoDB');
        
        // Clear all users
        const result = await mongoose.connection.db.collection('users').deleteMany({});
        console.log(`✅ Deleted ${result.deletedCount} users from database`);
        
        console.log('Database cleared! You can now register with any email.');
        process.exit(0);
    } catch (error) {
        console.error('Error clearing database:', error);
        process.exit(1);
    }
};

clearUsers();
