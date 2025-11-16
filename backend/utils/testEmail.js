const nodemailer = require('nodemailer');

// Create a test email service using Ethereal (fake SMTP)
const createTestEmailService = async () => {
    try {
        // Generate test SMTP service account from ethereal.email
        const testAccount = await nodemailer.createTestAccount();
        
        console.log('Test Email Account Created:');
        console.log('Email:', testAccount.user);
        console.log('Password:', testAccount.pass);
        
        // Create transporter with test account
        const transporter = nodemailer.createTransporter({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        
        return transporter;
    } catch (error) {
        console.error('Failed to create test email service:', error);
        return null;
    }
};

module.exports = { createTestEmailService };
