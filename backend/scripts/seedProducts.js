const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
  {
    category: 'electronics',
    stock: 50,
    name: 'Sony WH-1000XM4 Wireless Headphones',
    description: 'Premium wireless over-ear headphones with industry-leading noise cancellation. Features 30-hour battery life, quick charge, and exceptional sound quality. Perfect for travel, work, or daily commutes.',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    rating: 4.8,
    numReviews: 1247
  },
  {
    name: 'LEGO Modular Jazz Club Building Set',
    description: 'Detailed modular building set featuring a three-story jazz club and two-story pizzeria. Includes multiple minifigures, intricate architectural details, and vibrant city street scene. Perfect for collectors and builders.',
    price: 229.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
    category: 'toys',
    stock: 25,
    rating: 4.9,
    numReviews: 892
  },
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Classic crew neck t-shirt made from 100% premium cotton. Soft, comfortable, and durable. Available in multiple colors. Perfect for everyday wear or layering.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    category: 'clothing',
    stock: 150,
    rating: 4.5,
    numReviews: 523
  },
  {
    name: 'Vintage Wash Wide-Leg Jeans',
    description: 'High-waisted wide-leg jeans with vintage-inspired light blue wash. Features subtle distressing, whiskering, and raw hem details. Comfortable relaxed fit perfect for casual style.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
    category: 'clothing',
    stock: 85,
    rating: 4.6,
    numReviews: 312
  },
  {
    name: 'JavaScript: The Definitive Guide, 7th Edition',
    description: 'Master the world\'s most-used programming language with this comprehensive guide. Covers ES2020, modern JavaScript features, and practical examples. Essential for developers of all levels.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&h=500&fit=crop',
    category: 'books',
    stock: 45,
    rating: 4.7,
    numReviews: 456
  },
  {
    name: 'React Cookbook: Recipes for Mastering React',
    description: 'Learn React with practical recipes and real-world solutions. Covers hooks, context, performance optimization, and modern React patterns. Perfect for developers building React applications.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=500&fit=crop',
    category: 'books',
    stock: 38,
    rating: 4.6,
    numReviews: 289
  },
  {
    name: 'Adjustable Dumbbell Set (5-50 lbs)',
    description: 'Space-saving adjustable dumbbell set with quick-select weight system. Adjust from 5 to 50 pounds per dumbbell. Includes storage tray and workout guide. Perfect for home gyms.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
    category: 'sports',
    stock: 15,
    rating: 4.8,
    numReviews: 567
  },
  {
    name: 'Premium Non-Slip Yoga Mat',
    description: 'Extra-thick yoga mat with superior grip and cushioning. Eco-friendly TPE material, easy to clean, and includes carrying strap. Available in multiple vibrant colors. Perfect for all yoga practices.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop',
    category: 'sports',
    stock: 120,
    rating: 4.7,
    numReviews: 834
  },
  {
    name: 'Smart Watch Pro',
    description: 'Feature-rich smartwatch with fitness tracking, heart rate monitor, GPS, and 7-day battery life. Water-resistant, sleep tracking, and smartphone notifications. Perfect for active lifestyles.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    category: 'electronics',
    stock: 65,
    rating: 4.5,
    numReviews: 723
  },
  {
    name: 'Programmable Coffee Maker',
    description: '12-cup programmable coffee maker with auto-shutoff, brew strength control, and reusable filter. Keep warm function and easy-to-clean design. Start your day with perfect coffee.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500&h=500&fit=crop',
    category: 'home',
    stock: 42,
    rating: 4.4,
    numReviews: 445
  },
  {
    name: 'Remote Control Racing Car',
    description: 'High-speed RC car with 2.4GHz remote control, rechargeable battery, and LED lights. Durable construction, all-terrain tires, and 30+ minute playtime. Fun for all ages.',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
    category: 'toys',
    stock: 55,
    rating: 4.5,
    numReviews: 189
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');

    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(products);
    console.log('Seeded products successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();

