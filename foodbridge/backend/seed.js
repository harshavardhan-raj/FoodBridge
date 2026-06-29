const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const FoodListing = require('./models/FoodListing');
const ImpactStats = require('./models/ImpactStats');
const dotenv = require('dotenv');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await FoodListing.deleteMany({});
        await ImpactStats.deleteMany({});

        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create Admin
        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@foodbridge.com',
            password: hashedPassword,
            role: 'admin',
            phone: '1234567890',
            address: 'Central Hub, City Center',
            location: { type: 'Point', coordinates: [-74.006, 40.7128] }, // NYC
            isVerified: true
        });

        // Create Provider
        const restaurant = await User.create({
            name: 'The Good Bakery',
            email: 'provider@foodbridge.com',
            password: hashedPassword,
            role: 'provider',
            providerType: 'bakery',
            phone: '9876543210',
            address: '123 Bread St, Downtown',
            location: { type: 'Point', coordinates: [-73.985, 40.758] }, // Times Square area
            isVerified: true
        });

        // Create NGO
        const ngo = await User.create({
            name: 'Helping Hands NGO',
            email: 'ngo@foodbridge.com',
            password: hashedPassword,
            role: 'ngo',
            phone: '5555555555',
            address: '456 Charity Lane, Suburbia',
            location: { type: 'Point', coordinates: [-74.001, 40.715] },
            isVerified: true
        });

        const ngo2 = await User.create({
            name: 'Community Soup Kitchen',
            email: 'kitchen@example.com',
            password: hashedPassword,
            role: 'ngo',
            phone: '1112223333',
            address: '789 Hope Blvd, West Side',
            location: { type: 'Point', coordinates: [-74.015, 40.705] },
            isVerified: true
        });

        // Create Sample Listings
        await FoodListing.create([
            {
                providerId: restaurant._id,
                foodName: 'Fresh Sourdough Bread',
                category: 'cooked',
                quantity: 10,
                unit: 'kg',
                pickupTime: new Date(Date.now() + 3600000 * 2), // 2 hours from now
                expiryTime: new Date(Date.now() + 3600000 * 24), // 24 hours from now
                status: 'available',
                description: 'Freshly baked sourdough bread left over from today.',
                location: restaurant.location
            },
            {
                providerId: restaurant._id,
                foodName: 'Hot Pasta Trays',
                category: 'cooked',
                quantity: 5,
                unit: 'boxes',
                pickupTime: new Date(Date.now() + 3600000 * 1),
                expiryTime: new Date(Date.now() + 3600000 * 3),
                status: 'available',
                description: '3 trays of Penne Arabiata and 2 trays of Lasagna.',
                location: restaurant.location
            },
            {
                providerId: restaurant._id,
                foodName: 'Mixed Pastries',
                category: 'cooked',
                quantity: 20,
                unit: 'portions',
                pickupTime: new Date(Date.now() + 3600000 * 1), // 1 hour from now
                expiryTime: new Date(Date.now() + 3600000 * 5),
                status: 'available',
                description: 'Assorted sweet and savory pastries.',
                location: restaurant.location
            }
        ]);

        // Create Initial Stats
        await ImpactStats.create({
            totalFoodSaved: 75,
            totalMealsDistributed: 220,
            activeListings: 3,
            totalProviders: 1,
            totalNGOs: 2
        });

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seed();
