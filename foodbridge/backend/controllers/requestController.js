const Request = require('../models/Request');
const FoodListing = require('../models/FoodListing');
const Notification = require('../models/Notification');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const createAuditLog = require('../utils/auditLogger');

exports.createRequest = async (req, res) => {
    try {
        const { listingId, requestedQuantity, scheduledPickupTime, notes } = req.body;

        const listing = await FoodListing.findById(listingId);
        if (!listing || listing.status !== 'available') {
            return res.status(400).json({ message: 'Listing not available' });
        }

        const request = new Request({
            listingId,
            ngoId: req.user.id,
            providerId: listing.providerId,
            requestedQuantity,
            scheduledPickupTime,
            notes
        });

        await request.save();

        // Audit Log
        await createAuditLog(req, 'CREATE_REQUEST', request._id, 'Request', `Requested ${requestedQuantity} of ${listing.foodName}`);

        // Create notification for provider
        const isStudent = req.user.role === 'student';
        const notification = new Notification({
            userId: listing.providerId,
            title: isStudent ? 'New Student Deal Claimed' : 'New Food Request',
            message: `${req.user.name} (${isStudent ? 'Student' : 'NGO'}) has requested food from your listing: ${listing.foodName}`,
            type: 'request_received',
            relatedId: request._id
        });
        await notification.save();

        // Socket notification
        const io = req.app.get('io');
        io.to(listing.providerId.toString()).emit('notification', notification);

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: 'Request creation failed', error: error.message });
    }
};

exports.getProviderRequests = async (req, res) => {
    try {
        const requests = await Request.find({ providerId: req.user.id })
            .populate('listingId')
            .populate('ngoId', 'name phone address');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Fetching requests failed', error: error.message });
    }
};

exports.getNGORequests = async (req, res) => {
    try {
        const requests = await Request.find({ ngoId: req.user.id })
            .populate('listingId')
            .populate('providerId', 'name phone address');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Fetching requests failed', error: error.message });
    }
};

exports.updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // approved, rejected, completed

        const request = await Request.findById(id).populate('listingId');
        if (!request) return res.status(404).json({ message: 'Request not found' });

        const oldStatus = request.status;
        const listing = request.listingId;

        if (status === 'approved' && oldStatus !== 'approved') {
            if (!listing) return res.status(404).json({ message: 'Listing not found' });

            // Check if enough quantity is available
            if (listing.quantity < request.requestedQuantity) {
                return res.status(400).json({ message: 'Insufficient quantity available' });
            }

            // Deduct quantity
            listing.quantity -= request.requestedQuantity;

            // If quantity reaches 0, mark as reserved, otherwise keep as available
            if (listing.quantity <= 0) {
                listing.status = 'reserved';
            } else {
                listing.status = 'available';
            }
            await listing.save();
        }
        else if (status === 'rejected' && (oldStatus === 'approved' || oldStatus === 'completed')) {
            if (listing) {
                listing.quantity += request.requestedQuantity;
                listing.status = 'available';
                await listing.save();
            }
        }
        else if (status === 'completed' && oldStatus !== 'completed') {
            if (listing && listing.quantity <= 0) {
                listing.status = 'picked-up';
                await listing.save();
            }
        }

        // Now update the request status
        request.status = status;
        request.updatedAt = Date.now();
        await request.save();

        // Audit Log
        await createAuditLog(req, 'UPDATE_REQUEST_STATUS', request._id, 'Request', `Updated request status from ${oldStatus} to ${status}`);

        if (status === 'approved' && oldStatus !== 'approved') {
            // Notify NGO via Email
            const ngo = await User.findById(request.ngoId);
            const isStudent = ngo.role === 'student';
            try {
                await sendEmail({
                    email: ngo.email,
                    subject: isStudent ? 'Student Deal Approved - FoodBridge' : 'Pick-up Request Approved - FoodBridge',
                    html: `
                        <div style="font-family: sans-serif; padding: 20px;">
                            <h2 style="color: #16a34a;">Good news!</h2>
                            <p>Your ${isStudent ? 'deal claim' : 'request'} for <b>${listing.foodName}</b> has been approved.</p>
                            <p><b>Quantity:</b> ${request.requestedQuantity} ${listing.unit}</p>
                            <p><b>Pick-up Location:</b> ${listing.address || 'Provider Location'}</p>
                            <p>Please coordinate the pick-up as scheduled.</p>
                            <a href="${process.env.FRONTEND_URL}/${isStudent ? 'student' : 'ngo'}/requests" style="background: #16a34a; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">View ${isStudent ? 'Order' : 'Request'}</a>
                        </div>
                    `
                });
            } catch (emailErr) {
                console.error('Email failed to send', emailErr);
            }
        }

        // Notify NGO
        const notification = new Notification({
            userId: request.ngoId,
            title: `Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: `Your request for ${request.listingId.foodName} has been ${status}.`,
            type: 'request_status',
            relatedId: request._id
        });
        await notification.save();

        const io = req.app.get('io');
        io.to(request.ngoId.toString()).emit('notification', notification);

        // Emit real-time listing status update
        if (status === 'completed' && listing) {
            io.emit('listing_status_update', {
                listingId: listing._id,
                status: listing.status,
                quantity: listing.quantity
            });
        }

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: 'Updating request failed', error: error.message });
    }
};
