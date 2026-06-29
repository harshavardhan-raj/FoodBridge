const { useCloudinary } = require('../utils/cloudinary');
const FoodListing = require('../models/FoodListing');
const User = require('../models/User');
const Notification = require('../models/Notification');
const createAuditLog = require('../utils/auditLogger');
const predictionService = require('../services/predictionService');

exports.createListing = async (req, res) => {
    try {
        const listingData = { ...req.body, providerId: req.user.id };

        if (req.file) {
            listingData.imageUrl = useCloudinary
                ? req.file.path
                : `/uploads/${req.file.filename}`;
        }

        // Default location to provider's location if not provided
        if (!listingData.location) {
            listingData.location = req.user.location;
        }

        const listing = new FoodListing(listingData);
        await listing.save();

        // Feed ML model
        await predictionService.recordListing(listing);

        // Create Audit Log
        await createAuditLog(req, 'CREATE_LISTING', listing._id, 'FoodListing', `Created listing: ${listing.foodName}`);

        // Emit socket event for new listing
        const io = req.app.get('io');
        io.emit('new_listing', listing);

        res.status(201).json(listing);
    } catch (error) {
        console.error('Listing creation error:', error);
        res.status(500).json({ message: 'Listing creation failed', error: error.message });
    }
};

exports.getListings = async (req, res) => {
    try {
        const { lat, lng, radius = 10000, category, type, status, search, discounted } = req.query; // radius in meters
        const gracePeriod = 30 * 60 * 1000; // 30 minutes in ms
        let query = {
            status: status || 'available',
            expiryTime: { $gt: new Date(Date.now() - gracePeriod) }
        };

        if (category) query.category = category;
        if (type) query.listingType = type;

        // Enforce discounted deals for students
        if (req.user && req.user.role === 'student') {
            query.isDiscounted = true;
        } else if (discounted === 'true') {
            query.isDiscounted = true;
        }

        if (search) {
            // Find providers matching search to include them in the query
            const matchingProviders = await User.find({
                name: { $regex: search, $options: 'i' },
                role: 'provider'
            }).select('_id');
            const providerIds = matchingProviders.map(p => p._id);

            query.$or = [
                { foodName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { providerId: { $in: providerIds } }
            ];
        }

        if (lat && lng) {
            query.location = {
                $near: {
                    $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: parseInt(radius)
                }
            };
        }

        const listings = await FoodListing.find(query).populate('providerId', 'name phone profileImage');
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Fetching listings failed', error: error.message });
    }
};

exports.getProviderListings = async (req, res) => {
    try {
        const listings = await FoodListing.find({ providerId: req.user.id });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Fetching provider listings failed', error: error.message });
    }
};

exports.getListingById = async (req, res) => {
    try {
        const listing = await FoodListing.findById(req.params.id).populate('providerId', 'name email phone location address');
        if (!listing) return res.status(404).json({ message: 'Listing not found' });
        res.json(listing);
    } catch (error) {
        res.status(500).json({ message: 'Fetching listing failed', error: error.message });
    }
};

exports.updateListingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const listing = await FoodListing.findByIdAndUpdate(id, { status }, { new: true });
        res.json(listing);
    } catch (error) {
        res.status(500).json({ message: 'Updating status failed', error: error.message });
    }
};

exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        if (req.file) {
            updateData.imageUrl = useCloudinary
                ? req.file.path
                : `/uploads/${req.file.filename}`;
        }

        const listing = await FoodListing.findByIdAndUpdate(id, updateData, { new: true });
        if (!listing) return res.status(404).json({ message: 'Listing not found' });

        // Create Audit Log
        await createAuditLog(req, 'UPDATE_LISTING', listing._id, 'FoodListing', `Updated listing: ${listing.foodName}`);

        res.json(listing);
    } catch (error) {
        res.status(500).json({ message: 'Updating listing failed', error: error.message });
    }
};
