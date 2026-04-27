import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import HRDashboard from './pages/HRDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
// import ServicePage from './pages/ServicePage'; // Redundant - using ServicesPage instead
import Clientele from './pages/Clientele';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import FAQ from './pages/FAQ';
import AboutUs from './pages/AboutUs';
import ExploreJobs from './pages/ExploreJobs';
import ExploreShop from './pages/ExploreShop';
import Testimonials from './pages/Testimonials';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Antigraviity from './pages/Antigraviity';
import Wishlist from './pages/Wishlist';
import JobPortal from './pages/JobPortal/JobPortal';
import HomeServices from './pages/HomeServices/HomeServices';
import EmployerDashboard from './pages/JobPortal/EmployerDashboard';
import ServiceWizard from './components/ui/ServiceWizard';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import JobConsultingPage from './pages/JobConsultingPage';

import SmoothScroll from './components/layout/SmoothScroll';
import CustomCursor from './components/ui/CustomCursor';
import LoadingScreen from './components/ui/LoadingScreen';
import ScrollToTop from './components/ui/ScrollToTop';
import ScrollToTopOnRoute from './components/ui/ScrollToTopOnRoute';
import CookieConsent from './components/ui/CookieConsent';
import ChatWidget from './components/ui/ChatWidget';
import FICQuippy from './components/ui/FICQuippy';
import RefundPolicy from './pages/RefundPolicy';
import ServiceDetails from './pages/ServiceDetails';
import LocationPermissionModal from './components/ui/LocationPermissionModal';
import TrackMission from './pages/TrackMission';
import ProtectedRoute from './components/layout/ProtectedRoute';
import GlobalCTABar from './components/ui/GlobalCTABar';
import { NotificationProvider } from './context/NotificationContext';
import NotFound from './pages/NotFound';
import TrainingPlacementPage from './pages/TrainingPlacementPage';

import { AnimatePresence } from 'framer-motion';

const ContentWrapper = ({ loading }) => {
  const location = useLocation();
  const [showInactivityPopup, setShowInactivityPopup] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  
  const hideNavPaths = ['/admin', '/vendor', '/hr', '/delivery', '/candidate/dashboard', '/employer', '/track-mission'];
  const isDashboard = hideNavPaths.some(path => location.pathname.startsWith(path));
  const dashboardRoles = ['Admin', 'Sub-Admin', 'Vendor', 'HR', 'Delivery Partner', 'Candidate', 'Employer'];
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
      {userInfo && userInfo?.role !== 'Admin' && <ChatWidget />}
      {(!userInfo || userInfo?.role === 'Candidate') && <FICQuippy />}
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

      <main className={`flex-grow ${!shouldHide ? 'pt-20' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/clientele" element={<Clientele />} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin', 'Sub-Admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['Admin', 'Sub-Admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/vendor" element={<ProtectedRoute allowedRoles={['Vendor', 'Admin']}><VendorDashboard /></ProtectedRoute>} />
          <Route path="/hr" element={<ProtectedRoute allowedRoles={['HR', 'Admin']}><HRDashboard /></ProtectedRoute>} />
          <Route path="/delivery" element={<ProtectedRoute allowedRoles={['Delivery Partner', 'Admin']}><DeliveryDashboard /></ProtectedRoute>} />
          <Route path="/candidate/dashboard" element={<ProtectedRoute allowedRoles={['Candidate', 'Admin']}><CandidateDashboard /></ProtectedRoute>} />
          <Route path="/trainer-dashboard" element={<ProtectedRoute allowedRoles={['Trainer', 'Admin']}><TrainerDashboard /></ProtectedRoute>} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/explore-jobs" element={<ExploreJobs />} />
          <Route path="/jobs" element={<JobPortal />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/employer/post-job" element={<EmployerDashboard />} />
          <Route path="/home-services" element={<HomeServices />} />
          <Route path="/home-services/booking/:serviceId" element={<ServiceWizard />} />
          <Route path="/explore-shop" element={<ExploreShop />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/antigraviity" element={<Antigraviity />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/track-mission" element={<TrackMission />} />
          <Route path="/job-consulting" element={<JobConsultingPage />} />
          <Route path="/training-placement" element={<TrainingPlacementPage />} />
          <Route path="/products/:id" element={<ProductRedirect />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* Global Branded Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[-1] overflow-hidden">
        <img 
          src="/logo.jpg" 
          alt="Connect Watermark" 
          className="w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] object-contain opacity-[0.03] grayscale dark:invert transition-opacity duration-1000"
        />
      </div>
      
      {!shouldHide && <Footer />}
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

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
