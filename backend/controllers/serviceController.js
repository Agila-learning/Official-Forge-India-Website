const Service = require('../models/Service');

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const services = await Service.find({ status: true });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single service by slug
// @route   GET /api/services/:slug
// @access  Public
const getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
  try {
    const { 
      serviceName, 
      slug, 
      description, 
      bannerImage, 
      icon, 
      category, 
      subCategory, 
      pricingType, 
      basePrice, 
      bookingFields, 
      features, 
      stats, 
      status, 
      serviceColor 
    } = req.body;

    const slugExists = await Service.findOne({ slug });
    if (slugExists) {
      return res.status(400).json({ message: 'Service slug already exists' });
    }

    const service = new Service({
      serviceName,
      slug,
      description,
      bannerImage,
      icon: icon || 'Zap',
      category,
      subCategory,
      pricingType: pricingType || 'fixed',
      basePrice: basePrice || 0,
      bookingFields: bookingFields || [],
      features: features || [],
      stats: stats || [],
      status: status !== undefined ? status : true,
      serviceColor: serviceColor || '#7C3AED'
    });

    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (service) {
      service.serviceName = req.body.serviceName || service.serviceName;
      service.slug = req.body.slug || service.slug;
      service.description = req.body.description || service.description;
      service.bannerImage = req.body.bannerImage !== undefined ? req.body.bannerImage : service.bannerImage;
      service.icon = req.body.icon || service.icon;
      service.category = req.body.category || service.category;
      service.subCategory = req.body.subCategory !== undefined ? req.body.subCategory : service.subCategory;
      service.pricingType = req.body.pricingType || service.pricingType;
      service.basePrice = req.body.basePrice !== undefined ? req.body.basePrice : service.basePrice;
      service.bookingFields = req.body.bookingFields || service.bookingFields;
      service.features = req.body.features || service.features;
      service.stats = req.body.stats || service.stats;
      service.status = req.body.status !== undefined ? req.body.status : service.status;
      service.serviceColor = req.body.serviceColor || service.serviceColor;

      const updatedService = await service.save();
      res.json(updatedService);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service) {
      await service.deleteOne();
      res.json({ message: 'Service removed successfully' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed initial services if none exist
const initializeServices = async () => {
  try {
    const count = await Service.countDocuments();
    if (count === 0) {
      const seedServices = [
        {
          serviceName: 'Bike Taxi Service',
          slug: 'bike-taxi',
          description: 'Beat traffic with FIC Bike Taxi. Quick, affordable, and reliable. Our verified riders get you to your destination safely and on time.',
          bannerImage: 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=800',
          icon: 'Zap',
          category: 'Rides',
          pricingType: 'distance',
          basePrice: 30,
          serviceColor: '#8B5CF6', // Purple
          stats: [{ value: '100+', label: 'Riders' }, { value: '₹30+', label: 'Starting Fare' }, { value: '< 5 Min', label: 'Pickup Time' }],
          features: [
            { icon: 'Shield', title: 'Verified Riders', description: 'Background-checked, licensed bikers' },
            { icon: 'Clock', title: 'Arrive in 5 Mins', description: 'Nearest rider dispatched instantly' },
            { icon: 'Star', title: 'Helmet Provided', description: 'Safety first, always' },
            { icon: 'MapPin', title: 'Live Tracking', description: 'Real-time GPS tracking' }
          ],
          bookingFields: [
            { name: 'pickup', label: 'Pickup Location', type: 'text', placeholder: 'Enter pickup address', required: true },
            { name: 'drop', label: 'Drop Location', type: 'text', placeholder: 'Enter destination', required: true },
            { name: 'date', label: 'Date & Time (Optional)', type: 'datetime-local', required: false }
          ]
        },
        {
          serviceName: 'Car Taxi Service',
          slug: 'car-taxi',
          description: 'Travel in comfort with FIC Car Taxi. AC cabs, professional drivers, and transparent pricing for city rides, airport transfers, and outstation trips.',
          bannerImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
          icon: 'Zap',
          category: 'Rides',
          pricingType: 'distance',
          basePrice: 80,
          serviceColor: '#0EA5E9', // Sky blue
          stats: [{ value: '50+', label: 'Cabs' }, { value: '₹80+', label: 'Starting Fare' }, { value: 'City & Outstation', label: 'Coverage' }],
          features: [
            { icon: 'Shield', title: 'Trained Drivers', description: 'Professionally trained and verified' },
            { icon: 'Star', title: 'AC Vehicles', description: 'Clean, air-conditioned cars' },
            { icon: 'Clock', title: 'Airport Transfers', description: 'On-time airport pickup & drop' },
            { icon: 'MapPin', title: 'Outstation Trips', description: 'City to city travel at flat rates' }
          ],
          bookingFields: [
            { name: 'pickup', label: 'Pickup Location', type: 'text', placeholder: 'Enter pickup address', required: true },
            { name: 'drop', label: 'Drop Location', type: 'text', placeholder: 'Enter destination', required: true },
            { name: 'tripType', label: 'Trip Type', type: 'select', options: ['City Ride', 'Airport Transfer', 'Outstation', 'Package Tour'], required: true },
            { name: 'date', label: 'Date & Time (Optional)', type: 'datetime-local', required: false }
          ]
        },
        {
          serviceName: 'Express Delivery',
          slug: 'delivery',
          description: 'Send parcels, documents, and packages across the city with same-day delivery. Fast, secure, and trackable.',
          bannerImage: 'https://images.unsplash.com/photo-1586769852044-692d6e3703a0?w=800',
          icon: 'Truck',
          category: 'Rides',
          pricingType: 'distance',
          basePrice: 50,
          serviceColor: '#F43F5E', // Rose
          stats: [{ value: '500+', label: 'Daily Deliveries' }, { value: '₹50+', label: 'Starting Rate' }, { value: '99%', label: 'On-Time Rate' }],
          features: [
            { icon: 'Shield', title: 'Insured Parcels', description: 'All packages fully insured in transit' },
            { icon: 'Clock', title: 'Same-Day Delivery', description: 'Order before 2 PM for same-day' },
            { icon: 'MapPin', title: 'Live GPS Tracking', description: 'Track your parcel in real-time' },
            { icon: 'Star', title: 'Proof of Delivery', description: 'Photo & signature on delivery' }
          ],
          bookingFields: [
            { name: 'pickup', label: 'Pickup Address', type: 'text', placeholder: 'Sender address', required: true },
            { name: 'drop', label: 'Delivery Address', type: 'text', placeholder: 'Recipient address', required: true },
            { name: 'weight', label: 'Package Weight (kg)', type: 'text', placeholder: '0.5', required: false },
            { name: 'notes', label: 'Special Instructions', type: 'text', placeholder: 'Fragile, handle with care...', required: false }
          ]
        },
        {
          serviceName: 'Modern PG Stays',
          slug: 'pg',
          description: 'Experience world-class co-living with FIC Modern PG. Fully furnished rooms, premium amenities, high-speed Wi-Fi, and 3-tier security for a comfortable stay.',
          bannerImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          icon: 'Home',
          category: 'Stays',
          pricingType: 'fixed',
          basePrice: 5500,
          serviceColor: '#F59E0B', // Amber
          stats: [{ value: '10+', label: 'Properties' }, { value: '₹5,500+', label: 'Starting Rent' }, { value: '4.9', label: 'Avg Rating' }],
          features: [
            { icon: 'Shield', title: '3-Tier Security', description: 'Biometric access & 24/7 CCTV' },
            { icon: 'Zap', title: 'High-Speed Wi-Fi', description: 'Dedicated 100 Mbps fiber line' },
            { icon: 'Star', title: 'Daily Cleaning', description: 'Professional housekeeping included' },
            { icon: 'Clock', title: 'All-Inclusive', description: 'Electricity, water & maintenance' }
          ],
          bookingFields: [
            { name: 'preferred_location', label: 'Preferred Area', type: 'text', placeholder: 'e.g. Tirupur North', required: true },
            { name: 'room_type', label: 'Room Preference', type: 'select', options: ['Single Room', 'Double Sharing', 'Triple Sharing', 'Luxury Suite'], required: true },
            { name: 'occupancy_date', label: 'Expected Move-in', type: 'date', required: true },
            { name: 'duration', label: 'Stay Duration', type: 'select', options: ['Monthly', '3 Months', '6 Months', 'Long Term (1 Year+)'], required: true }
          ]
        },
        {
          serviceName: 'Luxury Villas',
          slug: 'villas',
          description: 'Rent premium luxury villas with private amenities, spacious living areas, and serene surroundings. Perfect for families and executives.',
          bannerImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
          icon: 'Home',
          category: 'Stays',
          pricingType: 'fixed',
          basePrice: 45000,
          serviceColor: '#10B981', // Emerald
          stats: [{ value: '50+', label: 'Villas' }, { value: '₹45,000+', label: 'Starting Rent' }, { value: 'Premium', label: 'Quality' }],
          features: [
            { icon: 'Shield', title: 'Gated Community', description: 'Secure environments' },
            { icon: 'Star', title: 'Premium Amenities', description: 'Pool, Gym & Club House' },
            { icon: 'MapPin', title: 'Prime Locations', description: 'Connectivity & Convenience' },
            { icon: 'Home', title: 'Spacious Interiors', description: 'Modern architecture' }
          ],
          bookingFields: [
            { name: 'preferred_location', label: 'Preferred Area', type: 'text', placeholder: 'e.g. Hosur', required: true },
            { name: 'bhk', label: 'BHK Preference', type: 'select', options: ['2 BHK', '3 BHK', '4+ BHK', 'Independent Villa'], required: true },
            { name: 'occupancy_date', label: 'Expected Move-in', type: 'date', required: true }
          ]
        },
        {
          serviceName: 'Business Hotels',
          slug: 'hotels',
          description: 'Book premium and budget business hotels with world-class hospitality, high-speed internet, and corporate facilities across India.',
          bannerImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
          icon: 'Building2',
          category: 'Stays',
          pricingType: 'fixed',
          basePrice: 2500,
          serviceColor: '#3B82F6', // Blue
          stats: [{ value: '500+', label: 'Hotels' }, { value: '₹2,500+', label: 'Starting Price' }, { value: 'Pan India', label: 'Presence' }],
          features: [
            { icon: 'Shield', title: 'Verified Properties', description: 'Strict quality checks' },
            { icon: 'Zap', title: 'Instant Booking', description: 'No waiting time' },
            { icon: 'Star', title: 'Corporate Rates', description: 'Exclusive pricing' },
            { icon: 'Clock', title: '24/7 Service', description: 'Round-the-clock support' }
          ],
          bookingFields: [
            { name: 'destination', label: 'Destination City', type: 'text', placeholder: 'e.g. Chennai', required: true },
            { name: 'check_in', label: 'Check-In Date', type: 'date', required: true },
            { name: 'check_out', label: 'Check-Out Date', type: 'date', required: true },
            { name: 'guests', label: 'Number of Guests', type: 'text', placeholder: 'e.g. 2 Adults', required: true }
          ]
        },
        {
          serviceName: 'Home Cleaning Services',
          slug: 'cleaning',
          description: 'Professional deep cleaning services for your home. Trained experts, eco-friendly products, and a spotless guarantee.',
          bannerImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
          icon: 'Zap',
          category: 'Services',
          pricingType: 'fixed',
          basePrice: 999,
          serviceColor: '#06B6D4', // Cyan
          stats: [{ value: '10k+', label: 'Cleaned' }, { value: '₹999+', label: 'Starting' }, { value: '4.8', label: 'Rating' }],
          features: [
            { icon: 'Shield', title: 'Verified Experts', description: 'Background checked professionals' },
            { icon: 'Star', title: 'Eco-Friendly', description: 'Safe cleaning products' },
            { icon: 'Clock', title: 'On-Time', description: 'Punctual service delivery' }
          ],
          bookingFields: [
            { name: 'property_type', label: 'Property Type', type: 'select', options: ['1 BHK', '2 BHK', '3 BHK', 'Villa / Independent'], required: true },
            { name: 'service_date', label: 'Service Date', type: 'date', required: true },
            { name: 'address', label: 'Service Address', type: 'text', placeholder: 'Full address', required: true }
          ]
        },
        {
          serviceName: 'Plumbing Services',
          slug: 'plumbing',
          description: 'Get reliable plumbing services for leaks, installations, and repairs. Fast response and quality workmanship guaranteed.',
          bannerImage: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800',
          icon: 'Zap',
          category: 'Services',
          pricingType: 'fixed',
          basePrice: 299,
          serviceColor: '#4F46E5', // Indigo
          stats: [{ value: '5k+', label: 'Fixed' }, { value: '₹299+', label: 'Visit Fee' }, { value: '1 Hr', label: 'Response' }],
          features: [
            { icon: 'Shield', title: 'Certified Plumbers', description: 'Experienced and trained' },
            { icon: 'Star', title: 'Quality Parts', description: 'Genuine spare parts used' },
            { icon: 'Clock', title: 'Quick Fix', description: 'Same-day resolution' }
          ],
          bookingFields: [
            { name: 'issue_type', label: 'Issue Type', type: 'select', options: ['Leakage', 'Installation', 'Blockage', 'Other'], required: true },
            { name: 'service_date', label: 'Service Date', type: 'date', required: true },
            { name: 'address', label: 'Service Address', type: 'text', placeholder: 'Full address', required: true }
          ]
        },
        {
          serviceName: 'Carpentry Services',
          slug: 'carpentry',
          description: 'Skilled carpenters for furniture assembly, repair, and custom woodwork. Quality craftsmanship for your home.',
          bannerImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
          icon: 'Zap',
          category: 'Services',
          pricingType: 'fixed',
          basePrice: 399,
          serviceColor: '#F59E0B', // Amber
          stats: [{ value: '2k+', label: 'Completed' }, { value: '₹399+', label: 'Visit Fee' }, { value: 'Top Rated', label: 'Artisans' }],
          features: [
            { icon: 'Shield', title: 'Skilled Craftsmen', description: 'Experienced woodworkers' },
            { icon: 'Star', title: 'Custom Work', description: 'Tailored to your preferences' },
            { icon: 'Clock', title: 'On-Time', description: 'Reliable service schedule' }
          ],
          bookingFields: [
            { name: 'issue_type', label: 'Requirement', type: 'select', options: ['Repair', 'New Assembly', 'Custom Design', 'Other'], required: true },
            { name: 'service_date', label: 'Service Date', type: 'date', required: true },
            { name: 'address', label: 'Service Address', type: 'text', placeholder: 'Full address', required: true }
          ]
        }
      ];

      await Service.insertMany(seedServices);
      console.log('✅ Bootstrap: Dynamic Services seeded successfully');
    }
  } catch (error) {
    console.error('❌ Service seeding error:', error.message);
  }
};

module.exports = {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
  initializeServices
};
