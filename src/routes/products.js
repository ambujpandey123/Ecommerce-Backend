import express from 'express';
import { prisma } from '../server.js';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  objectIdSchema
} from '../schemas/index.js';

const router = express.Router();

// GET /api/products - Get all products with search and filter
router.get('/', async (req, res, next) => {
  try {
    const { search, categoryId, page, limit } = productQuerySchema.parse(req.query);
    
    // Build where clause
    const where = {};
    
    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive'
      };
    }
    
    if (categoryId) {
      objectIdSchema.parse(categoryId);
      where.categoryId = categoryId;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.product.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id - Get product by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    objectIdSchema.parse(id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Create new product
router.post('/', async (req, res, next) => {
  try {
    const validatedData = createProductSchema.parse(req.body);

    // Verify category exists
    objectIdSchema.parse(validatedData.categoryId);
    const categoryExists = await prisma.category.findUnique({
      where: { id: validatedData.categoryId }
    });

    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Category does not exist'
      });
    }

    const product = await prisma.product.create({
      data: validatedData,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    objectIdSchema.parse(id);
    
    const validatedData = updateProductSchema.parse(req.body);

    // If categoryId is being updated, verify it exists
    if (validatedData.categoryId) {
      objectIdSchema.parse(validatedData.categoryId);
      const categoryExists = await prisma.category.findUnique({
        where: { id: validatedData.categoryId }
      });

      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Category does not exist'
        });
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    objectIdSchema.parse(id);

    // Check if product exists and has cart items
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        cartItems: true
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Product not found'
      });
    }

    // Delete associated cart items first
    if (product.cartItems.length > 0) {
      await prisma.cartItem.deleteMany({
        where: { productId: id }
      });
    }

    // Delete the product
    await prisma.product.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
