const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { geocodeAddress } = require('../utils/geocoder');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, providerType, phone, address, coordinates, registrationNumber, university, studentId } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Geocode address if coordinates not provided
        let coords = coordinates;
        if (!coords || (coords[0] === 0 && coords[1] === 0)) {
            const geocoded = await geocodeAddress(address);
            if (geocoded) coords = geocoded;
        }

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            providerType: role === 'student' ? 'none' : providerType,
            phone,
            address,
            registrationNumber,
            university,
            studentId,
            location: {
                type: 'Point',
                coordinates: coords || [0, 0] // Default to [0,0] if geocoding fails
            },
            isVerified: role === 'provider' || role === 'ngo' ? false : true // Admin/Staff/Student auto-verified
        });

        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ user: { id: user._id, name, email, role }, token });
    } catch (error) {
        console.error('REGISTRATION ERROR:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

exports.getMe = async (req, res) => {
    res.json(req.user);
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, address, email } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            user.email = email;
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address && address !== user.address) {
            user.address = address;
            const geocoded = await geocodeAddress(address);
            if (geocoded) {
                user.location = {
                    type: 'Point',
                    coordinates: geocoded
                };
            }
        }

        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: error.message || 'Update failed' });
    }
};

exports.deactivateAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Permanently delete user
        await User.findByIdAndDelete(req.user.id);

        res.json({ message: 'Account permanently deactivated' });
    } catch (error) {
        console.error('Deactivate account error:', error);
        res.status(500).json({ message: 'Deactivation failed', error: error.message });
    }
};
