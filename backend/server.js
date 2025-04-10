const express = require('express');
const mongoose = require('mongoose');
const logger = require('./logger'); // 👈 Import custom logger
const app = require('./app');

const PORT = process.env.PORT || 4000;
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/usersdb';

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  logger.info('✅ Connected to MongoDB');

  // Log every request manually
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  app.get('/', (req, res) => {
    res.send('👋 Hello from Express!');
  });

  app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
})
.catch(err => {
  logger.error(`❌ MongoDB connection failed: ${err.message}`);
});
