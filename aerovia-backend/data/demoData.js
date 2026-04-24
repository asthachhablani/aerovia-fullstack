// ═══════════════════════════════════════════════════════════════
//  AEROVIA  ·  COMPREHENSIVE DEMO DATA
//  Hand-crafted "featured" items appear first; thousands of
//  realistic procedural items are appended from generate.js.
// ═══════════════════════════════════════════════════════════════

import {
  generateDestinations,
  generateFlights,
  generateHotels,
  generateBuses,
  generatePackages,
  generateDeals,
  generateAirports,
} from './generate.js';

const featuredDestinations = [
  {
    id: 'tokyo', name: 'Tokyo', country: 'Japan', region: 'East Asia',
    image: 'https://images.unsplash.com/photo-1665712638676-ff7045551805?w=1080&q=80',
    tag: 'URBAN PULSE', price: 58000, temp: '12°C', bestMonth: 'March',
    desc: 'A city that moves at 500km/h and stands perfectly still at the same time. Tokyo exists in plural.',
    stats: { weather: '12°C avg', avgCost: '₹58,000', bestSeason: 'Mar–May', flightTime: '7h 40m', timezone: 'JST +9', currency: 'JPY ¥', population: '13.9M', language: 'Japanese' },
    itineraries: [
      { id: 't1', days: 5, title: 'Electric Immersion', price: 58000, tag: 'BESTSELLER', highlights: ['Shibuya Crossing at midnight', 'Tsukiji outer market at dawn', 'Shinjuku izakaya crawl', 'TeamLab Borderless', 'Yanaka old town walk'] },
      { id: 't2', days: 8, title: 'Deep Tokyo', price: 84000, tag: 'EDITORIAL', highlights: ['Harajuku subculture tour', 'Sumo morning practice', 'Kaiseki dinner Ginza', 'Mt. Fuji day trip', 'Akihabara night', 'Meiji Shrine at 6AM', 'Capsule hotel experience'] },
      { id: 't3', days: 3, title: 'Flash Visit', price: 38000, tag: 'MINIMAL', highlights: ['Top 5 ramen stops', 'Asakusa temple district', 'Odaiba skyline sunset'] },
    ],
  },
  {
    id: 'patagonia', name: 'Patagonia', country: 'Argentina', region: 'South America',
    image: 'https://images.unsplash.com/photo-1692176048203-9125b4808282?w=1080&q=80',
    tag: 'WILDERNESS', price: 72000, temp: '8°C', bestMonth: 'November',
    desc: 'The edge of the world. Granite towers pierce clouds. Glaciers calve into the sea.',
    stats: { weather: '8°C avg', avgCost: '₹72,000', bestSeason: 'Nov–Feb', flightTime: '22h 30m', timezone: 'ART -3', currency: 'ARS $', population: '0.2M', language: 'Spanish' },
    itineraries: [
      { id: 'p1', days: 7, title: 'Torres del Paine Circuit', price: 72000, tag: 'ADVENTURE', highlights: ['W-Trek base camp', 'Grey Glacier kayak', 'Mirador Los Torres at sunrise', 'Gaucho asado night', 'Condor watching ridge'] },
      { id: 'p2', days: 10, title: 'End of the World', price: 96000, tag: 'DEEP WILD', highlights: ['Los Glaciares NP', 'Perito Moreno calving wall', 'Fitz Roy range hike', 'El Chaltén base camp', 'Ushuaia glacier'] },
    ],
  },
  {
    id: 'iceland', name: 'Iceland', country: 'Iceland', region: 'Nordic',
    image: 'https://images.unsplash.com/photo-1769670172608-f741dd969509?w=1080&q=80',
    tag: 'OTHERWORLDLY', price: 88000, temp: '2°C', bestMonth: 'February',
    desc: 'Volcanic silence. Aurora above. Steam rising from rifts in the earth.',
    stats: { weather: '2°C avg', avgCost: '₹88,000', bestSeason: 'Sep–Feb', flightTime: '9h 15m', timezone: 'GMT +0', currency: 'ISK kr', population: '0.37M', language: 'Icelandic' },
    itineraries: [
      { id: 'i1', days: 6, title: 'Ring Road North', price: 88000, tag: 'ICONIC', highlights: ['Reykjavik design district', 'Blue Lagoon geothermal', 'Golden Circle route', 'Black sand beach Vík', 'Aurora hunting night', 'Glacier walk Vatnajökull'] },
      { id: 'i2', days: 9, title: 'Full Circumnavigation', price: 118000, tag: 'COMPLETE', highlights: ['West fjords detour', 'Akureyri midnight sun', 'Dettifoss waterfall', 'Mývatn geothermal area', 'Eastfjords wilderness', 'Snæfellsnes Peninsula'] },
    ],
  },
  {
    id: 'morocco', name: 'Morocco', country: 'Morocco', region: 'North Africa',
    image: 'https://images.unsplash.com/photo-1548364504-57247d6f96bb?w=1080&q=80',
    tag: 'SENSORY', price: 28000, temp: '22°C', bestMonth: 'October',
    desc: 'Medina labyrinths. Saharan dunes at 5AM. The smell of cumin and cedar.',
    stats: { weather: '22°C avg', avgCost: '₹28,000', bestSeason: 'Oct–Apr', flightTime: '8h 20m', timezone: 'WET +1', currency: 'MAD د.م.', population: '37M', language: 'Arabic / French' },
    itineraries: [
      { id: 'm1', days: 7, title: 'Imperial Cities', price: 28000, tag: 'CULTURAL', highlights: ['Marrakech medina maze', 'Fes tanneries at dawn', 'Chefchaouen blue alleys', 'Sahara overnight camp', 'Atlas Mountain trek'] },
      { id: 'm2', days: 4, title: 'Marrakech Express', price: 16000, tag: 'SHORT BREAK', highlights: ['Djemaa el-Fna square', 'Bahia Palace', 'Souks shopping circuit', 'Hammam ritual'] },
    ],
  },
  {
    id: 'maldives', name: 'Maldives', country: 'Maldives', region: 'Indian Ocean',
    image: 'https://images.unsplash.com/photo-1575231902188-93d58962d791?w=1080&q=80',
    tag: 'ISOLATION', price: 95000, temp: '30°C', bestMonth: 'January',
    desc: 'Bioluminescent shores. Coral architecture beneath. The horizon is 360°.',
    stats: { weather: '30°C avg', avgCost: '₹95,000', bestSeason: 'Dec–Apr', flightTime: '4h 30m', timezone: 'MVT +5', currency: 'MVR Rf', population: '0.52M', language: 'Dhivehi' },
    itineraries: [
      { id: 'mv1', days: 5, title: 'Overwater Edit', price: 95000, tag: 'LUXURY', highlights: ['Private overwater villa', 'Dawn snorkel with rays', 'Underwater dining', 'Sunset dolphin cruise', 'Night bioluminescence walk'] },
      { id: 'mv2', days: 7, title: 'Island Hopper', price: 125000, tag: 'PREMIUM', highlights: ['Seaplane transfers', 'Two resort islands', 'Private sandbank dinner', 'Whale shark snorkel', 'Spa & wellness day'] },
    ],
  },
  {
    id: 'norway', name: 'Norway', country: 'Norway', region: 'Nordic',
    image: 'https://images.unsplash.com/photo-1695366804273-2c8da6f96ce0?w=1080&q=80',
    tag: 'DEPTH', price: 82000, temp: '5°C', bestMonth: 'June',
    desc: 'Water so deep it has its own colour. Fjords that make photographers cry.',
    stats: { weather: '5°C avg', avgCost: '₹82,000', bestSeason: 'Jun–Aug', flightTime: '11h 50m', timezone: 'CET +1', currency: 'NOK kr', population: '5.4M', language: 'Norwegian' },
    itineraries: [
      { id: 'n1', days: 7, title: 'Fjord Deep Dive', price: 82000, tag: 'SCENIC', highlights: ['Bergen fish market', 'Flam railway ascent', 'Nærøyfjord kayak', 'Preikestolen cliff hike', 'Trolltunga ledge'] },
    ],
  },
  {
    id: 'kyoto', name: 'Kyoto', country: 'Japan', region: 'East Asia',
    image: 'https://images.unsplash.com/photo-1768947814430-ec307db34952?w=1080&q=80',
    tag: 'RITUAL', price: 62000, temp: '15°C', bestMonth: 'April',
    desc: 'Ancient ritual lives beside the contemporary. Geiko in back streets. Bamboo light filtering through silence.',
    stats: { weather: '15°C avg', avgCost: '₹62,000', bestSeason: 'Apr / Nov', flightTime: '7h 40m', timezone: 'JST +9', currency: 'JPY ¥', population: '1.5M', language: 'Japanese' },
    itineraries: [
      { id: 'ky1', days: 5, title: 'Sacred Kyoto', price: 62000, tag: 'CULTURAL', highlights: ['Fushimi Inari at 5AM', 'Arashiyama bamboo grove', "Philosopher's Path walk", 'Gion district twilight', 'Tea ceremony Uji'] },
    ],
  },
  {
    id: 'lisbon', name: 'Lisbon', country: 'Portugal', region: 'Southern Europe',
    image: 'https://images.unsplash.com/photo-1681995585128-9c9bc14c2dd0?w=1080&q=80',
    tag: 'GOLDEN HOUR', price: 42000, temp: '18°C', bestMonth: 'May',
    desc: 'Seven hills, one light. The kind of city that makes you cancel your return ticket.',
    stats: { weather: '18°C avg', avgCost: '₹42,000', bestSeason: 'May–Oct', flightTime: '11h 30m', timezone: 'WET +1', currency: 'EUR €', population: '2.9M', language: 'Portuguese' },
    itineraries: [
      { id: 'l1', days: 5, title: 'Tejo Edit', price: 42000, tag: 'URBAN', highlights: ['Alfama morning fado', 'LX Factory Sunday market', 'Belém pastéis at 8AM', 'Sintra palace circuit', 'Cascais coastal walk'] },
    ],
  },
  {
    id: 'bali', name: 'Bali', country: 'Indonesia', region: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1080&q=80',
    tag: 'SPIRITUAL', price: 32000, temp: '28°C', bestMonth: 'July',
    desc: 'Rice terraces carved into hillsides. Temple smoke at dawn. The island vibrates at a different frequency.',
    stats: { weather: '28°C avg', avgCost: '₹32,000', bestSeason: 'Apr–Oct', flightTime: '5h 30m', timezone: 'WITA +8', currency: 'IDR Rp', population: '4.3M', language: 'Balinese / Indonesian' },
    itineraries: [
      { id: 'b1', days: 7, title: 'Sacred & Surf', price: 32000, tag: 'BALANCED', highlights: ['Ubud rice terraces', 'Tanah Lot sunset', 'Seminyak beach clubs', 'Tegalalang rice walk', 'Cooking class Ubud', 'Mount Batur sunrise', 'Nusa Penida snorkel'] },
      { id: 'b2', days: 4, title: 'Ubud Retreat', price: 18000, tag: 'WELLNESS', highlights: ['Daily yoga sessions', 'Jungle spa treatment', 'Sacred Monkey Forest', 'Waterfall hike Gitgit'] },
    ],
  },
  {
    id: 'santorini', name: 'Santorini', country: 'Greece', region: 'Southern Europe',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1080&q=80',
    tag: 'CINEMATIC', price: 68000, temp: '24°C', bestMonth: 'September',
    desc: 'White geometry against blue infinity. Sunsets that deserve their own mythology.',
    stats: { weather: '24°C avg', avgCost: '₹68,000', bestSeason: 'May–Oct', flightTime: '10h 20m', timezone: 'EET +2', currency: 'EUR €', population: '15K', language: 'Greek' },
    itineraries: [
      { id: 's1', days: 5, title: 'Cycladic Edit', price: 68000, tag: 'ICONIC', highlights: ['Oia sunset viewpoint', 'Caldera sailing', 'Black sand beach Perissa', 'Wine tasting Megalochori', 'Ancient Akrotiri ruins'] },
    ],
  },
  {
    id: 'peru', name: 'Peru', country: 'Peru', region: 'South America',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1080&q=80',
    tag: 'ANCIENT', price: 78000, temp: '14°C', bestMonth: 'June',
    desc: 'Stone cities above the clouds. Inca engineering that baffles modern architects. Altitude that rewires you.',
    stats: { weather: '14°C avg', avgCost: '₹78,000', bestSeason: 'May–Sep', flightTime: '20h 45m', timezone: 'PET -5', currency: 'PEN S/', population: '33M', language: 'Spanish / Quechua' },
    itineraries: [
      { id: 'pe1', days: 8, title: 'Inca Trail Complete', price: 78000, tag: 'EPIC', highlights: ['Machu Picchu sunrise', 'Inca Trail 4-day trek', 'Sacred Valley villages', 'Cusco colonial district', 'Rainbow Mountain hike', 'Lake Titicaca floating islands'] },
    ],
  },
  {
    id: 'dubai', name: 'Dubai', country: 'UAE', region: 'Middle East',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1080&q=80',
    tag: 'SPECTACLE', price: 45000, temp: '26°C', bestMonth: 'February',
    desc: 'The city that decided to be everything at once. Desert behind. Ocean ahead. Sky above the reach of ambition.',
    stats: { weather: '26°C avg', avgCost: '₹45,000', bestSeason: 'Nov–Mar', flightTime: '3h 20m', timezone: 'GST +4', currency: 'AED د.إ', population: '3.5M', language: 'Arabic / English' },
    itineraries: [
      { id: 'dxb1', days: 4, title: 'Ultra Dubai', price: 45000, tag: 'LUXURY', highlights: ['Burj Khalifa observation deck', 'Desert safari dune dinner', 'Dubai Frame & Garden Glow', 'Atlantis aquaventure', 'Gold souk old Dubai'] },
      { id: 'dxb2', days: 6, title: 'Dubai Extended', price: 62000, tag: 'COMPLETE', highlights: ['Abu Dhabi day trip', 'Sheikh Zayed Grand Mosque', 'Louvre Abu Dhabi', 'Yacht charter', 'Spa at Burj Al Arab', 'Old town Al Fahidi'] },
    ],
  },
  {
    id: 'vietnam', name: 'Vietnam', country: 'Vietnam', region: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1080&q=80',
    tag: 'LAYERED', price: 24000, temp: '26°C', bestMonth: 'March',
    desc: 'A country shaped like a letter S that contains entire civilizations. North to south takes three flights or a lifetime.',
    stats: { weather: '26°C avg', avgCost: '₹24,000', bestSeason: 'Feb–Apr', flightTime: '5h 15m', timezone: 'ICT +7', currency: 'VND ₫', population: '98M', language: 'Vietnamese' },
    itineraries: [
      { id: 'vn1', days: 10, title: 'North to South', price: 24000, tag: 'ESSENTIAL', highlights: ['Hanoi old quarter', 'Ha Long Bay overnight cruise', 'Hoi An Ancient Town', 'My Son Sanctuary', 'Ho Chi Minh City history', 'Mekong Delta boat tour'] },
      { id: 'vn2', days: 5, title: 'Hoi An Focus', price: 14000, tag: 'SLOW TRAVEL', highlights: ['Lantern festival walk', 'Cooking class countryside', 'Marble Mountains', 'Bicycle to rice fields', 'Tailored clothing'] },
    ],
  },
  {
    id: 'newzealand', name: 'New Zealand', country: 'New Zealand', region: 'Pacific',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1080&q=80',
    tag: 'PRIMAL', price: 105000, temp: '14°C', bestMonth: 'December',
    desc: 'Two islands of such violent beauty that the earth has not finished making them.',
    stats: { weather: '14°C avg', avgCost: '₹1,05,000', bestSeason: 'Dec–Feb', flightTime: '14h 30m', timezone: 'NZST +12', currency: 'NZD $', population: '5.1M', language: 'English / Māori' },
    itineraries: [
      { id: 'nz1', days: 10, title: 'Both Islands', price: 105000, tag: 'COMPLETE', highlights: ['Milford Sound fjord cruise', 'Queenstown adventure hub', 'Hobbiton Matamata', 'Tongariro Alpine Crossing', 'Abel Tasman coast walk', 'Waitomo glowworm caves'] },
    ],
  },
  {
    id: 'kenya', name: 'Kenya', country: 'Kenya', region: 'East Africa',
    image: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=1080&q=80',
    tag: 'PRIMAL', price: 92000, temp: '24°C', bestMonth: 'August',
    desc: 'The original place. Where the great migration writes its annual chapter across the Mara.',
    stats: { weather: '24°C avg', avgCost: '₹92,000', bestSeason: 'Jul–Oct', flightTime: '8h 45m', timezone: 'EAT +3', currency: 'KES KSh', population: '54M', language: 'Swahili / English' },
    itineraries: [
      { id: 'ke1', days: 8, title: 'Great Migration Safari', price: 92000, tag: 'WILDLIFE', highlights: ['Masai Mara game drives', 'River crossing spectacle', 'Amboseli with Kilimanjaro', 'Maasai village visit', 'Hot air balloon safari', 'Nairobi National Park', 'Giraffe Centre'] },
    ],
  },
  {
    id: 'switzerland', name: 'Switzerland', country: 'Switzerland', region: 'Central Europe',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1080&q=80',
    tag: 'ALPINE', price: 115000, temp: '6°C', bestMonth: 'July',
    desc: 'Precision meets poetry at altitude. Every valley hides a chocolate-box village that somehow earns it.',
    stats: { weather: '6°C avg', avgCost: '₹1,15,000', bestSeason: 'Jun–Sep', flightTime: '10h 40m', timezone: 'CET +1', currency: 'CHF Fr.', population: '8.7M', language: 'German / French / Italian' },
    itineraries: [
      { id: 'ch1', days: 7, title: 'Alpine Traverse', price: 115000, tag: 'SCENIC', highlights: ['Jungfraujoch top of Europe', 'Interlaken base camp', 'Lucerne chapel bridge', 'Glacier Express train', 'Zermatt Matterhorn view', 'Geneva lakeside', 'Grindelwald First cliff walk'] },
    ],
  },
  {
    id: 'spain', name: 'Barcelona', country: 'Spain', region: 'Southern Europe',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1080&q=80',
    tag: 'ALIVE', price: 52000, temp: '20°C', bestMonth: 'June',
    desc: 'Gaudí never finished his sentences. The city took on his habit. Still unfinished. Impossibly alive.',
    stats: { weather: '20°C avg', avgCost: '₹52,000', bestSeason: 'May–Oct', flightTime: '11h 50m', timezone: 'CET +1', currency: 'EUR €', population: '5.6M', language: 'Catalan / Spanish' },
    itineraries: [
      { id: 'bcn1', days: 5, title: 'Gaudí & Beyond', price: 52000, tag: 'URBAN', highlights: ['Sagrada Família early entry', 'Park Güell at sunrise', 'La Boqueria market breakfast', 'El Born nightlife', 'Barceloneta beach'] },
    ],
  },
  {
    id: 'egypt', name: 'Egypt', country: 'Egypt', region: 'North Africa',
    image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1080&q=80',
    tag: 'TIMELESS', price: 38000, temp: '28°C', bestMonth: 'October',
    desc: 'Five thousand years looking at you from stone. The Nile still flows through the original civilization.',
    stats: { weather: '28°C avg', avgCost: '₹38,000', bestSeason: 'Oct–Apr', flightTime: '6h 30m', timezone: 'EET +2', currency: 'EGP £', population: '105M', language: 'Arabic' },
    itineraries: [
      { id: 'eg1', days: 7, title: 'Pharaohs & Desert', price: 38000, tag: 'HISTORIC', highlights: ['Giza Pyramids at dawn', 'Egyptian Museum Cairo', 'Luxor Valley of Kings', 'Karnak Temple complex', 'Nile felucca sunset', 'Abu Simbel temples', 'Aswan Nubian village'] },
    ],
  },
  {
    id: 'canada', name: 'Banff', country: 'Canada', region: 'North America',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1080&q=80',
    tag: 'VAST', price: 98000, temp: '3°C', bestMonth: 'September',
    desc: 'Turquoise lakes that seem generated by AI. Mountains that require no filters. Silence measured in square kilometres.',
    stats: { weather: '3°C avg', avgCost: '₹98,000', bestSeason: 'Jun–Sep', flightTime: '16h 20m', timezone: 'MST -7', currency: 'CAD $', population: '38M', language: 'English / French' },
    itineraries: [
      { id: 'ca1', days: 8, title: 'Rockies Grand Tour', price: 98000, tag: 'EPIC', highlights: ['Lake Louise morning kayak', 'Moraine Lake vista', 'Icefields Parkway drive', 'Jasper dark sky reserve', 'Banff town & hot springs', 'Athabasca Glacier walk', 'Columbia Icefield'] },
    ],
  },
  {
    id: 'singapore', name: 'Singapore', country: 'Singapore', region: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1080&q=80',
    tag: 'FUTURE', price: 35000, temp: '30°C', bestMonth: 'February',
    desc: 'A city-state that decided to out-design every other city. Also: the best food per square kilometre on earth.',
    stats: { weather: '30°C avg', avgCost: '₹35,000', bestSeason: 'Feb–Apr', flightTime: '5h 20m', timezone: 'SGT +8', currency: 'SGD $', population: '5.9M', language: 'English / Mandarin / Malay' },
    itineraries: [
      { id: 'sg1', days: 4, title: 'Lion City Decoded', price: 35000, tag: 'URBAN', highlights: ['Gardens by the Bay light show', 'Hawker centre food circuit', 'Marina Bay Sands rooftop', 'Chinatown & Little India walk', 'Sentosa island day'] },
    ],
  },
];

// ─── FLIGHTS ─────────────────────────────────────────────────────
const featuredFlights = [
  { id: 'F001', airline: 'Air India', code: 'AI-101', from: 'DEL', fromCity: 'New Delhi', to: 'NRT', toCity: 'Tokyo', dep: '23:15', arr: '10:30+1', duration: '7h 45m', stops: 'Direct', price: 42800, seatsLeft: 12, class: 'Economy', tag: 'BEST VALUE' },
  { id: 'F002', airline: 'Emirates', code: 'EK-512', from: 'DEL', fromCity: 'New Delhi', to: 'NRT', toCity: 'Tokyo', dep: '02:30', arr: '14:55+1', duration: '8h 25m', stops: '1 stop · DXB', price: 38500, seatsLeft: 5, class: 'Economy', tag: 'LOWEST PRICE' },
  { id: 'F003', airline: 'JAL', code: 'JL-095', from: 'BOM', fromCity: 'Mumbai', to: 'NRT', toCity: 'Tokyo', dep: '14:00', arr: '04:15+2', duration: '9h 15m', stops: '1 stop · BKK', price: 45200, seatsLeft: 18, class: 'Economy', tag: 'FULL SERVICE' },
  { id: 'F004', airline: 'IndiGo', code: '6E-201', from: 'DEL', fromCity: 'New Delhi', to: 'DXB', toCity: 'Dubai', dep: '06:10', arr: '08:20', duration: '3h 10m', stops: 'Direct', price: 11200, seatsLeft: 34, class: 'Economy', tag: 'BUDGET' },
  { id: 'F005', airline: 'Emirates', code: 'EK-501', from: 'BOM', fromCity: 'Mumbai', to: 'DXB', toCity: 'Dubai', dep: '10:40', arr: '12:30', duration: '3h 20m', stops: 'Direct', price: 13800, seatsLeft: 8, class: 'Economy', tag: 'POPULAR' },
  { id: 'F006', airline: 'Air Arabia', code: 'G9-411', from: 'DEL', fromCity: 'New Delhi', to: 'DXB', toCity: 'Dubai', dep: '14:25', arr: '16:40', duration: '3h 15m', stops: 'Direct', price: 9900, seatsLeft: 22, class: 'Economy', tag: 'CHEAPEST' },
  { id: 'F007', airline: 'Lufthansa', code: 'LH-760', from: 'DEL', fromCity: 'New Delhi', to: 'FRA', toCity: 'Frankfurt', dep: '03:20', arr: '09:45', duration: '8h 25m', stops: 'Direct', price: 52000, seatsLeft: 6, class: 'Business', tag: 'BUSINESS' },
  { id: 'F008', airline: 'Air France', code: 'AF-226', from: 'BOM', fromCity: 'Mumbai', to: 'CDG', toCity: 'Paris', dep: '01:30', arr: '08:50', duration: '10h 20m', stops: 'Direct', price: 61500, seatsLeft: 4, class: 'Business', tag: 'LUXURY' },
  { id: 'F009', airline: 'Singapore Airlines', code: 'SQ-422', from: 'DEL', fromCity: 'New Delhi', to: 'SIN', toCity: 'Singapore', dep: '07:30', arr: '17:15', duration: '5h 45m', stops: 'Direct', price: 24500, seatsLeft: 15, class: 'Economy', tag: 'BEST AIRLINE' },
  { id: 'F010', airline: 'Vistara', code: 'UK-014', from: 'DEL', fromCity: 'New Delhi', to: 'SIN', toCity: 'Singapore', dep: '11:25', arr: '21:00', duration: '5h 35m', stops: 'Direct', price: 21800, seatsLeft: 27, class: 'Economy', tag: 'VALUE' },
  { id: 'F011', airline: 'Thai Airways', code: 'TG-315', from: 'DEL', fromCity: 'New Delhi', to: 'BKK', toCity: 'Bangkok', dep: '05:20', arr: '13:05', duration: '4h 45m', stops: 'Direct', price: 18900, seatsLeft: 20, class: 'Economy', tag: 'POPULAR' },
  { id: 'F012', airline: 'AirAsia', code: 'AK-055', from: 'DEL', fromCity: 'New Delhi', to: 'KUL', toCity: 'Kuala Lumpur', dep: '08:55', arr: '19:40', duration: '5h 45m', stops: 'Direct', price: 14200, seatsLeft: 41, class: 'Economy', tag: 'BUDGET' },
  { id: 'F013', airline: 'British Airways', code: 'BA-256', from: 'DEL', fromCity: 'New Delhi', to: 'LHR', toCity: 'London', dep: '21:00', arr: '02:35+1', duration: '9h 35m', stops: 'Direct', price: 58000, seatsLeft: 9, class: 'Economy', tag: 'DIRECT' },
  { id: 'F014', airline: 'KLM', code: 'KL-872', from: 'DEL', fromCity: 'New Delhi', to: 'AMS', toCity: 'Amsterdam', dep: '03:15', arr: '09:30', duration: '9h 15m', stops: 'Direct', price: 49500, seatsLeft: 16, class: 'Economy', tag: 'VALUE' },
  { id: 'F015', airline: 'Qatar Airways', code: 'QR-551', from: 'BOM', fromCity: 'Mumbai', to: 'DOH', toCity: 'Doha', dep: '09:45', arr: '11:50', duration: '3h 05m', stops: 'Direct', price: 10500, seatsLeft: 30, class: 'Economy', tag: 'TRANSIT HUB' },
  { id: 'F016', airline: 'Ethiopian Airlines', code: 'ET-304', from: 'DEL', fromCity: 'New Delhi', to: 'NBO', toCity: 'Nairobi', dep: '02:00', arr: '11:25', duration: '8h 25m', stops: '1 stop · ADD', price: 42000, seatsLeft: 7, class: 'Economy', tag: 'AFRICA' },
  { id: 'F017', airline: 'Air New Zealand', code: 'NZ-777', from: 'DEL', fromCity: 'New Delhi', to: 'AKL', toCity: 'Auckland', dep: '01:00', arr: '21:30+1', duration: '16h 30m', stops: '1 stop · SIN', price: 88000, seatsLeft: 3, class: 'Economy', tag: 'PACIFIC' },
  { id: 'F018', airline: 'American Airlines', code: 'AA-293', from: 'DEL', fromCity: 'New Delhi', to: 'JFK', toCity: 'New York', dep: '04:35', arr: '13:15', duration: '15h 40m', stops: '1 stop · LHR', price: 72000, seatsLeft: 11, class: 'Economy', tag: 'USA' },
  { id: 'F019', airline: 'Turkish Airlines', code: 'TK-712', from: 'DEL', fromCity: 'New Delhi', to: 'IST', toCity: 'Istanbul', dep: '06:45', arr: '11:55', duration: '7h 10m', stops: 'Direct', price: 36000, seatsLeft: 23, class: 'Economy', tag: 'EUROPE HUB' },
  { id: 'F020', airline: 'Iberia', code: 'IB-6401', from: 'DEL', fromCity: 'New Delhi', to: 'MAD', toCity: 'Madrid', dep: '03:00', arr: '10:45', duration: '11h 45m', stops: '1 stop · IST', price: 48000, seatsLeft: 14, class: 'Economy', tag: 'SPAIN' },
  { id: 'F021', airline: 'Korean Air', code: 'KE-672', from: 'DEL', fromCity: 'New Delhi', to: 'ICN', toCity: 'Seoul', dep: '08:30', arr: '20:55', duration: '7h 25m', stops: 'Direct', price: 39500, seatsLeft: 19, class: 'Economy', tag: 'KOREA' },
  { id: 'F022', airline: 'Cathay Pacific', code: 'CX-613', from: 'BOM', fromCity: 'Mumbai', to: 'HKG', toCity: 'Hong Kong', dep: '07:10', arr: '16:30', duration: '5h 20m', stops: 'Direct', price: 28000, seatsLeft: 25, class: 'Economy', tag: 'ASIA' },
  { id: 'F023', airline: 'Air Canada', code: 'AC-059', from: 'DEL', fromCity: 'New Delhi', to: 'YYZ', toCity: 'Toronto', dep: '22:55', arr: '07:40+1', duration: '16h 45m', stops: '1 stop · LHR', price: 76000, seatsLeft: 8, class: 'Economy', tag: 'CANADA' },
  { id: 'F024', airline: 'LATAM', code: 'LA-503', from: 'DEL', fromCity: 'New Delhi', to: 'SCL', toCity: 'Santiago', dep: '01:30', arr: '18:45+1', duration: '23h 15m', stops: '2 stops', price: 82000, seatsLeft: 6, class: 'Economy', tag: 'SOUTH AMERICA' },
  { id: 'F025', airline: 'Qantas', code: 'QF-028', from: 'DEL', fromCity: 'New Delhi', to: 'SYD', toCity: 'Sydney', dep: '12:00', arr: '06:30+2', duration: '14h 30m', stops: '1 stop · SIN', price: 91000, seatsLeft: 4, class: 'Economy', tag: 'AUSTRALIA' },
  { id: 'F026', airline: 'Icelandair', code: 'FI-452', from: 'DEL', fromCity: 'New Delhi', to: 'KEF', toCity: 'Reykjavik', dep: '03:10', arr: '14:30', duration: '13h 20m', stops: '1 stop · AMS', price: 68000, seatsLeft: 11, class: 'Economy', tag: 'ICELAND' },
  { id: 'F027', airline: 'Royal Air Maroc', code: 'AT-607', from: 'DEL', fromCity: 'New Delhi', to: 'CMN', toCity: 'Casablanca', dep: '02:45', arr: '11:15', duration: '10h 30m', stops: '1 stop · DXB', price: 32000, seatsLeft: 17, class: 'Economy', tag: 'MOROCCO' },
  { id: 'F028', airline: 'Vietjet', code: 'VJ-103', from: 'DEL', fromCity: 'New Delhi', to: 'HAN', toCity: 'Hanoi', dep: '09:30', arr: '18:15', duration: '5h 45m', stops: '1 stop · BKK', price: 16500, seatsLeft: 38, class: 'Economy', tag: 'VIETNAM' },
  { id: 'F029', airline: 'Air India', code: 'AI-311', from: 'DEL', fromCity: 'New Delhi', to: 'MLE', toCity: 'Malé', dep: '08:20', arr: '12:50', duration: '4h 30m', stops: 'Direct', price: 19800, seatsLeft: 22, class: 'Economy', tag: 'MALDIVES' },
  { id: 'F030', airline: 'Swiss Air', code: 'LX-150', from: 'DEL', fromCity: 'New Delhi', to: 'ZRH', toCity: 'Zurich', dep: '04:00', arr: '10:15', duration: '10h 15m', stops: 'Direct', price: 54000, seatsLeft: 9, class: 'Economy', tag: 'SWITZERLAND' },
];

// ─── HOTELS ──────────────────────────────────────────────────────
const featuredHotels = [
  { id: 'H001', name: 'The Peninsular Tokyo', city: 'Tokyo', country: 'Japan', stars: 5, rating: 4.9, reviews: 2840, pricePerNight: 18500, image: 'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800&q=80', amenities: ['Spa', 'Pool', 'Gym', 'Fine Dining', 'Concierge', 'Butler Service'], tag: 'ULTRA LUXURY', checkIn: '15:00', checkOut: '12:00', desc: 'Timeless elegance above Hibiya Park. Tokyo unfolds below in every direction.' },
  { id: 'H002', name: 'Shinjuku Granbell Hotel', city: 'Tokyo', country: 'Japan', stars: 4, rating: 4.5, reviews: 1240, pricePerNight: 8200, image: 'https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=800&q=80', amenities: ['Bar', 'Gym', 'City Views', 'Concierge'], tag: 'BOUTIQUE', checkIn: '15:00', checkOut: '11:00', desc: 'Design-forward boutique hotel in the heart of Shinjuku nightlife.' },
  { id: 'H003', name: 'Hoshinoya Tokyo', city: 'Tokyo', country: 'Japan', stars: 5, rating: 4.8, reviews: 890, pricePerNight: 22000, image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80', amenities: ['Onsen', 'Spa', 'Japanese Breakfast', 'Concierge', 'Roof Garden'], tag: 'RYOKAN LUXURY', checkIn: '15:00', checkOut: '12:00', desc: 'A vertical ryokan experience with private onsen floors in central Tokyo.' },
  { id: 'H004', name: 'Jumeirah Burj Al Arab', city: 'Dubai', country: 'UAE', stars: 5, rating: 4.9, reviews: 4320, pricePerNight: 45000, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', amenities: ['Private Beach', 'Helipad', 'Multiple Restaurants', 'Rolls Royce Transfer', 'Butler', 'Spa'], tag: 'ICONIC', checkIn: '15:00', checkOut: '12:00', desc: 'The sail-shaped icon of Dubai. Every room an ocean-view suite.' },
  { id: 'H005', name: 'Address Downtown Dubai', city: 'Dubai', country: 'UAE', stars: 5, rating: 4.7, reviews: 2100, pricePerNight: 18000, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80', amenities: ['Pool', 'Spa', 'Burj Khalifa View', 'Fine Dining', 'Gym'], tag: 'LUXURY', checkIn: '14:00', checkOut: '12:00', desc: 'Front-row seat to the Burj Khalifa and Dubai Fountain shows.' },
  { id: 'H006', name: 'Four Seasons Bali at Sayan', city: 'Ubud', country: 'Indonesia', stars: 5, rating: 4.9, reviews: 1870, pricePerNight: 28000, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', amenities: ['Infinity Pool', 'Yoga Pavilion', 'Jungle Spa', 'River Views', 'Cooking Class'], tag: 'RESORT', checkIn: '15:00', checkOut: '12:00', desc: 'Nestled above the Ayung River gorge. Rice terraces and jungle canopy in every direction.' },
  { id: 'H007', name: 'Alila Seminyak', city: 'Bali', country: 'Indonesia', stars: 5, rating: 4.6, reviews: 1340, pricePerNight: 14500, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', amenities: ['Beachfront', 'Pool', 'Spa', 'Rooftop Bar', 'Surfing Lessons'], tag: 'BEACHFRONT', checkIn: '14:00', checkOut: '11:00', desc: 'Minimalist Balinese architecture meets the Indian Ocean at Seminyak beach.' },
  { id: 'H008', name: 'Katikies Hotel Santorini', city: 'Oia', country: 'Greece', stars: 5, rating: 4.8, reviews: 980, pricePerNight: 32000, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80', amenities: ['Infinity Pool', 'Caldera View', 'Gourmet Restaurant', 'Spa', 'Sunset Terrace'], tag: 'CLIFFTOP', checkIn: '15:00', checkOut: '11:00', desc: 'Iconic white architecture on the caldera rim. The infinity pool spills toward the Aegean.' },
  { id: 'H009', name: 'Casa Laia Marrakech', city: 'Marrakech', country: 'Morocco', stars: 4, rating: 4.7, reviews: 620, pricePerNight: 7800, image: 'https://images.unsplash.com/photo-1548364504-57247d6f96bb?w=800&q=80', amenities: ['Rooftop Terrace', 'Hammam', 'Medina Location', 'Breakfast', 'Pool'], tag: 'RIAD', checkIn: '14:00', checkOut: '12:00', desc: 'A 16th-century riad in the heart of the medina. Zellige tiles and orange blossom water.' },
  { id: 'H010', name: 'Belmond Reid\'s Palace Madeira', city: 'Funchal', country: 'Portugal', stars: 5, rating: 4.8, reviews: 1560, pricePerNight: 24000, image: 'https://images.unsplash.com/photo-1681995585128-9c9bc14c2dd0?w=800&q=80', amenities: ['Clifftop Pool', 'Sea View', 'Tennis', 'Spa', 'Churchill Suite'], tag: 'HISTORIC', checkIn: '15:00', checkOut: '12:00', desc: 'Since 1891. Winston Churchill painted here. The Atlantic below. Gardens above.' },
  { id: 'H011', name: 'Anantara Kihavah Maldives', city: 'Baa Atoll', country: 'Maldives', stars: 5, rating: 4.9, reviews: 2240, pricePerNight: 52000, image: 'https://images.unsplash.com/photo-1575231902188-93d58962d791?w=800&q=80', amenities: ['Overwater Villa', 'Underwater Restaurant', 'House Reef', 'Spa', 'Stargazing Observatory'], tag: 'OVERWATER', checkIn: '14:00', checkOut: '12:00', desc: 'Overwater villas above the UNESCO biosphere reserve. Glass floors, private pools, endless horizon.' },
  { id: 'H012', name: 'Ion Adventure Hotel Reykjavik', city: 'Reykjavik', country: 'Iceland', stars: 4, rating: 4.6, reviews: 740, pricePerNight: 16500, image: 'https://images.unsplash.com/photo-1769670172608-f741dd969509?w=800&q=80', amenities: ['Northern Lights Views', 'Geothermal Pool', 'Adventure Desk', 'Restaurant', 'Bar'], tag: 'AURORA', checkIn: '15:00', checkOut: '11:00', desc: 'Built on a lava field above Þingvellir. Hot tub under the aurora.' },
  { id: 'H013', name: 'Inkaterra Machu Picchu', city: 'Aguas Calientes', country: 'Peru', stars: 5, rating: 4.8, reviews: 890, pricePerNight: 29000, image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80', amenities: ['Cloud Forest', 'Organic Garden', 'Orchid Farm', 'Restaurant', 'Spa'], tag: 'ECOLUXURY', checkIn: '14:00', checkOut: '12:00', desc: 'Cloud forest bungalows 200 metres from the entrance to Machu Picchu.' },
  { id: 'H014', name: 'Icehotel 365', city: 'Jukkasjärvi', country: 'Sweden', stars: 4, rating: 4.7, reviews: 560, pricePerNight: 21000, image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', amenities: ['Ice Suites', 'Aurora Viewing', 'Dog Sledding', 'Ice Bar', 'Sauna'], tag: 'UNIQUE', checkIn: '15:00', checkOut: '11:00', desc: 'Sleep inside a masterpiece of ice and snow art. Northern Lights from your pillow.' },
  { id: 'H015', name: 'Singita Serengeti House', city: 'Serengeti', country: 'Tanzania', stars: 5, rating: 4.9, reviews: 480, pricePerNight: 68000, image: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=800&q=80', amenities: ['Game Drives', 'Private Chef', 'Pool', 'Spa', 'Exclusive Use'], tag: 'SAFARI LUXURY', checkIn: '14:00', checkOut: '12:00', desc: 'Exclusive-use villa on the Serengeti. Wildebeest migrate past your infinity pool.' },
  { id: 'H016', name: 'Park Hyatt Sydney', city: 'Sydney', country: 'Australia', stars: 5, rating: 4.7, reviews: 1920, pricePerNight: 22000, image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', amenities: ['Opera House View', 'Harbour View', 'Pool', 'Spa', 'Rooftop'], tag: 'HARBOUR', checkIn: '15:00', checkOut: '11:00', desc: 'Unobstructed views of the Sydney Opera House from every room and the rooftop pool.' },
  { id: 'H017', name: 'Marina Bay Sands Singapore', city: 'Singapore', country: 'Singapore', stars: 5, rating: 4.6, reviews: 8900, pricePerNight: 19500, image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&q=80', amenities: ['Infinity Pool', 'Casino', 'Skypark', 'Shopping Mall', 'Multiple Restaurants', 'Spa'], tag: 'ICONIC', checkIn: '15:00', checkOut: '11:00', desc: 'The infinity pool 57 floors up with a view of the entire Singapore skyline.' },
  { id: 'H018', name: 'NH Collection Barcelona', city: 'Barcelona', country: 'Spain', stars: 4, rating: 4.5, reviews: 2340, pricePerNight: 12000, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80', amenities: ['Rooftop Pool', 'Terrace', 'Gym', 'Bar', 'City Centre Location'], tag: 'URBAN', checkIn: '14:00', checkOut: '12:00', desc: 'Central Barcelona with rooftop views over the Gothic Quarter.' },
  { id: 'H019', name: 'Sofitel Cairo Nile El Gezirah', city: 'Cairo', country: 'Egypt', stars: 5, rating: 4.5, reviews: 1100, pricePerNight: 9800, image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=80', amenities: ['Nile View', 'Pool', 'Spa', 'Rooftop Restaurant', 'Gym'], tag: 'NILE VIEW', checkIn: '15:00', checkOut: '12:00', desc: 'On Gezira Island. The Nile on three sides and the Cairo skyline in every window.' },
  { id: 'H020', name: 'Willow Stream Spa at Fairmont Banff', city: 'Banff', country: 'Canada', stars: 5, rating: 4.8, reviews: 2760, pricePerNight: 31000, image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80', amenities: ['Mountain View', 'Spa', 'Pool', 'Ski-In Access', 'Fine Dining', 'Concierge'], tag: 'MOUNTAIN', checkIn: '15:00', checkOut: '12:00', desc: 'The grande dame of the Canadian Rockies since 1888. Mountain peaks surround every window.' },
];

// ─── BUS ROUTES ──────────────────────────────────────────────────
const featuredBuses = [
  { id: 'B001', operator: 'RedBus Premium', from: 'Mumbai', to: 'Goa', dep: '20:00', arr: '07:30+1', duration: '11h 30m', price: 850, type: 'Sleeper AC', seatsLeft: 8, rating: 4.4, amenities: ['AC', 'Blanket', 'Charger', 'Water Bottle'] },
  { id: 'B002', operator: 'VRL Travels', from: 'Mumbai', to: 'Goa', dep: '22:00', arr: '09:00+1', duration: '11h 00m', price: 650, type: 'Semi Sleeper AC', seatsLeft: 14, rating: 4.1, amenities: ['AC', 'Charger'] },
  { id: 'B003', operator: 'Sharma Travels', from: 'Delhi', to: 'Jaipur', dep: '06:00', arr: '11:30', duration: '5h 30m', price: 480, type: 'AC Seater', seatsLeft: 22, rating: 4.3, amenities: ['AC', 'Snacks', 'Charger'] },
  { id: 'B004', operator: 'Rajasthan Travels', from: 'Delhi', to: 'Jaipur', dep: '08:30', arr: '13:45', duration: '5h 15m', price: 380, type: 'Non-AC Seater', seatsLeft: 31, rating: 3.8, amenities: ['Snacks'] },
  { id: 'B005', operator: 'Orange Travels', from: 'Chennai', to: 'Bengaluru', dep: '23:00', arr: '06:00+1', duration: '7h 00m', price: 720, type: 'Sleeper AC', seatsLeft: 6, rating: 4.5, amenities: ['AC', 'Blanket', 'Charger', 'Movie'] },
  { id: 'B006', operator: 'KSRTC', from: 'Bengaluru', to: 'Mysuru', dep: '07:00', arr: '10:30', duration: '3h 30m', price: 210, type: 'AC Seater', seatsLeft: 18, rating: 4.0, amenities: ['AC'] },
  { id: 'B007', operator: 'Patel Tours', from: 'Ahmedabad', to: 'Mumbai', dep: '19:00', arr: '07:00+1', duration: '12h 00m', price: 900, type: 'Sleeper AC', seatsLeft: 11, rating: 4.2, amenities: ['AC', 'Blanket', 'Dinner', 'Charger'] },
  { id: 'B008', operator: 'SRS Travels', from: 'Hyderabad', to: 'Bengaluru', dep: '21:00', arr: '05:30+1', duration: '8h 30m', price: 780, type: 'Sleeper AC', seatsLeft: 9, rating: 4.4, amenities: ['AC', 'Blanket', 'Charger'] },
  { id: 'B009', operator: 'Paulo Travels', from: 'Pune', to: 'Goa', dep: '19:30', arr: '06:00+1', duration: '10h 30m', price: 820, type: 'Sleeper AC', seatsLeft: 5, rating: 4.6, amenities: ['AC', 'Blanket', 'Water', 'Charger'] },
  { id: 'B010', operator: 'MSRTC Shivneri', from: 'Mumbai', to: 'Pune', dep: '06:15', arr: '09:30', duration: '3h 15m', price: 280, type: 'AC Seater', seatsLeft: 42, rating: 4.3, amenities: ['AC', 'CCTV'] },
  { id: 'B011', operator: 'Neeta Tours', from: 'Mumbai', to: 'Surat', dep: '07:00', arr: '11:30', duration: '4h 30m', price: 350, type: 'AC Seater', seatsLeft: 27, rating: 4.1, amenities: ['AC', 'Charger'] },
  { id: 'B012', operator: 'Kallada Travels', from: 'Kochi', to: 'Bengaluru', dep: '20:00', arr: '07:30+1', duration: '11h 30m', price: 980, type: 'Sleeper AC', seatsLeft: 7, rating: 4.7, amenities: ['AC', 'Blanket', 'Breakfast', 'Charger', 'Entertainment'] },
  { id: 'B013', operator: 'IntrCity SmartBus', from: 'Delhi', to: 'Agra', dep: '06:00', arr: '09:30', duration: '3h 30m', price: 420, type: 'AC Seater', seatsLeft: 16, rating: 4.5, amenities: ['AC', 'Wifi', 'Snacks', 'Charger'] },
  { id: 'B014', operator: 'Greenline Travels', from: 'Kolkata', to: 'Puri', dep: '21:00', arr: '05:30+1', duration: '8h 30m', price: 560, type: 'Sleeper AC', seatsLeft: 12, rating: 4.0, amenities: ['AC', 'Blanket'] },
  { id: 'B015', operator: 'Raj National Express', from: 'Delhi', to: 'Haridwar', dep: '05:30', arr: '10:30', duration: '5h 00m', price: 320, type: 'AC Seater', seatsLeft: 24, rating: 3.9, amenities: ['AC', 'Water'] },
];

// ─── PACKAGES ─────────────────────────────────────────────────────
const featuredPackages = [
  { id: 'PKG001', title: 'Japan Cherry Blossom Circuit', destination: 'Japan', image: 'https://images.unsplash.com/photo-1768947814430-ec307db34952?w=800&q=80', duration: '10 days', price: 128000, tag: 'BESTSELLER', rating: 4.9, reviews: 342, inclusions: ['Return Flights', '5-Star Hotels', 'Shinkansen Pass', 'Guide', 'Breakfast Daily', 'Airport Transfers'], desc: 'Tokyo to Kyoto via the bullet train. Cherry blossom season, ryokan nights, kaiseki dinners.' },
  { id: 'PKG002', title: 'Maldives Overwater Escape', destination: 'Maldives', image: 'https://images.unsplash.com/photo-1575231902188-93d58962d791?w=800&q=80', duration: '6 days', price: 142000, tag: 'LUXURY', rating: 4.9, reviews: 218, inclusions: ['Return Flights', 'Overwater Villa', 'All Meals', 'Seaplane Transfer', 'Snorkelling Gear', 'Sunset Cruise'], desc: 'A private overwater villa above the UNESCO-listed Baa Atoll. House reef, crystal water, absolute silence.' },
  { id: 'PKG003', title: 'Morocco Sahara Adventure', destination: 'Morocco', image: 'https://images.unsplash.com/photo-1548364504-57247d6f96bb?w=800&q=80', duration: '8 days', price: 52000, tag: 'ADVENTURE', rating: 4.7, reviews: 189, inclusions: ['Return Flights', 'Riads & Desert Camp', 'All Transport', 'Guide', 'Camel Trek', 'Breakfast Daily'], desc: 'Marrakech medina to Saharan dunes. Imperial cities, Atlas Mountains, desert nights under stars.' },
  { id: 'PKG004', title: 'Iceland Aurora Hunt', destination: 'Iceland', image: 'https://images.unsplash.com/photo-1769670172608-f741dd969509?w=800&q=80', duration: '7 days', price: 118000, tag: 'SEASONAL', rating: 4.8, reviews: 167, inclusions: ['Return Flights', 'Boutique Hotels', 'Ring Road Car Rental', 'Blue Lagoon Entry', 'Aurora Tour', 'Glacier Walk'], desc: 'Chasing aurora across the Ring Road. Geothermal pools, lava fields, glacier walks.' },
  { id: 'PKG005', title: 'Patagonia End of the World', destination: 'Argentina', image: 'https://images.unsplash.com/photo-1692176048203-9125b4808282?w=800&q=80', duration: '12 days', price: 165000, tag: 'EPIC', rating: 4.9, reviews: 94, inclusions: ['Return Flights', 'Lodges & Camps', 'All Transport', 'Expert Guide', 'Park Fees', 'Meals'], desc: 'Torres del Paine to Ushuaia via Perito Moreno Glacier. The most dramatic landscapes on earth.' },
  { id: 'PKG006', title: 'Dubai & Abu Dhabi Luxury', destination: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', duration: '5 days', price: 68000, tag: 'LUXURY', rating: 4.6, reviews: 445, inclusions: ['Return Flights', '5-Star Hotel', 'Desert Safari', 'City Tours', 'Burj Khalifa', 'Transfers'], desc: 'Burj Al Arab to Sheikh Zayed Mosque. Supercars, desert camps, and architecture from the future.' },
  { id: 'PKG007', title: 'Bali Wellness Retreat', destination: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', duration: '8 days', price: 48000, tag: 'WELLNESS', rating: 4.8, reviews: 276, inclusions: ['Return Flights', 'Resort Stay', 'Daily Yoga', 'Spa Sessions', 'Cooking Class', 'Breakfast & Dinner'], desc: 'Ubud jungle resort. Morning yoga, afternoon spa, evening fireflies. The reset you actually need.' },
  { id: 'PKG008', title: 'Vietnam North to South', destination: 'Vietnam', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80', duration: '11 days', price: 42000, tag: 'CULTURAL', rating: 4.7, reviews: 312, inclusions: ['Return Flights', 'Boutique Hotels', 'Ha Long Bay Cruise', 'Internal Flights', 'Guide', 'Breakfast Daily'], desc: 'Hanoi to Ho Chi Minh via Ha Long Bay and Hoi An Ancient Town.' },
  { id: 'PKG009', title: 'Santorini & Athens Combination', destination: 'Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80', duration: '7 days', price: 92000, tag: 'CLASSIC', rating: 4.6, reviews: 198, inclusions: ['Return Flights', 'Caldera Hotel', 'Ferry Tickets', 'Acropolis Tour', 'Sunset Cruise', 'Breakfast'], desc: 'Oia sunset, caldera sailing, then Athens archaeology. Ancient meets impossibly beautiful.' },
  { id: 'PKG010', title: 'Peru Machu Picchu & Amazon', destination: 'Peru', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80', duration: '10 days', price: 98000, tag: 'EXPLORER', rating: 4.8, reviews: 143, inclusions: ['Return Flights', 'Lodges', 'Inca Trail Permit', 'Amazon River Cruise', 'Guide', 'Most Meals'], desc: 'From Inca stone cities at 2,400m to Amazon jungle waterways at sea level.' },
  { id: 'PKG011', title: 'Kenya Safari & Zanzibar Beach', destination: 'Kenya', image: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=800&q=80', duration: '10 days', price: 138000, tag: 'WILDLIFE', rating: 4.9, reviews: 127, inclusions: ['Return Flights', 'Safari Lodge', 'Beach Resort', 'Game Drives', 'Transfers', 'Most Meals'], desc: 'Four nights in the Masai Mara watching the Great Migration, then Indian Ocean beach recovery.' },
  { id: 'PKG012', title: 'New Zealand Lord of the Rings Trail', destination: 'New Zealand', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', duration: '12 days', price: 152000, tag: 'ADVENTURE', rating: 4.7, reviews: 89, inclusions: ['Return Flights', 'Boutique Hotels', 'Rental Car', 'Milford Sound Cruise', 'Hobbiton', 'Queenstown Activities'], desc: 'Middle Earth is real. Milford Sound fjords, Tongariro Alpine Crossing, and Queenstown adrenaline.' },
  { id: 'PKG013', title: 'Switzerland Alpine Photography', destination: 'Switzerland', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80', duration: '8 days', price: 135000, tag: 'SCENIC', rating: 4.8, reviews: 76, inclusions: ['Return Flights', 'Mountain Hotels', 'Rail Pass', 'Glacier Access', 'Photography Guide', 'Breakfast'], desc: 'Jungfraujoch at sunrise, Glacier Express, Matterhorn views. Switzerland earns every cliché.' },
  { id: 'PKG014', title: 'Singapore & Bali Twin Centre', destination: 'Multi-Destination', image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&q=80', duration: '9 days', price: 72000, tag: 'TWIN CENTRE', rating: 4.6, reviews: 234, inclusions: ['Return Flights', '5-Star Hotels', 'SG City Tour', 'Internal Flight', 'Bali Transfer', 'Breakfast'], desc: 'Three nights of future-city in Singapore, then six nights of spiritual Bali. A perfect contrast.' },
  { id: 'PKG015', title: 'Egypt Pharaohs & Nile Cruise', destination: 'Egypt', image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=80', duration: '9 days', price: 62000, tag: 'HISTORIC', rating: 4.7, reviews: 165, inclusions: ['Return Flights', 'Nile Cruise Ship', 'Cairo Hotel', 'All Sightseeing', 'Guide', 'All Meals on Cruise'], desc: 'Pyramids at dawn, Valley of the Kings, Karnak temple. Then float down the Nile between it all.' },
  { id: 'PKG016', title: 'Norway Northern Lights & Fjords', destination: 'Norway', image: 'https://images.unsplash.com/photo-1695366804273-2c8da6f96ce0?w=800&q=80', duration: '8 days', price: 128000, tag: 'SEASONAL', rating: 4.8, reviews: 108, inclusions: ['Return Flights', 'Glass Igloo', 'Fjord Cruise', 'Dog Sledding', 'Snowmobile', 'Northern Lights Tour'], desc: 'Sleep in a glass igloo waiting for aurora. Kayak under the midnight sun. Norway in full spectacle.' },
  { id: 'PKG017', title: 'Barcelona & Portuguese Coast', destination: 'Europe', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80', duration: '9 days', price: 88000, tag: 'CULTURAL', rating: 4.6, reviews: 187, inclusions: ['Return Flights', 'Boutique Hotels', 'Train to Lisbon', 'City Tours', 'Wine Tasting', 'Breakfast Daily'], desc: 'Gaudí architecture, then the fado bars of Lisbon. Two cities that perfected the art of beautiful living.' },
  { id: 'PKG018', title: 'Canada Rockies Self Drive', destination: 'Canada', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', duration: '10 days', price: 142000, tag: 'SELF DRIVE', rating: 4.7, reviews: 94, inclusions: ['Return Flights', 'Mountain Hotels', 'Premium Car Rental', 'Park Passes', 'Breakfast Daily', 'GPS'], desc: 'Icefields Parkway at your own pace. Turquoise lakes, glaciers, elk on the road at dusk.' },
];

// ─── FLASH DEALS ─────────────────────────────────────────────────
const featuredDeals = [
  { id: 'D001', destId: 'morocco', destName: 'Morocco', image: 'https://images.unsplash.com/photo-1548364504-57247d6f96bb?w=800&q=80', originalPrice: 42000, discountedPrice: 27720, discount: 34, tag: 'FLASH', seatsLeft: 3, expiresIn: 23 * 3600 + 14 * 60, desc: 'Marrakech 7-night package including desert camp' },
  { id: 'D002', destId: 'tokyo', destName: 'Tokyo', image: 'https://images.unsplash.com/photo-1665712638676-ff7045551805?w=800&q=80', originalPrice: 74000, discountedPrice: 57720, discount: 22, tag: 'LIMITED', seatsLeft: 7, expiresIn: 11 * 3600 + 42 * 60, desc: 'Tokyo 8-day package with bullet train pass' },
  { id: 'D003', destId: 'lisbon', destName: 'Lisbon', image: 'https://images.unsplash.com/photo-1681995585128-9c9bc14c2dd0?w=800&q=80', originalPrice: 56000, discountedPrice: 45920, discount: 18, tag: 'WEEKEND', seatsLeft: 12, expiresIn: 47 * 3600 + 8 * 60, desc: 'Lisbon & Sintra 5-night boutique hotel package' },
  { id: 'D004', destId: 'iceland', destName: 'Iceland', image: 'https://images.unsplash.com/photo-1769670172608-f741dd969509?w=800&q=80', originalPrice: 122000, discountedPrice: 87840, discount: 28, tag: 'FLASH', seatsLeft: 2, expiresIn: 6 * 3600 + 55 * 60, desc: 'Iceland Aurora Ring Road 7-day full package' },
  { id: 'D005', destId: 'maldives', destName: 'Maldives', image: 'https://images.unsplash.com/photo-1575231902188-93d58962d791?w=800&q=80', originalPrice: 167000, discountedPrice: 141950, discount: 15, tag: 'SEASONAL', seatsLeft: 18, expiresIn: 35 * 3600 + 22 * 60, desc: 'Maldives 6-night overwater villa with all meals' },
  { id: 'D006', destId: 'norway', destName: 'Norway', image: 'https://images.unsplash.com/photo-1695366804273-2c8da6f96ce0?w=800&q=80', originalPrice: 105000, discountedPrice: 82950, discount: 21, tag: 'LIMITED', seatsLeft: 5, expiresIn: 19 * 3600 + 3 * 60, desc: 'Norway fjords & northern lights 8-night package' },
  { id: 'D007', destId: 'bali', destName: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', originalPrice: 48000, discountedPrice: 33600, discount: 30, tag: 'FLASH', seatsLeft: 4, expiresIn: 8 * 3600 + 30 * 60, desc: 'Bali wellness retreat 8 nights Ubud resort' },
  { id: 'D008', destId: 'dubai', destName: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', originalPrice: 72000, discountedPrice: 54000, discount: 25, tag: 'WEEKEND', seatsLeft: 9, expiresIn: 14 * 3600 + 45 * 60, desc: 'Dubai luxury 5-star 4-night package with desert safari' },
  { id: 'D009', destId: 'vietnam', destName: 'Vietnam', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80', originalPrice: 62000, discountedPrice: 49600, discount: 20, tag: 'LAST MINUTE', seatsLeft: 6, expiresIn: 4 * 3600 + 20 * 60, desc: 'Vietnam North to South 11 days with Ha Long cruise' },
  { id: 'D010', destId: 'santorini', destName: 'Santorini', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80', originalPrice: 95000, discountedPrice: 71250, discount: 25, tag: 'LIMITED', seatsLeft: 3, expiresIn: 28 * 3600 + 15 * 60, desc: 'Santorini clifftop hotel 5 nights with caldera views' },
  { id: 'D011', destId: 'peru', destName: 'Peru', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80', originalPrice: 118000, discountedPrice: 88500, discount: 25, tag: 'EARLY BIRD', seatsLeft: 8, expiresIn: 72 * 3600, desc: 'Peru Machu Picchu & Amazon 10-day expedition' },
  { id: 'D012', destId: 'singapore', destName: 'Singapore', image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&q=80', originalPrice: 55000, discountedPrice: 41250, discount: 25, tag: 'FLASH', seatsLeft: 11, expiresIn: 16 * 3600 + 40 * 60, desc: 'Singapore 4-night stay with SkyPark & Gardens' },
];

// ─── AIRPORT CODES ────────────────────────────────────────────────
const featuredAirports = [
  { code: 'DEL', city: 'New Delhi', country: 'India', name: 'Indira Gandhi International' },
  { code: 'BOM', city: 'Mumbai', country: 'India', name: 'Chhatrapati Shivaji Maharaj International' },
  { code: 'BLR', city: 'Bengaluru', country: 'India', name: 'Kempegowda International' },
  { code: 'MAA', city: 'Chennai', country: 'India', name: 'Chennai International' },
  { code: 'CCU', city: 'Kolkata', country: 'India', name: 'Netaji Subhas Chandra Bose International' },
  { code: 'HYD', city: 'Hyderabad', country: 'India', name: 'Rajiv Gandhi International' },
  { code: 'NRT', city: 'Tokyo', country: 'Japan', name: 'Narita International' },
  { code: 'DXB', city: 'Dubai', country: 'UAE', name: 'Dubai International' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', name: 'Changi Airport' },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', name: 'Suvarnabhumi Airport' },
  { code: 'LHR', city: 'London', country: 'UK', name: 'Heathrow Airport' },
  { code: 'CDG', city: 'Paris', country: 'France', name: 'Charles de Gaulle' },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', name: 'Frankfurt Airport' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands', name: 'Schiphol Airport' },
  { code: 'KEF', city: 'Reykjavik', country: 'Iceland', name: 'Keflavik International' },
  { code: 'MLE', city: 'Malé', country: 'Maldives', name: 'Velana International' },
  { code: 'NBO', city: 'Nairobi', country: 'Kenya', name: 'Jomo Kenyatta International' },
  { code: 'JFK', city: 'New York', country: 'USA', name: 'John F. Kennedy International' },
  { code: 'SYD', city: 'Sydney', country: 'Australia', name: 'Sydney Airport' },
  { code: 'ZRH', city: 'Zurich', country: 'Switzerland', name: 'Zurich Airport' },
];

// ═══════════════════════════════════════════════════════════════
//  COMBINED EXPORTS  ·  Featured items first, generated after.
//  Generation is deterministic (seeded) so IDs/prices are stable.
// ═══════════════════════════════════════════════════════════════
const t0 = Date.now();

export const destinations = [...featuredDestinations, ...generateDestinations(1, 180)];
export const flights      = [...featuredFlights,      ...generateFlights(2, 10000)];
export const hotels       = [...featuredHotels,       ...generateHotels(3, 10000)];
export const buses        = [...featuredBuses,        ...generateBuses(4, 10000)];
export const packages     = [...featuredPackages,     ...generatePackages(5, 10000)];
export const deals        = [...featuredDeals,        ...generateDeals(6, 100, packages)];
export const airports     = [...featuredAirports,     ...generateAirports().filter(a => !featuredAirports.find(f => f.code === a.code))];

console.log(`[demoData] catalogues built in ${Date.now() - t0}ms · ` +
  `dest=${destinations.length} flights=${flights.length} hotels=${hotels.length} ` +
  `buses=${buses.length} pkgs=${packages.length} deals=${deals.length} airports=${airports.length}`);
