const AuditLog = require('../models/AuditLog');

const createAuditLog = async (req, action, targetId, targetModel, details) => {
    try {
        await AuditLog.create({
            userId: req.user.id,
            action,
            targetId,
            targetModel,
            details,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
    }
};

module.exports = createAuditLog;
