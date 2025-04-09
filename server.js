const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const cors = require('cors');

const User = require('./models/User');
const Card = require('./models/Card');

const app = express();
const PORT = 5000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/creditcards', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// Signup Route
app.post('/welcome', async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.send('User already exists.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullname, email, password: hashedPassword });
    await newUser.save();

    res.send(`<h2>Welcome, ${fullname}! Account created.</h2>`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Signup failed.');
  }
});

// Login Route
app.post('/dashboard', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.send('User not found.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send('Wrong password.');

    res.send(`<h2>Welcome back, ${user.fullname}!</h2>`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Login failed.');
  }
});

// Cards Route (Search by query param)
app.get('/api/cards', async (req, res) => {
  try {
    const search = req.query.search;
    const query = search
      ? { cardname: { $regex: new RegExp(search, 'i') } }
      : {};
    const cards = await Card.find(query);
    res.json(cards);
  } catch (error) {
    res.status(500).send('Error fetching cards');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
