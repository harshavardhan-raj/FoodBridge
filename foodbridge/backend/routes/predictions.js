const express = require('express');
const router = express.Router();
const { predictSurplus, getForecasts, getAccuracyStats, trainModel } = require('../controllers/predictionController');
const { auth } = require('../middleware/auth');

router.get('/predict/:providerId?', auth, predictSurplus);
router.get('/forecasts', auth, getForecasts);
router.get('/accuracy', auth, getAccuracyStats);
router.post('/train', auth, trainModel);

module.exports = router;
