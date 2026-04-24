# Aerovia — AI-Powered Travel Booking System

> Full-stack travel platform with Gemini AI concierge, MongoDB backend, JWT auth, and a rich demo dataset.

---

## 📁 Project Structure

```
aerovia/
├── aerovia-frontend/   ← React + Vite + Tailwind (do NOT modify UI)
└── aerovia-backend/    ← Node.js + Express + MongoDB + Gemini AI
```

---

## ⚡ Quick Start

### Step 1 — Backend Setup

```bash
cd aerovia-backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```env
MONGODB_URI=mongodb://localhost:27017/aerovia
JWT_SECRET=your_super_secret_key_here_change_this
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

> **Get Gemini API Key free:** https://aistudio.google.com/app/apikey

Start backend:
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Aerovia backend running on http://localhost:5000
```

---

### Step 2 — Frontend Setup

```bash
cd aerovia-frontend
npm install   (or pnpm install)
```

The `.env.local` is already configured to point to `http://localhost:5000/api`.

Start frontend:
```bash
npm run dev
```

Open: **http://localhost:5173**

---

## 🔑 API Keys You Need

| Key | Where to Get | Free? |
|-----|-------------|-------|
| `GEMINI_API_KEY` | https://aistudio.google.com/app/apikey | ✅ Yes |
| `MONGODB_URI` | Local MongoDB OR https://cloud.mongodb.com (free tier) | ✅ Yes |

---

## 🗄️ MongoDB Setup Options

**Option A — Local MongoDB:**
- Install: https://www.mongodb.com/try/download/community
- Use URI: `mongodb://localhost:27017/aerovia`

**Option B — MongoDB Atlas (Cloud, free):**
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Get connection string like: `mongodb+srv://user:pass@cluster.mongodb.net/aerovia`

---

## 🚀 Features

### Backend
- **JWT Authentication** — Register, Login, token validation
- **User Profiles** — Update personal details, travel preferences, documents
- **Bookings** — Create, view, cancel bookings (stored in MongoDB)
- **Wishlist** — Save/remove destinations, packages, hotels
- **Gemini AI Chat** — Real AI responses with travel context
- **Data API** — 20+ destinations, 30 flights, 20 hotels, 15 buses, 18 packages, 12 deals

### Frontend
- All UI unchanged from Figma design
- Auth now uses real JWT backend (no more localStorage tricks)
- AI Chat powered by Google Gemini 1.5 Flash
- All data served from backend with search/filter support

---

## 📡 API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Verify token, get user |

### User
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/user/profile` | Get profile |
| PUT | `/api/user/profile` | Update profile |
| PUT | `/api/user/password` | Change password |

### Bookings
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/bookings` | Get all bookings |
| POST | `/api/bookings` | Create booking |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking |

### Wishlist
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/wishlist` | Get wishlist |
| POST | `/api/wishlist` | Add item |
| DELETE | `/api/wishlist/:itemId` | Remove item |

### Chat
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/chat` | Send message to Gemini AI |

### Data
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/data/destinations` | All destinations |
| GET | `/api/data/destinations/:id` | Single destination |
| GET | `/api/data/flights` | Flights (filterable) |
| GET | `/api/data/hotels` | Hotels (filterable) |
| GET | `/api/data/buses` | Bus routes |
| GET | `/api/data/packages` | Travel packages |
| GET | `/api/data/deals` | Flash deals |
| GET | `/api/data/search?q=` | AI-powered search |

---

## 🔮 Future Scope (as mentioned in paper)

- [ ] Real flight APIs (Amadeus, Skyscanner API)
- [ ] Real hotel APIs (Booking.com, Hotels.com API)
- [ ] Payment gateway (Razorpay integration already in tech stack)
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] ML-based personalized recommendations
- [ ] Multi-language support

---

## 🛠 Tech Stack

**Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, React Router 7, Recharts, Lucide React

**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.js, Google Generative AI SDK

**AI:** Google Gemini 1.5 Flash

---

## 📝 Notes

- All travel data is **demo data** — realistic but fictional
- The Gemini chatbot is a real AI connection — it needs your API key
- MongoDB stores real user data, bookings, and wishlists
- In production: add HTTPS, rate limiting, and environment hardening
