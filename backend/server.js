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

// Simple CORS configuration
const corsOptions = {
  origin: ['https://captoneproject-one.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reading-sessions', readingSessionRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ReadingHub API is running',
    cors: 'enabled',
    origin: req.headers.origin || 'none',
    timestamp: new Date().toISOString()
  });
});

// CORS test endpoint
app.get('/cors-test', (req, res) => {
  res.json({
    message: 'CORS is working!',
    origin: req.headers.origin || 'none',
    method: req.method,
    timestamp: new Date().toISOString()
  });
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
