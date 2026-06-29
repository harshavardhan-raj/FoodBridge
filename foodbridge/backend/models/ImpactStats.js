const mongoose = require('mongoose');

const impactStatsSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    totalFoodSaved: { type: Number, default: 0 }, // in kg
    totalMealsDistributed: { type: Number, default: 0 },
    activeListings: { type: Number, default: 0 },
    totalProviders: { type: Number, default: 0 },
    totalNGOs: { type: Number, default: 0 }
});

module.exports = mongoose.model('ImpactStats', impactStatsSchema);
