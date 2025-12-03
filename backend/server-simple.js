import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Simple CORS - allow all origins for debugging
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ReadingHub API is running',
    timestamp: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`📚 Health: http://localhost:${PORT}/health`);
  console.log(`🧪 Test: http://localhost:${PORT}/test`);
});