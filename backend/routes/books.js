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

// Get all books with search, filter, sort, and pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      search, 
      status, 
      genre, 
      sortBy = 'dateAdded', 
      sortOrder = 'desc', 
      page = 1, 
      limit = 10 
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const where = {
      userId: req.userId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { author: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(status && { status }),
      ...(genre && { genre: { contains: genre, mode: 'insensitive' } })
    };

    // Build orderBy clause
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [books, totalCount] = await Promise.all([
      prisma.book.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
      }),
      prisma.book.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      books,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get single book
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const book = await prisma.book.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Add new book
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, author, genre, pages, status = 'TO_READ' } = req.body;

    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        genre,
        pages: pages ? parseInt(pages) : null,
        status,
        userId: req.userId,
        ...(status === 'IN_PROGRESS' && { dateStarted: new Date() }),
        ...(status === 'COMPLETED' && { 
          dateStarted: new Date(), 
          dateFinished: new Date(),
          currentPage: pages ? parseInt(pages) : 0
        })
      }
    });

    res.status(201).json(book);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// Update book
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, author, genre, pages, status, currentPage, notes, review, rating } = req.body;

    const existingBook = await prisma.book.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!existingBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Handle status changes
    const updateData = {
      ...(title && { title }),
      ...(author && { author }),
      ...(genre !== undefined && { genre }),
      ...(pages && { pages: parseInt(pages) }),
      ...(status && { status }),
      ...(currentPage !== undefined && { currentPage: parseInt(currentPage) }),
      ...(notes !== undefined && { notes }),
      ...(review !== undefined && { review }),
      ...(rating && { rating: parseInt(rating) })
    };

    // Handle status-specific updates
    if (status && status !== existingBook.status) {
      if (status === 'IN_PROGRESS' && existingBook.status === 'TO_READ') {
        updateData.dateStarted = new Date();
      } else if (status === 'COMPLETED') {
        updateData.dateFinished = new Date();
        if (!existingBook.dateStarted) {
          updateData.dateStarted = new Date();
        }
        if (pages) {
          updateData.currentPage = parseInt(pages);
        }
      }
    }

    const book = await prisma.book.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Delete book
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const book = await prisma.book.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await prisma.book.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// Get reading statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const [totalBooks, completedBooks, inProgressBooks, toReadBooks] = await Promise.all([
      prisma.book.count({ where: { userId: req.userId } }),
      prisma.book.count({ where: { userId: req.userId, status: 'COMPLETED' } }),
      prisma.book.count({ where: { userId: req.userId, status: 'IN_PROGRESS' } }),
      prisma.book.count({ where: { userId: req.userId, status: 'TO_READ' } })
    ]);

    res.json({
      totalBooks,
      completedBooks,
      inProgressBooks,
      toReadBooks
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;