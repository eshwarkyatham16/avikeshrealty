const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Property = require('../models/Property');
const Testimonial = require('../models/Testimonial');
const TeamMember = require('../models/TeamMember');
const Lead = require('../models/Lead');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Property.deleteMany(),
      Testimonial.deleteMany(),
      TeamMember.deleteMany(),
      Lead.deleteMany(),
    ]);
    console.log('Existing data cleared.');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@avikeshrealty.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`Admin user created: ${admin.email}`);

    // Create sample properties
    const properties = await Property.create([
      {
        title: 'Royal Heritage Villa',
        description:
          'An exquisite villa that blends traditional Rajasthani architecture with modern luxury. Sprawling lawns, private pool, and handcrafted interiors make this a masterpiece of elegant living.',
        price: '8.5 Cr',
        priceNumeric: 85000000,
        location: 'Banjara Hills, Hyderabad',
        propertyType: 'Villa',
        bedrooms: 5,
        bathrooms: 6,
        area: '8,500 sq ft',
        amenities: [
          'Private Pool',
          'Home Theater',
          'Wine Cellar',
          'Smart Home',
          'Landscaped Garden',
          'Staff Quarters',
        ],
        images: [],
        featured: true,
        status: 'Available',
      },
      {
        title: 'Skyline Penthouse',
        description:
          'A breathtaking penthouse offering 360-degree city views with floor-to-ceiling windows. Features a private terrace, infinity pool, and the finest Italian marble throughout.',
        price: '12 Cr',
        priceNumeric: 120000000,
        location: 'Jubilee Hills, Hyderabad',
        propertyType: 'Luxury',
        bedrooms: 4,
        bathrooms: 5,
        area: '6,200 sq ft',
        amenities: [
          'Infinity Pool',
          'Private Elevator',
          'Rooftop Terrace',
          'Concierge Service',
          'Panoramic Views',
          'Italian Marble',
        ],
        images: [],
        featured: true,
        status: 'Available',
      },
      {
        title: 'Emerald Bay Apartment',
        description:
          'Premium waterfront apartment with stunning lake views. Contemporary design with premium finishes, smart home automation, and access to world-class amenities.',
        price: '3.2 Cr',
        priceNumeric: 32000000,
        location: 'Gachibowli, Hyderabad',
        propertyType: 'Apartment',
        bedrooms: 3,
        bathrooms: 3,
        area: '2,800 sq ft',
        amenities: [
          'Lake View',
          'Clubhouse',
          'Swimming Pool',
          'Gym',
          'Children Play Area',
          'Smart Home',
        ],
        images: [],
        featured: true,
        status: 'Available',
      },
      {
        title: 'The Grand Manor',
        description:
          'A palatial estate set on two acres of manicured grounds. This grand manor features a ballroom, library, wine cellar, and separate guest house.',
        price: '25 Cr',
        priceNumeric: 250000000,
        location: 'Jubilee Hills, Hyderabad',
        propertyType: 'Villa',
        bedrooms: 7,
        bathrooms: 8,
        area: '15,000 sq ft',
        amenities: [
          'Ballroom',
          'Library',
          'Wine Cellar',
          'Guest House',
          'Tennis Court',
          'Helipad',
        ],
        images: [],
        featured: true,
        status: 'Available',
      },
      {
        title: 'Azure Tower Residences',
        description:
          'Ultra-luxury high-rise living with dedicated floor for each residence. Features private lift lobby, panoramic views, and access to sky lounge and infinity pool.',
        price: '5.8 Cr',
        priceNumeric: 58000000,
        location: 'Hitech City, Hyderabad',
        propertyType: 'Apartment',
        bedrooms: 4,
        bathrooms: 4,
        area: '4,500 sq ft',
        amenities: [
          'Sky Lounge',
          'Private Lift',
          'Infinity Pool',
          'Business Center',
          'Spa',
          'Valet Parking',
        ],
        images: [],
        featured: false,
        status: 'Available',
      },
      {
        title: 'Orchid Business Park',
        description:
          'Premium Grade A commercial space in the heart of the IT corridor. Modern architecture, excellent connectivity, and top-tier infrastructure for forward-thinking businesses.',
        price: '15 Cr',
        priceNumeric: 150000000,
        location: 'Financial District, Hyderabad',
        propertyType: 'Commercial',
        bedrooms: 0,
        bathrooms: 4,
        area: '12,000 sq ft',
        amenities: [
          'Conference Hall',
          'Parking',
          'Power Backup',
          'Security',
          'Cafeteria',
          'High Speed Internet',
        ],
        images: [],
        featured: false,
        status: 'Available',
      },
      {
        title: 'Sunrise Valley Plot',
        description:
          'Premium gated community plot in a rapidly developing area. Perfect for building your dream home with excellent appreciation potential and all utilities connected.',
        price: '1.8 Cr',
        priceNumeric: 18000000,
        location: 'Shamshabad, Hyderabad',
        propertyType: 'Plot',
        bedrooms: 0,
        bathrooms: 0,
        area: '500 sq yards',
        amenities: [
          'Gated Community',
          'Park',
          'Club House',
          'Road Access',
          'Water Supply',
          'Electricity',
        ],
        images: [],
        featured: false,
        status: 'Available',
      },
      {
        title: 'Lotus Residency',
        description:
          'Upcoming ultra-luxury residential project with world-class amenities. Early bird pricing available for discerning buyers looking for an exceptional living experience.',
        price: '4.5 Cr',
        priceNumeric: 45000000,
        location: 'Kokapet, Hyderabad',
        propertyType: 'Apartment',
        bedrooms: 3,
        bathrooms: 4,
        area: '3,200 sq ft',
        amenities: [
          'Olympic Pool',
          'Golf Simulator',
          'Yoga Studio',
          'Party Hall',
          'Jogging Track',
          'EV Charging',
        ],
        images: [],
        featured: true,
        status: 'Upcoming',
      },
    ]);
    console.log(`${properties.length} properties created.`);

    // Create sample testimonials
    const testimonials = await Testimonial.create([
      {
        name: 'Rajesh Sharma',
        role: 'Business Owner',
        content:
          'Avikesh Realty made our dream of owning a luxury villa a reality. Their attention to detail and personalized service was beyond expectations. Highly recommend them for anyone looking for premium properties.',
        rating: 5,
        featured: true,
      },
      {
        name: 'Priya Menon',
        role: 'IT Professional',
        content:
          'The team at Avikesh Realty truly understands luxury living. They helped us find the perfect penthouse with stunning views. The entire process was seamless and professional.',
        rating: 5,
        featured: true,
      },
      {
        name: 'Vikram Reddy',
        role: 'Real Estate Investor',
        content:
          'As an investor, I appreciate their market knowledge and transparency. Every property they recommended has given excellent returns. They are my go-to advisors for luxury real estate.',
        rating: 5,
        featured: true,
      },
      {
        name: 'Anitha Krishnan',
        role: 'Doctor',
        content:
          'From the first consultation to handing over the keys, Avikesh Realty provided exceptional service. They understood our requirements perfectly and found us our dream home in Jubilee Hills.',
        rating: 4,
        featured: true,
      },
      {
        name: 'Suresh Patel',
        role: 'NRI Investor',
        content:
          'Being based abroad, I needed a trustworthy partner for my real estate investments in Hyderabad. Avikesh Realty handled everything professionally and kept me updated at every step.',
        rating: 5,
        featured: true,
      },
    ]);
    console.log(`${testimonials.length} testimonials created.`);

    // Create sample team members
    const teamMembers = await TeamMember.create([
      {
        name: 'Avikesh Kumar',
        role: 'Founder & CEO',
        bio: 'With over 15 years of experience in luxury real estate, Avikesh founded the company with a vision to redefine premium living in Hyderabad.',
        order: 1,
        social: {
          instagram: 'https://instagram.com/avikeshrealty',
          linkedin: 'https://linkedin.com/in/avikeshkumar',
          twitter: 'https://twitter.com/avikeshrealty',
        },
      },
      {
        name: 'Meera Reddy',
        role: 'Head of Sales',
        bio: 'Meera brings a decade of expertise in high-value property transactions and client relationship management to the team.',
        order: 2,
        social: {
          linkedin: 'https://linkedin.com/in/meerareddy',
        },
      },
      {
        name: 'Arjun Rao',
        role: 'Property Consultant',
        bio: 'Arjun specializes in identifying premium investment opportunities and providing personalized property recommendations to clients.',
        order: 3,
        social: {
          linkedin: 'https://linkedin.com/in/arjunrao',
          instagram: 'https://instagram.com/arjunrao',
        },
      },
      {
        name: 'Deepika Sharma',
        role: 'Marketing Director',
        bio: 'Deepika leads our marketing strategy with innovative campaigns that showcase the finest luxury properties in our portfolio.',
        order: 4,
        social: {
          linkedin: 'https://linkedin.com/in/deepikasharma',
          twitter: 'https://twitter.com/deepikasharma',
        },
      },
    ]);
    console.log(`${teamMembers.length} team members created.`);

    // Create sample leads
    const leads = await Lead.create([
      {
        name: 'Rahul Verma',
        phone: '+91 98765 43210',
        email: 'rahul.verma@email.com',
        budget: '5-10 Cr',
        propertyType: 'Villa',
        message: 'Looking for a 4BHK villa in Jubilee Hills or Banjara Hills area.',
        source: 'website',
        status: 'New',
      },
      {
        name: 'Sneha Iyer',
        phone: '+91 87654 32109',
        email: 'sneha.iyer@email.com',
        budget: '3-5 Cr',
        propertyType: 'Apartment',
        message: 'Interested in luxury apartments near Hitech City.',
        source: 'website',
        status: 'Contacted',
      },
      {
        name: 'Karthik Nair',
        phone: '+91 76543 21098',
        email: 'karthik.n@email.com',
        budget: '10+ Cr',
        propertyType: 'Luxury',
        message: 'NRI looking for premium investment property.',
        source: 'referral',
        status: 'Qualified',
      },
    ]);
    console.log(`${leads.length} sample leads created.`);

    console.log('\nSeed completed successfully!');
    console.log('Admin login: admin@avikeshrealty.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
