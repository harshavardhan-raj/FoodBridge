const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');

// Configurations
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Socket.io initialization
app.set('io', io);
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Basic Route
app.get('/', (req, res) => {
    res.send('FoodBridge API is running...');
});

// Import Routes
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const requestRoutes = require('./routes/requests');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const statRoutes = require('./routes/stats');
const discoveryRoutes = require('./routes/discovery');
const predictionRoutes = require('./routes/predictions');

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statRoutes);
app.use('/api/discovery', discoveryRoutes);
app.use('/api/predictions', predictionRoutes);

// Serve static assets in production
const distPath = path.join(__dirname, '../web-frontend/dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
    // If request starts with /api, pass it to next (error handler) instead of serving index.html
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ message: 'API route not found' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
