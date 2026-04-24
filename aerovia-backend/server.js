import dotenv from 'dotenv';
dotenv.config();

// Decide on storage mode BEFORE importing models/routes so they pick the
// correct backing implementation when evaluated.
const hasMongoUri = !!process.env.MONGODB_URI;
if (!hasMongoUri) {
  process.env.USE_MEMORY_DB = '1';
}
if (!process.env.JWT_SECRET) {
  // Stable demo secret so tokens survive nodemon-style restarts.
  process.env.JWT_SECRET = 'aerovia-demo-secret-change-me-in-production';
}

const express = (await import('express')).default;
const cors = (await import('cors')).default;

const authRoutes = (await import('./routes/auth.js')).default;
const userRoutes = (await import('./routes/user.js')).default;
const bookingRoutes = (await import('./routes/bookings.js')).default;
const wishlistRoutes = (await import('./routes/wishlist.js')).default;
const chatRoutes = (await import('./routes/chat.js')).default;
const dataRoutes = (await import('./routes/data.js')).default;

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// ─── Middleware ────────────────────────────────────────
// In Replit the frontend is served from a different proxied origin, so we
// allow all origins by default. Override with CLIENT_URL for stricter prod.
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Tiny request log for visibility during development.
app.use((req, _res, next) => {
  if (req.path !== '/api/health') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// ─── Routes ───────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/data', dataRoutes);

// ─── Health check ─────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    mode: process.env.USE_MEMORY_DB === '1' ? 'memory' : 'mongodb',
    aiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// 404 for unknown API routes
app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

// ─── Global error handler ─────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ─── Start (with optional MongoDB) ────────────────────
async function start() {
  if (hasMongoUri) {
    try {
      const mongoose = (await import('mongoose')).default;
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected');
    } catch (err) {
      console.error('⚠️  MongoDB connection failed, falling back to in-memory store:', err.message);
      process.env.USE_MEMORY_DB = '1';
    }
  } else {
    console.log('ℹ️  No MONGODB_URI provided — using in-memory store (data resets on restart).');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Aerovia backend running on http://0.0.0.0:${PORT}`);
    console.log(`   Storage mode : ${process.env.USE_MEMORY_DB === '1' ? 'memory' : 'mongodb'}`);
    console.log(`   AI concierge : ${process.env.GEMINI_API_KEY ? 'live (Gemini)' : 'demo replies'}`);
  });
}

start();
