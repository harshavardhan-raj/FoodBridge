const mongoose = require('mongoose');

const foodListingSchema = new mongoose.Schema({
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foodName: { type: String, required: true },
    category: {
        type: String,
        enum: ['cooked', 'raw', 'packaged', 'beverages'],
        required: true
    },
    quantity: { type: Number, required: true },
    unit: {
        type: String,
        enum: ['kg', 'portions', 'boxes'],
        required: true
    },
    pickupTime: { type: Date, required: true },
    expiryTime: { type: Date, required: true },
    listingType: {
        type: String,
        enum: ['regular', 'event', 'consumer-surplus'],
        default: 'regular'
    },
    status: {
        type: String,
        enum: ['available', 'reserved', 'picked-up', 'expired'],
        default: 'available'
    },
    description: { type: String },
    imageUrl: { type: String },
    images: [{ type: String }],
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number] }
    },
    isConsumerSurplus: { type: Boolean, default: false },
    consumerSurplusVerified: { type: Boolean, default: false },
    bulkQuantity: { type: Boolean, default: false },
    advanceListing: { type: Boolean, default: false },
    isDiscounted: { type: Boolean, default: false },
    price: { type: Number },
    originalPrice: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

foodListingSchema.index({ location: '2dsphere' });
foodListingSchema.index({ foodName: 'text', description: 'text' });

module.exports = mongoose.model('FoodListing', foodListingSchema);
