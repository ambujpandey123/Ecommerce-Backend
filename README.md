# E-commerce Backend

This project is a Node.js Express backend server with Prisma ORM and MongoDB for managing an e-commerce platform.

## Features
- **Authentication**: Implemented with JWT (if required).
- **Products API**: CRUD operations, search by title, filter by category.
- **Categories API**: Retrieve all categories, add new categories.
- **Cart API**: Manage user-specific cart, increment/decrement item quantities.
- **Validation**: Using Zod for schema validation.
- **Error Handling**: Comprehensive error handling for requests and responses.

## Getting Started

### Prerequisites
- Node.js (>=14.x.x)
- npm
- MongoDB

### Installation
1. Clone the repository:
   ```bash
   git clone https://your-repo-url.git
   cd ecommerce-backend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up the `.env` file:
   ```plaintext
   DATABASE_URL=mongodb://localhost:27017/ecommerce
   PORT=3000
   CORS_ORIGIN=http://localhost:3000
   NODE_ENV=development
   ```

4. Run Prisma migrations and generate client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Running Tests
- Coming soon.

## API Documentation

### Products
- **GET** `/api/products`
- **GET** `/api/products/:id`
- **POST** `/api/products`
- **PUT** `/api/products/:id`
- **DELETE** `/api/products/:id`

### Categories
- **GET** `/api/categories`
- **POST** `/api/categories`

### Cart
- **POST** `/api/cart`
- **GET** `/api/cart`
- **DELETE** `/api/cart`

## License
MIT

## Contact
For any questions, contact me at myemail@example.com.

