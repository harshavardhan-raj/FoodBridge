const mongoose = require('mongoose');

const historicalTrendSchema = new mongoose.Schema({
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dayOfWeek: { type: Number, min: 0, max: 6, required: true }, // 0 = Sunday
    hourOfDay: { type: Number, min: 0, max: 23, required: true },
    avgSurplusQuantity: { type: Number, default: 0 },
    surplusOccurrenceCount: { type: Number, default: 0 }, // How many times surplus occurred at this slot
    totalObservations: { type: Number, default: 0 }, // Total data points for this slot
    commonCategories: [{ type: String }],
    peakSeasonFactor: { type: Number, default: 1.0 }, // Multiplier for seasonal trends
    lastUpdated: { type: Date, default: Date.now }
});

historicalTrendSchema.index({ providerId: 1, dayOfWeek: 1, hourOfDay: 1 }, { unique: true });

module.exports = mongoose.model('HistoricalTrend', historicalTrendSchema);
