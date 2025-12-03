// server.js (ES module)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import analyticsRoutes from './routes/analytics.js';
import readingSessionRoutes from './routes/readingSessions.js';
import collectionRoutes from './routes/collections.js';
import aiRoutes from './routes/ai.js';

dotenv.config();
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5001;

/**
 * Whitelist — add any exact origins you want to allow.
 * Keep this strict for production.
 */
const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://localhost:5173',
  'https://capstone-sem3-j7sk.vercel.app',
  'https://capstone-sem3-five.vercel.app',
  'https://capstone-frontend.onrender.com'
]);

/**
 * Simpler, reliable CORS handler:
 * - If there's no origin (curl / server-to-server) allow it.
 * - If origin is in whitelist OR matches known deployment patterns allow it.
 * - For preflight, we explicitly respond with 204 so browser gets headers quickly.
 */
const corsOptions = {
  origin: (origin, callback) => {
    // allow non-browser requests (curl, Postman, mobile)
    if (!origin) return callback(null, true);

    // exact whitelist match
    if (allowedOrigins.has(origin)) return callback(null, true);

    // allow your known deployment patterns (keeps whitelist easier to manage)
    if (origin.includes('capstone-sem3') && origin.includes('vercel.app')) {
      console.log('CORS allowed for deployment:', origin);
      return callback(null, true);
    }
    if (origin.includes('capstone-frontend') && origin.includes('onrender.com')) {
      console.log('CORS allowed for onrender frontend:', origin);
      return callback(null, true);
    }

    console.log('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // only set true if you actually use cookies/auth across origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  maxAge: 86400
};

// IMPORTANT: apply cors middleware BEFORE routes so it runs for preflight too
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Debug request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

// Explicitly handle OPTIONS preflight with the same cors policy.
// Using the cors() middleware here ensures consistent headers on preflight responses.
app.options('*', cors(corsOptions), (req, res) => res.sendStatus(204));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reading-sessions', readingSessionRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ReadingHub API is running' });
});

// Error handler (CORS errors may surface here)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err?.message || err);
  // If the error is CORS rejection from our origin callback, return 403 with message
  if (err && err.message && err.message.includes('Not allowed by CORS')) {
    return res.status(403).json({ error: 'CORS blocked this origin' });
  }
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, async () => {
  console.log(`🚀 ReadingHub Server running on port ${PORT}`);
  console.log(`📚 API Health: http://localhost:${PORT}/health`);
  console.log(`🔑 JWT_SECRET configured:`, !!process.env.JWT_SECRET);
  console.log(`🗄️ DATABASE_URL configured:`, !!process.env.DATABASE_URL);
  console.log(`🌍 NODE_ENV:`, process.env.NODE_ENV);
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error?.message || error);
    console.log('⚠️ Server will continue without database connection');
  }
});

server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
