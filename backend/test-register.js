const axios = require('axios');

const testRegistration = async () => {
    try {
        console.log('Testing registration endpoint...');
        
        const testUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: '123456'
        };
        
        const response = await axios.post('http://localhost:4001/api/v1/register', testUser, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Registration successful!');
        console.log('Response:', response.data);
        
    } catch (error) {
        console.log('❌ Registration failed!');
        console.log('Status:', error.response?.status);
        console.log('Error:', error.response?.data);
        console.log('Full error:', error.message);
    }
};

testRegistration();
