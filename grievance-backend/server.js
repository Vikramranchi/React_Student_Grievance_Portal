// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const validator = require('validator');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
const corsOptions = {
  origin: 'https://harmonious-paprenjak-d43e35.netlify.app', // Your front-end origin
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json()); // Added body-parser

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/grievancePortal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Define Grievance Schema and Model
const grievanceSchema = new mongoose.Schema({
  name: String,
  rollNo: String,
  course: String,
  program: String,
  phoneNumber: String,
  email: String,
  category: String,
  description: String,
  timestamp: { type: Date, default: Date.now },
});
const Grievance = mongoose.model('Grievance', grievanceSchema);

// Define Response Schema and Model
const responseSchema = new mongoose.Schema({
  grievanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Grievance', required: true },
  responseText: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  email: { type: String, required: true }, // Include email in schema
});
const Response = mongoose.model('Response', responseSchema);

// Define CommitteeMember Schema and Model
const committeeMemberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const CommitteeMember = mongoose.model('CommitteeMember', committeeMemberSchema);

// Define User (for password reset) Schema and Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});
const User = mongoose.model('User', userSchema);

// Define Student Schema and Model
const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const Student = mongoose.model('Student', studentSchema, 'students');



// Define Question Schema and Model
const questionSchema = new mongoose.Schema({
  email: { type: String, required: true },  // User email
  questionText: { type: String, required: true },  // Question content
  timestamp: { type: Date, default: Date.now }  // Time when the question was asked
});
const Question = mongoose.model('Question', questionSchema);

// Define Answer Schema and Model
const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }, // Reference to the question
  email: { type: String, required: true },  // User email
  answerText: { type: String, required: true },  // Answer content
  timestamp: { type: Date, default: Date.now }  // Time when the answer was submitted
});
const Answer = mongoose.model('Answer', answerSchema);

// POST /api/questions - Add a new question
// POST /api/questions - Add a new question
// Backend route to handle question submissions

// POST /api/questions - Add a new question
app.post('/api/questions', async (req, res) => {
  const { email, questionText } = req.body;
  if (!email || !questionText) {
    return res.status(400).json({ error: 'Email and questionText are required' });
  }

  try {
    const newQuestion = new Question({
      email,       // Email of the user submitting the question
      questionText,
      timestamp: new Date(),
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error posting question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Backend route to handle answer submissions
// Backend route to handle answer submissions
app.post('/api/answers', async (req, res) => {
  const { questionId, email, answerText } = req.body;
  if (!email || !answerText || !questionId) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Include timestamp while saving the answer
    const newAnswer = new Answer({
      email,
      answerText,
      questionId,
      timestamp: new Date(),
    });

    await newAnswer.save();

    // Add the answer to the question's answer array
    // question.answers.push(newAnswer);
    await question.save();

    res.status(201).json(newAnswer);
  } catch (error) {
    console.error('Error posting answer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// GET /api/questions - Fetch all questions
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find().sort({ timestamp: -1 });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching questions' });
  }
});

// GET /api/questions/:id - Fetch a specific question and its answers
// GET /api/questions/:id - Fetch a specific question and its answers
app.get('/api/questions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).send({ message: 'Question not found' });
    }

    // Fetch answers and include timestamps
    const answers = await Answer.find({ questionId: id }).sort({ timestamp: -1 });

    res.status(200).json({ question, answers });
  } catch (error) {
    res.status(500).send({ message: 'Error fetching question and answers' });
  }
});





// POST /api/grievances - Submit a grievance
app.post('/api/grievances', async (req, res) => {
  try {
    const grievance = new Grievance(req.body);
    await grievance.save();
    res.status(201).send('Grievance submitted successfully');
  } catch (err) {
    res.status(400).send('Error submitting grievance: ' + err.message);
  }
});

// GET /api/grievances - Fetch grievances for committee portal with sorting and filtering
app.get('/api/grievances', async (req, res) => {
  const { category, program, sort } = req.query;
  let query = {};

  if (category) query.category = category;
  if (program) query.program = program;

  try {
    const grievances = await Grievance.find(query).sort({ timestamp: sort === 'asc' ? 1 : -1 });
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grievances' });
  }
});

// GET /api/grievances/:id - Get grievance by ID with responses
app.get('/api/grievances/:id', async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    const responses = await Response.find({ grievanceId: req.params.id });
    res.json({ grievance, responses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grievance and responses' });
  }
});

// POST /api/responses - Submit a response to a grievance
app.post('/api/responses', async (req, res) => {
  const { email, grievanceId, responseText, timestamp } = req.body;

  try {
    const response = new Response({
      email, 
      grievanceId,
      responseText,
      timestamp,
    });
    
    await response.save();
    res.status(200).send({ message: 'Response saved successfully' });
  } catch (error) {
    console.error("Error saving response:", error);
    res.status(500).send({ message: 'Error saving response' });
  }
});


// GET /api/responses - Fetch responses for the logged-in user's grievances
app.get('/api/responses', async (req, res) => {
  const { email } = req.query;
  
  try {
    const responses = await Response.find({ email: email });  // Filter responses by email
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching responses' });
  }
});


// GET /api/grievances - Fetch grievances for the logged-in user
app.get('/api/grievances', async (req, res) => {
  const { category, program, email, sort } = req.query; // Accept email as a query parameter
  let query = {};

  if (email) query.email = email;  // Filter grievances by email if provided
  if (category) query.category = category;
  if (program) query.program = program;

  try {
    const grievances = await Grievance.find(query).sort({ timestamp: sort === 'asc' ? 1 : -1 });
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grievances' });
  }
});


// POST /api/students/register - Register a new student with password strength validation
app.post('/api/students/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'This email is already registered.' });
    }

    // Validate password strength
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: 'Password is not strong enough' });
    }

    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new student and save to database
    const newStudent = new Student({ email, password: hashedPassword });
    await newStudent.save();

    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// POST /api/students/login - Login handler for students
app.post('/api/students/login', async (req, res) => {
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

    // Create JWT token
    const payload = { email: student.email, id: student._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login - Login handler for committee members
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const member = await CommitteeMember.findOne({ email });
    if (!member) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/forgot-password - Rate limited password reset requests
const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 reset password requests per windowMs
});

app.post('/api/auth/forgot-password', resetPasswordLimiter, async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Student.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clear existing token before generating a new one
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save token and expiry time in the user's document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
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
      Please click on the following link, or paste it into your browser to complete the process:\n\n
      http://localhost:3000/reset-password/${resetToken}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent!' });
  } catch (error) {
    console.error('Error in forgot-password:', error);
    res.status(500).json({ message: 'Error sending password reset email' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
 