const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

// Broadened CORS middleware with logging
app.use((req, res, next) => {
    const origin = req.headers.origin;
    console.log('Request Method:', req.method, 'Received Origin:', origin, 'URL:', req.url);
    if (origin && origin.includes('studio-neha-frontend')) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        console.log('CORS Allowed for Origin:', origin);
    } else {
        console.log('CORS Not Allowed for Origin:', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    if (req.method === 'OPTIONS') {
        console.log('OPTIONS Request handled with 204');
        return res.status(204).end();
    }
    next();
});

app.post('/api/send-booking', async (req, res) => {
    const { name, service, date, time, details } = req.body;

    console.log('POST Request Body:', req.body);
    if (!name || !service || !date || !time) {
        return res.status(400).json({ success: false, error: 'All required fields must be provided' });
    }

    console.log('Starting email process', { name, service, date, time, details });
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nehamakeup01@gmail.com',
            pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 10000,
        timeout: 20000
    });

    console.log('Transporter created, EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

    const mailOptions = {
        from: 'Studio Neha Beauty <nehamakeup01@gmail.com>',
        to: 'nehamakeup01@gmail.com',
        subject: 'New Booking Request - Studio Neha Beauty',
        html: `
            <h2 style="color: #db2777;">🌸 New Booking Request 🌸</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Additional Details:</strong> ${details || 'None'}</p>
            <p style="color: