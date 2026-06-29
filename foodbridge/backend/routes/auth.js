const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, deactivateAccount } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.patch('/profile', auth, updateProfile);
router.delete('/deactivate', auth, deactivateAccount);

module.exports = router;
