// routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// POST /auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token (you can also use JWT)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Save token and expiry time in the user's document (optional)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // You can use any email service
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: 'no-reply@yourdomain.com',
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested a password reset for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://localhost:3000/reset/${resetToken}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Reset link sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending reset link. Please try again.' });
  }
});

module.exports = router;
