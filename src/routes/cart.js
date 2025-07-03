import express from 'express';
import { prisma } from '../server.js';
import {
  addToCartSchema,
  cartQuerySchema,
  removeFromCartSchema,
  objectIdSchema
} from '../schemas/index.js';

const router = express.Router();

// POST /api/cart - Add item to cart
router.post('/', async (req, res, next) => {
  try {
    const validatedData = addToCartSchema.parse(req.body);
    const { userId, productId, quantity } = validatedData;

    // Verify product exists and has sufficient stock
    objectIdSchema.parse(productId);
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient Stock',
        message: `Only ${product.stock} items available in stock`
      });
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    let cartItem;

    if (existingCartItem) {
      // Update existing cart item (increment quantity)
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient Stock',
          message: `Cannot add ${quantity} more items. Only ${product.stock - existingCartItem.quantity} more available`
        });
      }

      cartItem = await prisma.cartItem.update({
        where: {
          userId_productId: {
            userId,
            productId
          }
        },
        data: {
          quantity: newQuantity
        },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              price: true,
              stock: true,
              category: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity
        },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              price: true,
              stock: true,
              category: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });
    }

    res.status(201).json({
      success: true,
      data: cartItem
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/cart - Get user's cart
router.get('/', async (req, res, next) => {
  try {
    const { userId } = cartQuerySchema.parse(req.query);

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            stock: true,
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate cart totals
    const subtotal = cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    const totalItems = cartItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    res.json({
      success: true,
      data: {
        items: cartItems,
        summary: {
          totalItems,
          subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
          itemCount: cartItems.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cart - Remove item from cart
router.delete('/', async (req, res, next) => {
  try {
    const { userId, productId } = removeFromCartSchema.parse(req.body);

    objectIdSchema.parse(productId);

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Item not found in cart'
      });
    }

    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
