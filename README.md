# 🏡 HomelyHub — Full-Stack Vacation Rental & AI Trip Planning Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/atlas)
[![Groq AI](https://img.shields.io/badge/Groq%20Cloud-AI%20Trip%20Planner-orange.svg)](https://groq.com/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://homelyhub0.netlify.app)

> **HomelyHub** is a production-ready, full-stack vacation rental booking platform inspired by Airbnb. It combines an intuitive property discovery interface, secure multi-day booking and reservation workflows, host property management, and an **AI Trip Genie** powered by **Groq Cloud (LLMs)** to generate personalized day-by-day travel itineraries with matched stays.

🌐 **Live Demo:** [https://homelyhub0.netlify.app](https://homelyhub0.netlify.app)  
⚙️ **API Endpoint:** [https://homelyhub-qjsw.onrender.com](https://homelyhub-qjsw.onrender.com)

---

## ✨ Features

### 🔍 Discovery, Search & Filtering
- **Multi-Criteria Search**: Search by destination (city, state, area, or property name), guest counts, and availability check-in/check-out dates.
- **Interactive Filters**: Dynamic price range slider (₹600 to ₹30,000+), property type selection (House, Flat, Guest House, Hotel), room types (Entire Home, Room, Any Type), and amenities (Wi-Fi, AC, Pool, Kitchen, Parking, TV, Washing Machine).
- **Responsive Pagination**: Active bidirectional pagination (8 properties/page) with fluid GSAP card animations, live page counters, and circular navigation.

### 🤖 AI Trip Genie (Trip Planner)
- **AI-Powered Itineraries**: Generates comprehensive day-by-day vacation plans using high-speed **Groq Cloud AI (`openai/gpt-oss-120b`)**.
- **Real-Time Property Matching**: Automatically maps generated itineraries to verified HomelyHub accommodations within destination and budget constraints.
- **Interactive Trip Customizer**: Tailor plans by destination, duration (days), group size, budget, and travel interests (Beach, Culture, Food, Adventure, Nightlife).

### 💳 Booking & Checkout Workflow
- **Date & Cost Calculation**: Accurate night calculations and dynamic pricing models based on selected check-in and check-out dates.
- **End-to-End Order Processing**: Multi-step checkout with order initiation, session persistence across page refreshes, and verified database reservations.
- **Reservation Conflict Prevention**: Prevents double bookings by validating against existing property booking dates.

### 👤 User Account & Host Portal
- **Secure Authentication**: JWT-based authentication with encrypted passwords (`bcryptjs`), HTTP-only cookies, and persistent login sessions.
- **Custom Profile & Avatars**: User profiles with custom avatars, password management, and detail editing.
- **My Bookings**: Real-time dashboard of upcoming, active, and completed stays with full invoice and reservation details.
- **Host Listings ("My Accommodations")**: Property owners can list new accommodations with multi-image support, custom amenities, pricing, check-in/out rules, and track their listings.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit (User, Property, Payment, Accommodation slices)
- **Routing**: React Router v6 with Protected Routes
- **UI & Animations**: GSAP (GreenSock), Ant Design (DatePickers), React Input Range, Material Symbols & Icons, Bootstrap 5 utilities
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios with interceptors and base configurations

### Backend
- **Runtime**: Node.js & Express.js (ES Modules)
- **Database**: MongoDB Atlas with Mongoose ODM
- **AI Engine**: Groq Cloud SDK (`openai/gpt-oss-120b`)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Media Management**: ImageKit.io SDK
- **Security & Utilities**: Cookie-Parser, CORS (with credentials), Dotenv

---

## 📁 Project Architecture

```
HomelyHub/
├── backend/
│   ├── src/
│   │   ├── ai/               # Groq Cloud AI trip planning logic
│   │   ├── controllers/      # Route controllers (auth, booking, property, trip)
│   │   ├── Models/           # Mongoose schemas (User, Property, Booking)
│   │   ├── routes/           # Express API route definitions
│   │   ├── utils/            # APIFeatures, DB connection, tokens, ImageKit
│   │   └── index.js          # Express app entry point & middleware pipeline
│   └── package.json
│
├── Frontend/
│   ├── public/assets/        # Logos, default avatars, static assets
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── home/         # Header, Search, Filter, FilterModal, PropertyList
│   │   │   ├── trip/         # AI Trip Planner & Genie components
│   │   │   ├── propertyListing/ # Property details & payment forms
│   │   │   ├── payment/      # Checkout & payment confirmation
│   │   │   ├── myBookings/   # User bookings & stay details
│   │   │   ├── accomodation/ # Host accommodation listing & form
│   │   │   └── user/         # Login, Signup, Profile, EditProfile, Password
│   │   ├── store/            # Redux Toolkit slices and async thunk actions
│   │   ├── css/              # Modular component styling
│   │   ├── App.jsx           # Application routing & route protection
│   │   └── main.jsx          # React DOM mounting with Redux Provider
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**
- **MongoDB Atlas** account or local MongoDB instance
- **Groq Cloud API Key** (free at [console.groq.com](https://console.groq.com/))

---

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/HomelyHub.git
cd HomelyHub
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=8080
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/homelyhub?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=90d
ORIGIN_ACCESS_URL=http://localhost:5173

# AI Trip Planner (Groq Cloud)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b

# ImageKit (Optional for image uploads)
IMAGEKIT_PUBLICKEY=your_imagekit_public_key
IMAGEKIT_PRIVATEKEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

Start the backend server:
```bash
npm run dev
# Server starts on http://localhost:8080
```

---

### 3. Frontend Setup
Open a new terminal window:
```bash
cd Frontend
npm install
```

Create a `.env` file inside `Frontend/`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Start the frontend development server:
```bash
npm run dev
# Application available at http://localhost:5173
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/v1/rent/user/signup` | Register new account | Public |
| `POST` | `/api/v1/rent/user/login` | Login user & issue JWT cookie | Public |
| `POST` | `/api/v1/rent/user/logout` | Logout user & clear cookie | Public |
| `GET` | `/api/v1/rent/user/me` | Fetch authenticated user profile | Private |
| `PUT` | `/api/v1/rent/user/updateprofile` | Update profile info & avatar | Private |
| `GET` | `/api/v1/rent/listing` | Search, filter, and paginate properties | Public |
| `GET` | `/api/v1/rent/listing/:id` | Get single property details | Public |
| `POST` | `/api/v1/rent/user/newAccommodation` | Host adds a new property listing | Private |
| `GET` | `/api/v1/rent/user/myAccommodation` | Fetch listings owned by current user | Private |
| `POST` | `/api/v1/rent/user/booking/create-order`| Initiate booking order | Private |
| `POST` | `/api/v1/rent/user/booking/verify-payment`| Verify payment & finalize booking | Private |
| `GET` | `/api/v1/rent/user/booking` | Retrieve user booking history | Private |
| `POST` | `/api/v1/rent/trip` | Generate AI travel itinerary & stays | Public / Private |
