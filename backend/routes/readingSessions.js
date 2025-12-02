import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = user.userId;
    next();
  });
};

// Get all reading sessions
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sessions = await prisma.readingSession.findMany({
      where: { userId: req.userId },
      include: {
        book: {
          select: { id: true, title: true, author: true }
        }
      },
      orderBy: { date: 'desc' },
      skip,
      take: parseInt(limit)
    });

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching reading sessions:', error);
    res.status(500).json({ error: 'Failed to fetch reading sessions' });
  }
});

// Create new reading session
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { bookId, startPage, endPage, duration, notes, mood, location } = req.body;

    if (!bookId || !startPage || !endPage || !duration) {
      return res.status(400).json({ error: 'Book, pages, and duration are required' });
    }

    if (endPage <= startPage) {
      return res.status(400).json({ error: 'End page must be greater than start page' });
    }

    // Verify book belongs to user
    const book = await prisma.book.findFirst({
      where: { id: bookId, userId: req.userId }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const session = await prisma.readingSession.create({
      data: {
        bookId,
        userId: req.userId,
        startPage: parseInt(startPage),
        endPage: parseInt(endPage),
        duration: parseInt(duration),
        notes,
        mood,
        location
      },
      include: {
        book: {
          select: { id: true, title: true, author: true }
        }
      }
    });

    // Update book's current page
    await prisma.book.update({
      where: { id: bookId },
      data: { 
        currentPage: Math.max(book.currentPage, parseInt(endPage)),
        ...(book.status === 'TO_READ' && { status: 'IN_PROGRESS', dateStarted: new Date() })
      }
    });

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating reading session:', error);
    res.status(500).json({ error: 'Failed to create reading session' });
  }
});

// Get reading session statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const sessions = await prisma.readingSession.findMany({
      where: { userId: req.userId }
    });

    const totalSessions = sessions.length;
    const totalPages = sessions.reduce((sum, session) => sum + (session.endPage - session.startPage), 0);
    const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
    const avgSessionTime = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

    res.json({
      totalSessions,
      totalPages,
      totalMinutes,
      avgSessionTime
    });
  } catch (error) {
    console.error('Error fetching session stats:', error);
    res.status(500).json({ error: 'Failed to fetch session statistics' });
  }
});

// Delete reading session
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const session = await prisma.readingSession.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Reading session not found' });
    }

    await prisma.readingSession.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Reading session deleted successfully' });
  } catch (error) {
    console.error('Error deleting reading session:', error);
    res.status(500).json({ error: 'Failed to delete reading session' });
  }
});

export default router;