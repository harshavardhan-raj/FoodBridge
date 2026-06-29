const predictionService = require('../services/predictionService');
const SurplusPrediction = require('../models/SurplusPrediction');
const User = require('../models/User');

exports.predictSurplus = async (req, res) => {
    try {
        let providerId = req.params.providerId;

        // Handle case where frontend might send "undefined" or "null" as a string
        if (!providerId || providerId === 'undefined' || providerId === 'null') {
            providerId = req.user.id;
        }

        console.log(`[ML] Predicting surplus for provider: ${providerId}`);

        // Check if this provider has any demo predictions (to enable demo mode)
        const hasDemo = await SurplusPrediction.exists({ providerId, isDemo: true });
        console.log(`[ML] Has demo data: ${!!hasDemo}`);

        const prediction = await predictionService.generatePrediction(providerId, !!hasDemo);

        if (!prediction) {
            console.log(`[ML] No prediction generated for ${providerId}`);
            return res.status(200).json({
                message: 'No sufficient historical data for prediction at this time',
                probability: 0
            });
        }

        console.log(`[ML] Prediction found: ${prediction._id}, Probability: ${prediction.probability}`);
        res.json(prediction);
    } catch (error) {
        console.error('[ML] Prediction error:', error);
        res.status(500).json({ message: 'Prediction generation failed', error: error.message });
    }
};

exports.getForecasts = async (req, res) => {
    try {
        // Fetch all active/upcoming predictions for the next 24 hours
        const predictions = await SurplusPrediction.find({
            predictionDate: { $gte: new Date() },
            probability: { $gte: 0.5 }
        }).populate('providerId', 'name address location');

        res.json(predictions);
    } catch (error) {
        res.status(500).json({ message: 'Fetching forecasts failed', error: error.message });
    }
};

exports.getAccuracyStats = async (req, res) => {
    try {
        const total = await SurplusPrediction.countDocuments({ status: { $in: ['fulfilled', 'missed'] } });
        const fulfilled = await SurplusPrediction.countDocuments({ status: 'fulfilled' });

        res.json({
            totalPredictions: total,
            fulfilledCount: fulfilled,
            accuracyScore: total > 0 ? (fulfilled / total) * 100 : 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Fetching accuracy stats failed', error: error.message });
    }
};

exports.trainModel = async (req, res) => {
    try {
        const providerId = req.user.id;
        if (req.user.role !== 'provider') {
            return res.status(403).json({ message: 'Only providers can train their model' });
        }

        const result = await predictionService.trainModel(providerId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Model training failed', error: error.message });
    }
};
