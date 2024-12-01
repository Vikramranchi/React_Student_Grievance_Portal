// server/routes/students.js
const express = require('express');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');

const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'This email is already registered.' });
    }

    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new student and save to the database
    const newStudent = new Student({
      email,
      password: hashedPassword,
    });

    await newStudent.save();
    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
