import { z } from 'zod';

// Product schemas
export const createProductSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  price: z.number()
    .positive('Price must be positive')
    .max(999999, 'Price is too high'),
  stock: z.number()
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative')
    .default(0),
  categoryId: z.string()
    .min(1, 'Category ID is required')
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10')
});

// Category schemas
export const createCategorySchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
});

// Cart schemas
export const addToCartSchema = z.object({
  userId: z.string()
    .min(1, 'User ID is required'),
  productId: z.string()
    .min(1, 'Product ID is required'),
  quantity: z.number()
    .int('Quantity must be an integer')
    .positive('Quantity must be positive')
    .max(100, 'Quantity cannot exceed 100')
    .default(1)
});

export const cartQuerySchema = z.object({
  userId: z.string()
    .min(1, 'User ID is required')
});

export const removeFromCartSchema = z.object({
  userId: z.string()
    .min(1, 'User ID is required'),
  productId: z.string()
    .min(1, 'Product ID is required')
});

// MongoDB ObjectId validation
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');
