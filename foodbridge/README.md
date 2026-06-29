# FoodBridge - Food Surplus Redistribution Platform

FoodBridge connects restaurants, hotels, and bakeries with NGOs to reduce food waste and feed those in need.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Cloudinary Account (for image uploads)

### 2. Backend Setup
```bash
cd backend
npm install
# Update .env with your MONGO_URI and Cloudinary credentials
node seed.js  # Optional: Seed initial data
npm start     # Runs on http://localhost:5000
```

### 3. Web Frontend Setup
```bash
cd web-frontend
npm install
npm run dev   # Runs on http://localhost:3000
```

### 4. Mobile App Setup (Expo)
```bash
cd mobile-app
npm install
npx expo start
```

## 🛠 Tech Stack
- **Frontend**: React.js, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, MongoDB, Socket.io
- **Mobile**: React Native (Expo)
- **Auth**: JWT & bcrypt
- **Storage**: Multer & Cloudinary

## 👥 User Roles
- **Provider**: Add surplus food, manage listings, approve requests.
- **NGO**: Browse nearby food on map/list, request food for pickup.
- **Admin**: Verify organizations and monitor platform activity.
- **Staff**: Verify consumer surplus items (mobile specific).

## ✨ Key Features
- **Geo-based Discovery**: NGOs see food within 10km radius.
- **Real-time Notifications**: Instant alerts for new food and request status updates.
- **Impact Tracking**: Automated stats for food saved and meals distributed.
- **Hygiene Verification**: Tick-box verification for food safety.
