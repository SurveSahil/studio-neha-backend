const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// Configure CORS to allow the frontend origin and handle preflight
app.use(cors({
  origin: 'https://studio-neha-frontend.vercel.app', // Matches your frontend URL
  methods: ['GET', 'POST', 'OPTIONS'], // Explicitly allow OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  credentials: true // Optional, if using cookies/auth
}));

app.use(express.json());

// Explicitly handle OPTIONS preflight request
app.options('/api/send-booking', (req, res) => {
  res.set('Access-Control-Allow-Origin', 'https://studio-neha-frontend.vercel.app');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).send(); // Respond with 200 OK for preflight
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nehamakeup01@gmail.com',
    pass: process.env.EMAIL_PASS
  }
});

// Handle POST requests
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { name, service, date, time, details } = req.body;

  if (!name || !service || !date || !time) {
    return res.status(400).json({ success: false, error: 'All required fields must be provided' });
  }

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
      <p style="color: #4b5563;">Thank you for choosing Studio Neha Beauty! Please confirm the appointment with the client.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.set('Access-Control-Allow-Origin', 'https://studio-neha-frontend.vercel.app'); // Set CORS for response
    res.status(200).json({ success: true, message: 'Booking request sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.set('Access-Control-Allow-Origin', 'https://studio-neha-frontend.vercel.app'); // Set CORS for error response
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
};