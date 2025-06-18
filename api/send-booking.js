const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://studio-neha-frontend-cptlhm08f-sahil-rupesh-surves-projects.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // No content for OPTIONS
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    const { name, service, date, time, details } = body ? JSON.parse(body) : {};

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    if (!name || !service || !date || !time) {
      return res.status(400).json({ success: false, error: 'All required fields must be provided' });
    }

    console.log('Starting email process');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nehamakeup01@gmail.com',
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 10000,
      timeout: 20000
    });

    console.log('Transporter created, EMAIL_PASS:', process.env.EMAIL_PASS);

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
      console.log('Sending email...');
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
      res.status(200).json({ success: true, message: 'Booking request sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, error: 'Failed to send email' });
    }
  });
};