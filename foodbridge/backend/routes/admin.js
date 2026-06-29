const express = require('express');
const router = express.Router();
const { getPendingVerifications, verifyUser, rejectUser, getAllListings, getAuditLogs } = require('../controllers/adminController');
const { auth, roleCheck } = require('../middleware/auth');

router.get('/pending-verifications', auth, roleCheck(['admin']), getPendingVerifications);
router.patch('/verify/:id', auth, roleCheck(['admin']), verifyUser);
router.delete('/reject/:id', auth, roleCheck(['admin']), rejectUser);
router.get('/all-listings', auth, roleCheck(['admin']), getAllListings);
router.get('/audit-logs', auth, roleCheck(['admin']), getAuditLogs);

module.exports = router;
