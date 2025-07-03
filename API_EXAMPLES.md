# API Usage Examples

This document shows you exactly how to upload products and retrieve them using HTTP requests.

## Base URL
```
http://localhost:3000
```

## 1. Create Categories First

Before creating products, you need categories. Here's how to create them:

### POST /api/categories
```bash
# Create Electronics category
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Electronic devices and accessories"
  }'

# Create Clothing category
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Clothing",
    "description": "Fashion and apparel"
  }'
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": "6582f1234567890abcdef123",
    "name": "Electronics",
    "description": "Electronic devices and accessories",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z",
    "_count": {
      "products": 0
    }
  }
}
```

## 2. Get All Categories

### GET /api/categories
```bash
curl -X GET http://localhost:3000/api/categories
```

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "id": "6582f1234567890abcdef123",
      "name": "Electronics",
      "description": "Electronic devices and accessories",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z",
      "_count": {
        "products": 5
      }
    }
  ]
}
```

## 3. Upload/Create Products

### POST /api/products
```bash
# Create a smartphone product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "iPhone 15 Pro",
    "description": "Latest iPhone with titanium design and A17 Pro chip",
    "price": 999.99,
    "stock": 50,
    "categoryId": "6582f1234567890abcdef123"
  }'

# Create a laptop product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "MacBook Pro M3",
    "description": "14-inch MacBook Pro with M3 chip",
    "price": 1999.99,
    "stock": 25,
    "categoryId": "6582f1234567890abcdef123"
  }'
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": "6582f1234567890abcdef456",
    "title": "iPhone 15 Pro",
    "description": "Latest iPhone with titanium design and A17 Pro chip",
    "price": 999.99,
    "stock": 50,
    "categoryId": "6582f1234567890abcdef123",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z",
    "category": {
      "id": "6582f1234567890abcdef123",
      "name": "Electronics"
    }
  }
}
```

## 4. Get All Products

### GET /api/products
```bash
# Get all products
curl -X GET http://localhost:3000/api/products

# Get products with pagination
curl -X GET "http://localhost:3000/api/products?page=1&limit=10"

# Search products by title
curl -X GET "http://localhost:3000/api/products?search=iPhone"

# Filter products by category
curl -X GET "http://localhost:3000/api/products?categoryId=6582f1234567890abcdef123"

# Combine search and filter
curl -X GET "http://localhost:3000/api/products?search=Pro&categoryId=6582f1234567890abcdef123&page=1&limit=5"
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "6582f1234567890abcdef456",
        "title": "iPhone 15 Pro",
        "description": "Latest iPhone with titanium design and A17 Pro chip",
        "price": 999.99,
        "stock": 50,
        "categoryId": "6582f1234567890abcdef123",
        "createdAt": "2024-01-01T10:00:00.000Z",
        "updatedAt": "2024-01-01T10:00:00.000Z",
        "category": {
          "id": "6582f1234567890abcdef123",
          "name": "Electronics"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalCount": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

## 5. Get Single Product

### GET /api/products/:id
```bash
curl -X GET http://localhost:3000/api/products/6582f1234567890abcdef456
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": "6582f1234567890abcdef456",
    "title": "iPhone 15 Pro",
    "description": "Latest iPhone with titanium design and A17 Pro chip",
    "price": 999.99,
    "stock": 50,
    "categoryId": "6582f1234567890abcdef123",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z",
    "category": {
      "id": "6582f1234567890abcdef123",
      "name": "Electronics",
      "description": "Electronic devices and accessories"
    }
  }
}
```

## 6. Update Product

### PUT /api/products/:id
```bash
curl -X PUT http://localhost:3000/api/products/6582f1234567890abcdef456 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "iPhone 15 Pro Max",
    "price": 1099.99,
    "stock": 75
  }'
```

## 7. Delete Product

### DELETE /api/products/:id
```bash
curl -X DELETE http://localhost:3000/api/products/6582f1234567890abcdef456
```

**Response Example:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## Using JavaScript Fetch API

Here are examples using JavaScript fetch for frontend integration:

### Create Product
```javascript
const createProduct = async (productData) => {
  try {
    const response = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Product created:', result.data);
      return result.data;
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Usage
createProduct({
  title: "Wireless Headphones",
  description: "Premium noise-canceling headphones",
  price: 299.99,
  stock: 100,
  categoryId: "6582f1234567890abcdef123"
});
```

### Get Products
```javascript
const getProducts = async (searchParams = {}) => {
  try {
    const params = new URLSearchParams(searchParams);
    const response = await fetch(`http://localhost:3000/api/products?${params}`);
    const result = await response.json();
    
    if (result.success) {
      console.log('Products:', result.data.products);
      console.log('Pagination:', result.data.pagination);
      return result.data;
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Usage examples
getProducts(); // Get all products
getProducts({ search: 'iPhone' }); // Search products
getProducts({ categoryId: '6582f1234567890abcdef123' }); // Filter by category
getProducts({ page: 1, limit: 10 }); // Pagination
```

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Validation Error",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error
