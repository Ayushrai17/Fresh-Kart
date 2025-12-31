import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/database.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const products = [
  // Groceries
  {
    name: 'Aashirvaad Atta (5kg)',
    description: 'Premium whole wheat flour for making soft rotis and chapatis. Made from finest quality wheat grains.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1615485925511-ef4e3c5e0c5c?w=400',
    category: 'Groceries',
    subscriptionEligible: true,
    stock: 50,
  },
  {
    name: 'India Gate Basmati Rice (5kg)',
    description: 'Premium long grain basmati rice with aromatic fragrance. Perfect for biryanis and pulao.',
    price: 549,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    category: 'Groceries',
    subscriptionEligible: true,
    stock: 40,
  },
  {
    name: 'Tata Sampann Toor Dal (1kg)',
    description: 'High quality toor dal, rich in protein. Clean, sorted, and ready to cook.',
    price: 189,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
    category: 'Groceries',
    subscriptionEligible: true,
    stock: 60,
  },
  {
    name: 'Fortune Sunflower Oil (1L)',
    description: 'Pure sunflower oil, light and healthy. Rich in vitamin E and low in saturated fats.',
    price: 159,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacb8d6c8d?w=400',
    category: 'Groceries',
    subscriptionEligible: true,
    stock: 45,
  },
  {
    name: 'Sugar (1kg)',
    description: 'Pure white crystal sugar. Perfect for daily use in tea, coffee, and cooking.',
    price: 49,
    image: 'https://images.unsplash.com/photo-1615485500705-1c784840b0e3?w=400',
    category: 'Groceries',
    subscriptionEligible: true,
    stock: 100,
  },
  // Dairy
  {
    name: 'Amul Milk (1L)',
    description: 'Fresh, pure cow milk. Pasteurized and homogenized for safety and taste.',
    price: 58,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    category: 'Dairy',
    subscriptionEligible: true,
    stock: 80,
  },
  {
    name: 'Amul Butter (500g)',
    description: 'Pure white butter made from fresh cream. Rich, creamy, and delicious.',
    price: 265,
    image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400',
    category: 'Dairy',
    subscriptionEligible: true,
    stock: 35,
  },
  {
    name: 'Mother Dairy Curd (1kg)',
    description: 'Fresh, creamy curd made from pure milk. Rich in probiotics and calcium.',
    price: 95,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
    category: 'Dairy',
    subscriptionEligible: true,
    stock: 50,
  },
  {
    name: 'Amul Paneer (200g)',
    description: 'Fresh, soft paneer made from pure milk. Perfect for curries and snacks.',
    price: 89,
    image: 'https://images.unsplash.com/photo-1618164436264-4473940d1f5c?w=400',
    category: 'Dairy',
    subscriptionEligible: true,
    stock: 40,
  },
  // Personal Care
  {
    name: 'Colgate Toothpaste (200g)',
    description: 'Advanced whitening toothpaste with fluoride. Fights cavities and keeps teeth healthy.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400',
    category: 'Personal Care',
    subscriptionEligible: true,
    stock: 70,
  },
  {
    name: 'Dove Soap (4 pcs)',
    description: 'Moisturizing beauty bar soap. Gentle on skin, keeps you clean and fresh.',
    price: 210,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
    category: 'Personal Care',
    subscriptionEligible: true,
    stock: 55,
  },
  {
    name: 'Head & Shoulders Shampoo (340ml)',
    description: 'Anti-dandruff shampoo. Cleanses hair and scalp, prevents dandruff effectively.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
    category: 'Personal Care',
    subscriptionEligible: true,
    stock: 45,
  },
  {
    name: 'Nivea Body Lotion (400ml)',
    description: 'Intensive moisturizing body lotion. Keeps skin soft, smooth, and hydrated all day.',
    price: 275,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
    category: 'Personal Care',
    subscriptionEligible: true,
    stock: 40,
  },
  // Household
  {
    name: 'Surf Excel Detergent (2kg)',
    description: 'Powerful detergent powder. Removes tough stains and keeps clothes bright and clean.',
    price: 379,
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e9c7b87e?w=400',
    category: 'Household',
    subscriptionEligible: true,
    stock: 50,
  },
  {
    name: 'Vim Dishwash Gel (750ml)',
    description: 'Effective dishwashing gel. Cuts through grease and leaves dishes sparkling clean.',
    price: 179,
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e9c7b87e?w=400',
    category: 'Household',
    subscriptionEligible: true,
    stock: 60,
  },
  {
    name: 'Harpic Toilet Cleaner (1L)',
    description: 'Powerful toilet cleaner. Removes stains, kills germs, and leaves toilet fresh.',
    price: 198,
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e9c7b87e?w=400',
    category: 'Household',
    subscriptionEligible: true,
    stock: 45,
  },
  {
    name: 'Scotch-Brite Scrubber (Pack of 3)',
    description: 'Durable scrubber pads for cleaning dishes and utensils. Long-lasting and effective.',
    price: 85,
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e9c7b87e?w=400',
    category: 'Household',
    subscriptionEligible: true,
    stock: 70,
  },
  // Beverages
  {
    name: 'Tata Tea Gold (1kg)',
    description: 'Premium tea leaves with rich aroma and flavor. Perfect for morning tea.',
    price: 525,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    category: 'Beverages',
    subscriptionEligible: true,
    stock: 30,
  },
  {
    name: 'Nescafe Classic (200g)',
    description: 'Instant coffee powder. Rich, aromatic coffee for a perfect start to your day.',
    price: 399,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    category: 'Beverages',
    subscriptionEligible: true,
    stock: 35,
  },
  {
    name: 'Real Mixed Fruit Juice (1L)',
    description: '100% real fruit juice blend. No added preservatives, rich in vitamins.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    category: 'Beverages',
    subscriptionEligible: true,
    stock: 50,
  },
  {
    name: 'Bisleri Water (20L)',
    description: 'Pure, safe drinking water. Mineral water for daily hydration needs.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1548839140-5a6d0e1e5fcc?w=400',
    category: 'Beverages',
    subscriptionEligible: true,
    stock: 40,
  },
];

const seedProducts = async () => {
  try {
    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    
    if (existingProducts > 0) {
      console.log('Products already exist in database. Skipping seed.');
      console.log(`Found ${existingProducts} products.`);
      process.exit(0);
    }

    // Insert products
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${insertedProducts.length} products!`);
    console.log('\nProducts added:');
    insertedProducts.forEach((product) => {
      console.log(`  - ${product.name} (₹${product.price})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

// Run seed function
seedProducts();

