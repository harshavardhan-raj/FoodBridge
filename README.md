#  FoodBridge — Surplus Food Redistribution Platform

FoodBridge is a premium web application designed to combat food waste and address food insecurity. It bridges the gap between surplus food providers (like restaurants, bakeries, and grocery stores), local NGO charities, and students looking for discounted meals.

---

##  Key Features

* ** NGO Map & Discovery**: Real-time interactive mapping allowing local charities to locate available food listings nearby and reserve them instantly.
* ** Student Marketplace**: A dedicated, discounted deal tracker where students can claim surplus food at major discounts.
* ** Provider Inventory Management**: Intuitive provider dashboard where businesses can list food details, upload photos, set expiry windows, and track pickups.
* ** Predictive Surplus Matching**: Machine learning algorithms matching historical surplus data with user trends to predict future food surplus availability.
* ** Live Notifications**: Real-time status updates via WebSockets (Socket.io) informing users when listing statuses change or new food becomes available.

---

##  Technology Stack

* **Frontend**: React (Vite), Tailwind CSS, HSL Custom Glassmorphism UI.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB (Mongoose schemas with strict validations).
* **Real-time Engine**: Socket.io.
* **Security & Auth**: JSON Web Tokens (JWT) & bcrypt passwords.

---

##  Local Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [MongoDB](https://www.mongodb.com/) (running locally or a remote Atlas connection)

### 1. Clone & Initialize
```bash
git clone https://github.com/harshavardhan-raj/FoodBridge.git
cd FoodBridge
```

### 2. Configure Backend
Navigate to the backend directory and set up your configurations:
```bash
cd foodbridge/backend
npm install
```
Create a `.env` file inside `foodbridge/backend/` and configure:
```env
MONGO_URI=mongodb://localhost:27017/foodbridge
JWT_SECRET=your_secret_key
PORT=5000
```
Seed the database with test data:
```bash
npm run seed
```
Start the backend server:
```bash
npm start
```

### 3. Configure Frontend
Navigate to the frontend directory:
```bash
cd ../web-frontend
npm install
npm run dev
```
Open **[http://localhost:3001/](http://localhost:3001/)** in your browser.

---

## ☁️ Single-Link Cloud Deployment

The repository is configured for a **unified single-link deployment** on Render or Railway using Docker or Node runtimes:

### Deploy to Render:
1. Create a new **Web Service** on Render connected to your repository.
2. Leave the **Root Directory** setting blank.
3. If using **Docker** runtime:
   * Set **Dockerfile Path** to `foodbridge/backend/Dockerfile`.
4. If using **Node** runtime:
   * Set **Root Directory** to `foodbridge/backend`.
   * Set **Build Command** to `npm run build`.
   * Set **Start Command** to `npm start`.
5. Add Environment Variables:
   * `MONGO_URI`: Your MongoDB Atlas URI.
   * `JWT_SECRET`: A secure random encryption key.
   * `PORT`: `5000`
