import { ZodError } from 'zod';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: err.errors.map(error => ({
        field: error.path.join('.'),
        message: error.message
      }))
    });
  }

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      error: 'Conflict',
      message: 'A record with this data already exists'
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: 'Record not found'
    });
  }

  if (err.code === 'P2003') {
    return res.status(400).json({
      success: false,
      error: 'Foreign Key Constraint',
      message: 'Referenced record does not exist'
    });
  }

  // Custom application errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.name || 'Application Error',
      message: err.message
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};
