const express = require('express');
const cors = require('cors');
const userRoutes = require('./userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/user', userRoutes);

module.exports = app;