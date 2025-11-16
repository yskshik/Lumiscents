const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

console.log('Testing MongoDB connection...');
console.log('DB_URI:', process.env.DB_URI);

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then((con) => {
    console.log('✅ MongoDB connected successfully!');
    console.log('Host:', con.connection.host);
    console.log('Database:', con.connection.name);
    process.exit(0);
})
.catch((err) => {
    console.log('❌ MongoDB connection failed:');
    console.log('Error:', err.message);
    console.log('Full error:', err);
    process.exit(1);
});

// Timeout after 10 seconds
setTimeout(() => {
    console.log('❌ Connection test timed out');
    process.exit(1);
}, 10000);
