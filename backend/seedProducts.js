const mongoose = require('mongoose');
const Product = require('./models/product');
const Category = require('./models/category');
require('dotenv').config();

const products = [
    {
        name: 'Vanilla',
        price: 24.99,
        description: 'Pure and comforting vanilla scent that creates a warm, inviting atmosphere. Perfect for relaxation and creating a cozy home environment.',
        category: 'Classic',
        stock: 50,
        seller: 'LumiScents',
        isActive: true,
        images: [
            {
                public_id: 'candles/vanilla_candle',
                url: 'https://res.cloudinary.com/demo/image/upload/v1588795943/sample.jpg'
            }
        ],
        reviews: [],
        ratings: 4.5,
        numOfReviews: 12
    },
    {
        name: 'Lavender',
        price: 27.99,
        description: 'Calming lavender essential oil blend that promotes relaxation and peaceful sleep. Ideal for bedrooms and meditation spaces.',
        category: 'Floral',
        stock: 45,
        seller: 'LumiScents',
        isActive: true,
        images: [
            {
                public_id: 'candles/lavender_candle',
                url: 'https://res.cloudinary.com/demo/image/upload/v1588795943/sample.jpg'
            }
        ],
        reviews: [],
        ratings: 4.7,
        numOfReviews: 18
    },
    {
        name: 'Rose',
        price: 29.99,
        description: 'Romantic rose fragrance with subtle floral notes. Creates an elegant and sophisticated ambiance for special occasions.',
        category: 'Floral',
        stock: 40,
        seller: 'LumiScents',
        isActive: true,
        images: [
            {
                public_id: 'candles/rose_candle',
                url: 'https://res.cloudinary.com/demo/image/upload/v1588795943/sample.jpg'
            }
        ],
        reviews: [],
        ratings: 4.6,
        numOfReviews: 15
    },
    {
        name: 'Sandalwood',
        price: 32.99,
        description: 'Rich, woody sandalwood scent with earthy undertones. Perfect for creating a meditative and grounding atmosphere.',
        category: 'Woody',
        stock: 35,
        seller: 'LumiScents',
        isActive: true,
        images: [
            {
                public_id: 'candles/sandalwood_candle',
                url: 'https://res.cloudinary.com/demo/image/upload/v1588795943/sample.jpg'
            }
        ],
        reviews: [],
        ratings: 4.8,
        numOfReviews: 22
    },
    {
        name: 'Citrus',
        price: 22.99,
        description: 'Energizing blend of lemon, orange, and grapefruit. Uplifting and refreshing, perfect for kitchens and morning routines.',
        category: 'Fresh',
        stock: 55,
        seller: 'LumiScents',
        isActive: true,
        images: [
            {
                public_id: 'candles/citrus_candle',
                url: 'https://res.cloudinary.com/demo/image/upload/v1588795943/sample.jpg'
            }
        ],
        reviews: [],
        ratings: 4.4,
        numOfReviews: 20
    },
    {
        name: 'Eucalyptus',
        price: 26.99,
        description: 'Clean and invigorating eucalyptus scent with menthol notes. Excellent for clearing the mind and supporting respiratory comfort.',
        category: 'Fresh',
        stock: 42,
        seller: 'LumiScents',
        isActive: true,
        images: [
            {
                public_id: 'candles/eucalyptus_candle',
                url: 'https://res.cloudinary.com/demo/image/upload/v1588795943/sample.jpg'
            }
        ],
        reviews: [],
        ratings: 4.5,
        numOfReviews: 16
    },
    {
        name: 'Pumpkin Spice',
        price: 28.99,
        description: 'Warm and spicy blend of cinnamon, nutmeg, and clove. The perfect autumn fragrance for cozy evenings.',
        category: 'Spicy',
        stock: 38,
        seller: 'LumiScents',
        isActive: true,
        images: [
            {
                public_id: 'candles/pumpkin_spice_candle',
                url: 'https://res.cloudinary.com/demo/image/upload/v1588795943/sample.jpg'
            }
        ],
        reviews: [],
        ratings: 4.7,
        numOfReviews: 25
    },
    {
        name: 'Patchouli',
        price: 31.99,
        description: 'Earthy and exotic patchouli with sweet and spicy undertones. Creates a bohemian and relaxing atmosphere.',
        category: 'Earthy',
        stock: 33,
        seller: 'LumiScents',
        isActive: true,
        images: [
            {
                public_id: 'candles/patchouli_candle',
                url: 'https://res.cloudinary.com/demo/image/upload/v1588795943/sample.jpg'
            }
        ],
        reviews: [],
        ratings: 4.6,
        numOfReviews: 14
    },
    {
        name: 'Ocean Breeze',
        price: 25.99,
        description: 'Fresh and clean ocean scent with notes of sea salt and marine air. Brings the coastal feeling into your home.',
        category: 'Fresh',
        stock: 48,
        seller: 'LumiScents',
        isActive: true,
        images: [
            {
                public_id: 'candles/ocean_breeze_candle',
                url: 'https://res.cloudinary.com/demo/image/upload/v1588795943/sample.jpg'
            }
        ],
        reviews: [],
        ratings: 4.5,
        numOfReviews: 19
    },
    {
        name: 'Amber',
        price: 34.99,
        description: 'Rich and warm amber with vanilla and resinous notes. Creates a luxurious and sophisticated ambiance.',
        category: 'Woody',
        stock: 30,
        seller: 'LumiScents',
        isActive: true,
        images: [
            {
                public_id: 'candles/amber_candle',
                url: 'https://res.cloudinary.com/demo/image/upload/v1588795943/sample.jpg'
            }
        ],
        reviews: [],
        ratings: 4.8,
        numOfReviews: 21
    }
];

const categories = [
    {
        name: 'Classic',
        description: 'Timeless and traditional candle scents that never go out of style',
        image: {
            public_id: 'categories/classic',
            url: 'https://res.cloudinary.com/demo/image/upload/v1588795943/sample.jpg'
        }
    },
    {
        name: 'Floral',
        description: 'Beautiful and romantic floral fragrances for a fresh atmosphere',
        image: {
            public_id: 'categories/floral',
            url: 'https://res.cloudinary.com/demo/image/upload/v1588795943/sample.jpg'
        }
    },
    {
        name: 'Woody',
        description: 'Rich and earthy wood scents for a grounding experience',
        image: {
            public_id: 'categories/woody',
            url: 'https://res.cloudinary.com/demo/image/upload/v1588795943/sample.jpg'
        }
    },
    {
        name: 'Fresh',
        description: 'Clean and invigorating scents to energize your space',
        image: {
            public_id: 'categories/fresh',
            url: 'https://res.cloudinary.com/demo/image/upload/v1588795943/sample.jpg'
        }
    },
    {
        name: 'Spicy',
        description: 'Warm and aromatic spices for cozy and comforting ambiance',
        image: {
            public_id: 'categories/spicy',
            url: 'https://res.cloudinary.com/demo/image/upload/v1588795943/sample.jpg'
        }
    },
    {
        name: 'Earthy',
        description: 'Natural and grounded scents from the earth\'s finest ingredients',
        image: {
            public_id: 'categories/earthy',
            url: 'https://res.cloudinary.com/demo/image/upload/v1588795943/sample.jpg'
        }
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB_LOCAL_URI || 'mongodb://localhost:27017/lumiscents', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB...');

        // Clear existing products and categories
        await Product.deleteMany({});
        await Category.deleteMany({});
        console.log('Cleared existing products and categories');

        // Add categories first
        const createdCategories = await Category.insertMany(categories);
        console.log('Categories added successfully');

        // Create category map for product assignment
        const categoryMap = {};
        createdCategories.forEach(cat => {
            categoryMap[cat.name] = cat._id;
        });

        // Update products with correct category IDs
        const productsWithCategories = products.map(product => ({
            ...product,
            category: categoryMap[product.category]
        }));

        // Add products
        await Product.insertMany(productsWithCategories);
        console.log('Products added successfully');

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
