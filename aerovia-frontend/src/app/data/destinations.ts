export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  image: string;
  tag: string;
  price: number;
  temp: string;
  bestMonth: string;
  desc: string;
  stats: {
    weather: string;
    avgCost: string;
    bestSeason: string;
    flightTime: string;
    timezone: string;
    currency: string;
    population: string;
    language: string;
  };
  itineraries: Array<{
    id: string;
    days: number;
    title: string;
    price: number;
    tag: string;
    highlights: string[];
  }>;
}

export const destinations: Destination[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'East Asia',
    image: 'https://images.unsplash.com/photo-1665712638676-ff7045551805?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb2t5byUyMG5pZ2h0JTIwbmVvbiUyMHJhaW4lMjBjaW5lbWF0aWMlMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzc2OTUwNjA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tag: 'URBAN PULSE',
    price: 58000,
    temp: '12°C',
    bestMonth: 'March',
    desc: 'A city that moves at 500km/h and stands perfectly still at the same time. Tokyo exists in plural.',
    stats: {
      weather: '12°C avg',
      avgCost: '₹58,000',
      bestSeason: 'Mar – May',
      flightTime: '7h 40m',
      timezone: 'JST +9',
      currency: 'JPY ¥',
      population: '13.9M',
      language: 'Japanese',
    },
    itineraries: [
      {
        id: 't1', days: 5, title: 'Electric Immersion', price: 58000, tag: 'BESTSELLER',
        highlights: ['Shibuya Crossing at midnight', 'Tsukiji outer market at dawn', 'Shinjuku izakaya crawl', 'TeamLab Borderless', 'Yanaka old town walk'],
      },
      {
        id: 't2', days: 8, title: 'Deep Tokyo', price: 84000, tag: 'EDITORIAL',
        highlights: ['Harajuku subculture tour', 'Sumo morning practice', 'Kaiseki dinner, Ginza', 'Mt. Fuji day trip', 'Akihabara night', 'Meiji Shrine at 6AM', 'Capsule hotel experience'],
      },
      {
        id: 't3', days: 3, title: 'Flash Visit', price: 38000, tag: 'MINIMAL',
        highlights: ['Top 5 ramen stops', 'Asakusa temple district', 'Odaiba skyline sunset'],
      },
    ],
  },
  {
    id: 'patagonia',
    name: 'Patagonia',
    country: 'Argentina',
    region: 'South America',
    image: 'https://images.unsplash.com/photo-1692176048203-9125b4808282?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYXRhZ29uaWElMjBUb3JyZXMlMjBQYWluZSUyMGRyYW1hdGljJTIwcGVha3MlMjBmb2d8ZW58MXx8fHwxNzc2OTUwNjA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tag: 'WILDERNESS',
    price: 72000,
    temp: '8°C',
    bestMonth: 'November',
    desc: 'The edge of the world. Granite towers pierce clouds. Glaciers calve into the sea. This is what silence sounds like.',
    stats: {
      weather: '8°C avg',
      avgCost: '₹72,000',
      bestSeason: 'Nov – Feb',
      flightTime: '22h 30m',
      timezone: 'ART -3',
      currency: 'ARS $',
      population: '0.2M',
      language: 'Spanish',
    },
    itineraries: [
      {
        id: 'p1', days: 7, title: 'Torres del Paine Circuit', price: 72000, tag: 'ADVENTURE',
        highlights: ['W-Trek base camp', 'Grey Glacier kayak', 'Mirador Los Torres at sunrise', 'Gaucho asado night', 'Condor watching ridge', 'Valle del Francés', 'Puerto Natales town'],
      },
      {
        id: 'p2', days: 10, title: 'End of the World', price: 96000, tag: 'DEEP WILD',
        highlights: ['Los Glaciares NP', 'Perito Moreno calving wall', 'Fitz Roy range hike', 'El Chaltén base camp', 'Estancia stay', 'Ushuaia glacier', 'Beagle Channel navigation'],
      },
    ],
  },
  {
    id: 'iceland',
    name: 'Iceland',
    country: 'Iceland',
    region: 'Nordic',
    image: 'https://images.unsplash.com/photo-1769670172608-f741dd969509?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJY2VsYW5kJTIwdm9sY2FuaWMlMjBkYXJrJTIwbW9vZHklMjBkcmFtYXRpYyUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzY5NTA2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    tag: 'OTHERWORLDLY',
    price: 88000,
    temp: '2°C',
    bestMonth: 'February',
    desc: 'Volcanic silence. Aurora above. Steam rising from rifts in the earth. Iceland makes you feel like a visitor on your own planet.',
    stats: {
      weather: '2°C avg',
      avgCost: '₹88,000',
      bestSeason: 'Sep – Feb',
      flightTime: '9h 15m',
      timezone: 'GMT +0',
      currency: 'ISK kr',
      population: '0.37M',
      language: 'Icelandic',
    },
    itineraries: [
      {
        id: 'i1', days: 6, title: 'Ring Road North', price: 88000, tag: 'ICONIC',
        highlights: ['Reykjavik design district', 'Blue Lagoon geothermal', 'Golden Circle route', 'Black sand beach, Vík', 'Aurora hunting night', 'Glacier walk, Vatnajökull'],
      },
    ],
  },
  {
    id: 'morocco',
    name: 'Morocco',
    country: 'Morocco',
    region: 'North Africa',
    image: 'https://images.unsplash.com/photo-1548364504-57247d6f96bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NvJTIwU2FoYXJhJTIwZGVzZXJ0JTIwZHVuZXMlMjBnb2xkZW4lMjBob3VyfGVufDF8fHx8MTc3Njk1MDYwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    tag: 'SENSORY',
    price: 28000,
    temp: '22°C',
    bestMonth: 'October',
    desc: 'Medina labyrinths. Saharan dunes at 5AM. The smell of cumin and cedar. Morocco is not a place — it is a frequency.',
    stats: {
      weather: '22°C avg',
      avgCost: '₹28,000',
      bestSeason: 'Oct – Apr',
      flightTime: '8h 20m',
      timezone: 'WET +1',
      currency: 'MAD د.م.',
      population: '37M',
      language: 'Arabic / French',
    },
    itineraries: [
      {
        id: 'm1', days: 7, title: 'Imperial Cities', price: 28000, tag: 'CULTURAL',
        highlights: ['Marrakech medina maze', 'Fes tanneries at dawn', 'Chefchaouen blue alleys', 'Sahara overnight camp', 'Atlas Mountain trek', 'Riad cooking class', 'Djemaa el-Fna night'],
      },
    ],
  },
  {
    id: 'maldives',
    name: 'Maldives',
    country: 'Maldives',
    region: 'Indian Ocean',
    image: 'https://images.unsplash.com/photo-1575231902188-93d58962d791?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxkaXZlcyUyMGFlcmlhbCUyMHZpZXclMjB0dXJxdW9pc2UlMjBvY2VhbiUyMGJ1bmdhbG93fGVufDF8fHx8MTc3Njk1MDYwNnww&ixlib=rb-4.1.0&q=80&w=1080',
    tag: 'ISOLATION',
    price: 95000,
    temp: '30°C',
    bestMonth: 'January',
    desc: 'Bioluminescent shores. Coral architecture beneath. The horizon is 360°. Some places earn their clichés.',
    stats: {
      weather: '30°C avg',
      avgCost: '₹95,000',
      bestSeason: 'Dec – Apr',
      flightTime: '4h 30m',
      timezone: 'MVT +5',
      currency: 'MVR Rf',
      population: '0.52M',
      language: 'Dhivehi',
    },
    itineraries: [
      {
        id: 'mv1', days: 5, title: 'Overwater Edit', price: 95000, tag: 'LUXURY',
        highlights: ['Private overwater villa', 'Dawn snorkel with rays', 'Underwater dining', 'Sunset dolphin cruise', 'Night bioluminescence walk'],
      },
    ],
  },
  {
    id: 'norway',
    name: 'Norway',
    country: 'Norway',
    region: 'Nordic',
    image: 'https://images.unsplash.com/photo-1695366804273-2c8da6f96ce0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOb3J3YXklMjBmam9yZHMlMjBkYXJrJTIwZHJhbWF0aWMlMjBhdG1vc3BoZXJpY3xlbnwxfHx8fDE3NzY5NTA2MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    tag: 'DEPTH',
    price: 82000,
    temp: '5°C',
    bestMonth: 'June',
    desc: 'Water so deep it has its own colour. Fjords that make photographers cry. Silence with a mountain echo.',
    stats: {
      weather: '5°C avg',
      avgCost: '₹82,000',
      bestSeason: 'Jun – Aug',
      flightTime: '11h 50m',
      timezone: 'CET +1',
      currency: 'NOK kr',
      population: '5.4M',
      language: 'Norwegian',
    },
    itineraries: [
      {
        id: 'n1', days: 7, title: 'Fjord Deep Dive', price: 82000, tag: 'SCENIC',
        highlights: ['Bergen fish market', 'Flam railway ascent', 'Nærøyfjord kayak', 'Preikestolen cliff hike', 'Trolltunga ledge', 'Midnight sun kayak', 'Hardangerfjord orchard'],
      },
    ],
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    region: 'East Asia',
    image: 'https://images.unsplash.com/photo-1768947814430-ec307db34952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLeW90byUyMEphcGFuJTIwYmFtYm9vJTIwZm9yZXN0JTIwbWlzdHl8ZW58MXx8fHwxNzc2OTUwNjA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tag: 'RITUAL',
    price: 62000,
    temp: '15°C',
    bestMonth: 'April',
    desc: 'Ancient ritual lives beside the contemporary. Geiko in back streets. Bamboo light filtering through silence.',
    stats: {
      weather: '15°C avg',
      avgCost: '₹62,000',
      bestSeason: 'Apr / Nov',
      flightTime: '7h 40m',
      timezone: 'JST +9',
      currency: 'JPY ¥',
      population: '1.5M',
      language: 'Japanese',
    },
    itineraries: [
      {
        id: 'ky1', days: 5, title: 'Sacred Kyoto', price: 62000, tag: 'CULTURAL',
        highlights: ['Fushimi Inari at 5AM', 'Arashiyama bamboo grove', 'Philosopher\'s Path walk', 'Gion district twilight', 'Tea ceremony, Uji'],
      },
    ],
  },
  {
    id: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    region: 'Southern Europe',
    image: 'https://images.unsplash.com/photo-1681995585128-9c9bc14c2dd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMaXNib24lMjBQb3J0dWdhbCUyMGNvbG9yZnVsJTIwZWRpdG9yaWFsJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3Njk1MDYwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    tag: 'GOLDEN HOUR',
    price: 42000,
    temp: '18°C',
    bestMonth: 'May',
    desc: 'Seven hills, one light. The kind of city that makes you cancel your return ticket.',
    stats: {
      weather: '18°C avg',
      avgCost: '₹42,000',
      bestSeason: 'May – Oct',
      flightTime: '11h 30m',
      timezone: 'WET +1',
      currency: 'EUR €',
      population: '2.9M',
      language: 'Portuguese',
    },
    itineraries: [
      {
        id: 'l1', days: 5, title: 'Tejo Edit', price: 42000, tag: 'URBAN',
        highlights: ['Alfama morning fado', 'LX Factory Sunday market', 'Belém pastéis at 8AM', 'Sintra palace circuit', 'Cascais coastal walk'],
      },
    ],
  },
];

export const getDestination = (id: string) => destinations.find(d => d.id === id);
