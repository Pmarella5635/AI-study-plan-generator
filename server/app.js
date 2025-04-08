// server/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');
const planRoutes = require('./routes/plans');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'https://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Test route
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API is working' });
});

// Routes - SIMPLIFIED with no auth
app.use('/api/plans', planRoutes);

// Error handling
app.use(errorHandler);

// 404 Not Found
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;