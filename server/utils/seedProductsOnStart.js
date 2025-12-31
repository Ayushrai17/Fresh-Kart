import Product from '../models/Product.js';

// Seed catalog for all shop categories using Indian grocery brands.
// Categories (frontend == backend):
// - Dairy, Bread & Eggs
// - Snacks & Munchies
// - Fruits & Vegetables
// - Cold Drinks & Juices
// - Bakery & Biscuits
// - Personal Care
// - Household Essentials

const products = [
  // Dairy, Bread & Eggs
  {
    name: 'Amul Taaza Toned Milk (1L)',
    description: 'Toned milk from Amul, perfect for daily tea, coffee and drinking.',
    price: 60,
    image: 'https://images.pexels.com/photos/5946610/pexels-photo-5946610.jpeg?auto=compress&w=400',
    category: 'Dairy, Bread & Eggs',
    subscriptionEligible: true,
    stock: 120,
    rating: 4.6,
  },
  {
    name: 'Mother Dairy Classic Curd (500g)',
    description: 'Thick and creamy dahi, ideal for raita, kadhi and everyday meals.',
    price: 55,
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&w=400',
    category: 'Dairy, Bread & Eggs',
    subscriptionEligible: true,
    stock: 80,
    rating: 4.5,
  },
  {
    name: 'Amul Butter (500g)',
    description: 'Iconic Amul salted butter for toast, parathas and baking.',
    price: 260,
    image: 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&w=400',
    category: 'Dairy, Bread & Eggs',
    subscriptionEligible: false,
    stock: 60,
    rating: 4.8,
  },
  {
    name: 'Britannia Whole Wheat Bread (400g)',
    description: 'Soft and fresh whole wheat bread, high in fibre.',
    price: 45,
    image: 'https://images.pexels.com/photos/2434/bread-food-healthy-breakfast.jpg?auto=compress&w=400',
    category: 'Dairy, Bread & Eggs',
    subscriptionEligible: true,
    stock: 90,
    rating: 4.4,
  },
  {
    name: 'Country Delight Farm Eggs (12 pcs)',
    description: 'Fresh white eggs sourced from local farms, rich in protein.',
    price: 110,
    image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&w=400',
    category: 'Dairy, Bread & Eggs',
    subscriptionEligible: true,
    stock: 70,
    rating: 4.7,
  },
  {
    name: 'Amul Fresh Paneer (200g)',
    description: 'Soft and fresh paneer cubes, perfect for gravies and tikkas.',
    price: 90,
    image: 'https://images.pexels.com/photos/461431/pexels-photo-461431.jpeg?auto=compress&w=400',
    category: 'Dairy, Bread & Eggs',
    subscriptionEligible: false,
    stock: 50,
    rating: 4.5,
  },

  // Snacks & Munchies
  {
    name: "Haldiram's Bhujia Sev (1kg)",
    description: 'Crispy and spicy bhujia sev, perfect tea-time snack.',
    price: 210,
    image: 'https://images.pexels.com/photos/4109990/pexels-photo-4109990.jpeg?auto=compress&w=400',
    category: 'Snacks & Munchies',
    subscriptionEligible: false,
    stock: 100,
    rating: 4.6,
  },
  {
    name: 'Lay’s Magic Masala Chips (150g)',
    description: 'Classic Indian style masala potato chips from Lay’s.',
    price: 50,
    image: 'https://images.pexels.com/photos/4109130/pexels-photo-4109130.jpeg?auto=compress&w=400',
    category: 'Snacks & Munchies',
    subscriptionEligible: false,
    stock: 150,
    rating: 4.3,
  },
  {
    name: 'KurKure Masala Munch (90g)',
    description: 'Crunchy and spicy corn puffs popular across India.',
    price: 30,
    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&w=400',
    category: 'Snacks & Munchies',
    subscriptionEligible: false,
    stock: 120,
    rating: 4.2,
  },
  {
    name: 'Bikaji Bikaneri Bhujia (400g)',
    description: 'Traditional Bikaneri bhujia made from gram flour and spices.',
    price: 145,
    image: 'https://images.pexels.com/photos/4110008/pexels-photo-4110008.jpeg?auto=compress&w=400',
    category: 'Snacks & Munchies',
    subscriptionEligible: false,
    stock: 80,
    rating: 4.5,
  },
  {
    name: 'Parle Monaco Salted Biscuits (200g)',
    description: 'Light, crispy salted biscuits, great with tea.',
    price: 35,
    image: 'https://images.pexels.com/photos/1028718/pexels-photo-1028718.jpeg?auto=compress&w=400',
    category: 'Snacks & Munchies',
    subscriptionEligible: true,
    stock: 140,
    rating: 4.4,
  },
  {
    name: 'Haldiram’s Nut Cracker (200g)',
    description: 'Coated peanuts fried to perfection, crunchy and spicy.',
    price: 75,
    image: 'https://images.pexels.com/photos/4110006/pexels-photo-4110006.jpeg?auto=compress&w=400',
    category: 'Snacks & Munchies',
    subscriptionEligible: false,
    stock: 90,
    rating: 4.6,
  },

  // Fruits & Vegetables
  {
    name: 'Fresh Bananas (1kg)',
    description: 'Ripe yellow bananas, naturally sweet and high in potassium.',
    price: 55,
    image: 'https://images.pexels.com/photos/208450/pexels-photo-208450.jpeg?auto=compress&w=400',
    category: 'Fruits & Vegetables',
    subscriptionEligible: true,
    stock: 60,
    rating: 4.7,
  },
  {
    name: 'Farm Fresh Tomatoes (1kg)',
    description: 'Juicy red tomatoes, perfect for salads and gravies.',
    price: 40,
    image: 'https://images.pexels.com/photos/8390/food-wood-tomatoes.jpg?auto=compress&w=400',
    category: 'Fruits & Vegetables',
    subscriptionEligible: true,
    stock: 90,
    rating: 4.5,
  },
  {
    name: 'Onions (5kg Pack)',
    description: 'Kitchen essential red onions, medium size.',
    price: 220,
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&w=400',
    category: 'Fruits & Vegetables',
    subscriptionEligible: true,
    stock: 70,
    rating: 4.4,
  },
  {
    name: 'Potatoes (5kg Pack)',
    description: 'Fresh potatoes suitable for fries, sabzi and snacks.',
    price: 180,
    image: 'https://images.pexels.com/photos/1431338/pexels-photo-1431338.jpeg?auto=compress&w=400',
    category: 'Fruits & Vegetables',
    subscriptionEligible: true,
    stock: 75,
    rating: 4.5,
  },
  {
    name: 'Shimla Apples (1kg)',
    description: 'Crisp and juicy apples from the hills of Himachal.',
    price: 180,
    image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&w=400',
    category: 'Fruits & Vegetables',
    subscriptionEligible: false,
    stock: 50,
    rating: 4.6,
  },
  {
    name: 'Coriander Leaves (100g)',
    description: 'Fresh dhania for garnishing and chutneys.',
    price: 20,
    image: 'https://images.pexels.com/photos/1431335/pexels-photo-1431335.jpeg?auto=compress&w=400',
    category: 'Fruits & Vegetables',
    subscriptionEligible: true,
    stock: 100,
    rating: 4.3,
  },

  // Cold Drinks & Juices
  {
    name: 'Coca Cola Soft Drink (2L)',
    description: 'Classic cola carbonated soft drink, serve chilled.',
    price: 95,
    image: 'https://images.pexels.com/photos/8210544/pexels-photo-8210544.jpeg?auto=compress&w=400',
    category: 'Cold Drinks & Juices',
    subscriptionEligible: false,
    stock: 60,
    rating: 4.5,
  },
  {
    name: 'Pepsi Soft Drink (1.25L)',
    description: 'Refreshing cola drink, great for parties and snacks.',
    price: 70,
    image: 'https://images.pexels.com/photos/4109992/pexels-photo-4109992.jpeg?auto=compress&w=400',
    category: 'Cold Drinks & Juices',
    subscriptionEligible: false,
    stock: 50,
    rating: 4.4,
  },
  {
    name: 'Real Mango Juice (1L)',
    description: 'Thick mango juice made from real fruit pulp.',
    price: 115,
    image: 'https://images.pexels.com/photos/5531553/pexels-photo-5531553.jpeg?auto=compress&w=400',
    category: 'Cold Drinks & Juices',
    subscriptionEligible: true,
    stock: 80,
    rating: 4.6,
  },
  {
    name: 'Tropicana Orange Delight (1L)',
    description: 'Orange juice drink, no added preservatives.',
    price: 110,
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&w=400',
    category: 'Cold Drinks & Juices',
    subscriptionEligible: true,
    stock: 70,
    rating: 4.5,
  },
  {
    name: 'Bisleri Mineral Water (2L)',
    description: 'Packaged drinking water, safe and pure.',
    price: 35,
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&w=400',
    category: 'Cold Drinks & Juices',
    subscriptionEligible: true,
    stock: 100,
    rating: 4.7,
  },
  {
    name: 'Paper Boat Aam Panna (600ml)',
    description: 'Refreshing raw mango drink with authentic Indian flavours.',
    price: 70,
    image: 'https://images.pexels.com/photos/5531553/pexels-photo-5531553.jpeg?auto=compress&w=400',
    category: 'Cold Drinks & Juices',
    subscriptionEligible: false,
    stock: 40,
    rating: 4.3,
  },

  // Bakery & Biscuits
  {
    name: 'Britannia Marie Gold Biscuits (600g)',
    description: 'Light and crispy Marie biscuits, perfect with tea.',
    price: 80,
    image: 'https://images.pexels.com/photos/1028718/pexels-photo-1028718.jpeg?auto=compress&w=400',
    category: 'Bakery & Biscuits',
    subscriptionEligible: true,
    stock: 120,
    rating: 4.5,
  },
  {
    name: 'Parle-G Original Glucose Biscuits (800g)',
    description: 'India’s favourite glucose biscuit, energy for all ages.',
    price: 90,
    image: 'https://images.pexels.com/photos/1028718/pexels-photo-1028718.jpeg?auto=compress&w=400',
    category: 'Bakery & Biscuits',
    subscriptionEligible: true,
    stock: 130,
    rating: 4.7,
  },
  {
    name: 'Britannia NutriChoice Digestive (500g)',
    description: 'High fibre digestive biscuits for a healthier snack.',
    price: 120,
    image: 'https://images.pexels.com/photos/1028718/pexels-photo-1028718.jpeg?auto=compress&w=400',
    category: 'Bakery & Biscuits',
    subscriptionEligible: true,
    stock: 80,
    rating: 4.4,
  },
  {
    name: 'Britannia Cake Rusk (400g)',
    description: 'Crispy baked cake rusk, ideal for chai-time.',
    price: 140,
    image: 'https://images.pexels.com/photos/2434/bread-food-healthy-breakfast.jpg?auto=compress&w=400',
    category: 'Bakery & Biscuits',
    subscriptionEligible: false,
    stock: 60,
    rating: 4.3,
  },
  {
    name: 'Local Fresh White Bread (400g)',
    description: 'Soft and fresh white bread, baked daily.',
    price: 40,
    image: 'https://images.pexels.com/photos/2434/bread-food-healthy-breakfast.jpg?auto=compress&w=400',
    category: 'Bakery & Biscuits',
    subscriptionEligible: true,
    stock: 90,
    rating: 4.2,
  },
  {
    name: 'Britannia Good Day Butter Cookies (600g)',
    description: 'Rich and buttery cookies with crunchy cashews.',
    price: 150,
    image: 'https://images.pexels.com/photos/1028718/pexels-photo-1028718.jpeg?auto=compress&w=400',
    category: 'Bakery & Biscuits',
    subscriptionEligible: false,
    stock: 100,
    rating: 4.6,
  },

  // Personal Care
  {
    name: 'Colgate Strong Teeth Toothpaste (200g)',
    description: 'Fluoride toothpaste that strengthens teeth from within.',
    price: 110,
    image: 'https://images.pexels.com/photos/837126/pexels-photo-837126.jpeg?auto=compress&w=400',
    category: 'Personal Care',
    subscriptionEligible: true,
    stock: 90,
    rating: 4.6,
  },
  {
    name: 'Dove Cream Beauty Bathing Bar (Pack of 4)',
    description: 'Moisturising soap that nourishes skin during every bath.',
    price: 210,
    image: 'https://images.pexels.com/photos/3738364/pexels-photo-3738364.jpeg?auto=compress&w=400',
    category: 'Personal Care',
    subscriptionEligible: true,
    stock: 70,
    rating: 4.7,
  },
  {
    name: 'Head & Shoulders Anti Dandruff Shampoo (340ml)',
    description: 'Removes dandruff and keeps scalp clean & fresh.',
    price: 299,
    image: 'https://images.pexels.com/photos/3738371/pexels-photo-3738371.jpeg?auto=compress&w=400',
    category: 'Personal Care',
    subscriptionEligible: false,
    stock: 60,
    rating: 4.5,
  },
  {
    name: 'Patanjali Aloe Vera Gel (150ml)',
    description: 'Multi-purpose aloe vera gel for skin and hair care.',
    price: 95,
    image: 'https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&w=400',
    category: 'Personal Care',
    subscriptionEligible: true,
    stock: 85,
    rating: 4.3,
  },
  {
    name: 'Dabur Vatika Hair Oil (300ml)',
    description: 'Enriched with herbs for stronger and shinier hair.',
    price: 160,
    image: 'https://images.pexels.com/photos/3738366/pexels-photo-3738366.jpeg?auto=compress&w=400',
    category: 'Personal Care',
    subscriptionEligible: true,
    stock: 65,
    rating: 4.4,
  },
  {
    name: 'Nivea Men Deodorant (150ml)',
    description: 'Long lasting body deodorant for all day freshness.',
    price: 199,
    image: 'https://images.pexels.com/photos/3738384/pexels-photo-3738384.jpeg?auto=compress&w=400',
    category: 'Personal Care',
    subscriptionEligible: false,
    stock: 50,
    rating: 4.2,
  },

  // Household Essentials
  {
    name: 'Surf Excel Easy Wash Detergent Powder (2kg)',
    description: 'Removes tough stains while keeping clothes bright.',
    price: 360,
    image: 'https://images.pexels.com/photos/3735165/pexels-photo-3735165.jpeg?auto=compress&w=400',
    category: 'Household Essentials',
    subscriptionEligible: true,
    stock: 80,
    rating: 4.6,
  },
  {
    name: 'Vim Lemon Dishwash Liquid (1L)',
    description: 'Tough on grease, gentle on hands, with lemon fragrance.',
    price: 190,
    image: 'https://images.pexels.com/photos/3735196/pexels-photo-3735196.jpeg?auto=compress&w=400',
    category: 'Household Essentials',
    subscriptionEligible: true,
    stock: 90,
    rating: 4.5,
  },
  {
    name: 'Harpic Power Plus Toilet Cleaner (1L)',
    description: 'Kills 99.9% germs and removes tough stains in toilets.',
    price: 190,
    image: 'https://images.pexels.com/photos/3735192/pexels-photo-3735192.jpeg?auto=compress&w=400',
    category: 'Household Essentials',
    subscriptionEligible: false,
    stock: 70,
    rating: 4.5,
  },
  {
    name: 'Lizol Disinfectant Surface Cleaner (1L)',
    description: 'Multipurpose floor cleaner with pleasant fragrance.',
    price: 185,
    image: 'https://images.pexels.com/photos/3735194/pexels-photo-3735194.jpeg?auto=compress&w=400',
    category: 'Household Essentials',
    subscriptionEligible: true,
    stock: 65,
    rating: 4.4,
  },
  {
    name: 'Scotch-Brite Scrub Pad (Pack of 3)',
    description: 'Durable scrub pads for tough cleaning of utensils.',
    price: 90,
    image: 'https://images.pexels.com/photos/3735193/pexels-photo-3735193.jpeg?auto=compress&w=400',
    category: 'Household Essentials',
    subscriptionEligible: false,
    stock: 100,
    rating: 4.3,
  },
  {
    name: 'Ariel Matic Front Load Detergent (2kg)',
    description: 'High efficiency detergent for front load washing machines.',
    price: 520,
    image: 'https://images.pexels.com/photos/3735165/pexels-photo-3735165.jpeg?auto=compress&w=400',
    category: 'Household Essentials',
    subscriptionEligible: true,
    stock: 55,
    rating: 4.7,
  },
];

export const seedProductsOnStart = async () => {
  try {
    const existingProducts = await Product.countDocuments();

    if (existingProducts === 0) {
      console.log('📦 Database is empty. Seeding products...');
    } else {
      console.log(`📦 Found ${existingProducts} products. Ensuring base catalog is present...`);
    }

    let inserted = 0;
    for (const p of products) {
      const existing = await Product.findOne({ name: p.name });
      if (!existing) {
        await Product.create(p);
        inserted += 1;
      }
    }

    if (inserted > 0) {
      console.log(`✅ Seeded/added ${inserted} products to catalog.`);
    } else {
      console.log('ℹ️ Catalog already contains all seeded products.');
    }
  } catch (error) {
    console.error('❌ Error seeding products on start:', error);
  }
};


