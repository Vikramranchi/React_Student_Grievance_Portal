// routes/studentRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const Student = require('../models/Student');
const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'User not found. Please register.' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful', redirectTo: '/first' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register Route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ message: 'User already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    student = new Student({ email, password: hashedPassword });
    await student.save();

    res.json({ message: 'Registration successful. Please login.', redirectTo: '/login' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
