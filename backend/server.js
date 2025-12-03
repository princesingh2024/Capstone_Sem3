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

// Initialize Prisma Client
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration - more permissive for debugging
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://capstone-sem3-j7sk.vercel.app',
      'https://capstone-sem3-five.vercel.app',
      'https://capstone-frontend.onrender.com'
    ];
    
    // Check exact matches first
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow any Vercel deployment URL for this project
    if (origin && (
      (origin.includes('capstone-sem3') && origin.includes('vercel.app')) ||
      (origin.includes('capstone-frontend') && origin.includes('onrender.com'))
    )) {
      console.log('CORS allowed for deployment:', origin);
      return callback(null, true);
    }
    
    // In production, be more permissive for HTTPS origins (temporary for debugging)
    if (process.env.NODE_ENV === 'production' && origin && origin.startsWith('https://')) {
      console.log('CORS allowed for HTTPS origin in production:', origin);
      return callback(null, true);
    }
    
    // For debugging - log the origin that's being blocked
    console.log('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400 // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

// Handle preflight requests explicitly
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(200);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reading-sessions', readingSessionRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ReadingHub API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, async () => {
  console.log(`🚀 ReadingHub Server running on port ${PORT}`);
  console.log(`📚 API Health: http://localhost:${PORT}/health`);
  console.log(`🔑 JWT_SECRET configured:`, !!process.env.JWT_SECRET);
  console.log(`🗄️ DATABASE_URL configured:`, !!process.env.DATABASE_URL);
  console.log(`🌍 NODE_ENV:`, process.env.NODE_ENV);
  
  // Test database connection (don't exit on failure for now)
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('⚠️ Server will continue without database connection');
  }
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
