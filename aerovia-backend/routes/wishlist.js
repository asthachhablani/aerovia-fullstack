import express from 'express';
import Wishlist from '../models/Wishlist.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/wishlist
router.get('/', protect, async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch wishlist.' });
  }
});

// POST /api/wishlist
router.post('/', protect, async (req, res) => {
  try {
    const { itemType, itemId, snapshot } = req.body;
    const item = await Wishlist.create({ user: req.user._id, itemType, itemId, snapshot });
    res.status(201).json({ success: true, item });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Item already in wishlist.' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/wishlist/:itemId
router.delete('/:itemId', protect, async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ user: req.user._id, itemId: req.params.itemId });
    res.json({ success: true, message: 'Removed from wishlist.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not remove item.' });
  }
});

export default router;
