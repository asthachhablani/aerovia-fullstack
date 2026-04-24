import express from 'express';
import { destinations, flights, hotels, buses, packages, deals, airports } from '../data/demoData.js';

const router = express.Router();

// ─── DESTINATIONS ─────────────────────────────────────
router.get('/destinations', (req, res) => {
  const { region, maxPrice, search } = req.query;
  let data = [...destinations];

  if (region && region !== 'All') {
    data = data.filter(d => d.region.toLowerCase().includes(region.toLowerCase()));
  }
  if (maxPrice) {
    data = data.filter(d => d.price <= Number(maxPrice));
  }
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q) ||
      d.tag.toLowerCase().includes(q) ||
      d.desc.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, data, total: data.length });
});

router.get('/destinations/:id', (req, res) => {
  const dest = destinations.find(d => d.id === req.params.id);
  if (!dest) return res.status(404).json({ success: false, message: 'Destination not found.' });
  res.json({ success: true, data: dest });
});

// ─── FLIGHTS ──────────────────────────────────────────
router.get('/flights', (req, res) => {
  const { from, to, maxPrice, stops, airline, sortBy } = req.query;
  let data = [...flights];

  if (from) data = data.filter(f => f.from.toLowerCase() === from.toLowerCase());
  if (to) data = data.filter(f => f.to.toLowerCase() === to.toLowerCase());
  if (maxPrice) data = data.filter(f => f.price <= Number(maxPrice));
  if (stops) data = data.filter(f => stops === 'direct' ? f.stops === 'Direct' : f.stops !== 'Direct');
  if (airline) data = data.filter(f => f.airline.toLowerCase().includes(airline.toLowerCase()));

  if (sortBy === 'price') data.sort((a, b) => a.price - b.price);
  if (sortBy === 'duration') data.sort((a, b) => a.duration.localeCompare(b.duration));

  res.json({ success: true, data, total: data.length });
});

router.get('/flights/:id', (req, res) => {
  const flight = flights.find(f => f.id === req.params.id);
  if (!flight) return res.status(404).json({ success: false, message: 'Flight not found.' });
  res.json({ success: true, data: flight });
});

// ─── HOTELS ───────────────────────────────────────────
router.get('/hotels', (req, res) => {
  const { city, minStars, maxPrice, search } = req.query;
  let data = [...hotels];

  if (city) data = data.filter(h => h.city.toLowerCase().includes(city.toLowerCase()) || h.country.toLowerCase().includes(city.toLowerCase()));
  if (minStars) data = data.filter(h => h.stars >= Number(minStars));
  if (maxPrice) data = data.filter(h => h.pricePerNight <= Number(maxPrice));
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(h => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q));
  }

  res.json({ success: true, data, total: data.length });
});

router.get('/hotels/:id', (req, res) => {
  const hotel = hotels.find(h => h.id === req.params.id);
  if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found.' });
  res.json({ success: true, data: hotel });
});

// ─── BUSES ────────────────────────────────────────────
router.get('/buses', (req, res) => {
  const { from, to, maxPrice, type } = req.query;
  let data = [...buses];

  if (from) data = data.filter(b => b.from.toLowerCase().includes(from.toLowerCase()));
  if (to) data = data.filter(b => b.to.toLowerCase().includes(to.toLowerCase()));
  if (maxPrice) data = data.filter(b => b.price <= Number(maxPrice));
  if (type) data = data.filter(b => b.type.toLowerCase().includes(type.toLowerCase()));

  res.json({ success: true, data, total: data.length });
});

// ─── PACKAGES ─────────────────────────────────────────
router.get('/packages', (req, res) => {
  const { destination, maxPrice, tag, search } = req.query;
  let data = [...packages];

  if (destination) data = data.filter(p => p.destination.toLowerCase().includes(destination.toLowerCase()));
  if (maxPrice) data = data.filter(p => p.price <= Number(maxPrice));
  if (tag) data = data.filter(p => p.tag.toLowerCase().includes(tag.toLowerCase()));
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(p => p.title.toLowerCase().includes(q) || p.destination.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  }

  res.json({ success: true, data, total: data.length });
});

router.get('/packages/:id', (req, res) => {
  const pkg = packages.find(p => p.id === req.params.id);
  if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });
  res.json({ success: true, data: pkg });
});

// ─── DEALS ────────────────────────────────────────────
router.get('/deals', (req, res) => {
  res.json({ success: true, data: deals, total: deals.length });
});

// ─── AIRPORTS ─────────────────────────────────────────
router.get('/airports', (req, res) => {
  const { q } = req.query;
  let data = [...airports];
  if (q) {
    const query = q.toLowerCase();
    data = data.filter(a =>
      a.code.toLowerCase().includes(query) ||
      a.city.toLowerCase().includes(query) ||
      a.name.toLowerCase().includes(query)
    );
  }
  res.json({ success: true, data });
});

// ─── AI SEARCH (smart filter across all services) ────
router.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ success: true, destinations: [], flights: [], packages: [] });

  const query = q.toLowerCase();

  const matchedDests = destinations.filter(d =>
    d.name.toLowerCase().includes(query) ||
    d.country.toLowerCase().includes(query) ||
    d.desc.toLowerCase().includes(query) ||
    d.tag.toLowerCase().includes(query) ||
    (query.includes('warm') && d.temp.includes('2') === false && parseInt(d.temp) > 18) ||
    (query.includes('budget') && d.price < 50000) ||
    (query.includes('adventure') && ['WILDERNESS', 'OTHERWORLDLY', 'ANCIENT', 'PRIMAL'].includes(d.tag))
  ).slice(0, 6);

  const matchedPackages = packages.filter(p =>
    p.title.toLowerCase().includes(query) ||
    p.destination.toLowerCase().includes(query) ||
    p.desc.toLowerCase().includes(query)
  ).slice(0, 4);

  res.json({ success: true, destinations: matchedDests, packages: matchedPackages, total: matchedDests.length + matchedPackages.length });
});

export default router;
