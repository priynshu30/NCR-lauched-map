/**
 * NCR LaunchMap — Express Server
 * ================================
 * Entrypoint for the Node.js backend.
 *
 * Features:
 *  - CORS configured for the React client origin
 *  - express-rate-limit to prevent abuse
 *  - JSON body parsing (max 1mb)
 *  - MongoDB connection via Mongoose
 *  - Modular routes: /api/jobs, /api/companies
 *  - Health check endpoint: GET /health
 *
 * Usage:
 *   node src/server.js            (production)
 *   nodemon src/server.js         (development)
 */

'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const jobsRouter = require('./routes/jobs');
const companiesRouter = require('./routes/companies');

// ─── Config ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ncr_launchmap';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// ─── Express App ──────────────────────────────────────────────────────────────
const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow requests from the React Vite dev server and any production domain.
app.use(
  cors({
    origin: [
      CLIENT_ORIGIN,
      'http://localhost:5173',
      'http://localhost:3000',
      // Add your production domain here, e.g.:
      // 'https://ncr-launchmap.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
// Applies to all /api/* routes. Protects against scraping / abuse.
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),               // 100 req / window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please slow down.' },
});
app.use('/api', apiLimiter);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  const status = mongoose.connection.readyState === 1 ? 'ok' : 'degraded';
  res.json({
    status,
    service: 'ncr-launchmap-api',
    timestamp: new Date().toISOString(),
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/jobs', jobsRouter);
app.use('/api/companies', companiesRouter);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ─── MongoDB Connection + Server Start ────────────────────────────────────────
async function startServer() {
  try {
    console.log(`\n🗺️  NCR LaunchMap API Server`);
    console.log(`📦 Connecting to MongoDB: ${MONGO_URI}`);

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running at http://localhost:${PORT}`);
      console.log(`📡 Health: http://localhost:${PORT}/health`);
      console.log(`🔍 Jobs:   http://localhost:${PORT}/api/jobs?lat=28.6&lng=77.2&radius=30`);
      console.log(`🏢 Hiring: http://localhost:${PORT}/api/companies/hiring\n`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

// Handle unexpected MongoDB disconnects
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Reconnecting...');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

startServer();
