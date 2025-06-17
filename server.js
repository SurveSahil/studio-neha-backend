const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors()); // Allow cross-origin requests
app.use(express.json());

// Configure Nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nehamakeup01@gmail.com',
    pass: process.env.EMAIL_PASS // Use environment variable for security
  }
});

app.post('/send-booking', async (req, res) => {
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
    res.status(200).json({ success: true, message: 'Booking request sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));