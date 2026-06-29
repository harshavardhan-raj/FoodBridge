const express = require('express');
const router = express.Router();
const { createListing, getListings, getProviderListings, updateListingStatus, getListingById, updateListing } = require('../controllers/listingController');
const { auth, roleCheck } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

router.post('/', auth, roleCheck(['provider', 'admin']), upload.single('image'), createListing);
router.get('/', auth, getListings);
router.get('/my-listings', auth, roleCheck(['provider']), getProviderListings);
router.get('/:id', auth, getListingById);
router.patch('/:id/status', auth, roleCheck(['provider', 'admin', 'staff']), updateListingStatus);
router.put('/:id', auth, roleCheck(['provider', 'admin']), upload.single('image'), updateListing);

module.exports = router;
