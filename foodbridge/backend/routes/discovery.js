const express = require('express');
const router = express.Router();
const { getNGOs, getProviders } = require('../controllers/discoveryController');
const { auth } = require('../middleware/auth');

router.get('/ngos', auth, getNGOs);
router.get('/providers', auth, getProviders);

module.exports = router;
