const express = require('express');
const router = express.Router();
const { createRequest, getProviderRequests, getNGORequests, updateRequestStatus } = require('../controllers/requestController');
const { auth, roleCheck } = require('../middleware/auth');

router.post('/', auth, roleCheck(['ngo', 'student']), createRequest);
router.get('/provider', auth, roleCheck(['provider']), getProviderRequests);
router.get('/ngo', auth, roleCheck(['ngo', 'student']), getNGORequests);
router.get('/my-requests', auth, roleCheck(['ngo', 'student']), getNGORequests); // Alias for convenience
router.patch('/:id/status', auth, roleCheck(['provider', 'admin']), updateRequestStatus);

module.exports = router;
