// ═══════════════════════════════════════════════════════════════
//  AEROVIA  ·  PROCEDURAL DEMO DATA
//  Generates large, realistic catalogues from real-world seed
//  pools. Uses a seeded PRNG so the dataset is stable across
//  server restarts (good for caching, screenshots, demos).
// ═══════════════════════════════════════════════════════════════

// ── Seeded PRNG (mulberry32) ──────────────────────────────────
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s |= 0;
    s = (s + 0x6D2B79F5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (rand, arr) => arr[Math.floor(rand() * arr.length)];
const intIn = (rand, lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const round = (n, step) => Math.round(n / step) * step;
const pad = (n, w = 5) => String(n).padStart(w, '0');

// ── Real-world seed pools ─────────────────────────────────────

// 100 well-known global cities for destinations / hotel locations
export const CITY_POOL = [
  // South / Southeast Asia
  { city: 'Goa',          country: 'India',        region: 'South Asia',     code: 'GOI', img: 'photo-1582510003544-4d00b7f74220' },
  { city: 'Jaipur',       country: 'India',        region: 'South Asia',     code: 'JAI', img: 'photo-1599661046289-e31897846e41' },
  { city: 'Udaipur',      country: 'India',        region: 'South Asia',     code: 'UDR', img: 'photo-1568659585037-e26ed3eda90e' },
  { city: 'Kerala',       country: 'India',        region: 'South Asia',     code: 'COK', img: 'photo-1580289143186-031f5e034333' },
  { city: 'Leh',          country: 'India',        region: 'South Asia',     code: 'IXL', img: 'photo-1598452963314-b09f397a5c48' },
  { city: 'Andaman',      country: 'India',        region: 'South Asia',     code: 'IXZ', img: 'photo-1583416750470-965b2707b355' },
  { city: 'Colombo',      country: 'Sri Lanka',    region: 'South Asia',     code: 'CMB', img: 'photo-1566296314736-6eaac1ca0cb9' },
  { city: 'Kandy',        country: 'Sri Lanka',    region: 'South Asia',     code: 'KCT', img: 'photo-1586511934875-5c5411eedd71' },
  { city: 'Kathmandu',    country: 'Nepal',        region: 'South Asia',     code: 'KTM', img: 'photo-1605640840605-14ac1855827b' },
  { city: 'Pokhara',      country: 'Nepal',        region: 'South Asia',     code: 'PKR', img: 'photo-1605640840605-14ac1855827b' },
  { city: 'Thimphu',      country: 'Bhutan',       region: 'South Asia',     code: 'PBH', img: 'photo-1564507048089-fce18068b97a' },
  { city: 'Male',         country: 'Maldives',     region: 'Indian Ocean',   code: 'MLE', img: 'photo-1575231902188-93d58962d791' },
  { city: 'Bangkok',      country: 'Thailand',     region: 'Southeast Asia', code: 'BKK', img: 'photo-1508009603885-50cf7c579365' },
  { city: 'Phuket',       country: 'Thailand',     region: 'Southeast Asia', code: 'HKT', img: 'photo-1589394815804-964ed0be2eb5' },
  { city: 'Chiang Mai',   country: 'Thailand',     region: 'Southeast Asia', code: 'CNX', img: 'photo-1598935898639-81586f7d2129' },
  { city: 'Krabi',        country: 'Thailand',     region: 'Southeast Asia', code: 'KBV', img: 'photo-1589394815804-964ed0be2eb5' },
  { city: 'Bali',         country: 'Indonesia',    region: 'Southeast Asia', code: 'DPS', img: 'photo-1537996194471-e657df975ab4' },
  { city: 'Jakarta',      country: 'Indonesia',    region: 'Southeast Asia', code: 'CGK', img: 'photo-1555899434-94d1368aa7af' },
  { city: 'Yogyakarta',   country: 'Indonesia',    region: 'Southeast Asia', code: 'JOG', img: 'photo-1596402184320-417e7178b2cd' },
  { city: 'Hanoi',        country: 'Vietnam',      region: 'Southeast Asia', code: 'HAN', img: 'photo-1528127269322-539801943592' },
  { city: 'Ho Chi Minh',  country: 'Vietnam',      region: 'Southeast Asia', code: 'SGN', img: 'photo-1583417319070-4a69db38a482' },
  { city: 'Da Nang',      country: 'Vietnam',      region: 'Southeast Asia', code: 'DAD', img: 'photo-1559592413-7cec4d0cae2b' },
  { city: 'Siem Reap',    country: 'Cambodia',     region: 'Southeast Asia', code: 'REP', img: 'photo-1539367628448-4bc5c9d171c8' },
  { city: 'Phnom Penh',   country: 'Cambodia',     region: 'Southeast Asia', code: 'PNH', img: 'photo-1563492065599-3520f775eeed' },
  { city: 'Luang Prabang',country: 'Laos',         region: 'Southeast Asia', code: 'LPQ', img: 'photo-1571536802807-30451e3955d8' },
  { city: 'Yangon',       country: 'Myanmar',      region: 'Southeast Asia', code: 'RGN', img: 'photo-1555990538-0d68bf931589' },
  { city: 'Manila',       country: 'Philippines',  region: 'Southeast Asia', code: 'MNL', img: 'photo-1518509562904-e7ef99cddc85' },
  { city: 'Cebu',         country: 'Philippines',  region: 'Southeast Asia', code: 'CEB', img: 'photo-1552248524-10d9a7e4841c' },
  { city: 'Singapore',    country: 'Singapore',    region: 'Southeast Asia', code: 'SIN', img: 'photo-1565967511849-76a60a516170' },
  { city: 'Kuala Lumpur', country: 'Malaysia',     region: 'Southeast Asia', code: 'KUL', img: 'photo-1596422846543-75c6fc197f07' },
  { city: 'Langkawi',     country: 'Malaysia',     region: 'Southeast Asia', code: 'LGK', img: 'photo-1561414927-6d86591d0c4f' },

  // East Asia
  { city: 'Tokyo',        country: 'Japan',        region: 'East Asia',      code: 'NRT', img: 'photo-1665712638676-ff7045551805' },
  { city: 'Kyoto',        country: 'Japan',        region: 'East Asia',      code: 'UKY', img: 'photo-1768947814430-ec307db34952' },
  { city: 'Osaka',        country: 'Japan',        region: 'East Asia',      code: 'KIX', img: 'photo-1590559899731-a382839e5549' },
  { city: 'Sapporo',      country: 'Japan',        region: 'East Asia',      code: 'CTS', img: 'photo-1542640244-7e672d6cef4e' },
  { city: 'Seoul',        country: 'South Korea',  region: 'East Asia',      code: 'ICN', img: 'photo-1538485399081-7191377e8241' },
  { city: 'Busan',        country: 'South Korea',  region: 'East Asia',      code: 'PUS', img: 'photo-1542640244-7e672d6cef4e' },
  { city: 'Hong Kong',    country: 'Hong Kong',    region: 'East Asia',      code: 'HKG', img: 'photo-1532455935509-eb76842cee50' },
  { city: 'Taipei',       country: 'Taiwan',       region: 'East Asia',      code: 'TPE', img: 'photo-1470004914212-05527e49370b' },
  { city: 'Shanghai',     country: 'China',        region: 'East Asia',      code: 'PVG', img: 'photo-1545893835-abaa50cbe628' },
  { city: 'Beijing',      country: 'China',        region: 'East Asia',      code: 'PEK', img: 'photo-1508804185872-d7badad00f7d' },

  // Middle East / Central Asia
  { city: 'Dubai',        country: 'UAE',          region: 'Middle East',    code: 'DXB', img: 'photo-1512453979798-5ea266f8880c' },
  { city: 'Abu Dhabi',    country: 'UAE',          region: 'Middle East',    code: 'AUH', img: 'photo-1582719508461-905c673771fd' },
  { city: 'Doha',         country: 'Qatar',        region: 'Middle East',    code: 'DOH', img: 'photo-1518630904902-39e9c5b3bf7a' },
  { city: 'Muscat',       country: 'Oman',         region: 'Middle East',    code: 'MCT', img: 'photo-1531219572328-a0171b4448a3' },
  { city: 'Istanbul',     country: 'Turkey',       region: 'Middle East',    code: 'IST', img: 'photo-1524231757912-21f4fe3a7200' },
  { city: 'Cappadocia',   country: 'Turkey',       region: 'Middle East',    code: 'NAV', img: 'photo-1641128324972-af3212f0f6bd' },
  { city: 'Tbilisi',      country: 'Georgia',      region: 'Central Asia',   code: 'TBS', img: 'photo-1565008576549-57569a49371d' },
  { city: 'Almaty',       country: 'Kazakhstan',   region: 'Central Asia',   code: 'ALA', img: 'photo-1612375871347-39e7f5a2cdd1' },
  { city: 'Tashkent',     country: 'Uzbekistan',   region: 'Central Asia',   code: 'TAS', img: 'photo-1565008576549-57569a49371d' },

  // Europe
  { city: 'London',       country: 'UK',           region: 'Europe',         code: 'LHR', img: 'photo-1486299267070-83823f5448dd' },
  { city: 'Edinburgh',    country: 'UK',           region: 'Europe',         code: 'EDI', img: 'photo-1506377585622-bedcbb027afc' },
  { city: 'Paris',        country: 'France',       region: 'Europe',         code: 'CDG', img: 'photo-1502602898657-3e91760cbb34' },
  { city: 'Nice',         country: 'France',       region: 'Europe',         code: 'NCE', img: 'photo-1533104816931-20fa691ff6ca' },
  { city: 'Barcelona',    country: 'Spain',        region: 'Europe',         code: 'BCN', img: 'photo-1583422409516-2895a77efded' },
  { city: 'Madrid',       country: 'Spain',        region: 'Europe',         code: 'MAD', img: 'photo-1543783207-ec64e4d95325' },
  { city: 'Seville',      country: 'Spain',        region: 'Europe',         code: 'SVQ', img: 'photo-1559692048-79a3f837883d' },
  { city: 'Lisbon',       country: 'Portugal',     region: 'Europe',         code: 'LIS', img: 'photo-1681995585128-9c9bc14c2dd0' },
  { city: 'Porto',        country: 'Portugal',     region: 'Europe',         code: 'OPO', img: 'photo-1555881400-74d7acaacd8b' },
  { city: 'Rome',         country: 'Italy',        region: 'Europe',         code: 'FCO', img: 'photo-1525874684015-58379d421a52' },
  { city: 'Florence',     country: 'Italy',        region: 'Europe',         code: 'FLR', img: 'photo-1543429776-2782fc8e1acd' },
  { city: 'Venice',       country: 'Italy',        region: 'Europe',         code: 'VCE', img: 'photo-1514890547357-a9ee288728e0' },
  { city: 'Amalfi',       country: 'Italy',        region: 'Europe',         code: 'NAP', img: 'photo-1533188850608-cb6d97ce5d1d' },
  { city: 'Athens',       country: 'Greece',       region: 'Europe',         code: 'ATH', img: 'photo-1555993539-1732b0258235' },
  { city: 'Santorini',    country: 'Greece',       region: 'Europe',         code: 'JTR', img: 'photo-1570077188670-e3a8d69ac5ff' },
  { city: 'Mykonos',      country: 'Greece',       region: 'Europe',         code: 'JMK', img: 'photo-1601581875309-fafbf2d3ed3a' },
  { city: 'Berlin',       country: 'Germany',      region: 'Europe',         code: 'BER', img: 'photo-1587330979470-3016b6702d89' },
  { city: 'Munich',       country: 'Germany',      region: 'Europe',         code: 'MUC', img: 'photo-1595867818082-083862f3d630' },
  { city: 'Frankfurt',    country: 'Germany',      region: 'Europe',         code: 'FRA', img: 'photo-1577188949002-bbf67ad9f9a6' },
  { city: 'Vienna',       country: 'Austria',      region: 'Europe',         code: 'VIE', img: 'photo-1516550893923-42d28e5677af' },
  { city: 'Prague',       country: 'Czechia',      region: 'Europe',         code: 'PRG', img: 'photo-1541849546-216549ae216d' },
  { city: 'Budapest',     country: 'Hungary',      region: 'Europe',         code: 'BUD', img: 'photo-1551867633-194f125bddfa' },
  { city: 'Krakow',       country: 'Poland',       region: 'Europe',         code: 'KRK', img: 'photo-1606992894456-799462dde3e3' },
  { city: 'Amsterdam',    country: 'Netherlands',  region: 'Europe',         code: 'AMS', img: 'photo-1534351590666-13e3e96c5017' },
  { city: 'Zurich',       country: 'Switzerland',  region: 'Europe',         code: 'ZRH', img: 'photo-1531366936337-7c912a4589a7' },
  { city: 'Geneva',       country: 'Switzerland',  region: 'Europe',         code: 'GVA', img: 'photo-1530841377377-3ff06c0ca713' },
  { city: 'Interlaken',   country: 'Switzerland',  region: 'Europe',         code: 'BRN', img: 'photo-1531366936337-7c912a4589a7' },
  { city: 'Copenhagen',   country: 'Denmark',      region: 'Nordic',         code: 'CPH', img: 'photo-1513622470522-26c3c8a854bc' },
  { city: 'Stockholm',    country: 'Sweden',       region: 'Nordic',         code: 'ARN', img: 'photo-1509356843151-3e7d96241e11' },
  { city: 'Oslo',         country: 'Norway',       region: 'Nordic',         code: 'OSL', img: 'photo-1601084881623-cdf9a8ea242c' },
  { city: 'Bergen',       country: 'Norway',       region: 'Nordic',         code: 'BGO', img: 'photo-1695366804273-2c8da6f96ce0' },
  { city: 'Tromsø',       country: 'Norway',       region: 'Nordic',         code: 'TOS', img: 'photo-1601084881623-cdf9a8ea242c' },
  { city: 'Helsinki',     country: 'Finland',      region: 'Nordic',         code: 'HEL', img: 'photo-1581873372796-635b67ca2008' },
  { city: 'Reykjavik',    country: 'Iceland',      region: 'Nordic',         code: 'KEF', img: 'photo-1769670172608-f741dd969509' },
  { city: 'Dublin',       country: 'Ireland',      region: 'Europe',         code: 'DUB', img: 'photo-1549918864-48ac978761a4' },
  { city: 'Moscow',       country: 'Russia',       region: 'Europe',         code: 'SVO', img: 'photo-1547448415-e9f5b28e570d' },

  // Africa
  { city: 'Marrakech',    country: 'Morocco',      region: 'North Africa',   code: 'RAK', img: 'photo-1548364504-57247d6f96bb' },
  { city: 'Casablanca',   country: 'Morocco',      region: 'North Africa',   code: 'CMN', img: 'photo-1548364504-57247d6f96bb' },
  { city: 'Cairo',        country: 'Egypt',        region: 'North Africa',   code: 'CAI', img: 'photo-1539768942893-daf53e448371' },
  { city: 'Luxor',        country: 'Egypt',        region: 'North Africa',   code: 'LXR', img: 'photo-1539768942893-daf53e448371' },
  { city: 'Tunis',        country: 'Tunisia',      region: 'North Africa',   code: 'TUN', img: 'photo-1572252009286-268acec5ca0a' },
  { city: 'Cape Town',    country: 'South Africa', region: 'Africa',         code: 'CPT', img: 'photo-1580060839134-75a5edca2e99' },
  { city: 'Johannesburg', country: 'South Africa', region: 'Africa',         code: 'JNB', img: 'photo-1577948000111-9c970dfe3743' },
  { city: 'Kruger',       country: 'South Africa', region: 'Africa',         code: 'MQP', img: 'photo-1547970810-dc1eac37d174' },
  { city: 'Nairobi',      country: 'Kenya',        region: 'Africa',         code: 'NBO', img: 'photo-1547970810-dc1eac37d174' },
  { city: 'Masai Mara',   country: 'Kenya',        region: 'Africa',         code: 'MRE', img: 'photo-1547970810-dc1eac37d174' },
  { city: 'Mombasa',      country: 'Kenya',        region: 'Africa',         code: 'MBA', img: 'photo-1580060839134-75a5edca2e99' },
  { city: 'Zanzibar',     country: 'Tanzania',     region: 'Africa',         code: 'ZNZ', img: 'photo-1565552645632-d725f8bfc19a' },
  { city: 'Serengeti',    country: 'Tanzania',     region: 'Africa',         code: 'SEU', img: 'photo-1547970810-dc1eac37d174' },
  { city: 'Victoria Falls',country: 'Zimbabwe',    region: 'Africa',         code: 'VFA', img: 'photo-1547970810-dc1eac37d174' },
  { city: 'Addis Ababa',  country: 'Ethiopia',     region: 'Africa',         code: 'ADD', img: 'photo-1565552645632-d725f8bfc19a' },

  // Americas
  { city: 'New York',     country: 'USA',          region: 'North America',  code: 'JFK', img: 'photo-1496442226666-8d4d0e62e6e9' },
  { city: 'Los Angeles',  country: 'USA',          region: 'North America',  code: 'LAX', img: 'photo-1503891450247-ee5f8ec46dc3' },
  { city: 'San Francisco',country: 'USA',          region: 'North America',  code: 'SFO', img: 'photo-1501594907352-04cda38ebc29' },
  { city: 'Chicago',      country: 'USA',          region: 'North America',  code: 'ORD', img: 'photo-1494522855154-9297ac14b55f' },
  { city: 'Miami',        country: 'USA',          region: 'North America',  code: 'MIA', img: 'photo-1535498730771-e735b998cd64' },
  { city: 'Las Vegas',    country: 'USA',          region: 'North America',  code: 'LAS', img: 'photo-1605833556294-ea5c7a74f57d' },
  { city: 'Honolulu',     country: 'USA',          region: 'North America',  code: 'HNL', img: 'photo-1505852679233-d9fd70aff56d' },
  { city: 'Toronto',      country: 'Canada',       region: 'North America',  code: 'YYZ', img: 'photo-1517090504586-fde19ea6066f' },
  { city: 'Vancouver',    country: 'Canada',       region: 'North America',  code: 'YVR', img: 'photo-1559511260-66a654ae982a' },
  { city: 'Banff',        country: 'Canada',       region: 'North America',  code: 'YBA', img: 'photo-1441974231531-c6227db76b6e' },
  { city: 'Mexico City',  country: 'Mexico',       region: 'North America',  code: 'MEX', img: 'photo-1518105779142-d975f22f1b0a' },
  { city: 'Cancun',       country: 'Mexico',       region: 'North America',  code: 'CUN', img: 'photo-1552074284-5e88ef1aef18' },
  { city: 'Tulum',        country: 'Mexico',       region: 'North America',  code: 'TUY', img: 'photo-1582510003544-4d00b7f74220' },
  { city: 'Havana',       country: 'Cuba',         region: 'Caribbean',      code: 'HAV', img: 'photo-1500759285222-a95626b934cb' },
  { city: 'San Juan',     country: 'Puerto Rico',  region: 'Caribbean',      code: 'SJU', img: 'photo-1500759285222-a95626b934cb' },
  { city: 'Rio de Janeiro',country: 'Brazil',      region: 'South America',  code: 'GIG', img: 'photo-1483729558449-99ef09a8c325' },
  { city: 'São Paulo',    country: 'Brazil',       region: 'South America',  code: 'GRU', img: 'photo-1543059080-f9b1272213d5' },
  { city: 'Buenos Aires', country: 'Argentina',    region: 'South America',  code: 'EZE', img: 'photo-1612294037637-ec7e0cce6f64' },
  { city: 'Patagonia',    country: 'Argentina',    region: 'South America',  code: 'FTE', img: 'photo-1692176048203-9125b4808282' },
  { city: 'Santiago',     country: 'Chile',        region: 'South America',  code: 'SCL', img: 'photo-1601553900-1f1b1c8a5c41' },
  { city: 'Lima',         country: 'Peru',         region: 'South America',  code: 'LIM', img: 'photo-1526392060635-9d6019884377' },
  { city: 'Cusco',        country: 'Peru',         region: 'South America',  code: 'CUZ', img: 'photo-1526392060635-9d6019884377' },
  { city: 'Bogota',       country: 'Colombia',     region: 'South America',  code: 'BOG', img: 'photo-1539635245046-a8e21abc1a09' },
  { city: 'Cartagena',    country: 'Colombia',     region: 'South America',  code: 'CTG', img: 'photo-1539635245046-a8e21abc1a09' },
  { city: 'Quito',        country: 'Ecuador',      region: 'South America',  code: 'UIO', img: 'photo-1601553900-1f1b1c8a5c41' },
  { city: 'La Paz',       country: 'Bolivia',      region: 'South America',  code: 'LPB', img: 'photo-1601553900-1f1b1c8a5c41' },

  // Oceania
  { city: 'Sydney',       country: 'Australia',    region: 'Oceania',        code: 'SYD', img: 'photo-1441974231531-c6227db76b6e' },
  { city: 'Melbourne',    country: 'Australia',    region: 'Oceania',        code: 'MEL', img: 'photo-1514395462725-fb4566210144' },
  { city: 'Brisbane',     country: 'Australia',    region: 'Oceania',        code: 'BNE', img: 'photo-1473625247510-8ceb1760943f' },
  { city: 'Cairns',       country: 'Australia',    region: 'Oceania',        code: 'CNS', img: 'photo-1559511260-66a654ae982a' },
  { city: 'Perth',        country: 'Australia',    region: 'Oceania',        code: 'PER', img: 'photo-1473625247510-8ceb1760943f' },
  { city: 'Auckland',     country: 'New Zealand',  region: 'Oceania',        code: 'AKL', img: 'photo-1469854523086-cc02fe5d8800' },
  { city: 'Queenstown',   country: 'New Zealand',  region: 'Oceania',        code: 'ZQN', img: 'photo-1469854523086-cc02fe5d8800' },
  { city: 'Fiji',         country: 'Fiji',         region: 'Oceania',        code: 'NAN', img: 'photo-1505852679233-d9fd70aff56d' },
  { city: 'Bora Bora',    country: 'French Polynesia', region: 'Oceania',    code: 'BOB', img: 'photo-1505852679233-d9fd70aff56d' },
];

// Indian metros (origins for flights & buses)
const INDIA_HUBS = [
  { city: 'New Delhi',  code: 'DEL' },
  { city: 'Mumbai',     code: 'BOM' },
  { city: 'Bengaluru',  code: 'BLR' },
  { city: 'Chennai',    code: 'MAA' },
  { city: 'Kolkata',    code: 'CCU' },
  { city: 'Hyderabad',  code: 'HYD' },
  { city: 'Ahmedabad',  code: 'AMD' },
  { city: 'Pune',       code: 'PNQ' },
  { city: 'Goa',        code: 'GOI' },
  { city: 'Kochi',      code: 'COK' },
];

const AIRLINES = [
  { name: 'Air India',           code: 'AI', tier: 'full',   tag: 'NATIONAL' },
  { name: 'IndiGo',              code: '6E', tier: 'budget', tag: 'BUDGET' },
  { name: 'Vistara',             code: 'UK', tier: 'full',   tag: 'PREMIUM' },
  { name: 'SpiceJet',            code: 'SG', tier: 'budget', tag: 'BUDGET' },
  { name: 'Akasa Air',           code: 'QP', tier: 'budget', tag: 'NEW' },
  { name: 'Emirates',            code: 'EK', tier: 'luxury', tag: 'LUXURY' },
  { name: 'Etihad Airways',      code: 'EY', tier: 'luxury', tag: 'LUXURY' },
  { name: 'Qatar Airways',       code: 'QR', tier: 'luxury', tag: '5-STAR' },
  { name: 'Singapore Airlines',  code: 'SQ', tier: 'luxury', tag: 'BEST AIRLINE' },
  { name: 'Cathay Pacific',      code: 'CX', tier: 'full',   tag: 'ASIA HUB' },
  { name: 'Thai Airways',        code: 'TG', tier: 'full',   tag: 'POPULAR' },
  { name: 'Malaysia Airlines',   code: 'MH', tier: 'full',   tag: 'VALUE' },
  { name: 'AirAsia',             code: 'AK', tier: 'budget', tag: 'BUDGET' },
  { name: 'Vietjet',             code: 'VJ', tier: 'budget', tag: 'BUDGET' },
  { name: 'Korean Air',          code: 'KE', tier: 'full',   tag: 'KOREA' },
  { name: 'JAL',                 code: 'JL', tier: 'full',   tag: 'JAPAN' },
  { name: 'ANA',                 code: 'NH', tier: 'full',   tag: 'JAPAN' },
  { name: 'Lufthansa',           code: 'LH', tier: 'full',   tag: 'EUROPE' },
  { name: 'Air France',          code: 'AF', tier: 'full',   tag: 'EUROPE' },
  { name: 'KLM',                 code: 'KL', tier: 'full',   tag: 'EUROPE' },
  { name: 'British Airways',     code: 'BA', tier: 'full',   tag: 'UK' },
  { name: 'Virgin Atlantic',     code: 'VS', tier: 'full',   tag: 'UK' },
  { name: 'Swiss Air',           code: 'LX', tier: 'full',   tag: 'PREMIUM' },
  { name: 'Turkish Airlines',    code: 'TK', tier: 'full',   tag: 'HUB' },
  { name: 'Aeroflot',            code: 'SU', tier: 'full',   tag: 'VALUE' },
  { name: 'Iberia',              code: 'IB', tier: 'full',   tag: 'SPAIN' },
  { name: 'TAP Portugal',        code: 'TP', tier: 'full',   tag: 'EUROPE' },
  { name: 'Ethiopian Airlines',  code: 'ET', tier: 'full',   tag: 'AFRICA' },
  { name: 'Kenya Airways',       code: 'KQ', tier: 'full',   tag: 'AFRICA' },
  { name: 'Qantas',              code: 'QF', tier: 'full',   tag: 'AUSTRALIA' },
  { name: 'Air New Zealand',     code: 'NZ', tier: 'full',   tag: 'PACIFIC' },
  { name: 'United Airlines',     code: 'UA', tier: 'full',   tag: 'USA' },
  { name: 'American Airlines',   code: 'AA', tier: 'full',   tag: 'USA' },
  { name: 'Delta',               code: 'DL', tier: 'full',   tag: 'USA' },
  { name: 'Air Canada',          code: 'AC', tier: 'full',   tag: 'CANADA' },
];

const HOTEL_BRANDS = [
  { brand: 'The St. Regis',       chain: 'Marriott',    tier: 5, tag: 'ULTRA LUXURY' },
  { brand: 'The Ritz-Carlton',    chain: 'Marriott',    tier: 5, tag: 'ICONIC' },
  { brand: 'Four Seasons',        chain: 'Four Seasons',tier: 5, tag: 'LUXURY' },
  { brand: 'Park Hyatt',          chain: 'Hyatt',       tier: 5, tag: 'PREMIUM' },
  { brand: 'Mandarin Oriental',   chain: 'Mandarin',    tier: 5, tag: 'LUXURY' },
  { brand: 'Aman',                chain: 'Aman',        tier: 5, tag: 'EXCLUSIVE' },
  { brand: 'Six Senses',          chain: 'IHG',         tier: 5, tag: 'WELLNESS' },
  { brand: 'Anantara',            chain: 'Minor',       tier: 5, tag: 'RESORT' },
  { brand: 'Soneva',              chain: 'Soneva',      tier: 5, tag: 'BAREFOOT' },
  { brand: 'Conrad',              chain: 'Hilton',      tier: 5, tag: 'LUXURY' },
  { brand: 'Waldorf Astoria',     chain: 'Hilton',      tier: 5, tag: 'GRAND' },
  { brand: 'JW Marriott',         chain: 'Marriott',    tier: 5, tag: 'BUSINESS LUXURY' },
  { brand: 'Banyan Tree',         chain: 'Banyan Tree', tier: 5, tag: 'RESORT' },
  { brand: 'Taj',                 chain: 'IHCL',        tier: 5, tag: 'HERITAGE' },
  { brand: 'Oberoi',              chain: 'Oberoi',      tier: 5, tag: 'INDIAN LUXURY' },
  { brand: 'Hyatt Regency',       chain: 'Hyatt',       tier: 4, tag: 'BUSINESS' },
  { brand: 'Sheraton',            chain: 'Marriott',    tier: 4, tag: 'CLASSIC' },
  { brand: 'Hilton',              chain: 'Hilton',      tier: 4, tag: 'GLOBAL' },
  { brand: 'Marriott',            chain: 'Marriott',    tier: 4, tag: 'BUSINESS' },
  { brand: 'Westin',              chain: 'Marriott',    tier: 4, tag: 'WELLNESS' },
  { brand: 'Pullman',             chain: 'Accor',       tier: 4, tag: 'UPSCALE' },
  { brand: 'Sofitel',             chain: 'Accor',       tier: 5, tag: 'FRENCH LUXURY' },
  { brand: 'Novotel',             chain: 'Accor',       tier: 4, tag: 'COMFORT' },
  { brand: 'Mövenpick',           chain: 'Accor',       tier: 4, tag: 'EUROPEAN' },
  { brand: 'Crowne Plaza',        chain: 'IHG',         tier: 4, tag: 'BUSINESS' },
  { brand: 'Holiday Inn',         chain: 'IHG',         tier: 3, tag: 'VALUE' },
  { brand: 'Courtyard',           chain: 'Marriott',    tier: 3, tag: 'BUSINESS' },
  { brand: 'Hampton Inn',         chain: 'Hilton',      tier: 3, tag: 'COMFORT' },
  { brand: 'ibis',                chain: 'Accor',       tier: 3, tag: 'BUDGET' },
  { brand: 'OYO Premium',         chain: 'OYO',         tier: 3, tag: 'BUDGET' },
  { brand: 'Lemon Tree',          chain: 'Lemon Tree',  tier: 4, tag: 'INDIAN' },
  { brand: 'ITC',                 chain: 'ITC',         tier: 5, tag: 'LUXURY' },
  { brand: 'Boutique Riad',       chain: 'Independent', tier: 4, tag: 'BOUTIQUE' },
  { brand: 'Heritage Haveli',     chain: 'Independent', tier: 4, tag: 'HERITAGE' },
  { brand: 'Design Hotel',        chain: 'Design',      tier: 4, tag: 'DESIGN' },
];

const HOTEL_AMENITIES = [
  'Pool', 'Spa', 'Gym', 'Fine Dining', 'Concierge', 'Butler Service',
  'Free WiFi', 'Airport Transfer', 'Bar', 'Rooftop', 'Kids Club',
  'Business Centre', 'Pet Friendly', 'EV Charging', 'Yoga', 'Tennis',
  'Beach Access', 'Ocean View', 'Mountain View', 'City View',
  'Spa Suite', 'Hammam', 'Sauna', 'Hot Tub', 'Library',
];

const BUS_OPERATORS = [
  'RedBus Premium', 'VRL Travels', 'SRS Travels', 'Patel Tours', 'Orange Travels',
  'Sharma Travels', 'IntrCity SmartBus', 'Kallada Travels', 'Paulo Travels',
  'Neeta Tours', 'KSRTC Airavat', 'MSRTC Shivneri', 'Greenline Travels',
  'Raj National Express', 'Royal Travels', 'NueGo Electric', 'Zingbus',
  'YOLO Bus', 'Vega Travels', 'Hans Travels',
];

const BUS_TYPES = [
  { type: 'AC Sleeper',         priceMul: 1.4 },
  { type: 'Sleeper AC',         priceMul: 1.4 },
  { type: 'Volvo Multi-Axle AC',priceMul: 1.6 },
  { type: 'Mercedes Multi-Axle',priceMul: 1.8 },
  { type: 'AC Seater',          priceMul: 1.0 },
  { type: 'Semi-Sleeper AC',    priceMul: 1.2 },
  { type: 'Non-AC Seater',      priceMul: 0.6 },
  { type: 'Electric AC',        priceMul: 1.3 },
];

const BUS_AMENITIES = ['AC', 'Charger', 'Blanket', 'Water Bottle', 'Snacks', 'Wifi', 'Movie', 'GPS', 'CCTV', 'Reading Light'];

const PACKAGE_THEMES = [
  { theme: 'Cultural Immersion',    tag: 'CULTURAL',   inclusionsExtra: ['Local Guide', 'Heritage Walks'] },
  { theme: 'Beach Escape',          tag: 'BEACH',      inclusionsExtra: ['Beachfront Stay', 'Snorkelling'] },
  { theme: 'Wellness Retreat',      tag: 'WELLNESS',   inclusionsExtra: ['Daily Yoga', 'Spa Treatments'] },
  { theme: 'Adventure Trail',       tag: 'ADVENTURE',  inclusionsExtra: ['Trekking Guide', 'Equipment Rental'] },
  { theme: 'Foodie Tour',           tag: 'CULINARY',   inclusionsExtra: ['Cooking Class', 'Market Tour'] },
  { theme: 'Honeymoon Special',     tag: 'ROMANCE',    inclusionsExtra: ['Candlelit Dinner', 'Couple Spa'] },
  { theme: 'Family Adventure',      tag: 'FAMILY',     inclusionsExtra: ['Kids Activities', 'Family Suite'] },
  { theme: 'Solo Backpacker',       tag: 'BUDGET',     inclusionsExtra: ['Hostel Network', 'Local SIM'] },
  { theme: 'Photography Tour',      tag: 'SCENIC',     inclusionsExtra: ['Photo Guide', 'Drone Permits'] },
  { theme: 'Wildlife Safari',       tag: 'WILDLIFE',   inclusionsExtra: ['Game Drives', 'Naturalist'] },
  { theme: 'Luxury Indulgence',     tag: 'LUXURY',     inclusionsExtra: ['Private Transfers', 'Suite Upgrade'] },
  { theme: 'Northern Lights Hunt',  tag: 'SEASONAL',   inclusionsExtra: ['Aurora Tours', 'Glass Igloo'] },
  { theme: 'Snow & Ski',            tag: 'WINTER',     inclusionsExtra: ['Lift Pass', 'Ski Lessons'] },
  { theme: 'Eco Lodge',             tag: 'ECO',        inclusionsExtra: ['Carbon Offset', 'Local Community Visit'] },
  { theme: 'Architecture Trail',    tag: 'DESIGN',     inclusionsExtra: ['Expert Guide', 'Museum Passes'] },
  { theme: 'Wine & Vineyard',       tag: 'GASTRONOMY', inclusionsExtra: ['Vineyard Tours', 'Tastings'] },
];

const PACKAGE_BASE_INCLUSIONS = [
  'Return Flights', 'Airport Transfers', 'Breakfast Daily',
  'Daily Tours', 'Travel Insurance', 'Visa Assistance',
];

const PACKAGE_DURATIONS = [
  { days: 3, mul: 0.40 }, { days: 4, mul: 0.55 }, { days: 5, mul: 0.70 },
  { days: 6, mul: 0.85 }, { days: 7, mul: 1.00 }, { days: 8, mul: 1.15 },
  { days: 9, mul: 1.30 }, { days: 10,mul: 1.45 }, { days: 12,mul: 1.70 },
  { days: 14,mul: 2.00 }, { days: 21,mul: 2.80 },
];

const DEST_TAGS = ['URBAN PULSE', 'WILDERNESS', 'COASTAL', 'CULTURAL', 'EXOTIC', 'HISTORIC', 'TROPICAL', 'NORDIC FROST', 'DESERT', 'HIGH ALTITUDE'];
const DEST_TEMPLATES = [
  d => `${d.city} sits at the intersection of tradition and tomorrow — a place where every street tells a story.`,
  d => `If you've ever wanted to feel small in the best possible way, ${d.city} is where you go.`,
  d => `${d.city} doesn't try to impress you. It just is, and that turns out to be more than enough.`,
  d => `Few cities photograph as well as ${d.city}. Fewer still feel as alive when you put the camera away.`,
  d => `${d.city} runs on a different clock — slower, sharper, and somehow more honest than most.`,
  d => `Locals will tell you ${d.city} hasn't changed in fifty years. They will be lying, beautifully.`,
];

// ── Image helpers ─────────────────────────────────────────────
const img = (id, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80`;

// ── Generators ────────────────────────────────────────────────

export function generateDestinations(seed = 1, count = 180) {
  const rand = rng(seed);
  const out = [];
  for (let i = 0; i < count; i++) {
    const seedCity = CITY_POOL[i % CITY_POOL.length];
    const variant = i >= CITY_POOL.length ? ` ${pick(rand, ['Edit', 'Loop', 'Encore', 'Revisited', 'After Dark', 'Off-Season'])}` : '';
    const tag = pick(rand, DEST_TAGS);
    const price = round(intIn(rand, 18000, 145000), 500);
    const tempC = intIn(rand, -2, 34);
    out.push({
      id: `dest-${pad(i + 1, 4)}`,
      name: seedCity.city + variant,
      country: seedCity.country,
      region: seedCity.region,
      image: img(seedCity.img, 1080),
      tag,
      price,
      temp: `${tempC}°C`,
      bestMonth: pick(rand, ['January','February','March','April','May','June','July','August','September','October','November','December']),
      desc: pick(rand, DEST_TEMPLATES)(seedCity),
      stats: {
        weather: `${tempC}°C avg`,
        avgCost: `₹${price.toLocaleString('en-IN')}`,
        bestSeason: pick(rand, ['Year-round', 'Oct–Mar', 'Mar–May', 'Jun–Sep', 'Nov–Feb']),
        flightTime: `${intIn(rand, 2, 22)}h ${intIn(rand, 0, 55)}m`,
        timezone: pick(rand, ['GMT +0', 'GMT +1', 'GMT +3', 'GMT +5:30', 'GMT +7', 'GMT +8', 'GMT +9', 'GMT -3', 'GMT -5', 'GMT -8']),
        currency: pick(rand, ['USD $', 'EUR €', 'GBP £', 'JPY ¥', 'INR ₹', 'AUD $', 'CAD $', 'CHF']),
        population: `${(intIn(rand, 1, 250) / 10).toFixed(1)}M`,
        language: pick(rand, ['English', 'Spanish', 'French', 'Mandarin', 'Arabic', 'Portuguese', 'Japanese', 'German', 'Italian']),
      },
      itineraries: [
        {
          id: `dest-${pad(i + 1, 4)}-i1`,
          days: pick(rand, [3, 5, 7, 10]),
          title: pick(rand, ['Highlights Loop', 'Editorial Edit', 'Slow Travel Cut', 'Classic Circuit', 'Off-the-Path']),
          price,
          tag: pick(rand, ['BESTSELLER', 'EDITORIAL', 'BUDGET', 'PREMIUM']),
          highlights: Array.from({ length: 4 }, () => pick(rand, [
            `${seedCity.city} old town walk`,
            `Sunrise at the city's highest viewpoint`,
            `Local market food crawl`,
            `Hidden neighbourhood discovery`,
            `Day trip to nearby village`,
            `Evening rooftop bar`,
            `Boutique shopping circuit`,
            `Live music night`,
            `Heritage building tour`,
            `Coastline drive`,
          ])),
        },
      ],
    });
  }
  return out;
}

export function generateFlights(seed = 2, count = 10000) {
  const rand = rng(seed);
  const out = [];
  for (let i = 0; i < count; i++) {
    const airline = pick(rand, AIRLINES);
    const isDomestic = rand() < 0.40;
    const from = pick(rand, INDIA_HUBS);
    let to;
    if (isDomestic) {
      do { to = pick(rand, INDIA_HUBS); } while (to.code === from.code);
    } else {
      to = pick(rand, CITY_POOL);
    }

    const stopsRoll = rand();
    const stops = stopsRoll < 0.55 ? 'Direct'
      : stopsRoll < 0.85 ? `1 stop · ${pick(rand, ['DXB', 'DOH', 'SIN', 'BKK', 'IST', 'AMS', 'FRA', 'LHR'])}`
      : `2 stops`;

    const durHours = isDomestic
      ? intIn(rand, 1, 4)
      : intIn(rand, 4, 22);
    const durMins = intIn(rand, 0, 55);

    const tierMul = airline.tier === 'budget' ? 0.7 : airline.tier === 'luxury' ? 1.6 : 1.0;
    const stopsMul = stops === 'Direct' ? 1.15 : stops.startsWith('2') ? 0.78 : 0.92;
    const basePrice = isDomestic ? 4500 : 22000;
    const distMul = isDomestic ? 1 : 1 + durHours * 0.18;
    const price = round(basePrice * tierMul * stopsMul * distMul + intIn(rand, -800, 1500), 100);

    const depH = intIn(rand, 0, 23);
    const depM = pick(rand, [0, 15, 30, 45]);
    const arrH = (depH + durHours) % 24;
    const arrM = (depM + durMins) % 60;
    const dayOffset = depH + durHours >= 24 ? '+1' : '';

    const fmt = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    const tagRoll = rand();
    const tag = tagRoll < 0.10 ? 'BEST VALUE'
      : tagRoll < 0.20 ? 'LOWEST PRICE'
      : tagRoll < 0.30 ? 'FASTEST'
      : tagRoll < 0.40 ? airline.tag
      : tagRoll < 0.55 ? 'POPULAR'
      : tagRoll < 0.65 ? 'RECOMMENDED'
      : '';

    out.push({
      id: `F-G-${pad(i + 1, 5)}`,
      airline: airline.name,
      code: `${airline.code}-${intIn(rand, 100, 9999)}`,
      from: from.code,
      fromCity: from.city,
      to: to.code,
      toCity: to.city,
      dep: fmt(depH, depM),
      arr: `${fmt(arrH, arrM)}${dayOffset}`,
      duration: `${durHours}h ${String(durMins).padStart(2, '0')}m`,
      stops,
      price,
      seatsLeft: intIn(rand, 1, 60),
      class: pick(rand, ['Economy', 'Economy', 'Economy', 'Premium Economy', 'Business', 'First']),
      tag,
    });
  }
  return out;
}

export function generateHotels(seed = 3, count = 10000) {
  const rand = rng(seed);
  const out = [];
  for (let i = 0; i < count; i++) {
    const city = pick(rand, CITY_POOL);
    const brand = pick(rand, HOTEL_BRANDS);
    const stars = brand.tier;
    const rating = (3.8 + rand() * 1.2).toFixed(1);
    const reviews = intIn(rand, 80, 9800);
    const tierBase = stars >= 5 ? 18000 : stars === 4 ? 8500 : 4500;
    const cityMul = ['Maldives', 'Switzerland', 'Iceland', 'Norway', 'Japan', 'UAE'].includes(city.country) ? 1.4
      : ['Vietnam', 'Cambodia', 'India', 'Indonesia', 'Egypt'].includes(city.country) ? 0.65
      : 1.0;
    const pricePerNight = round(tierBase * cityMul + intIn(rand, -1500, 4500), 100);

    const amenityCount = stars >= 5 ? intIn(rand, 6, 9) : stars === 4 ? intIn(rand, 4, 6) : intIn(rand, 2, 4);
    const amenities = [];
    while (amenities.length < amenityCount) {
      const a = pick(rand, HOTEL_AMENITIES);
      if (!amenities.includes(a)) amenities.push(a);
    }

    const suffix = pick(rand, ['', ` ${city.city}`, ` ${city.city} Downtown`, ` ${city.city} Resort & Spa`, ` ${city.city} Marina`, ` ${city.city} Old Town`, ` ${city.city} Garden`, ` ${city.city} Bay`]);
    out.push({
      id: `H-G-${pad(i + 1, 5)}`,
      name: `${brand.brand}${suffix}`,
      city: city.city,
      country: city.country,
      stars,
      rating: Number(rating),
      reviews,
      pricePerNight,
      image: img(city.img, 800),
      amenities,
      tag: brand.tag,
      checkIn: pick(rand, ['14:00', '15:00', '16:00']),
      checkOut: pick(rand, ['11:00', '12:00']),
      desc: `${brand.brand} brings its signature ${brand.tag.toLowerCase()} hospitality to ${city.city}, blending local craft with the chain's polish.`,
    });
  }
  return out;
}

export function generateBuses(seed = 4, count = 10000) {
  const rand = rng(seed);
  const out = [];
  for (let i = 0; i < count; i++) {
    const op = pick(rand, BUS_OPERATORS);
    const fromHub = pick(rand, INDIA_HUBS);
    let toHub;
    do { toHub = pick(rand, INDIA_HUBS); } while (toHub.code === fromHub.code);

    const t = pick(rand, BUS_TYPES);
    const baseHours = intIn(rand, 3, 16);
    const baseMins = pick(rand, [0, 15, 30, 45]);
    const basePrice = 60 * baseHours + 80;
    const price = round(basePrice * t.priceMul + intIn(rand, -50, 250), 10);

    const depH = intIn(rand, 0, 23);
    const depM = pick(rand, [0, 15, 30, 45]);
    const arrH = (depH + baseHours) % 24;
    const arrM = (depM + baseMins) % 60;
    const dayOffset = depH + baseHours >= 24 ? '+1' : '';
    const fmt = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    const amenCount = t.type.includes('Sleeper') ? intIn(rand, 4, 6) : intIn(rand, 2, 4);
    const amenities = [];
    while (amenities.length < amenCount) {
      const a = pick(rand, BUS_AMENITIES);
      if (!amenities.includes(a)) amenities.push(a);
    }

    out.push({
      id: `B-G-${pad(i + 1, 5)}`,
      operator: op,
      from: fromHub.city,
      to: toHub.city,
      dep: fmt(depH, depM),
      arr: `${fmt(arrH, arrM)}${dayOffset}`,
      duration: `${baseHours}h ${String(baseMins).padStart(2, '0')}m`,
      price,
      type: t.type,
      seatsLeft: intIn(rand, 1, 45),
      rating: Number((3.6 + rand() * 1.3).toFixed(1)),
      amenities,
    });
  }
  return out;
}

export function generatePackages(seed = 5, count = 10000) {
  const rand = rng(seed);
  const out = [];
  for (let i = 0; i < count; i++) {
    const city = pick(rand, CITY_POOL);
    const theme = pick(rand, PACKAGE_THEMES);
    const dur = pick(rand, PACKAGE_DURATIONS);

    const baseByCountry = ['Maldives', 'Switzerland', 'Iceland', 'Norway', 'Japan'].includes(city.country) ? 110000
      : ['Vietnam', 'Cambodia', 'India', 'Indonesia', 'Sri Lanka', 'Nepal', 'Egypt'].includes(city.country) ? 28000
      : 65000;

    const themeMul = theme.tag === 'LUXURY' ? 1.5 : theme.tag === 'BUDGET' ? 0.7 : 1.0;
    const price = round(baseByCountry * dur.mul * themeMul + intIn(rand, -3500, 6500), 500);
    const rating = Number((4.2 + rand() * 0.8).toFixed(1));
    const reviews = intIn(rand, 35, 850);

    const inclusions = [...PACKAGE_BASE_INCLUSIONS.slice(0, intIn(rand, 3, 5)), ...theme.inclusionsExtra];

    const titlePrefix = pick(rand, [
      `${dur.days}-Day`, `Classic`, `Editorial`, `Hidden`, `Signature`, `Untold`,
      `Boutique`, `Premium`, `Curated`, `Express`, `Extended`,
    ]);
    out.push({
      id: `PKG-G-${pad(i + 1, 5)}`,
      title: `${titlePrefix} ${city.city} ${theme.theme}`,
      destination: city.country,
      city: city.city,
      image: img(city.img, 800),
      duration: `${dur.days} days`,
      price,
      tag: theme.tag,
      rating,
      reviews,
      inclusions,
      desc: `${dur.days} days through ${city.city}, ${city.country} — designed around ${theme.theme.toLowerCase()}. ${theme.inclusionsExtra.join(' and ')} included.`,
    });
  }
  return out;
}

export function generateDeals(seed = 6, count = 100, sourcePackages = []) {
  const rand = rng(seed);
  const tags = ['FLASH', 'LIMITED', 'WEEKEND', 'SEASONAL', 'EARLY BIRD', 'LAST MINUTE'];
  const out = [];
  for (let i = 0; i < count; i++) {
    const pkg = sourcePackages.length
      ? sourcePackages[Math.floor(rand() * sourcePackages.length)]
      : null;
    const city = pkg ? { city: pkg.city || pkg.destination, country: pkg.destination, img: pkg.image?.match(/photo-[\w-]+/)?.[0] || 'photo-1469854523086-cc02fe5d8800' } : pick(rand, CITY_POOL);
    const original = pkg ? pkg.price : intIn(rand, 30000, 160000);
    const discount = intIn(rand, 12, 42);
    const discounted = round(original * (100 - discount) / 100, 100);
    out.push({
      id: `DG-${pad(i + 1, 4)}`,
      destId: city.city.toLowerCase().replace(/\s+/g, '-'),
      destName: city.city,
      image: typeof city.img === 'string' && city.img.startsWith('http') ? city.img : img(city.img || 'photo-1469854523086-cc02fe5d8800', 800),
      originalPrice: original,
      discountedPrice: discounted,
      discount,
      tag: pick(rand, tags),
      seatsLeft: intIn(rand, 1, 18),
      expiresIn: intIn(rand, 1 * 3600, 72 * 3600),
      desc: pkg ? pkg.title : `${city.city} curated escape with hand-picked stays`,
    });
  }
  return out;
}

export function generateAirports() {
  // Real IATA codes for every city in the pool, plus India hubs
  const seen = new Set();
  const out = [];
  for (const c of CITY_POOL) {
    if (seen.has(c.code)) continue;
    seen.add(c.code);
    out.push({
      code: c.code,
      city: c.city,
      country: c.country,
      name: `${c.city} International Airport`,
    });
  }
  for (const h of INDIA_HUBS) {
    if (seen.has(h.code)) continue;
    seen.add(h.code);
    out.push({
      code: h.code,
      city: h.city,
      country: 'India',
      name: `${h.city} International Airport`,
    });
  }
  return out;
}
