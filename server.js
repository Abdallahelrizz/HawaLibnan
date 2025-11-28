// Express server setup
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow requests from frontend
  credentials: true
}));

// Routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const placeRoutes = require('./routes/placeRoutes');

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/places', placeRoutes);

// Start server
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
