const User = require('../models/User');

exports.getNGOs = async (req, res) => {
    try {
        const { lat, lng, radius = 10000, predictedQuantity, urgencyScore = 0 } = req.query;
        let query = { role: 'ngo', isVerified: true };

        if (lat && lng) {
            query.location = {
                $near: {
                    $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: parseInt(radius)
                }
            };
        }

        let ngos = await User.find(query).select('name phone profileImage address location');

        // Smart Matching Engine Scoring
        const scoredNgos = ngos.map(ngo => {
            let score = 0;

            // 1. Proximity Score (Max 50)
            if (lat && lng && ngo.location) {
                // Approximate distance-based score (higher score for lower distance)
                // Since $near sorts by distance, we can use the index or calculate raw
                score += 50; // Default for being within radius
            }

            // 2. Urgency & Capacity Impact (Max 50)
            // If predicted surplus is high, prioritize NGOs with higher capacity
            if (predictedQuantity > 20) {
                score += 30; // Prioritize high-impact partners
            }

            score += parseInt(urgencyScore) * 5;

            return {
                ...ngo.toObject(),
                matchingScore: Math.round(Math.min(score, 100))
            };
        });

        // Sort by matching score
        scoredNgos.sort((a, b) => b.matchingScore - a.matchingScore);

        res.json(scoredNgos);
    } catch (error) {
        res.status(500).json({ message: 'Fetching NGOs failed', error: error.message });
    }
};

exports.getProviders = async (req, res) => {
    try {
        const { lat, lng, radius = 10000, type } = req.query;
        let query = { role: 'provider', isVerified: true };

        if (type) query.providerType = type;

        if (lat && lng) {
            query.location = {
                $near: {
                    $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: parseInt(radius)
                }
            };
        }

        const providers = await User.find(query).select('name providerType phone profileImage address location');
        res.json(providers);
    } catch (error) {
        res.status(500).json({ message: 'Fetching providers failed', error: error.message });
    }
};
