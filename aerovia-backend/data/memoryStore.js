// ═══════════════════════════════════════════════════════════════
//  AEROVIA · IN-MEMORY DATA STORE
//  A tiny mongoose-compatible substitute used when MongoDB is not
//  configured. Implements just the methods the routes/models need.
// ═══════════════════════════════════════════════════════════════

import bcrypt from 'bcryptjs';
import crypto from 'crypto';

function newId() {
  return crypto.randomBytes(12).toString('hex');
}

function matches(doc, query) {
  return Object.entries(query).every(([k, v]) => {
    if (k === '_id') return doc._id === String(v);
    return doc[k] === v;
  });
}

// A thenable that mimics a mongoose Query, supporting .select() / .sort()
class MemQuery {
  constructor(executor) {
    this._exec = executor;
  }
  select() { return this; }
  sort() { return this; }
  then(resolve, reject) {
    return Promise.resolve().then(() => this._exec()).then(resolve, reject);
  }
  catch(reject) { return this.then(undefined, reject); }
}

// ─── User ─────────────────────────────────────────────────
class MemoryUserDoc {
  constructor(data) { Object.assign(this, data); }

  async comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
  }

  toProfile() {
    return {
      id: String(this._id),
      name: this.name,
      email: this.email,
      phone: this.phone || '',
      country: this.country || '',
      city: this.city || '',
      dateOfBirth: this.dateOfBirth || '',
      passportNumber: this.passportNumber || '',
      nationality: this.nationality || '',
      travelPreferences: this.travelPreferences || [],
      avatar: this.avatar || '',
      createdAt: new Date(this.createdAt).toISOString(),
    };
  }

  async save() {
    if (this.password && !this.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
    this.updatedAt = Date.now();
    return this;
  }
}

class MemoryUserModel {
  static _users = [];

  static findOne(query) {
    return new MemQuery(() => {
      const normalized = { ...query };
      if (normalized.email) normalized.email = String(normalized.email).toLowerCase().trim();
      return this._users.find(u => matches(u, normalized)) || null;
    });
  }

  static findById(id) {
    return new MemQuery(() => this._users.find(u => u._id === String(id)) || null);
  }

  static findByIdAndUpdate(id, updates, opts = {}) {
    return new MemQuery(() => {
      const u = this._users.find(x => x._id === String(id));
      if (!u) return null;
      Object.assign(u, updates);
      u.updatedAt = Date.now();
      return opts.new === false ? null : u;
    });
  }

  static async create(data) {
    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    const email = String(data.email || '').toLowerCase().trim();
    if (!email) throw new Error('Email is required');
    if (this._users.some(u => u.email === email)) {
      const err = new Error('Email already exists'); err.code = 11000; throw err;
    }
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(data.password, salt);
    const now = Date.now();
    const doc = new MemoryUserDoc({
      _id: newId(),
      name: String(data.name || '').trim(),
      email,
      password: hashed,
      phone: '', country: '', city: '', dateOfBirth: '',
      passportNumber: '', nationality: '', travelPreferences: [], avatar: '',
      createdAt: now, updatedAt: now,
    });
    this._users.push(doc);
    return doc;
  }
}

// ─── Booking ──────────────────────────────────────────────
class MemoryBookingModel {
  static _bookings = [];

  static find(query) {
    const sortable = {
      _docs: this._bookings.filter(b => matches(b, query)),
      sort(spec) {
        const [field, dir] = Object.entries(spec)[0];
        this._docs = [...this._docs].sort((a, b) => (a[field] > b[field] ? 1 : -1) * (dir === -1 ? -1 : 1));
        return this;
      },
      then(resolve, reject) { return Promise.resolve(this._docs).then(resolve, reject); },
    };
    return sortable;
  }

  static findOne(query) {
    return new MemQuery(() => this._bookings.find(b => matches(b, query)) || null);
  }

  static findOneAndUpdate(query, updates, opts = {}) {
    return new MemQuery(() => {
      const b = this._bookings.find(x => matches(x, query));
      if (!b) return null;
      Object.assign(b, updates);
      b.updatedAt = Date.now();
      return opts.new === false ? null : b;
    });
  }

  static async create(data) {
    if (data.totalPrice == null || data.basePrice == null) {
      throw new Error('basePrice and totalPrice are required');
    }
    if (!data.type) throw new Error('type is required');
    const now = Date.now();
    const booking = {
      _id: newId(),
      user: String(data.user),
      type: data.type,
      from: data.from,
      to: data.to,
      flightCode: data.flightCode,
      airline: data.airline,
      departure: data.departure,
      arrival: data.arrival,
      duration: data.duration,
      travelDate: data.travelDate,
      returnDate: data.returnDate,
      passengers: data.passengers || 1,
      extras: data.extras || [],
      basePrice: Number(data.basePrice),
      totalPrice: Number(data.totalPrice),
      status: data.status || 'confirmed',
      destinationName: data.destinationName,
      destinationImage: data.destinationImage,
      hotel: data.hotel,
      createdAt: now,
      updatedAt: now,
    };
    this._bookings.push(booking);
    return booking;
  }
}

// ─── Wishlist ─────────────────────────────────────────────
class MemoryWishlistModel {
  static _items = [];

  static find(query) {
    const sortable = {
      _docs: this._items.filter(w => matches(w, query)),
      sort(spec) {
        const [field, dir] = Object.entries(spec)[0];
        this._docs = [...this._docs].sort((a, b) => (a[field] > b[field] ? 1 : -1) * (dir === -1 ? -1 : 1));
        return this;
      },
      then(resolve, reject) { return Promise.resolve(this._docs).then(resolve, reject); },
    };
    return sortable;
  }

  static async create(data) {
    if (!data.itemType || !data.itemId) throw new Error('itemType and itemId are required');
    const userId = String(data.user);
    if (this._items.some(w => w.user === userId && w.itemId === data.itemId)) {
      const err = new Error('Item already in wishlist'); err.code = 11000; throw err;
    }
    const now = Date.now();
    const item = {
      _id: newId(),
      user: userId,
      itemType: data.itemType,
      itemId: data.itemId,
      snapshot: data.snapshot || {},
      createdAt: now,
      updatedAt: now,
    };
    this._items.push(item);
    return item;
  }

  static async findOneAndDelete(query) {
    const idx = this._items.findIndex(w => matches(w, query));
    if (idx === -1) return null;
    const [removed] = this._items.splice(idx, 1);
    return removed;
  }
}

export const MemoryUser = MemoryUserModel;
export const MemoryBooking = MemoryBookingModel;
export const MemoryWishlist = MemoryWishlistModel;
