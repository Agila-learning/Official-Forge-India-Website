import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(() => {
        const saved = localStorage.getItem('fic_user_location');
        return saved ? JSON.parse(saved) : null;
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error, denied
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const hasAsked = localStorage.getItem('fic_location_asked');
        if (!location && !hasAsked) {
            setShowModal(true);
        }
    }, [location]);

    const detectLocation = () => {
        setStatus('loading');
        if (!navigator.geolocation) {
            setStatus('error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Using BigDataCloud for free reverse geocoding (no key required for client-side basic requests usually)
                    // Or OpenStreetMap Nominatim
                    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                    const data = await response.json();
                    
                    const newLocation = {
                        lat: latitude,
                        lng: longitude,
                        city: data.city || data.locality || 'Unknown City',
                        state: data.principalSubdivision || 'Unknown State',
                        pincode: data.postcode || '',
                        formatted: `${data.city || data.locality}, ${data.principalSubdivision}`
                    };

                    setLocation(newLocation);
                    localStorage.setItem('fic_user_location', JSON.stringify(newLocation));
                    localStorage.setItem('fic_location_asked', 'true');
                    setStatus('success');
                    setShowModal(false);
                } catch (err) {
                    console.error('Reverse geocoding failed:', err);
                    setStatus('error');
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                setStatus('denied');
                localStorage.setItem('fic_location_asked', 'true');
            }
        );
    };

    const updateManualLocation = (manualLoc) => {
        // Ensure city is set for the Navbar display
        const city = manualLoc.city || manualLoc.formatted.split(',')[0].trim();
        const updatedLoc = { ...manualLoc, city };
        
        setLocation(updatedLoc);
        localStorage.setItem('fic_user_location', JSON.stringify(updatedLoc));
        localStorage.setItem('fic_location_asked', 'true');
        setShowModal(false);
    };

    const fetchPincodeByCity = async (city) => {
        if (!city || city.length < 3) return null;
        try {
            // Mock lookup for major hubs
            const mockHubs = {
                'Tirupur': '641604',
                'Coimbatore': '641001',
                'Chennai': '600001',
                'Bangalore': '560001',
                'Mumbai': '400001',
                'Delhi': '110001'
            };
            
            if (mockHubs[city]) return mockHubs[city];

            // Real lookup using Zippopotam.us or similar public API for India (IN)
            // Note: India support is limited in some free APIs, so we fall back to reverse geocoding if needed
            const response = await fetch(`https://api.zippopotam.us/IN/${city}`);
            const data = await response.json();
            return data.places?.[0]?.['post code'] || '';
        } catch (err) {
            return '';
        }
    };

    return (
        <LocationContext.Provider value={{ 
            location, 
            status, 
            showModal, 
            setShowModal, 
            detectLocation, 
            getLiveLocation: detectLocation,
            updateManualLocation,
            fetchPincodeByCity
        }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
