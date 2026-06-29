const ImpactStats = require('../models/ImpactStats');
const FoodListing = require('../models/FoodListing');
const User = require('../models/User');

exports.getStats = async (req, res) => {
    try {
        const stats = await ImpactStats.find().sort({ date: -1 }).limit(30);

        // Calculate current live stats
        const totalProviders = await User.countDocuments({ role: 'provider' });
        const totalNGOs = await User.countDocuments({ role: 'ngo' });
        const activeListings = await FoodListing.countDocuments({ status: 'available' });

        res.json({
            history: stats,
            current: {
                totalProviders,
                totalNGOs,
                activeListings
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Fetching stats failed', error: error.message });
    }
};
