# E-Commerce MERN Stack Application

A full-stack e-commerce application built with React, Node.js, Express, and MongoDB.

## Features

- **Product Management**: Browse, search, and filter products
- **User Authentication**: Register, login, and user profiles
- **Shopping Cart**: Add, update, and remove items from cart
- **Order Management**: Place orders and track order history
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
MERN/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (Auth)
- `PUT /api/users/profile` - Update user profile (Auth)

### Cart
- `GET /api/cart` - Get user cart (Auth)
- `POST /api/cart/add` - Add item to cart (Auth)
- `PUT /api/cart/update` - Update cart item (Auth)
- `DELETE /api/cart/remove/:productId` - Remove item (Auth)
- `DELETE /api/cart/clear` - Clear cart (Auth)

### Orders
- `POST /api/orders` - Create order (Auth)
- `GET /api/orders/myorders` - Get user orders (Auth)
- `GET /api/orders/:id` - Get single order (Auth)
- `PUT /api/orders/:id/pay` - Mark order as paid (Auth)
- `PUT /api/orders/:id/deliver` - Mark order as delivered (Admin)

## Usage

1. Start MongoDB (if using local installation)
2. Start the backend server
3. Start the frontend development server
4. Open `http://localhost:3000` in your browser
5. Register a new account or login
6. Browse products and start shopping!

## Notes

- The cart is stored in memory (backend) - in production, consider using Redis or database storage
- JWT tokens are stored in localStorage
- Make sure MongoDB is running before starting the backend server
- For production, update the JWT_SECRET and use environment variables

## License

ISC

