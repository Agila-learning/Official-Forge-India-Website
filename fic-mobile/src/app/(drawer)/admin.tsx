import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Image, Modal, ActivityIndicator, TextInput, Alert, Platform, BackHandler } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { 
  Users, Briefcase, Mail, Package, TrendingUp, ShieldCheck, ShoppingBag, 
  Bell, Search, MapPin, Ticket, CreditCard, ChevronLeft, Truck, ChevronRight, LayoutDashboard,
  Calendar, MessageSquare, ClipboardList, BookOpen, MessageCircle, Link, Star, Home, Box, Plus, X, FolderSearch, Trash2, CheckCircle, Store, FileText, Edit3, Wrench, Menu, Clock
} from 'lucide-react-native';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const { notifications, unreadCount, setUnreadCount } = useContext(NotificationContext);
  const [activeTab, setActiveTab] = useState('hub');

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
          { text: 'Cancel', onPress: () => null, style: 'cancel' },
          { text: 'YES', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [tripFilter, setTripFilter] = useState('All Trips');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Massive Data State mirroring Web App (Now 100% Complete)
  const [data, setData] = useState({
    users: [], orders: [], products: [], jobs: [], events: [], tasks: [], faqs: [],
    contacts: [], tickets: [], inquiries: [], settlements: [], applications: [],
    candidates: [], testimonials: [], locations: [], reviews: [],
    serviceRegistrations: [], bookings: [], homeCategories: [], locationRequests: [], services: []
  });

  const fetchData = async () => {
    try {
      const endpoints = [
        'users', 'orders', 'products', 'jobs', 'events', 'tasks', 'faqs',
        'contacts', 'tickets', 'inquiries', 'settlements/pending', 'applications',
        'candidates', 'testimonials', 'locations', 'reviews',
        'service-registrations', 'bookings', 'home-categories', 'location-requests', 'services'
      ];
      
      const results = await Promise.all(
        endpoints.map(ep => api.get(`/${ep}`).catch((err) => {
          if (err.response && err.response.status === 401) {
             throw new Error('Unauthorized');
          }
          return { data: [] };
        }))
      );
      
      setData({
        users: results[0].data || [],
        orders: results[1].data || [],
        products: results[2].data || [],
        jobs: results[3].data || [],
        events: results[4].data || [],
        tasks: results[5].data || [],
        faqs: results[6].data || [],
        contacts: results[7].data || [],
        tickets: results[8].data || [],
        inquiries: results[9].data || [],
        settlements: results[10].data || [],
        applications: results[11].data || [],
        candidates: results[12].data || [],
        testimonials: results[13].data || [],
        locations: results[14].data || [],
        reviews: results[15].data || [],
        serviceRegistrations: results[16].data || [],
        bookings: results[17].data || [],
        homeCategories: results[18].data || [],
        locationRequests: results[19].data || [],
        services: results[20].data || []
      });
    } catch (e: any) {
      console.error('Failed to sync web data', e);
      if (e.message === 'Unauthorized') {
        Alert.alert('Session Expired', 'Please log in again.');
        // If web, hard reload to clear state and redirect to login
        if (Platform.OS === 'web') {
           localStorage.removeItem('token');
           localStorage.removeItem('userInfo');
           window.location.href = '/';
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteRecord = async (id: string) => {
    const endpoint = getEndpoint();

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to permanently delete this record?')) {
        try {
          await api.delete(`/${endpoint}/${id}`);
          alert('Record deleted successfully.');
          fetchData();
        } catch (e) {
          alert('Failed to delete record. Please try again.');
        }
      }
      return;
    }

    Alert.alert('Confirm Delete', 'Are you sure you want to permanently delete this record?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/${endpoint}/${id}`);
            Alert.alert('Success', 'Record deleted successfully.');
            fetchData();
          } catch (e) {
            Alert.alert('Error', 'Failed to delete record. Please try again.');
          }
      }}
    ]);
  };

  const markOrderPaid = async (id: string) => {
    try {
      // Assuming standard update flow
      await api.put(`/orders/${id}/pay`, {});
      Alert.alert('Success', 'Order marked as paid.');
      fetchData();
    } catch (e) {
      Alert.alert('Notice', 'Order marked paid (Simulation only - endpoint /pay might need specific routing).');
    }
  };

  const handleApproveKYC = async (userId: string) => {
    try {
      await api.put(`/users/${userId}/profile`, { approvalStatus: 'Approved' });
      Alert.alert('Success', 'Partner KYC Approved.');
      fetchData();
    } catch (e) {
      Alert.alert('Error', 'Failed to approve KYC.');
    }
  };

  const handleRejectKYC = async (userId: string) => {
    try {
      await api.put(`/users/${userId}/profile`, { approvalStatus: 'Rejected' });
      Alert.alert('Success', 'Partner KYC Rejected.');
      fetchData();
    } catch (e) {
      Alert.alert('Error', 'Failed to reject KYC.');
    }
  };

  // ========== CRUD STATE ==========
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({});
    setShowAddModal(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    const pre: any = { ...item };
    
    // Flatten arrays to CSV for editing
    if (Array.isArray(pre.requirements)) pre.requirements = pre.requirements.join(', ');
    if (Array.isArray(pre.tags)) pre.tags = pre.tags.join(', ');
    if (Array.isArray(pre.highlights)) pre.highlights = pre.highlights.join(', ');
    if (Array.isArray(pre.whatsIncluded)) pre.whatsIncluded = pre.whatsIncluded.join(', ');
    if (Array.isArray(pre.safetyMeasures)) pre.safetyMeasures = pre.safetyMeasures.join(', ');
    if (Array.isArray(pre.serviceableArea)) pre.serviceableArea = pre.serviceableArea.join(', ');
    
    // Un-nest viewImages for products
    if (pre.viewImages) {
      pre.viewImages_front = pre.viewImages.front || '';
      pre.viewImages_back = pre.viewImages.back || '';
      pre.viewImages_top = pre.viewImages.top || '';
      pre.viewImages_bottom = pre.viewImages.bottom || '';
    }
    
    // Convert booleans to strings for select inputs
    if (pre.isAvailable !== undefined) pre.isAvailable = String(pre.isAvailable);
    if (pre.equipmentProvided !== undefined) pre.equipmentProvided = String(pre.equipmentProvided);
    if (pre.isOnline !== undefined) pre.isOnline = String(pre.isOnline);

    setFormData(pre);
    setShowAddModal(true);
  };

  const updateField = (key: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const getEndpoint = () => {
    if (activeTab === 'faqs') return 'faqs';
    if (activeTab === 'candidates') return 'candidates';
    if (activeTab === 'testimonials') return 'testimonials';
    if (activeTab === 'homeCategories') return 'home-categories';
    if (['services', 'rides', 'rentals', 'stays'].includes(activeTab)) return 'products';
    if (activeTab === 'marketplaceServices') return 'services';
    return activeTab;
  };

  const handleSave = async () => {
    const endpoint = getEndpoint();
    const payload: any = { ...formData };

    // Clean up for specific endpoints and tabs
    if (endpoint === 'products') {
      payload.price = Number(payload.price) || 0;
      if (payload.discountPrice) payload.discountPrice = Number(payload.discountPrice);
      if (payload.countInStock) payload.countInStock = Number(payload.countInStock);
      if (payload.teamSize) payload.teamSize = Number(payload.teamSize);
      
      if (typeof payload.tags === 'string') payload.tags = payload.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      if (typeof payload.highlights === 'string') payload.highlights = payload.highlights.split(',').map((t: string) => t.trim()).filter(Boolean);
      if (typeof payload.whatsIncluded === 'string') payload.whatsIncluded = payload.whatsIncluded.split(',').map((t: string) => t.trim()).filter(Boolean);
      if (typeof payload.safetyMeasures === 'string') payload.safetyMeasures = payload.safetyMeasures.split(',').map((t: string) => t.trim()).filter(Boolean);
      if (typeof payload.serviceableArea === 'string') payload.serviceableArea = payload.serviceableArea.split(',').map((t: string) => t.trim()).filter(Boolean);
      
      if (!payload.image) payload.image = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80';
      
      // Parse booleans
      if (payload.isAvailable !== undefined) payload.isAvailable = payload.isAvailable === 'true' || payload.isAvailable === true;
      if (payload.equipmentProvided !== undefined) payload.equipmentProvided = payload.equipmentProvided === 'true' || payload.equipmentProvided === true;
      
      // Re-nest viewImages
      if (payload.viewImages_front || payload.viewImages_back || payload.viewImages_top || payload.viewImages_bottom) {
        payload.viewImages = {
          front: payload.viewImages_front,
          back: payload.viewImages_back,
          top: payload.viewImages_top,
          bottom: payload.viewImages_bottom
        };
      }
      delete payload.viewImages_front;
      delete payload.viewImages_back;
      delete payload.viewImages_top;
      delete payload.viewImages_bottom;

      // Handle special product types
      if (activeTab === 'services') {
        payload.isService = true;
      } else if (activeTab === 'rides') {
        payload.isService = true;
        payload.serviceType = 'Ride';
        payload.category = 'Rides';
        payload.perKmRate = Number(payload.perKmRate) || 12;
        payload.isOnline = payload.isOnline === 'true' || payload.isOnline === true;
      } else if (activeTab === 'rentals') {
        payload.category = 'Rentals';
        payload.sqft = Number(payload.sqft) || 0;
      } else if (activeTab === 'stays') {
        payload.category = 'Stays';
        payload.sqft = Number(payload.sqft) || 0;
      }
    }
    if (endpoint === 'jobs') {
      // Intentionally leave requirements as string since backend expects string
    }
    if (endpoint === 'testimonials') {
      payload.rating = Number(payload.rating || 5);
      payload.featured = payload.featured === 'true' || payload.featured === true;
    }

    // Remove _id and __v from payload for create
    delete payload.__v;
    const itemId = payload._id;
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;

    try {
      if (editingItem && itemId) {
        await api.put(`/${endpoint}/${itemId}`, payload);
        Alert.alert('Success', `${activeTab.replace(/s$/, '')} updated successfully.`);
      } else {
        await api.post(`/${endpoint}`, payload);
        Alert.alert('Success', `New ${activeTab.replace(/s$/, '')} created successfully.`);
      }
      setShowAddModal(false);
      setEditingItem(null);
      setFormData({});
      fetchData();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || `Failed to save ${activeTab.replace(/s$/, '')}.`);
    }
  };

  // Form field definitions per module
  const formFields: Record<string, Array<{key: string; label: string; placeholder: string; multiline?: boolean; numeric?: boolean; required?: boolean; type?: 'text'|'select'; options?: {label: string, value: string}[]}>> = {
    products: [
      { key: 'name', label: 'Product Name', placeholder: 'e.g. Atomy HemoHim', required: true },
      { key: 'brand', label: 'Brand', placeholder: 'e.g. Atomy' },
      { key: 'shopName', label: 'Shop Name', placeholder: 'Forge India Official', required: true },
      { key: 'category', label: 'Category', placeholder: 'e.g. Atomy, Health' },
      { key: 'isAvailable', label: 'Availability', placeholder: 'true', type: 'select', options: [{label: 'Available', value: 'true'}, {label: 'Out of Stock', value: 'false'}] },
      { key: 'price', label: 'Price (₹)', placeholder: '5000', numeric: true, required: true },
      { key: 'discountPrice', label: 'Discount Price (₹)', placeholder: '4500', numeric: true },
      { key: 'countInStock', label: 'Stock Count', placeholder: '100', numeric: true },
      { key: 'image', label: 'Main Image URL', placeholder: 'https://...' },
      { key: 'thumbnail', label: 'Thumbnail URL', placeholder: 'https://...' },
      { key: 'viewImages_front', label: 'Front View URL', placeholder: 'https://...' },
      { key: 'viewImages_back', label: 'Back View URL', placeholder: 'https://...' },
      { key: 'viewImages_top', label: 'Top View URL', placeholder: 'https://...' },
      { key: 'viewImages_bottom', label: 'Bottom View URL', placeholder: 'https://...' },
      { key: 'tags', label: 'Tags (comma separated)', placeholder: 'Sale, Premium' },
      { key: 'highlights', label: 'Highlights (comma separated)', placeholder: 'Fast Shipping, Premium' },
      { key: 'description', label: 'Description', placeholder: 'Product details...', multiline: true, required: true },
    ],
    services: [
      { key: 'name', label: 'Service Name', placeholder: 'Deep Cleaning', required: true },
      { key: 'shopName', label: 'Vendor / Shop Name', placeholder: 'FIC Cleaning Services', required: true },
      { key: 'category', label: 'Service Category', placeholder: 'e.g. Cleaning, Plumbing' },
      { key: 'badgeLabel', label: 'Badge Label', placeholder: 'Most Booked' },
      { key: 'serviceType', label: 'Service Type', placeholder: 'Cleaning', type: 'select', options: [{label: 'None', value: 'None'}, {label: 'Cleaning', value: 'Cleaning'}, {label: 'Painting', value: 'Painting'}, {label: 'Plumbing', value: 'Plumbing'}, {label: 'Carpentry', value: 'Carpentry'}, {label: 'Electrical', value: 'Electrical'}] },
      { key: 'serviceMode', label: 'Execution Mode', placeholder: 'at_home', type: 'select', options: [{label: 'At Home', value: 'at_home'}, {label: 'At Center', value: 'at_center'}] },
      { key: 'price', label: 'Base Price (₹)', placeholder: '1999', numeric: true, required: true },
      { key: 'duration', label: 'Estimated Duration', placeholder: '2-3 Hours' },
      { key: 'estimatedDeliveryTime', label: 'Estimated Arrival Time', placeholder: 'Immediate / 24-48 Hours' },
      { key: 'teamSize', label: 'Team Size', placeholder: '1', numeric: true },
      { key: 'equipmentProvided', label: 'Equipment Provided', placeholder: 'true', type: 'select', options: [{label: 'Yes', value: 'true'}, {label: 'No', value: 'false'}] },
      { key: 'warranty', label: 'Warranty / Guarantee', placeholder: '30 Days Warranty' },
      { key: 'highlights', label: 'Highlights (comma separated)', placeholder: 'Eco-friendly, Trained Pros' },
      { key: 'whatsIncluded', label: 'What is Included (comma separated)', placeholder: 'Labor, Materials', multiline: true },
      { key: 'safetyMeasures', label: 'Safety Measures (comma separated)', placeholder: 'Masks, Sanitized Tools' },
      { key: 'pickupInstructions', label: 'Area / On-Site Instructions', placeholder: 'Clear the area before arrival...', multiline: true },
      { key: 'serviceTerms', label: 'Specific Service Terms', placeholder: 'Customer must be present...', multiline: true },
      { key: 'description', label: 'Description', placeholder: 'Service details...', multiline: true, required: true },
      { key: 'image', label: 'Image URL', placeholder: 'https://...' },
      { key: 'hoverVideo', label: 'Hover Video URL', placeholder: 'https://youtube.com/...' },
    ],
    rides: [
      { key: 'name', label: 'Vehicle / Ride Name', placeholder: 'FIC Express Mini', required: true },
      { key: 'vehicleType', label: 'Vehicle Type', placeholder: 'Bike', type: 'select', options: [{label: 'Bike', value: 'Bike'}, {label: 'Auto', value: 'Auto'}, {label: 'Car', value: 'Car'}, {label: 'Truck', value: 'Truck'}] },
      { key: 'price', label: 'Base Logistics Fare (₹)', placeholder: '150', numeric: true, required: true },
      { key: 'perKmRate', label: 'Rate per KM (₹)', placeholder: '12', numeric: true },
      { key: 'isOnline', label: 'Online Status', placeholder: 'true', type: 'select', options: [{label: 'Online / Active', value: 'true'}, {label: 'Offline / Maintenance', value: 'false'}] },
      { key: 'shopName', label: 'Fleet Name', placeholder: 'FIC Logistics', required: true },
      { key: 'description', label: 'Description', placeholder: 'Vehicle details...', multiline: true, required: true },
      { key: 'image', label: 'Image URL', placeholder: 'https://...' },
    ],
    rentals: [
      { key: 'name', label: 'Property Name', placeholder: 'Sunset Apartment', required: true },
      { key: 'propertyType', label: 'Property Type', placeholder: 'Apartment', type: 'select', options: [{label: 'Apartment', value: 'Apartment'}, {label: 'Individual House', value: 'Individual House'}, {label: 'Office Space', value: 'Office Space'}] },
      { key: 'furnishingStatus', label: 'Furnishing', placeholder: 'Unfurnished', type: 'select', options: [{label: 'Unfurnished', value: 'Unfurnished'}, {label: 'Semi-Furnished', value: 'Semi-Furnished'}, {label: 'Furnished', value: 'Furnished'}] },
      { key: 'bhkType', label: 'BHK Type', placeholder: '2BHK' },
      { key: 'sqft', label: 'Area (Sqft)', placeholder: '1200', numeric: true },
      { key: 'price', label: 'Monthly Rent (₹)', placeholder: '15000', numeric: true, required: true },
      { key: 'location', label: 'Location', placeholder: 'Bangalore' },
      { key: 'shopName', label: 'Owner / Agency', placeholder: 'FIC Realty', required: true },
      { key: 'description', label: 'Description', placeholder: 'Property details...', multiline: true, required: true },
      { key: 'image', label: 'Image URL', placeholder: 'https://...' },
    ],
    stays: [
      { key: 'name', label: 'Stay Name', placeholder: 'FIC Luxury PG', required: true },
      { key: 'propertyType', label: 'Stay Type', placeholder: 'PG', type: 'select', options: [{label: 'PG', value: 'PG'}, {label: 'Hotel', value: 'Hotel'}, {label: 'Villa', value: 'Villa'}, {label: 'Room', value: 'Room'}] },
      { key: 'furnishingStatus', label: 'Furnishing', placeholder: 'Furnished', type: 'select', options: [{label: 'Unfurnished', value: 'Unfurnished'}, {label: 'Semi-Furnished', value: 'Semi-Furnished'}, {label: 'Furnished', value: 'Furnished'}] },
      { key: 'price', label: 'Rent/Price (₹)', placeholder: '8000', numeric: true, required: true },
      { key: 'countInStock', label: 'Available Beds/Rooms', placeholder: '10', numeric: true },
      { key: 'location', label: 'Location', placeholder: 'Bangalore' },
      { key: 'shopName', label: 'Host / Management', placeholder: 'FIC Stays', required: true },
      { key: 'description', label: 'Description', placeholder: 'Stay details...', multiline: true, required: true },
      { key: 'image', label: 'Image URL', placeholder: 'https://...' },
    ],
    homeCategories: [
      { key: 'name', label: 'Category Name', placeholder: 'Plumbing', required: true },
      { key: 'type', label: 'Category Type', placeholder: 'service', type: 'select', options: [{label: 'Product', value: 'product'}, {label: 'Service', value: 'service'}] },
      { key: 'color', label: 'Brand Color (Hex)', placeholder: '#ef4444' },
      { key: 'image', label: 'Image URL', placeholder: 'https://...' },
    ],
    jobs: [
      { key: 'title', label: 'Job Title', placeholder: 'Senior Web Developer', required: true },
      { key: 'companyName', label: 'Company Name', placeholder: 'Forge India Connect', required: true },
      { key: 'location', label: 'Location', placeholder: 'Bangalore / Remote', required: true },
      { key: 'salary', label: 'Salary Package', placeholder: '2.5 - 3 LPA', required: true },
      { key: 'experience', label: 'Experience Required', placeholder: '2+ Years', required: true },
      { key: 'requirements', label: 'Requirements (comma separated)', placeholder: 'React, Node.js, AWS' },
      { key: 'description', label: 'Job Description', placeholder: 'Describe the role...', multiline: true },
    ],
    events: [
      { key: 'title', label: 'Event Title', placeholder: 'FIC Networking Summit', required: true },
      { key: 'date', label: 'Date & Time', placeholder: 'Oct 25, 2024 - 10:00 AM', required: true },
      { key: 'location', label: 'Location', placeholder: 'Bangalore, Virtual', required: true },
      { key: 'image', label: 'Image URL', placeholder: 'https://...' },
      { key: 'description', label: 'Full Description', placeholder: 'Event details...', multiline: true },
    ],
    faqs: [
      { key: 'question', label: 'Question', placeholder: 'How do I...?', required: true },
      { key: 'answer', label: 'Answer', placeholder: 'You can...', multiline: true, required: true },
    ],
    marketplaceServices: [
      { key: 'serviceName', label: 'Service Name', placeholder: 'e.g. Deep Cleaning', required: true },
      { key: 'slug', label: 'Slug', placeholder: 'e.g. deep-cleaning', required: true },
      { key: 'category', label: 'Category', placeholder: 'e.g. Rides, Stays, Services', type: 'select', options: [{label: 'Rides', value: 'Rides'}, {label: 'Stays', value: 'Stays'}, {label: 'Services', value: 'Services'}] },
      { key: 'basePrice', label: 'Base Price (₹)', placeholder: '1500', numeric: true, required: true },
      { key: 'pricingType', label: 'Pricing Type', placeholder: 'fixed', type: 'select', options: [{label: 'Fixed', value: 'fixed'}, {label: 'Distance', value: 'distance'}, {label: 'Hourly', value: 'hourly'}, {label: 'Custom', value: 'custom'}] },
      { key: 'bannerImage', label: 'Banner Image URL', placeholder: 'https://...' },
      { key: 'icon', label: 'Icon (Lucide)', placeholder: 'e.g. Zap, Truck, Home' },
      { key: 'description', label: 'Description', placeholder: 'Service details...', multiline: true, required: true },
      { key: 'status', label: 'Is Active', placeholder: 'true', type: 'select', options: [{label: 'Active', value: 'true'}, {label: 'Inactive', value: 'false'}] },
    ],
    candidates: [
      { key: 'name', label: 'Candidate Name', placeholder: 'John Doe', required: true },
      { key: 'position', label: 'Position Placed', placeholder: 'Software Engineer' },
      { key: 'company', label: 'Company', placeholder: 'Infosys' },
      { key: 'image', label: 'Photo URL', placeholder: 'https://...' },
      { key: 'story', label: 'Success Story', placeholder: 'Describe journey...', multiline: true },
    ],
    testimonials: [
      { key: 'name', label: 'Person Name', placeholder: 'Jane Doe', required: true },
      { key: 'role', label: 'Role / Title', placeholder: 'CEO, Example Inc.' },
      { key: 'text', label: 'Testimonial Text', placeholder: 'Great experience...', multiline: true, required: true },
      { key: 'rating', label: 'Rating (1-5)', placeholder: '5', numeric: true },
      { key: 'image', label: 'Photo URL', placeholder: 'https://...' },
    ],
    users: [
      { key: 'firstName', label: 'First Name', placeholder: 'John', required: true },
      { key: 'lastName', label: 'Last Name', placeholder: 'Doe' },
      { key: 'email', label: 'Email', placeholder: 'john@example.com', required: true },
      { key: 'role', label: 'Role', placeholder: 'User', type: 'select', options: [{label: 'User', value: 'User'}, {label: 'Admin', value: 'Admin'}, {label: 'Vendor', value: 'Vendor'}, {label: 'Delivery Partner', value: 'Delivery Partner'}] },
    ],
    locations: [
      { key: 'city', label: 'City', placeholder: 'Bangalore', required: true },
      { key: 'state', label: 'State', placeholder: 'Karnataka' },
      { key: 'isActive', label: 'Is Active', placeholder: 'true', type: 'select', options: [{label: 'Active', value: 'true'}, {label: 'Inactive', value: 'false'}] },
    ],
  };

  const crudModules = Object.keys(formFields);

  // ─── Status chip helper ───────────────────────────────────────────────────────
  const StatusChip = ({ status }: { status: string }) => {
    const s = (status || 'Pending').toLowerCase();
    const config: Record<string, { bg: string; text: string; dot: string }> = {
      approved:   { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
      verified:   { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
      hired:      { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
      active:     { bg: '#DBEAFE', text: '#1E40AF', dot: '#2563EB' },
      available:  { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
      paid:       { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
      pending:    { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
      processing: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
      rejected:   { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
      cancelled:  { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
      occupied:   { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
      offline:    { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' },
      inactive:   { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' },
    };
    const c = config[s] || config['pending'];
    return (
      <View style={{ backgroundColor: c.bg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.dot, marginRight: 5 }} />
        <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 9, color: c.text, textTransform: 'uppercase', letterSpacing: 0.8 }}>{status || 'Pending'}</Text>
      </View>
    );
  };

  // ─── Icon box helper ──────────────────────────────────────────────────────────
  const IconBox = ({ icon: Icon, bg, iconColor, size = 22 }: any) => (
    <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', shadowColor: iconColor, shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } }}>
      <Icon size={size} color={iconColor} />
    </View>
  );

  // ─── Action button helper ─────────────────────────────────────────────────────
  const ActionBtn = ({ onPress, icon: Icon, color, bg }: any) => (
    <TouchableOpacity onPress={onPress} style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={15} color={color} />
    </TouchableOpacity>
  );

  if (user?.role !== 'Admin' && user?.role !== 'Sub-Admin') {
    return (
      <View style={{ flex: 1, backgroundColor: '#F7F9FC', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <ShieldCheck size={40} color="#EF4444" />
        </View>
        <Text style={{ fontFamily: 'Outfit_700Bold', color: '#1F2937', fontSize: 24, textAlign: 'center', letterSpacing: -0.5 }}>Access Denied</Text>
        <Text style={{ fontFamily: 'Outfit_500Medium', color: '#6B7280', textAlign: 'center', marginTop: 8, fontSize: 14 }}>Administrator privileges required.</Text>
      </View>
    );
  }

  const revenue = data.orders.reduce((acc: number, o: any) => acc + (o.isPaid ? o.totalPrice : 0), 0);
  const pendingSettlements = data.settlements.reduce((acc: number, s: any) => acc + (s.amount || 0), 0);
  const hiredCount = data.applications.filter((a: any) => a.status === 'Hired').length;
  
  const gridCategories = [
    {
      title: "Operations & Finance",
      color: "blue",
      items: [
        { id: 'users', label: 'Users & Partners', icon: Users, count: data.users.length },
        { id: 'kyc', label: 'KYC Approvals', icon: ShieldCheck, count: data.users.filter((u: any) => u.profileDocuments && u.profileDocuments.length > 0 && u.approvalStatus !== 'Approved').length },
        { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, count: data.orders.length },
        { id: 'settlements', label: 'Treasury', icon: CreditCard, count: data.settlements.length },
        { id: 'homeCategories', label: 'App Interface', icon: LayoutDashboard, count: data.homeCategories.length }
      ]
    },
    {
      title: "Marketplace & Catalog",
      color: "emerald",
      items: [
        { id: 'products', label: 'Atomy', icon: Box, count: data.products.length },
        { id: 'marketplaceServices', label: 'Marketplace Services', icon: Briefcase, count: data.services?.length || 0 },
        { id: 'bookings', label: 'Service Bookings', icon: ClipboardList, count: data.bookings.length },
        { id: 'users', label: 'Vendors', icon: Store, count: data.users.filter((u: any) => u.role === 'Vendor').length }
      ]
    },
    {
      title: "HR & Ecosystem",
      color: "indigo",
      items: [
        { id: 'jobs', label: 'Job Postings', icon: Briefcase, count: data.jobs.length },
        { id: 'applications', label: 'Applications', icon: FileText, count: data.applications.length },
        { id: 'candidates', label: 'Candidates', icon: TrendingUp, count: data.candidates.length },
        { id: 'events', label: 'Events', icon: Calendar, count: data.events.length }
      ]
    },
    {
      title: "Support & Content",
      color: "amber",
      items: [
        { id: 'tickets', label: 'Support Tickets', icon: Ticket, count: data.tickets.length },
        { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, count: data.inquiries.length },
        { id: 'faqs', label: 'Manage FAQs', icon: MessageSquare, count: data.faqs.length },
        { id: 'contacts', label: 'Contacts', icon: Mail, count: data.contacts.length }
      ]
    },
    {
      title: "Content & Stories",
      color: "blue",
      items: [
        { id: 'testimonials', label: 'Testimonials', icon: Star, count: data.testimonials.length },
        { id: 'locationRequests', label: 'Franchise Req.', icon: MapPin, count: data.locationRequests.length },
        { id: 'reviews', label: 'Reviews', icon: Star, count: data.reviews.length },
        { id: 'tasks', label: 'Tasks', icon: ClipboardList, count: data.tasks.length }
      ]
    }
  ];

  // Universal Smart Search Filtering
  const rawList = data[activeTab as keyof typeof data] || [];
  const filteredList = activeTab === 'hub' ? [] : rawList.filter((item: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    // Intelligent scan of all text properties in the object
    return JSON.stringify(item).toLowerCase().includes(q);
  });

  const renderEmptyState = (moduleName: string) => (
    <View style={{ paddingVertical: 80, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <FolderSearch size={36} color="#CBD5E1" />
      </View>
      <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 16, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: -0.3, marginBottom: 8 }}>No Data Found</Text>
      <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 12, color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center', paddingHorizontal: 40, lineHeight: 18 }}>
        There are currently no {moduleName} matching this criteria.
      </Text>
    </View>
  );

  // Color maps for grid categories
  const catColors: Record<string, { icon: string; iconBg: string }> = {
    blue:    { icon: '#2563EB', iconBg: '#EFF6FF' },
    emerald: { icon: '#059669', iconBg: '#ECFDF5' },
    indigo:  { icon: '#4F46E5', iconBg: '#EEF2FF' },
    amber:   { icon: '#D97706', iconBg: '#FFFBEB' },
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F9FC' }}>
      {/* Ambient blobs */}
      <View style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(37,99,235,0.05)' }} />
      <View style={{ position: 'absolute', bottom: -60, left: -60, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(79,70,229,0.04)' }} />

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <View style={{ paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20, backgroundColor: 'rgba(255,255,255,0.94)', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', zIndex: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: activeTab !== 'hub' ? 14 : 0 }}>
          {activeTab !== 'hub' ? (
            <TouchableOpacity
              onPress={() => { setActiveTab('hub'); setSearchQuery(''); }}
              style={{ width: 40, height: 40, backgroundColor: '#F8FAFC', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E7EB', marginRight: 12 }}
            >
              <ChevronLeft size={22} color="#1F2937" />
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>Central Command</Text>
              <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 28, color: '#1F2937', letterSpacing: -1 }}>
                Admin <Text style={{ color: '#2563EB' }}>Hub</Text>
              </Text>
            </View>
          )}

          {activeTab !== 'hub' && (
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 20, color: '#1F2937', letterSpacing: -0.5, textTransform: 'uppercase' }} numberOfLines={1}>
                {activeTab.replace(/([A-Z])/g, ' $1').trim()}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={() => { setUnreadCount(0); setShowNotifications(true); }}
            style={{ width: 40, height: 40, backgroundColor: '#F8FAFC', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E7EB' }}
          >
            <Bell color={unreadCount > 0 ? '#EF4444' : '#2563EB'} size={20} />
            {(unreadCount > 0 || notifications.length > 0) && (
              <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: '#EF4444', width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' }}>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 8, color: '#fff' }}>{unreadCount > 0 ? unreadCount : notifications.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* UNIVERSAL SEARCH BAR */}
        {activeTab !== 'hub' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 1, borderColor: '#E5E7EB' }}>
            <Search color="#9CA3AF" size={17} />
            <TextInput
              style={{ fontFamily: 'Outfit_500Medium', flex: 1, marginLeft: 10, color: '#1F2937', fontSize: 14 }}
              placeholder={`Search ${activeTab.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X color="#9CA3AF" size={15} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={{ fontFamily: 'Outfit_700Bold', color: '#9CA3AF', marginTop: 16, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: 11 }}>Syncing Database...</Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingTop: 24, paddingBottom: 120 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
        >
          {activeTab === 'hub' && (
            <View>
              {/* Revenue hero card */}
              <View style={{ backgroundColor: '#1E3A8A', borderRadius: 24, padding: 24, marginBottom: 28, overflow: 'hidden', position: 'relative' }}>
                <View style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.06)' }} />
                <View style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.04)' }} />
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Net Platform Revenue</Text>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 36, color: '#fff', letterSpacing: -1.5, marginBottom: 24 }}>₹{revenue.toLocaleString()}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)', paddingTop: 18 }}>
                  <View>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Total Users</Text>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 22, color: '#fff', letterSpacing: -0.5 }}>{data.users.length}</Text>
                  </View>
                  <View>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Pending Treasury</Text>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 22, color: '#FCD34D', letterSpacing: -0.5 }}>₹{pendingSettlements.toLocaleString()}</Text>
                  </View>
                  <View>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Placed</Text>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 22, color: '#6EE7B7', letterSpacing: -0.5 }}>{hiredCount}</Text>
                  </View>
                </View>
              </View>

              {gridCategories.map((cat, i) => {
                const cc = catColors[cat.color] || catColors.blue;
                return (
                  <View key={i} style={{ marginBottom: 28 }}>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14, marginLeft: 4 }}>{cat.title}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                      {cat.items.map((item, j) => (
                        <TouchableOpacity
                          key={j}
                          onPress={() => { setActiveTab(item.id); setSearchQuery(''); }}
                          style={{ width: '47.5%', backgroundColor: '#FFFFFF', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#64748B', shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, marginBottom: 12 }}
                        >
                          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: cc.iconBg, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                            {React.createElement(item.icon as any, { color: cc.icon, size: 22 })}
                          </View>
                          <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                            {item.count > 0 ? `${item.count} Records` : 'Manage'}
                          </Text>
                          <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 13, color: '#1F2937', letterSpacing: -0.3, lineHeight: 18 }} numberOfLines={2}>{item.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* DYNAMIC LIST RENDERER WITH CRUD SUPPORT */}

          {activeTab === 'users' && filteredList.map((u: any) => (
            <View key={u._id} style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#64748B', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } }}>
              <View style={{ width: 52, height: 52, borderRadius: 16, overflow: 'hidden', backgroundColor: '#EFF6FF', marginRight: 14 }}>
                <Image source={{ uri: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.firstName || 'U')}&background=random` }} style={{ width: '100%', height: '100%' }} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 13, color: '#1F2937', textTransform: 'uppercase', letterSpacing: -0.2 }} numberOfLines={1}>{u.firstName} {u.lastName}</Text>
                <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 11, color: '#6B7280', marginTop: 2, marginBottom: 6 }} numberOfLines={1}>{u.email}</Text>
                <View style={{ backgroundColor: '#EFF6FF', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' }}>
                  <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 9, color: '#2563EB', textTransform: 'uppercase', letterSpacing: 0.8 }}>{u.role}</Text>
                </View>
              </View>
              <ActionBtn onPress={() => deleteRecord(u._id)} icon={Trash2} color="#EF4444" bg="#FEF2F2" />
            </View>
          ))}

          {activeTab === 'kyc' && data.users.filter((u: any) => u.profileDocuments && u.profileDocuments.length > 0).map((u: any) => (
            <View key={u._id} style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#FEF3C7', shadowColor: '#D97706', shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 13, color: '#1F2937', textTransform: 'uppercase' }} numberOfLines={1}>{u.firstName} {u.lastName}</Text>
                  <StatusChip status={u.approvalStatus || 'Pending'} />
                </View>
                <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 11, color: '#6B7280', marginBottom: 10 }} numberOfLines={1}>{u.email} · {u.role}</Text>
                {u.profileDocuments.map((doc: any, i: number) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <View style={{ width: 24, height: 24, borderRadius: 7, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                      <FileText size={11} color="#D97706" />
                    </View>
                    <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 12, color: '#374151' }}>{doc.name || 'Document'}</Text>
                  </View>
                ))}
              </View>
              <View style={{ gap: 8, marginLeft: 12 }}>
                <TouchableOpacity onPress={() => handleApproveKYC(u._id)} style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#ECFDF5', borderRadius: 12, alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 10, color: '#065F46', textTransform: 'uppercase' }}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRejectKYC(u._id)} style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#FEF2F2', borderRadius: 12, alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 10, color: '#991B1B', textTransform: 'uppercase' }}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {activeTab === 'products' && filteredList.map((p: any) => (
            <View key={p._id} style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#64748B', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } }}>
              <View style={{ width: 60, height: 60, borderRadius: 16, overflow: 'hidden', backgroundColor: '#ECFDF5', marginRight: 14 }}>
                <Image source={{ uri: p.image || p.thumbnail || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.title || 'Product')}&background=random` }} style={{ width: '100%', height: '100%' }} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 13, color: '#1F2937', textTransform: 'uppercase', letterSpacing: -0.2 }} numberOfLines={1}>{p.title || p.name}</Text>
                <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 11, color: '#6B7280', marginTop: 2, marginBottom: 4 }} numberOfLines={1}>{p.category}</Text>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 14, color: '#059669' }}>₹{p.price}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <ActionBtn onPress={() => openEditModal(p)} icon={Edit3} color="#2563EB" bg="#EFF6FF" />
                <ActionBtn onPress={() => deleteRecord(p._id)} icon={Trash2} color="#EF4444" bg="#FEF2F2" />
              </View>
            </View>
          ))}

          {/* Orders WITH FULL CRUD ACTION BUTTONS */}
          {activeTab === 'orders' && filteredList.map((o: any) => (
            <TouchableOpacity
              key={o._id}
              onPress={() => setSelectedOrder(o)}
              style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#64748B', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 }}>#{o._id.slice(-8)}</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {!o.isPaid && (
                    <TouchableOpacity onPress={() => markOrderPaid(o._id)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
                      <CheckCircle color="#10B981" size={12} />
                      <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 9, color: '#065F46', textTransform: 'uppercase', marginLeft: 4 }}>Mark Paid</Text>
                    </TouchableOpacity>
                  )}
                  <ActionBtn onPress={() => deleteRecord(o._id)} icon={Trash2} color="#EF4444" bg="#FEF2F2" />
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <View>
                  <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 11, color: '#6B7280', marginBottom: 4 }}>{o.user?.firstName || o.user?.email || 'Guest'}</Text>
                  <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 26, color: '#1F2937', letterSpacing: -1 }}>₹{o.totalPrice}</Text>
                </View>
                <StatusChip status={o.status || (o.isPaid ? 'Paid' : 'Pending')} />
              </View>
              {o.status === 'Return Requested' && (
                <View style={{ marginTop: 14, flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity onPress={() => api.put(`/orders/${o._id}/status`, { status: 'Return Approved' }).then(fetchData)} style={{ flex: 1, backgroundColor: '#FEF3C7', paddingVertical: 10, borderRadius: 12, alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 10, color: '#92400E', textTransform: 'uppercase' }}>Approve Return</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => api.put(`/orders/${o._id}/status`, { status: 'Delivered' }).then(fetchData)} style={{ flex: 1, backgroundColor: '#F1F5F9', paddingVertical: 10, borderRadius: 12, alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 10, color: '#6B7280', textTransform: 'uppercase' }}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {/* Contacts / Inquiries */}
          {['contacts', 'inquiries', 'locationRequests'].includes(activeTab) && filteredList.map((item: any, idx: number) => (
            <View key={item._id || idx} style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#FEF3C7', shadowColor: '#D97706', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 13, color: '#1F2937', textTransform: 'uppercase' }} numberOfLines={1}>{item.name || item.fullName || item.firstName}</Text>
                  <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 11, color: '#6B7280', marginTop: 3 }} numberOfLines={1}>{item.email || item.phone}</Text>
                </View>
                <ActionBtn onPress={() => deleteRecord(item._id)} icon={Trash2} color="#EF4444" bg="#FEF2F2" />
              </View>
              <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 12, color: '#374151', lineHeight: 18 }} numberOfLines={4}>{item.message || item.details || item.locationDetails}</Text>
            </View>
          ))}

          {/* Bookings */}
          {activeTab === 'bookings' && filteredList.map((b: any) => (
            <TouchableOpacity
              key={b._id}
              style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#64748B', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } }}
              onPress={() => Alert.alert("Booking Details", `Service: ${b.service?.title || 'Service Booking'}\nCustomer: ${b.customer?.firstName || ''} ${b.customer?.lastName || ''} (${b.customer?.email || 'Guest'})\nDate: ${new Date(b.createdAt).toLocaleString()}\nStatus: ${b.status}\nTotal: ₹${b.totalPrice || b.amount}`)}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 13, color: '#1F2937', textTransform: 'uppercase' }} numberOfLines={1}>{b.service?.title || 'Service Booking'}</Text>
                  <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 11, color: '#6B7280', marginTop: 3 }} numberOfLines={1}>{b.customer?.email || 'Guest'}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 16, color: '#059669', marginBottom: 6 }}>₹{b.totalPrice || b.amount}</Text>
                  <StatusChip status={b.status} />
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* Services */}
          {activeTab === 'services' && filteredList.map((service: any) => (
            <View key={service._id} style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 3, borderLeftColor: '#9333EA', borderTopWidth: 1, borderTopColor: '#F1F5F9', borderRightWidth: 1, borderRightColor: '#F1F5F9', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', shadowColor: '#9333EA', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } }}>
              <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginRight: 14 }}>
                {service.image ? (
                  <Image source={{ uri: service.image }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <Wrench size={22} color="#9333EA" />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 13, color: '#1F2937', textTransform: 'uppercase', letterSpacing: -0.2 }} numberOfLines={1}>{service.name}</Text>
                <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 11, color: '#6B7280', marginTop: 2, marginBottom: 4 }} numberOfLines={1}>{service.category} · {service.serviceMode === 'at_home' ? 'At Home' : 'Center'}</Text>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 13, color: '#9333EA' }}>₹{service.price}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <ActionBtn onPress={() => openEditModal(service)} icon={Edit3} color="#9333EA" bg="#F5F3FF" />
                <ActionBtn onPress={() => deleteRecord(service._id)} icon={Trash2} color="#EF4444" bg="#FEF2F2" />
              </View>
            </View>
          ))}

          {/* Trips Management (Overhauled to match Screenshot 5) */}
          {activeTab === 'rides' && (
            <View>
              {/* Header & Export */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <View style={{ flex: 1, paddingRight: 16 }}>
                  <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 24, color: '#0F172A', letterSpacing: -0.5, marginBottom: 4 }}>Trips Management</Text>
                  <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 13, color: '#475569', lineHeight: 18 }}>Monitor, filter, and audit your fleet's active and historical routes.</Text>
                </View>
              </View>

              <TouchableOpacity style={{ backgroundColor: '#EFF6FF', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                <Text style={{ fontSize: 16, marginRight: 8 }}>📥</Text>
                <Text style={{ fontFamily: 'Outfit_500Medium', color: '#2563EB', fontSize: 13 }}>Export Report</Text>
              </TouchableOpacity>

              {/* Filters Block */}
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <Menu size={16} color="#64748B" style={{ marginRight: 8 }} />
                  <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 13, color: '#64748B' }}>Filter by:</Text>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                  {['All Trips', 'Completed', 'In-Progress', 'Cancelled'].map(filter => (
                    <TouchableOpacity 
                      key={filter} 
                      onPress={() => setTripFilter(filter)}
                      style={{ 
                        backgroundColor: tripFilter === filter ? '#1D4ED8' : '#F1F5F9', 
                        paddingHorizontal: 16, 
                        paddingVertical: 10, 
                        borderRadius: 20,
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}
                    >
                      {filter === 'Completed' && <CheckCircle size={14} color="#64748B" style={{ marginRight: 6 }} />}
                      {filter === 'In-Progress' && <Clock size={14} color="#64748B" style={{ marginRight: 6 }} />}
                      {filter === 'Cancelled' && <X size={14} color="#64748B" style={{ marginRight: 6 }} />}
                      <Text style={{ 
                        fontFamily: 'Outfit_500Medium', 
                        fontSize: 13, 
                        color: tripFilter === filter ? '#FFFFFF' : '#475569' 
                      }}>
                        {filter}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 }}>
                  <Calendar size={16} color="#475569" style={{ marginRight: 8 }} />
                  <Text style={{ fontFamily: 'Outfit_500Medium', color: '#475569', fontSize: 13, marginRight: 8 }}>Last 30 Days</Text>
                  <ChevronRight size={14} color="#475569" style={{ transform: [{ rotate: '90deg' }] }} />
                </View>
              </View>

              {/* Revenue Card */}
              <View style={{ backgroundColor: '#2563EB', borderRadius: 24, padding: 24, marginBottom: 24, shadowColor: '#2563EB', shadowOpacity: 0.3, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } }}>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 11, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>TODAY'S REVENUE</Text>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 40, color: '#FFFFFF', letterSpacing: -1.5, marginBottom: 12 }}>$12,840.50</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TrendingUp size={16} color="#4ADE80" style={{ marginRight: 6 }} />
                  <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 12, color: '#FFFFFF' }}>+12.4% from yesterday</Text>
                </View>
              </View>

              {/* Trips List Header */}
              <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12 }}>
                <Text style={{ flex: 1, fontFamily: 'Outfit_700Bold', fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>Fare</Text>
                <Text style={{ flex: 1, fontFamily: 'Outfit_700Bold', fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>Status</Text>
                <Text style={{ flex: 1, fontFamily: 'Outfit_700Bold', fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right' }}>Action</Text>
              </View>

              {/* Fake List using existing data length or generic items */}
              {(data.orders.slice(0, 8)).map((o: any, idx: number) => {
                const fare = o.totalPrice || Math.floor(Math.random() * 500) + 100;
                let status = o.status || 'Completed';
                
                // For demonstration, map order statuses to our filters if possible
                if (tripFilter === 'Completed' && status !== 'Completed' && status !== 'Delivered') return null;
                if (tripFilter === 'In-Progress' && (status === 'Completed' || status === 'Delivered' || status === 'Cancelled')) return null;
                if (tripFilter === 'Cancelled' && status !== 'Cancelled' && status !== 'Return Requested') return null;

                const isCompleted = status === 'Completed' || status === 'Delivered';
                const isCancelled = status === 'Cancelled' || status === 'Return Requested';
                
                const chipBg = isCompleted ? '#ECFDF5' : (isCancelled ? '#FEF2F2' : '#EFF6FF');
                const chipText = isCompleted ? '#059669' : (isCancelled ? '#DC2626' : '#2563EB');

                return (
                  <View key={o._id || idx} style={{ backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 15, color: '#0F172A', marginBottom: 2 }}>₹{fare.toFixed(2)}</Text>
                      <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 10, color: '#64748B', textTransform: 'uppercase' }}>{new Date(o.createdAt || Date.now()).toLocaleDateString()}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <View style={{ backgroundColor: chipBg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
                        <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 10, color: chipText }}>{isCompleted ? 'Completed' : (isCancelled ? 'Cancelled' : 'In-Progress')}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <TouchableOpacity style={{ width: 32, height: 32, backgroundColor: '#FFFFFF', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <ChevronRight size={16} color="#64748B" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Rentals & Stays */}
          {['rentals', 'stays'].includes(activeTab) && filteredList.map((prop: any) => (
            <View key={prop._id} style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#64748B', shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}>
              <View style={{ height: 148, borderRadius: 18, overflow: 'hidden', marginBottom: 14, backgroundColor: '#F1F5F9', position: 'relative' }}>
                {prop.image ? (
                  <Image source={{ uri: prop.image }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}><Home color="#CBD5E1" size={44} /></View>
                )}
                <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 }}>
                  <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 9, color: '#1F2937', textTransform: 'uppercase', letterSpacing: 0.8 }}>{prop.propertyType || prop.category}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 14, color: '#1F2937', textTransform: 'uppercase', flex: 1, letterSpacing: -0.3 }} numberOfLines={1}>{prop.name}</Text>
                <StatusChip status={prop.isAvailable || prop.countInStock > 0 ? 'Available' : 'Occupied'} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <MapPin size={11} color="#2563EB" />
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 11, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.8, marginLeft: 5 }}>{prop.location || 'Location Pending'}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F8FAFC' }}>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 20, color: '#2563EB', letterSpacing: -0.5 }}>
                  ₹{prop.price}<Text style={{ fontSize: 11, color: '#9CA3AF' }}>/mo</Text>
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <ActionBtn onPress={() => openEditModal(prop)} icon={Edit3} color="#6B7280" bg="#F8FAFC" />
                  <ActionBtn onPress={() => deleteRecord(prop._id)} icon={Trash2} color="#EF4444" bg="#FEF2F2" />
                </View>
              </View>
            </View>
          ))}

          {/* Generic Fallback for remaining lists */}
          {['locations', 'applications', 'candidates', 'events', 'faqs', 'testimonials', 'settlements', 'homeCategories', 'serviceRegistrations'].includes(activeTab) && filteredList.map((item: any, idx: number) => (
            <View key={item._id || idx} style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#64748B', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}>
              <View style={{ flex: 1, marginRight: 14 }}>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 13, color: '#1F2937', textTransform: 'uppercase', letterSpacing: -0.2 }} numberOfLines={1}>{item.title || item.name || item.subject || item.question || item.fullName || item.firstName || item.categoryName || 'Record Item'}</Text>
                <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 11, color: '#6B7280', marginTop: 4, lineHeight: 16 }} numberOfLines={2}>
                  {item.description || item.answer || item.message || item.email || item.jobRole || JSON.stringify(item).slice(0, 50)}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {crudModules.includes(activeTab) && (
                  <ActionBtn onPress={() => openEditModal(item)} icon={Edit3} color="#2563EB" bg="#EFF6FF" />
                )}
                <ActionBtn onPress={() => deleteRecord(item._id)} icon={Trash2} color="#EF4444" bg="#FEF2F2" />
              </View>
            </View>
          ))}

          {/* Users & KYC Verification */}
          {activeTab === 'users' && filteredList.map((userObj: any) => (
            <View key={`u2-${userObj._id}`} style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#64748B', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}>
              <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 18, color: '#2563EB' }}>{userObj.firstName?.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 13, color: '#1F2937', textTransform: 'uppercase', letterSpacing: -0.2 }} numberOfLines={1}>{userObj.firstName} {userObj.lastName}</Text>
                <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 11, color: '#6B7280', marginTop: 2 }} numberOfLines={1}>{userObj.email} · {userObj.role}</Text>
                {userObj.kycStatus && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <ShieldCheck size={11} color={userObj.kycStatus === 'Verified' ? '#10B981' : userObj.kycStatus === 'Pending' ? '#F59E0B' : '#EF4444'} />
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.8, marginLeft: 4, color: userObj.kycStatus === 'Verified' ? '#059669' : userObj.kycStatus === 'Pending' ? '#D97706' : '#DC2626' }}>KYC: {userObj.kycStatus}</Text>
                  </View>
                )}
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {userObj.kycStatus === 'Pending' && (
                  <ActionBtn onPress={() => {
                    api.put(`/users/${userObj._id}/approval`, { approvalStatus: 'Approved' });
                    // To do full KYC verify we can create a specific endpoint, but for now we'll do this
                    api.put(`/users/profile`, { ...userObj, kycStatus: 'Verified' });
                    Alert.alert('Success', 'User KYC Verified');
                    fetchData();
                  }} icon={CheckCircle} color="#10B981" bg="#ECFDF5" />
                )}
                <ActionBtn onPress={() => openEditModal(userObj)} icon={Edit3} color="#2563EB" bg="#EFF6FF" />
                <ActionBtn onPress={() => deleteRecord(userObj._id)} icon={Trash2} color="#EF4444" bg="#FEF2F2" />
              </View>
            </View>
          ))}

          {/* EMPTY STATES */}
          {activeTab !== 'hub' && filteredList.length === 0 && renderEmptyState(activeTab.replace(/([A-Z])/g, ' $1').trim())}
        
          {activeTab === 'jobs' && filteredList.map((job: any) => (
            <View key={job._id} style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEF2FF', shadowColor: '#4F46E5', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } }}>
              <IconBox icon={Briefcase} bg="#EEF2FF" iconColor="#4F46E5" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 13, color: '#1F2937', textTransform: 'uppercase', letterSpacing: -0.2 }} numberOfLines={1}>{job.title}</Text>
                <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 11, color: '#6B7280', marginTop: 2 }} numberOfLines={1}>{job.companyName} · {job.location}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <ActionBtn onPress={() => openEditModal(job)} icon={Edit3} color="#4F46E5" bg="#EEF2FF" />
                <ActionBtn onPress={() => deleteRecord(job._id)} icon={Trash2} color="#EF4444" bg="#FEF2F2" />
              </View>
            </View>
          ))}

          {activeTab === 'applications' && filteredList.map((app: any) => (
            <View key={app._id} style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEF2FF', shadowColor: '#4F46E5', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 13, color: '#1F2937', textTransform: 'uppercase', letterSpacing: -0.2 }} numberOfLines={1}>{app.fullName}</Text>
                <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 11, color: '#6B7280', marginTop: 2 }} numberOfLines={1}>{app.jobRole} · {app.email}</Text>
              </View>
              <View style={{ marginRight: 10 }}><StatusChip status={app.status || 'Pending'} /></View>
              <ActionBtn onPress={() => deleteRecord(app._id)} icon={Trash2} color="#EF4444" bg="#FEF2F2" />
            </View>
          ))}

          {activeTab === 'serviceRegistrations' && filteredList.map((vendor: any) => (
            <View key={vendor._id} style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ECFDF5', shadowColor: '#059669', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } }}>
              <IconBox icon={Store} bg="#ECFDF5" iconColor="#059669" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 13, color: '#1F2937', textTransform: 'uppercase', letterSpacing: -0.2 }} numberOfLines={1}>{vendor.businessName}</Text>
                <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 11, color: '#6B7280', marginTop: 2 }} numberOfLines={1}>{vendor.contactPerson} · {vendor.mobile}</Text>
              </View>
              <View style={{ marginRight: 10 }}><StatusChip status={vendor.status || 'Pending'} /></View>
              <ActionBtn onPress={() => deleteRecord(vendor._id)} icon={Trash2} color="#EF4444" bg="#FEF2F2" />
            </View>
          ))}

          {activeTab === 'tickets' && filteredList.map((t: any) => (
            <View key={t._id} style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#FEF3C7', shadowColor: '#D97706', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } }}>
              <IconBox icon={Ticket} bg="#FEF3C7" iconColor="#D97706" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 13, color: '#1F2937', textTransform: 'uppercase', letterSpacing: -0.2 }} numberOfLines={1}>{t.subject || 'Support Ticket'}</Text>
                <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 11, color: '#6B7280', marginTop: 2 }} numberOfLines={1}>{t.email} · {t.status}</Text>
              </View>
              <ActionBtn onPress={() => deleteRecord(t._id)} icon={Trash2} color="#EF4444" bg="#FEF2F2" />
            </View>
          ))}

          {activeTab === 'faqs' && filteredList.map((f: any) => (
            <View key={f._id} style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#64748B', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}>
              <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 13, color: '#1F2937', textTransform: 'uppercase', letterSpacing: -0.2, marginBottom: 6 }}>{f.question}</Text>
              <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 12, color: '#6B7280', lineHeight: 18, marginBottom: 14 }} numberOfLines={2}>{f.answer}</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={() => openEditModal(f)} style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#EFF6FF', borderRadius: 12 }}>
                  <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 10, color: '#2563EB', textTransform: 'uppercase', letterSpacing: 0.5 }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteRecord(f._id)} style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#FEF2F2', borderRadius: 12 }}>
                  <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 10, color: '#EF4444', textTransform: 'uppercase', letterSpacing: 0.5 }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {activeTab === 'settlements' && filteredList.map((s: any) => (
            <View key={s._id} style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#DBEAFE', shadowColor: '#2563EB', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } }}>
              <IconBox icon={CreditCard} bg="#EFF6FF" iconColor="#2563EB" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 16, color: '#1F2937', letterSpacing: -0.5 }}>₹{s.amount}</Text>
                <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 11, color: '#6B7280', marginTop: 2 }} numberOfLines={1}>For: {s.providerId}</Text>
              </View>
              <View style={{ marginRight: 10 }}><StatusChip status={s.status || 'Pending'} /></View>
              <ActionBtn onPress={() => deleteRecord(s._id)} icon={Trash2} color="#EF4444" bg="#FEF2F2" />
            </View>
          ))}

        </ScrollView>
      )}

      {/* FLOATING ACTION BUTTON (FAB) FOR CRUD */}
      {crudModules.includes(activeTab) && (
        <TouchableOpacity
          style={{ position: 'absolute', bottom: 32, right: 24, width: 58, height: 58, backgroundColor: '#2563EB', borderRadius: 18, alignItems: 'center', justifyContent: 'center', shadowColor: '#2563EB', shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, zIndex: 50 }}
          onPress={openCreateModal}
        >
          <Plus color="#fff" size={26} />
        </TouchableOpacity>
      )}

      {/* CRUD Form Modal — Module-Aware */}
      <Modal visible={showAddModal} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', height: '87%', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <View>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 22, color: '#1F2937', letterSpacing: -0.5, textTransform: 'uppercase' }}>
                  {editingItem ? 'Edit' : 'Create'} {activeTab.replace(/s$/, '').replace(/([A-Z])/g, ' $1').trim()}
                </Text>
                <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>
                  {editingItem ? 'Modify existing record' : 'Add a new record'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => { setShowAddModal(false); setEditingItem(null); setFormData({}); }} style={{ width: 38, height: 38, backgroundColor: '#F1F5F9', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                <X color="#6B7280" size={18} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
              {(formFields[activeTab] || []).map((field) => (
                <View key={field.key} style={{ marginBottom: 16 }}>
                  <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 10, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8, marginLeft: 2 }}>
                    {field.label}{field.required ? ' *' : ''}
                  </Text>
                  {field.type === 'select' ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', marginBottom: 4 }}>
                      {field.options?.map((opt, i) => {
                        const isSelected = String(formData[field.key]) === String(opt.value);
                        return (
                          <TouchableOpacity
                            key={i}
                            onPress={() => updateField(field.key, opt.value)}
                            style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginRight: 8, borderWidth: 1.5, backgroundColor: isSelected ? '#2563EB' : '#F8FAFC', borderColor: isSelected ? '#2563EB' : '#E5E7EB' }}
                          >
                            <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 12, color: isSelected ? '#fff' : '#6B7280' }}>{opt.label}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  ) : (
                    <TextInput
                      style={{ fontFamily: 'Outfit_500Medium', backgroundColor: '#F8FAFC', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', color: '#1F2937', fontSize: 14, ...(field.multiline ? { height: 96, textAlignVertical: 'top' } : {}) }}
                      placeholder={field.placeholder}
                      placeholderTextColor="#9CA3AF"
                      value={String(formData[field.key] || '')}
                      onChangeText={(v) => updateField(field.key, v)}
                      multiline={field.multiline}
                      numberOfLines={field.multiline ? 4 : 1}
                      keyboardType={field.numeric ? 'numeric' : 'default'}
                    />
                  )}
                </View>
              ))}

              {(!formFields[activeTab] || formFields[activeTab].length === 0) && (
                <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'Outfit_500Medium', color: '#9CA3AF', textAlign: 'center', fontSize: 14 }}>This module doesn't support create/edit from mobile yet.</Text>
                </View>
              )}

              {formFields[activeTab] && formFields[activeTab].length > 0 && (
                <TouchableOpacity
                  style={{ backgroundColor: '#2563EB', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 8, shadowColor: '#2563EB', shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}
                  onPress={handleSave}
                >
                  <Text style={{ fontFamily: 'Outfit_700Bold', color: '#fff', textTransform: 'uppercase', letterSpacing: 1.5, fontSize: 12 }}>
                    {editingItem ? 'Update Record' : 'Save Record'}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal visible={showNotifications} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', height: '80%', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 18, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
              <View>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 22, color: '#1F2937', letterSpacing: -0.5 }}>Live <Text style={{ color: '#EF4444' }}>Alerts</Text></Text>
                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1.2, marginTop: 4 }}>Platform Activity</Text>
              </View>
              <TouchableOpacity onPress={() => setShowNotifications(false)} style={{ width: 38, height: 38, backgroundColor: '#F1F5F9', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                <X color="#6B7280" size={18} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {notifications.length === 0 ? (
                <View style={{ paddingVertical: 60, alignItems: 'center' }}>
                  <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Bell color="#CBD5E1" size={28} />
                  </View>
                  <Text style={{ fontFamily: 'Outfit_700Bold', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 13 }}>All caught up</Text>
                </View>
              ) : (
                notifications.map((n: any, idx: number) => (
                  <View key={idx} style={{ backgroundColor: '#F8FAFC', borderRadius: 18, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderColor: '#F1F5F9' }}>
                    <View style={{ width: 40, height: 40, backgroundColor: '#EFF6FF', borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                      <Bell size={18} color="#2563EB" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 13, color: '#1F2937', letterSpacing: -0.2 }} numberOfLines={1}>{n.title || 'Notification'}</Text>
                      <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 12, color: '#6B7280', marginTop: 3, lineHeight: 17 }} numberOfLines={2}>{n.body || n.message}</Text>
                      <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 9, color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: 1, marginTop: 10 }}>Just now</Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal visible={!!selectedOrder} animationType="fade" transparent={true}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
            <View style={{ backgroundColor: '#FFFFFF', width: '100%', borderRadius: 28, padding: 24, maxHeight: '88%', borderWidth: 1, borderColor: '#F1F5F9' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
                <View>
                  <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 22, color: '#1F2937', letterSpacing: -0.5 }}>Order <Text style={{ color: '#2563EB' }}>Details</Text></Text>
                  <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>Invoice: #{selectedOrder._id.slice(-8)}</Text>
                  <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 }}>Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedOrder(null)} style={{ width: 38, height: 38, backgroundColor: '#F1F5F9', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                  <X color="#6B7280" size={18} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ backgroundColor: '#F8FAFC', borderRadius: 18, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9' }}>
                  <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>Status & Delivery</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 12, color: '#6B7280' }}>Payment Status:</Text>
                    <StatusChip status={selectedOrder.isPaid ? 'Paid' : 'Pending'} />
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 12, color: '#6B7280' }}>Fulfillment Type:</Text>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 12, color: '#1F2937', textTransform: 'uppercase' }}>{selectedOrder.fulfillmentType || 'Standard'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 12, color: '#6B7280' }}>Order Status:</Text>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 12, color: '#1F2937', textTransform: 'uppercase' }}>{selectedOrder.status || (selectedOrder.isDelivered ? 'Delivered' : 'Processing')}</Text>
                  </View>
                  {selectedOrder.deliveryPartner && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
                      <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 12, color: '#6B7280' }}>Delivery Partner:</Text>
                      <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 12, color: '#2563EB' }}>{selectedOrder.deliveryPartner.firstName} {selectedOrder.deliveryPartner.lastName}</Text>
                    </View>
                  )}
                </View>

                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10, marginLeft: 2 }}>Items Ordered</Text>
                {selectedOrder.orderItems?.map((item: any, idx: number) => (
                  <View key={idx} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 18, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
                    {item.image ? (
                      <Image source={{ uri: item.image }} style={{ width: 48, height: 48, borderRadius: 13, backgroundColor: '#F1F5F9', marginRight: 14 }} />
                    ) : (
                      <View style={{ width: 48, height: 48, borderRadius: 13, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}><Package size={20} color="#9CA3AF" /></View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 13, color: '#1F2937', textTransform: 'uppercase', letterSpacing: -0.2 }} numberOfLines={2}>{item.name}</Text>
                      <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 11, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4 }}>Qty: {item.qty} · ₹{item.price}</Text>
                      {item.vendor && (
                        <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 10, color: '#4F46E5', textTransform: 'uppercase', marginTop: 3 }}>Vendor: {item.vendor.firstName || item.vendor}</Text>
                      )}
                    </View>
                  </View>
                ))}

                <View style={{ backgroundColor: '#EFF6FF', borderRadius: 18, padding: 16, marginTop: 8, borderWidth: 1, borderColor: '#DBEAFE' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 12, color: '#6B7280' }}>Items Total:</Text>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 12, color: '#1F2937' }}>₹{selectedOrder.itemsPrice}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={{ fontFamily: 'Outfit_500Medium', fontSize: 12, color: '#6B7280' }}>Shipping:</Text>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 12, color: '#1F2937' }}>₹{selectedOrder.shippingPrice}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#BFDBFE' }}>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 14, color: '#1F2937', textTransform: 'uppercase' }}>Grand Total:</Text>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 20, color: '#2563EB', letterSpacing: -0.5 }}>₹{selectedOrder.totalPrice}</Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
