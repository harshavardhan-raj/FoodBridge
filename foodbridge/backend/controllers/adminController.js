const User = require('../models/User');
const FoodListing = require('../models/FoodListing');
const AuditLog = require('../models/AuditLog');
const createAuditLog = require('../utils/auditLogger');

exports.getPendingVerifications = async (req, res) => {
    try {
        const users = await User.find({ isVerified: false, role: { $ne: 'admin' } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Fetching pending verifications failed', error: error.message });
    }
};

exports.verifyUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Audit log
        await createAuditLog(req, 'VERIFY_USER', user._id, 'User', `Verified user: ${user.name} (${user.role})`);

        res.json({ message: 'User verified successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Verification failed', error: error.message });
    }
};

exports.rejectUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Audit log
        await createAuditLog(req, 'REJECT_USER', user._id, 'User', `Rejected verification for: ${user.name} (${user.role})`);

        // Currently, we just delete the user or keep them unverified.
        // For this implementation, let's keep them and mark a rejection flag if we had one, 
        // or just notify them. Since there's no 'status' beyond isVerified, 
        // we might delete them to allow re-registration or keep them disabled.
        // Let's go with deletion for this MVP to allow them to retry with correct info.
        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User rejected and removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Rejection failed', error: error.message });
    }
};

exports.getAllListings = async (req, res) => {
    try {
        const listings = await FoodListing.find().populate('providerId', 'name email');
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Fetching all listings failed', error: error.message });
    }
};

exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate('userId', 'name email role')
            .sort({ createdAt: -1 })
            .limit(100);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Fetching audit logs failed', error: error.message });
    }
};
