const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g., 'CREATE_LISTING', 'APPROVE_REQUEST', 'VERIFY_USER'
    targetId: { type: mongoose.Schema.Types.ObjectId }, // ID of the listing, request, or user affected
    targetModel: { type: String }, // e.g., 'FoodListing', 'Request', 'User'
    details: { type: String },
    ipAddress: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
