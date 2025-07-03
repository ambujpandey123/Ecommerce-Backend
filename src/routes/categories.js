import express from 'express';
import { prisma } from '../server.js';
import { createCategorySchema } from '../schemas/index.js';

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/categories - Create new category
router.post('/', async (req, res, next) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);

    const category = await prisma.category.create({
      data: validatedData,
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
});

export default router;
