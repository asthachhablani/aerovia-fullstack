import express from 'express';
import { destinations, flights, hotels, buses, packages, deals, airports } from '../data/demoData.js';

const router = express.Router();

// ── Pagination helper ────────────────────────────────────────────
//  Accepts ?page=N&limit=M (defaults: page 1, limit 50, max 100).
//  Returns { data, total, page, limit, pageCount }.
//  Pass ?all=1 to opt out of pagination (capped at 1000 for safety).
function paginate(req, items) {
  const all = req.query.all === '1' || req.query.all === 'true';
  const total = items.length;

  if (all) {
    const capped = items.slice(0, 1000);
    return { data: capped, total, page: 1, limit: capped.length, pageCount: 1, capped: total > 1000 };
  }

  const page  = Math.max(1, parseInt(req.query.page, 10)  || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    total,
    page,
    limit,
    pageCount: Math.max(1, Math.ceil(total / limit)),
  };
}

// ── Sort helper ──────────────────────────────────────────────────
function sortItems(items, sortBy) {
  if (!sortBy) return items;
  const arr = [...items];
  switch (sortBy) {
    case 'price':       return arr.sort((a, b) => (a.price ?? a.pricePerNight ?? 0) - (b.price ?? b.pricePerNight ?? 0));
    case '-price':      return arr.sort((a, b) => (b.price ?? b.pricePerNight ?? 0) - (a.price ?? a.pricePerNight ?? 0));
    case 'rating':      return arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case 'duration':    return arr.sort((a, b) => String(a.duration).localeCompare(String(b.duration)));
    default:            return arr;
  }
}

// ─── DESTINATIONS ─────────────────────────────────────
router.get('/destinations', (req, res) => {
  const { region, maxPrice, search, sortBy } = req.query;
  let data = destinations;

  if (region && region !== 'All') {
    const r = region.toLowerCase();
    data = data.filter(d => d.region.toLowerCase().includes(r));
  }
  if (maxPrice) data = data.filter(d => d.price <= Number(maxPrice));
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
  data = sortItems(data, sortBy);
  res.json({ success: true, ...paginate(req, data) });
});

router.get('/destinations/:id', (req, res) => {
  const dest = destinations.find(d => d.id === req.params.id);
  if (!dest) return res.status(404).json({ success: false, message: 'Destination not found.' });
  res.json({ success: true, data: dest });
});

// ─── FLIGHTS ──────────────────────────────────────────
router.get('/flights', (req, res) => {
  const { from, to, maxPrice, stops, airline, class: cabinClass, sortBy } = req.query;
  let data = flights;

  if (from)        data = data.filter(f => f.from.toLowerCase() === from.toLowerCase() || f.fromCity.toLowerCase() === from.toLowerCase());
  if (to)          data = data.filter(f => f.to.toLowerCase() === to.toLowerCase()     || f.toCity.toLowerCase()   === to.toLowerCase());
  if (maxPrice)    data = data.filter(f => f.price <= Number(maxPrice));
  if (stops)       data = data.filter(f => stops === 'direct' ? f.stops === 'Direct' : f.stops !== 'Direct');
  if (airline)     data = data.filter(f => f.airline.toLowerCase().includes(airline.toLowerCase()));
  if (cabinClass)  data = data.filter(f => f.class.toLowerCase() === cabinClass.toLowerCase());

  data = sortItems(data, sortBy);
  res.json({ success: true, ...paginate(req, data) });
});

router.get('/flights/:id', (req, res) => {
  const flight = flights.find(f => f.id === req.params.id);
  if (!flight) return res.status(404).json({ success: false, message: 'Flight not found.' });
  res.json({ success: true, data: flight });
});

// ─── HOTELS ───────────────────────────────────────────
router.get('/hotels', (req, res) => {
  const { city, country, minStars, maxPrice, search, sortBy } = req.query;
  let data = hotels;

  if (city)     data = data.filter(h => h.city.toLowerCase().includes(city.toLowerCase()));
  if (country)  data = data.filter(h => h.country.toLowerCase().includes(country.toLowerCase()));
  if (minStars) data = data.filter(h => h.stars >= Number(minStars));
  if (maxPrice) data = data.filter(h => h.pricePerNight <= Number(maxPrice));
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(h => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q) || h.country.toLowerCase().includes(q));
  }
  data = sortItems(data, sortBy);
  res.json({ success: true, ...paginate(req, data) });
});

router.get('/hotels/:id', (req, res) => {
  const hotel = hotels.find(h => h.id === req.params.id);
  if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found.' });
  res.json({ success: true, data: hotel });
});

// ─── BUSES ────────────────────────────────────────────
router.get('/buses', (req, res) => {
  const { from, to, maxPrice, type, sortBy } = req.query;
  let data = buses;

  if (from)     data = data.filter(b => b.from.toLowerCase().includes(from.toLowerCase()));
  if (to)       data = data.filter(b => b.to.toLowerCase().includes(to.toLowerCase()));
  if (maxPrice) data = data.filter(b => b.price <= Number(maxPrice));
  if (type)     data = data.filter(b => b.type.toLowerCase().includes(type.toLowerCase()));

  data = sortItems(data, sortBy);
  res.json({ success: true, ...paginate(req, data) });
});

router.get('/buses/:id', (req, res) => {
  const bus = buses.find(b => b.id === req.params.id);
  if (!bus) return res.status(404).json({ success: false, message: 'Bus not found.' });
  res.json({ success: true, data: bus });
});

// ─── PACKAGES ─────────────────────────────────────────
router.get('/packages', (req, res) => {
  const { destination, city, maxPrice, tag, search, sortBy } = req.query;
  let data = packages;

  if (destination) data = data.filter(p => p.destination.toLowerCase().includes(destination.toLowerCase()));
  if (city)        data = data.filter(p => (p.city || '').toLowerCase().includes(city.toLowerCase()));
  if (maxPrice)    data = data.filter(p => p.price <= Number(maxPrice));
  if (tag)         data = data.filter(p => p.tag.toLowerCase().includes(tag.toLowerCase()));
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.destination.toLowerCase().includes(q) ||
      (p.city || '').toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    );
  }
  data = sortItems(data, sortBy);
  res.json({ success: true, ...paginate(req, data) });
});

router.get('/packages/:id', (req, res) => {
  const pkg = packages.find(p => p.id === req.params.id);
  if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });
  res.json({ success: true, data: pkg });
});

// ─── DEALS ────────────────────────────────────────────
router.get('/deals', (req, res) => {
  res.json({ success: true, ...paginate(req, deals) });
});

// ─── AIRPORTS (typeahead-friendly, no pagination needed) ──────
router.get('/airports', (req, res) => {
  const { q } = req.query;
  let data = airports;
  if (q) {
    const query = q.toLowerCase();
    data = data.filter(a =>
      a.code.toLowerCase().includes(query) ||
      a.city.toLowerCase().includes(query) ||
      a.name.toLowerCase().includes(query)
    ).slice(0, 30);
  }
  res.json({ success: true, data, total: data.length });
});

// ─── AI SEARCH (smart filter across all services) ────
router.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ success: true, destinations: [], packages: [], total: 0 });

  const query = q.toLowerCase();

  const matchedDests = destinations.filter(d =>
    d.name.toLowerCase().includes(query) ||
    d.country.toLowerCase().includes(query) ||
    d.desc.toLowerCase().includes(query) ||
    d.tag.toLowerCase().includes(query)
  ).slice(0, 12);

  const matchedPackages = packages.filter(p =>
    p.title.toLowerCase().includes(query) ||
    p.destination.toLowerCase().includes(query) ||
    (p.city || '').toLowerCase().includes(query) ||
    p.desc.toLowerCase().includes(query)
  ).slice(0, 12);

  res.json({
    success: true,
    destinations: matchedDests,
    packages: matchedPackages,
    total: matchedDests.length + matchedPackages.length,
  });
});

export default router;
