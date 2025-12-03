import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import geminiService from '../services/geminiService.js';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.userId = user.userId;
    next();
  });
};

// Get AI-powered book recommendations
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    console.log('Generating AI recommendations for user:', req.userId);

    // Get user's books
    const userBooks = await prisma.book.findMany({
      where: { userId: req.userId },
      select: {
        title: true,
        author: true,
        genre: true,
        status: true,
        rating: true
      }
    });

    if (userBooks.length === 0) {
      return res.json({
        recommendations: [],
        message: 'Add some books to your library to get personalized recommendations!'
      });
    }

    // Get user preferences (you can expand this)
    const preferences = {
      genres: [...new Set(userBooks.flatMap(book => book.genre || []))],
      authors: [...new Set(userBooks.map(book => book.author))].slice(0, 5)
    };

    const recommendations = await geminiService.generateBookRecommendations(userBooks, preferences);
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to generate recommendations',
      message: 'Please try again later'
    });
  }
});

// Get reading insights
router.get('/insights', authenticateToken, async (req, res) => {
  try {
    console.log('Generating reading insights for user:', req.userId);

    // Get user's books
    const userBooks = await prisma.book.findMany({
      where: { userId: req.userId }
    });

    // Get reading sessions if available
    const readingSessions = await prisma.readingSession.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
      take: 50 // Last 50 sessions
    });

    if (userBooks.length === 0) {
      return res.json({
        insights: {
          readingPatterns: 'Start adding books to your library to get personalized insights!',
          favoriteGenres: [],
          readingStrengths: 'Begin your reading journey by adding your first book.',
          suggestions: 'Add books you\'ve read or want to read to get AI-powered insights.',
          yearProgress: 'Your reading adventure is about to begin!'
        }
      });
    }

    const insights = await geminiService.generateReadingInsights(userBooks, readingSessions);
    
    res.json(insights);
  } catch (error) {
    console.error('Error getting reading insights:', error);
    res.status(500).json({ 
      error: 'Failed to generate insights',
      message: 'Please try again later'
    });
  }
});

// Get book summary
router.get('/summary/:bookId', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    console.log('Generating book summary for book:', bookId);

    // Get the book
    const book = await prisma.book.findFirst({
      where: {
        id: bookId,
        userId: req.userId
      }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const summary = await geminiService.generateBookSummary(
      book.title, 
      book.author, 
      book.notes || ''
    );
    
    res.json(summary);
  } catch (error) {
    console.error('Error generating book summary:', error);
    res.status(500).json({ 
      error: 'Failed to generate book summary',
      message: 'Please try again later'
    });
  }
});

// Get reading goals suggestions
router.get('/goals', authenticateToken, async (req, res) => {
  try {
    console.log('Generating reading goals for user:', req.userId);

    // Get user's books
    const userBooks = await prisma.book.findMany({
      where: { userId: req.userId }
    });

    // Get user's current reading goal
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { readingGoal: true }
    });

    const goals = await geminiService.generateReadingGoals(userBooks, user?.readingGoal);
    
    res.json(goals);
  } catch (error) {
    console.error('Error generating reading goals:', error);
    res.status(500).json({ 
      error: 'Failed to generate reading goals',
      message: 'Please try again later'
    });
  }
});

// Chat with AI about books
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { message, bookId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('AI chat request from user:', req.userId);

    let context = '';
    
    if (bookId) {
      // Get specific book context
      const book = await prisma.book.findFirst({
        where: {
          id: bookId,
          userId: req.userId
        }
      });
      
      if (book) {
        context = `Context: User is asking about "${book.title}" by ${book.author}. `;
        if (book.notes) context += `User's notes: ${book.notes}. `;
        if (book.review) context += `User's review: ${book.review}. `;
      }
    } else {
      // Get general reading context
      const recentBooks = await prisma.book.findMany({
        where: { userId: req.userId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: { title: true, author: true, status: true }
      });
      
      if (recentBooks.length > 0) {
        context = `Context: User's recent books: ${recentBooks.map(b => `"${b.title}" by ${b.author} (${b.status})`).join(', ')}. `;
      }
    }

    const prompt = `${context}User question: ${message}

Please provide a helpful, friendly response about books and reading. Keep it conversational and engaging.`;

    const result = await geminiService.model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    res.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      message: 'Please try again later'
    });
  }
});

export default router;