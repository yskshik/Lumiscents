const http = require('http');

const testHealth = () => {
    const options = {
        hostname: 'localhost',
        port: 4001,
        path: '/api/v1/health',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('Response:', data);
        });
    });

    req.on('error', (error) => {
        console.error('Error:', error.message);
    });

    req.end();
};

console.log('Testing backend health...');
testHealth();
