const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['provider', 'ngo', 'admin', 'staff', 'student'],
    required: true
  },
  providerType: {
    type: String,
    enum: ['restaurant', 'hotel', 'bakery', 'event', 'none'],
    default: 'none'
  },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number] } // [lng, lat]
  },
  registrationNumber: { type: String, default: '' },
  university: { type: String, default: '' },
  studentId: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  profileImage: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
