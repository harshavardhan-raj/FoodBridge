const mongoose = require('mongoose');

const surplusPredictionSchema = new mongoose.Schema({
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    predictionDate: { type: Date, required: true },
    probability: { type: Number, min: 0, max: 1, required: true },
    expectedQuantity: { type: Number, required: true },
    expectedUnit: { type: String, required: true },
    timeWindowStart: { type: Date, required: true },
    timeWindowEnd: { type: Date, required: true },
    confidenceScore: { type: Number, min: 0, max: 100, required: true },
    factors: {
        dayFactor: Number,
        timeFactor: Number,
        seasonalFactor: Number,
        eventFactor: Number
    },
    status: {
        type: String,
        enum: ['forecasted', 'active-alert', 'fulfilled', 'missed'],
        default: 'forecasted'
    },
    actualQuantity: { type: Number }, // To track accuracy
    topFoods: [{ type: String }], // Items likely to be surplus
    isDemo: { type: Boolean, default: false }, // Flag for demo predictions
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SurplusPrediction', surplusPredictionSchema);
