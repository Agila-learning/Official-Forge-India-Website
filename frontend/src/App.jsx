import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';

// Layout components (Keep synchronous for critical UI)
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SmoothScroll from './components/layout/SmoothScroll';
import ScrollToTop from './components/ui/ScrollToTop';
import ScrollToTopOnRoute from './components/ui/ScrollToTopOnRoute';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoadingScreen from './components/ui/LoadingScreen';

// UI components (Keep synchronous for critical UI)
import GlobalCTABar from './components/ui/GlobalCTABar';
import CookieConsent from './components/ui/CookieConsent';
import ChatWidget from './components/ui/ChatWidget';
import FICQuippy from './components/ui/FICQuippy';
import LocationPermissionModal from './components/ui/LocationPermissionModal';
import CustomCursor from './components/ui/CustomCursor';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const VendorDashboard = lazy(() => import('./pages/VendorDashboard'));
const HRDashboard = lazy(() => import('./pages/HRDashboard'));
const DeliveryDashboard = lazy(() => import('./pages/DeliveryDashboard'));
const CandidateDashboard = lazy(() => import('./pages/CandidateDashboard'));
const TrainerDashboard = lazy(() => import('./pages/TrainerDashboard'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
const Clientele = lazy(() => import('./pages/Clientele'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const FAQ = lazy(() => import('./pages/FAQ'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ExploreJobs = lazy(() => import('./pages/ExploreJobs'));
const ExploreShop = lazy(() => import('./pages/ExploreShop'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const Antigraviity = lazy(() => import('./pages/Antigraviity'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const JobPortal = lazy(() => import('./pages/JobPortal/JobPortal'));
const HomeServices = lazy(() => import('./pages/HomeServices/HomeServices'));
const EmployerDashboard = lazy(() => import('./pages/JobPortal/EmployerDashboard'));
const ServiceWizard = lazy(() => import('./components/ui/ServiceWizard'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const JobConsultingPage = lazy(() => import('./pages/JobConsultingPage'));
const AgentDashboard = lazy(() => import('./pages/AgentDashboard'));
const ServiceProviderDashboard = lazy(() => import('./pages/ServiceProviderDashboard'));
const YetToLaunch = lazy(() => import('./pages/YetToLaunch'));
const Notifications = lazy(() => import('./pages/Notifications'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const ServiceDetails = lazy(() => import('./pages/ServiceDetails'));
const TrackMission = lazy(() => import('./pages/TrackMission'));
const NotFound = lazy(() => import('./pages/NotFound'));
const TrainingPlacementPage = lazy(() => import('./pages/TrainingPlacementPage'));
const AtomyProducts = lazy(() => import('./pages/AtomyProducts'));
const StayPartnerDashboard = lazy(() => import('./pages/StayPartnerDashboard'));
const RidePartnerDashboard = lazy(() => import('./pages/RidePartnerDashboard'));
const ServiceLanding = lazy(() => import('./pages/ServiceLanding'));
const ServiceLandingPage = lazy(() => import('./pages/ServiceLandingPage'));

// Context
import { NotificationProvider } from './context/NotificationContext';

const PageLoader = () => (
 <div className="min-h-[60vh] flex items-center justify-center">
 <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
 </div>
);

const ContentWrapper = ({ loading }) => {
 const location = useLocation();
 const [showInactivityPopup, setShowInactivityPopup] = useState(false);
 const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
 
 const hideNavPaths = [
 '/admin', '/vendor', '/hr', '/delivery', '/candidate/dashboard', 
 '/employer', '/track-mission', '/service-provider', '/stay-partner', '/ride-partner', '/seller-dashboard'
 ];
 const isDashboard = hideNavPaths.some(path => location.pathname.startsWith(path));
 const dashboardRoles = [
 'Admin', 'Sub-Admin', 'Vendor', 'HR', 'Delivery Partner', 
 'Candidate', 'Employer', 'Stay Provider', 'Ride Provider', 'Seller'
 ];
 const shouldHide = isDashboard;
 
 // Log navigation visibility (after shouldHide is defined)
 console.log('Nav Visibility:', { pathname: location.pathname, role: userInfo?.role, shouldHide });

 useEffect(() => {
 const hasDismissed = localStorage.getItem('fic_inactivity_dismissed');
 if (hasDismissed) return;

 const timer = setTimeout(() => {
 setShowInactivityPopup(true);
 }, 60000);

 return () => clearTimeout(timer);
 }, []);

 return (
 <div className={`min-h-screen font-sans bg-white dark:bg-dark-bg text-slate-800 dark:text-dark-text flex flex-col transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
 {!shouldHide && <Navbar />}
 <ScrollToTopOnRoute />
 <ScrollToTop />
 {!shouldHide && <GlobalCTABar />}
 {userInfo && !['Admin', 'Sub-Admin'].includes(userInfo?.role) && <ChatWidget />}
 {(!userInfo || userInfo?.role === 'Candidate' || location.pathname === '/') && !isDashboard && <FICQuippy />}
 {(!userInfo && location.pathname === '/') && <CookieConsent />}
 <LocationPermissionModal />
 
 {/* 2-Minute Activity Popup */}
 {showInactivityPopup && !shouldHide && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
 <div className="bg-white dark:bg-dark-bg p-10 rounded-[3rem] max-w-lg w-full text-center shadow-2xl relative border border-gray-100 dark:border-gray-800">
 <button onClick={() => {
 localStorage.setItem('fic_inactivity_dismissed', 'true');
 setShowInactivityPopup(false);
 }} className="absolute top-6 right-6 text-gray-400 hover:text-red-500">
 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
 </button>
 <h2 className="text-4xl font-black mb-4">Finding Your Path?</h2>
 <p className="text-xl text-gray-500 mb-8">Looking for a career change or searching for your dream job? Join India's fastest growing business network today!</p>
 <div className="flex flex-col gap-4">
 <a href="/register" className="px-10 py-5 bg-primary text-white font-black rounded-full text-lg shadow-xl shadow-primary/30">Register Now</a>
 <button onClick={() => {
 localStorage.setItem('fic_inactivity_dismissed', 'true');
 setShowInactivityPopup(false);
 }} className="text-gray-400 font-bold hover:text-primary transition-colors">Maybe later</button>
 </div>
 </div>
 </div>
 )}

 <main className={`flex-grow ${!shouldHide ? (location.pathname === '/' ? 'pt-0' : 'pt-16') : ''}`}>
 <Suspense fallback={<PageLoader />}>
 <Routes>
 <Route path="/" element={<Home />} />
 <Route path="/login" element={<Login />} />
 <Route path="/register" element={<Register />} />
 <Route path="/forgot-password" element={<ForgotPassword />} />
 <Route path="/services/category/:categorySlug" element={<ServicesPage />} />
 <Route path="/services" element={<ServicesPage />} />
 <Route path="/services/:id" element={<ServiceDetails />} />
 <Route path="/clientele" element={<Clientele />} />
 <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin', 'Sub-Admin']}><AdminDashboard /></ProtectedRoute>} />
 <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['Admin', 'Sub-Admin']}><AdminDashboard /></ProtectedRoute>} />
 <Route path="/contact" element={<ContactPage />} />
 <Route path="/vendor" element={<ProtectedRoute allowedRoles={['Vendor', 'Admin']}><VendorDashboard /></ProtectedRoute>} />
 <Route path="/hr" element={<ProtectedRoute allowedRoles={['HR', 'Admin']}><HRDashboard /></ProtectedRoute>} />
 <Route path="/delivery" element={<ProtectedRoute allowedRoles={['Delivery Partner', 'Admin']}><DeliveryDashboard /></ProtectedRoute>} />
 <Route path="/stay-partner" element={<ProtectedRoute allowedRoles={['Stay Provider', 'Admin']}><StayPartnerDashboard /></ProtectedRoute>} />
 <Route path="/ride-partner" element={<ProtectedRoute allowedRoles={['Ride Provider', 'Admin']}><RidePartnerDashboard /></ProtectedRoute>} />
 <Route path="/candidate/dashboard" element={<ProtectedRoute allowedRoles={['Candidate', 'Admin']}><CandidateDashboard /></ProtectedRoute>} />
 <Route path="/trainer-dashboard" element={<ProtectedRoute allowedRoles={['Trainer', 'Admin']}><TrainerDashboard /></ProtectedRoute>} />
 <Route path="/seller-dashboard" element={<ProtectedRoute allowedRoles={['Seller', 'Admin']}><SellerDashboard /></ProtectedRoute>} />
 <Route path="/privacy" element={<PrivacyPolicy />} />
 <Route path="/terms" element={<TermsAndConditions />} />
 <Route path="/explore-jobs" element={<ExploreJobs />} />
 <Route path="/jobs" element={<JobPortal />} />
 <Route path="/employer" element={<EmployerDashboard />} />
 <Route path="/employer/post-job" element={<EmployerDashboard />} />
 <Route path="/home-services" element={<HomeServices />} />
 <Route path="/home-services/booking/:serviceId" element={<ProtectedRoute allowedRoles={['Candidate', 'Admin', 'Vendor', 'Customer']}><ServiceWizard /></ProtectedRoute>} />
 <Route path="/explore-shop" element={<ProtectedRoute allowedRoles={['Candidate', 'Admin', 'Vendor', 'Customer']}><ExploreShop /></ProtectedRoute>} />
 <Route path="/testimonials" element={<Testimonials />} />
 <Route path="/faq" element={<FAQ />} />
 <Route path="/about" element={<AboutUs />} />
 <Route path="/about-us" element={<AboutUs />} />
 <Route path="/antigraviity" element={<Antigraviity />} />
 <Route path="/cart" element={<Cart />} />
 <Route path="/wishlist" element={<Wishlist />} />
 <Route path="/checkout" element={<Checkout />} />
 <Route path="/profile" element={<Profile />} />
 <Route path="/track-mission/:id" element={<TrackMission />} />
 <Route path="/track-mission" element={<TrackMission />} />
 <Route path="/job-consulting" element={<JobConsultingPage />} />
 <Route path="/training-placement" element={<TrainingPlacementPage />} />
 <Route path="/service-provider" element={<ProtectedRoute allowedRoles={['Service Provider', 'Admin']}><ServiceProviderDashboard /></ProtectedRoute>} />
 <Route path="/agent-admin" element={<ProtectedRoute allowedRoles={['Agent', 'Admin']}><AgentDashboard /></ProtectedRoute>} />
 <Route path="/products/:id" element={<ProductRedirect />} />
 <Route path="/refund-policy" element={<RefundPolicy />} />
 <Route path="/yet-to-launch" element={<YetToLaunch />} />
 <Route path="/notifications" element={<Notifications />} />
 <Route path="/atomy" element={<AtomyProducts />} />
 <Route path="/services/landing/:slug" element={<ServiceLanding />} />
 <Route path="/services/category/it-solutions" element={<ServiceLandingPage />} />
 <Route path="/services/category/app-development" element={<ServiceLandingPage />} />
 <Route path="/services/category/website-development" element={<ServiceLandingPage />} />
 <Route path="/services/category/digital-marketing" element={<ServiceLandingPage />} />
 <Route path="/services/category/:categorySlug" element={<ServicesPage />} />
 <Route path="/rentals/pg" element={<Navigate to="/services/landing/pg" replace />} />
 <Route path="/rentals/villas" element={<Navigate to="/services/landing/villas" replace />} />
 <Route path="/rentals/hotels" element={<Navigate to="/services/landing/hotels" replace />} />
 <Route path="/rides/bike" element={<Navigate to="/services/landing/bike-taxi" replace />} />
 <Route path="/rides/taxi" element={<Navigate to="/services/landing/car-taxi" replace />} />
 <Route path="/rides/delivery" element={<Navigate to="/services/landing/delivery" replace />} />
 <Route path="/rentals/*" element={<Navigate to="/services/landing/hotels" replace />} />
 <Route path="/rides/*" element={<Navigate to="/services/landing/bike-taxi" replace />} />
 <Route path="*" element={<NotFound />} />
 </Routes>
 </Suspense>
 </main>
 
 {/* Global Branded Watermark */}
 <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[-1] overflow-hidden">
 <img 
 src="/logo.svg" 
 alt="Connect Watermark" 
 loading="lazy"
 decoding="async"
 className="w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] object-contain opacity-[0.03] grayscale dark:invert transition-opacity duration-1000"
 onError={(e) => {
 e.target.onerror = null;
 e.target.src = "/logo.jpg";
 }}
 />
 </div>
 
 {!shouldHide && <Footer />}
 </div>
 );
};

function App() {
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 console.log("%c FIC DEPLOYMENT VERSION: 1.0.9 - PAYMENT_SOCKET_STABILIZE_V1 ", "color: white; background: #2563eb; font-weight: bold; padding: 4px; border-radius: 4px;");
 console.log("Build Timestamp:", "2026-05-11T12:10:00Z");
 }, []);

 return (
 <HelmetProvider>
 <Router future={{ 
 v7_startTransition: true, 
 v7_relativeSplatPath: true,
 v7_fetcherPersist: true,
 v7_normalizeFormMethod: true,
 v7_partialHydration: true,
 v7_skipActionErrorRevalidation: true
 }}>
 <NotificationProvider>
 <Toaster position="top-right" reverseOrder={false} />
 <SmoothScroll>
 <CustomCursor />
 <AnimatePresence mode="wait">
 {loading && <LoadingScreen key="loader" onComplete={() => setLoading(false)} />}
 </AnimatePresence>
 <ContentWrapper loading={loading} />
 </SmoothScroll>
 </NotificationProvider>
 </Router>
 </HelmetProvider>
 );
}

const ProductRedirect = () => {
 const { id } = useParams();
 return <Navigate to={`/services/${id}`} replace />;
};

export default App;
