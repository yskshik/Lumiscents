const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

const checkUserRole = async () => {
    try {
        await mongoose.connect(process.env.DB_LOCAL_URI || 'mongodb://localhost:27017/Lumiscents');
        console.log('Connected to MongoDB...');

        const users = await User.find({}, 'email role name');
        console.log('Users in database:');
        users.forEach(user => {
            console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
        });
        
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUserRole();
