const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Protected Test Route
const authMiddleware = require('./middleware/auth');
app.get('/api/user/profile', authMiddleware, (req, res) => {
  res.json({ message: 'Welcome to your profile!', user: req.user });
});

// Database Start & Server Init
const startServer = async () => {
  try {
    const mongoUri = process.env.DATABASE_URL;

    if (!mongoUri) {
      throw new Error('DATABASE_URL environment variable is not set. Please connect a MongoDB service.');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Backend Auth API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
