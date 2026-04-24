import mongoose from 'mongoose';
import { MemoryWishlist } from '../data/memoryStore.js';

const useMemory = process.env.USE_MEMORY_DB === '1';

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemType: { type: String, enum: ['destination', 'flight', 'hotel', 'package', 'deal'], required: true },
    itemId: { type: String, required: true },
    snapshot: {
      name: String,
      image: String,
      price: Number,
      tag: String,
      country: String,
    },
  },
  { timestamps: true }
);

wishlistSchema.index({ user: 1, itemId: 1 }, { unique: true });

const MongoWishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);

export default useMemory ? MemoryWishlist : MongoWishlist;
