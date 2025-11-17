const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.DB_LOCAL_URI || 'mongodb://localhost:27017/Lumiscents');
        console.log('Connected to MongoDB...');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@Lumiscents.com' });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log(`Email: ${existingAdmin.email}, Role: ${existingAdmin.role}`);
            process.exit();
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const admin = new User({
            name: 'Admin User',
            email: 'admin@Lumiscents.com',
            password: hashedPassword,
            role: 'admin',
            avatar: {
                public_id: 'avatars/admin',
                url: 'https://res.cloudinary.com/demo/image/upload/v1588795943/sample.jpg'
            }
        });

        await admin.save();
        console.log('Admin user created successfully!');
        console.log('Login credentials:');
        console.log('Email: admin@Lumiscents.com');
        console.log('Password: admin123');
        console.log('Role: admin');
        
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
