const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/CommitteeMember');

// Login handler
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
