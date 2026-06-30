const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { DATA_DIR, writeJSON } = require('./fileStore');

const FORCE = process.argv.includes('--force');

function fileExists(filename) {
  return fs.existsSync(path.join(DATA_DIR, filename));
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

async function buildAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@avikeshrealty.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);
  return { email, passwordHash, name: 'Admin', _plainPassword: password };
}

const SETTINGS = {
  siteName: 'Avikesh Realty',
  logo: { primaryText: 'AVIKESH', accentText: 'REALTY', imageUrl: '' },
  whatsappNumber: '919876543210',
  contact: {
    phone: '+91 98765 43210',
    email: 'info@avikeshrealty.com',
    address: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033, India',
    workingHours: 'Mon - Sat: 10:00 AM - 7:00 PM',
  },
  social: {
    instagram: 'https://instagram.com/avikeshrealty',
    facebook: 'https://facebook.com/avikeshrealty',
    linkedin: 'https://linkedin.com/company/avikeshrealty',
    youtube: 'https://youtube.com/@avikeshrealty',
  },
  hero: {
    headlineLine1: 'Where Luxury Meets',
    headlineLine2: 'Opportunity',
    subtitle:
      'Discover premium villas, apartments and investment properties across Hyderabad.',
    backgroundImage:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
  },
  about: {
    storyHeading: 'Our Story',
    storyParagraph:
      "For over 15 years, Avikesh Realty has been redefining luxury living in Hyderabad. We don't just sell properties — we craft lifestyles, build legacies, and create investment opportunities that stand the test of time.",
    legacyHeading: 'A Legacy of Excellence',
    legacyParagraphs: [
      'Founded with a vision to transform the real estate landscape in Hyderabad, Avikesh Realty has grown from a small consultancy to a premium real estate powerhouse.',
      'Our portfolio spans luxury villas, premium apartments, strategic commercial spaces, and high-value investment plots — each handpicked for quality, location, and appreciation potential.',
      'With over ₹2000 Crores in successful transactions and 1000+ satisfied clients, our track record speaks for itself.',
    ],
  },
  stats: {
    yearsExperience: 15,
    propertiesSold: 500,
    happyClients: 1000,
    investmentPortfolioCr: 2000,
  },
  footer: {
    description:
      'Redefining luxury living in Hyderabad. We curate exceptional properties for discerning individuals who demand nothing but the finest.',
  },
};

function buildProperties() {
  const defs = [
    {
      title: 'Royal Palm Villa',
      slug: 'royal-palm-villa',
      description:
        'An exquisite villa that blends traditional architecture with modern luxury. Sprawling lawns, private pool, and handcrafted interiors make this a masterpiece of elegant living.',
      price: '8.5 Cr',
      priceNumeric: 85000000,
      location: 'Banjara Hills, Hyderabad',
      propertyType: 'Villa',
      bedrooms: 5,
      bathrooms: 6,
      area: '8,500 sq ft',
      amenities: ['Private Pool', 'Home Theater', 'Wine Cellar', 'Smart Home', 'Landscaped Garden', 'Staff Quarters'],
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80',
      ],
      featured: true,
      status: 'Available',
      daysOld: 2,
    },
    {
      title: 'Skyline Penthouse',
      slug: 'skyline-penthouse',
      description:
        'A breathtaking penthouse offering 360-degree city views with floor-to-ceiling windows. Features a private terrace, infinity pool, and the finest Italian marble throughout.',
      price: '12 Cr',
      priceNumeric: 120000000,
      location: 'Jubilee Hills, Hyderabad',
      propertyType: 'Luxury',
      bedrooms: 4,
      bathrooms: 5,
      area: '6,200 sq ft',
      amenities: ['Infinity Pool', 'Private Elevator', 'Rooftop Terrace', 'Concierge Service', 'Panoramic Views', 'Italian Marble'],
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
      ],
      featured: true,
      status: 'Available',
      daysOld: 4,
    },
    {
      title: 'Emerald Bay Apartment',
      slug: 'emerald-bay-apartment',
      description:
        'Premium waterfront apartment with stunning lake views. Contemporary design with premium finishes, smart home automation, and access to world-class amenities.',
      price: '3.2 Cr',
      priceNumeric: 32000000,
      location: 'Gachibowli, Hyderabad',
      propertyType: 'Apartment',
      bedrooms: 3,
      bathrooms: 3,
      area: '2,800 sq ft',
      amenities: ['Lake View', 'Clubhouse', 'Swimming Pool', 'Gym', 'Children Play Area', 'Smart Home'],
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
      ],
      featured: true,
      status: 'Available',
      daysOld: 6,
    },
    {
      title: 'The Grand Manor',
      slug: 'the-grand-manor',
      description:
        'A palatial estate set on two acres of manicured grounds. This grand manor features a ballroom, library, wine cellar, and separate guest house.',
      price: '25 Cr',
      priceNumeric: 250000000,
      location: 'Jubilee Hills, Hyderabad',
      propertyType: 'Villa',
      bedrooms: 7,
      bathrooms: 8,
      area: '15,000 sq ft',
      amenities: ['Ballroom', 'Library', 'Wine Cellar', 'Guest House', 'Tennis Court', 'Helipad'],
      images: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      ],
      featured: true,
      status: 'Available',
      daysOld: 8,
    },
    {
      title: 'Azure Tower Residences',
      slug: 'azure-tower-residences',
      description:
        'Ultra-luxury high-rise living with dedicated floor for each residence. Features private lift lobby, panoramic views, and access to sky lounge and infinity pool.',
      price: '5.8 Cr',
      priceNumeric: 58000000,
      location: 'Hitech City, Hyderabad',
      propertyType: 'Apartment',
      bedrooms: 4,
      bathrooms: 4,
      area: '4,500 sq ft',
      amenities: ['Sky Lounge', 'Private Lift', 'Infinity Pool', 'Business Center', 'Spa', 'Valet Parking'],
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80',
      ],
      featured: false,
      status: 'Available',
      daysOld: 10,
    },
    {
      title: 'Orchid Business Park',
      slug: 'orchid-business-park',
      description:
        'Premium Grade A commercial space in the heart of the IT corridor. Modern architecture, excellent connectivity, and top-tier infrastructure for forward-thinking businesses.',
      price: '15 Cr',
      priceNumeric: 150000000,
      location: 'Financial District, Hyderabad',
      propertyType: 'Commercial',
      bedrooms: 0,
      bathrooms: 4,
      area: '12,000 sq ft',
      amenities: ['Conference Hall', 'Parking', 'Power Backup', 'Security', 'Cafeteria', 'High Speed Internet'],
      images: [
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
      ],
      featured: false,
      status: 'Available',
      daysOld: 12,
    },
    {
      title: 'Sunrise Valley Plot',
      slug: 'sunrise-valley-plot',
      description:
        'Premium gated community plot in a rapidly developing area. Perfect for building your dream home with excellent appreciation potential and all utilities connected.',
      price: '1.8 Cr',
      priceNumeric: 18000000,
      location: 'Shamshabad, Hyderabad',
      propertyType: 'Plot',
      bedrooms: 0,
      bathrooms: 0,
      area: '500 sq yards',
      amenities: ['Gated Community', 'Park', 'Club House', 'Road Access', 'Water Supply', 'Electricity'],
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
        'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=1200&q=80',
      ],
      featured: false,
      status: 'Available',
      daysOld: 14,
    },
    {
      title: 'Lotus Residency',
      slug: 'lotus-residency',
      description:
        'Upcoming ultra-luxury residential project with world-class amenities. Early bird pricing available for discerning buyers looking for an exceptional living experience.',
      price: '4.5 Cr',
      priceNumeric: 45000000,
      location: 'Kokapet, Hyderabad',
      propertyType: 'Apartment',
      bedrooms: 3,
      bathrooms: 4,
      area: '3,200 sq ft',
      amenities: ['Olympic Pool', 'Golf Simulator', 'Yoga Studio', 'Party Hall', 'Jogging Track', 'EV Charging'],
      images: [
        'https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=1200&q=80',
        'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1200&q=80',
      ],
      featured: false,
      status: 'Upcoming',
      daysOld: 16,
    },
  ];

  return defs.map((def) => {
    const { daysOld, ...rest } = def;
    return {
      videos: [],
      brochureUrl: '',
      ...rest,
      _id: randomUUID(),
      createdAt: daysAgo(daysOld),
    };
  });
}

function buildTestimonials() {
  const defs = [
    {
      name: 'Rajesh Sharma',
      role: 'Business Owner',
      content:
        'Avikesh Realty made our dream of owning a luxury villa a reality. Their attention to detail and personalized service was beyond expectations. Highly recommend them for anyone looking for premium properties.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
      featured: true,
      daysOld: 3,
    },
    {
      name: 'Priya Menon',
      role: 'IT Professional',
      content:
        'The team at Avikesh Realty truly understands luxury living. They helped us find the perfect penthouse with stunning views. The entire process was seamless and professional.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
      featured: true,
      daysOld: 5,
    },
    {
      name: 'Vikram Reddy',
      role: 'Real Estate Investor',
      content:
        'As an investor, I appreciate their market knowledge and transparency. Every property they recommended has given excellent returns. They are my go-to advisors for luxury real estate.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80',
      featured: true,
      daysOld: 7,
    },
    {
      name: 'Anitha Krishnan',
      role: 'Doctor',
      content:
        'From the first consultation to handing over the keys, Avikesh Realty provided exceptional service. They understood our requirements perfectly and found us our dream home in Jubilee Hills.',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80',
      featured: true,
      daysOld: 9,
    },
    {
      name: 'Suresh Patel',
      role: 'NRI Investor',
      content:
        'Being based abroad, I needed a trustworthy partner for my real estate investments in Hyderabad. Avikesh Realty handled everything professionally and kept me updated at every step.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80',
      featured: true,
      daysOld: 11,
    },
    {
      name: 'Lakshmi Narayanan',
      role: 'Entrepreneur',
      content:
        'Exceptional service from start to finish. The team went above and beyond to find a commercial space that perfectly matched our business needs and growth plans.',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
      featured: true,
      daysOld: 13,
    },
  ];

  return defs.map((def) => {
    const { daysOld, ...rest } = def;
    return {
      ...rest,
      _id: randomUUID(),
      createdAt: daysAgo(daysOld),
    };
  });
}

function buildTeam() {
  const defs = [
    {
      name: 'Avikesh Kumar',
      role: 'Founder & CEO',
      bio: 'With over 15 years of experience in luxury real estate, Avikesh founded the company with a vision to redefine premium living in Hyderabad.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
      order: 0,
      social: {
        instagram: 'https://instagram.com/avikeshrealty',
        linkedin: 'https://linkedin.com/in/avikeshkumar',
        twitter: 'https://twitter.com/avikeshrealty',
      },
    },
    {
      name: 'Meera Reddy',
      role: 'Sales Director',
      bio: 'Meera brings a decade of expertise in high-value property transactions and client relationship management to the team.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
      order: 1,
      social: {
        instagram: '',
        linkedin: 'https://linkedin.com/in/meerareddy',
        twitter: '',
      },
    },
    {
      name: 'Arjun Rao',
      role: 'Investment Advisor',
      bio: 'Arjun specializes in identifying premium investment opportunities and providing personalized property recommendations to clients.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      order: 2,
      social: {
        instagram: 'https://instagram.com/arjunrao',
        linkedin: 'https://linkedin.com/in/arjunrao',
        twitter: '',
      },
    },
    {
      name: 'Deepika Sharma',
      role: 'Marketing Head',
      bio: 'Deepika leads our marketing strategy with innovative campaigns that showcase the finest luxury properties in our portfolio.',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
      order: 3,
      social: {
        instagram: '',
        linkedin: 'https://linkedin.com/in/deepikasharma',
        twitter: 'https://twitter.com/deepikasharma',
      },
    },
  ];

  return defs.map((def, i) => ({
    ...def,
    _id: randomUUID(),
    createdAt: daysAgo(20 - i),
  }));
}

async function seed() {
  console.log(`Seeding data (${FORCE ? 'force overwrite' : 'create-if-missing'})...`);
  fs.mkdirSync(DATA_DIR, { recursive: true });

  const summary = [];

  // admin.json
  let adminEmail;
  let adminPassword;
  if (FORCE || !fileExists('admin.json')) {
    const admin = await buildAdmin();
    adminEmail = admin.email;
    adminPassword = admin._plainPassword;
    delete admin._plainPassword;
    writeJSON('admin.json', admin);
    summary.push('admin.json: created');
  } else {
    summary.push('admin.json: skipped (already exists)');
    adminEmail = process.env.ADMIN_EMAIL || 'admin@avikeshrealty.com';
    adminPassword = '(unchanged — existing file kept)';
  }

  // settings.json
  if (FORCE || !fileExists('settings.json')) {
    writeJSON('settings.json', SETTINGS);
    summary.push('settings.json: created');
  } else {
    summary.push('settings.json: skipped (already exists)');
  }

  // properties.json
  if (FORCE || !fileExists('properties.json')) {
    const properties = buildProperties();
    writeJSON('properties.json', properties);
    summary.push(`properties.json: created (${properties.length} properties)`);
  } else {
    summary.push('properties.json: skipped (already exists)');
  }

  // testimonials.json
  if (FORCE || !fileExists('testimonials.json')) {
    const testimonials = buildTestimonials();
    writeJSON('testimonials.json', testimonials);
    summary.push(`testimonials.json: created (${testimonials.length} testimonials)`);
  } else {
    summary.push('testimonials.json: skipped (already exists)');
  }

  // team.json
  if (FORCE || !fileExists('team.json')) {
    const team = buildTeam();
    writeJSON('team.json', team);
    summary.push(`team.json: created (${team.length} team members)`);
  } else {
    summary.push('team.json: skipped (already exists)');
  }

  console.log('\nSeed summary:');
  summary.forEach((line) => console.log(`  - ${line}`));
  console.log('\nAdmin login credentials:');
  console.log(`  email:    ${adminEmail}`);
  console.log(`  password: ${adminPassword}`);
  console.log('\nDone.');
}

seed().catch((error) => {
  console.error('Seed error:', error);
  process.exit(1);
});
