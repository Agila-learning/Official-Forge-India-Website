import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '2rem'
};

// Simulated center (Tirupur, India area)
const initialCenter = {
  lat: 11.1085,
  lng: 77.3411
};

const MissionMap = ({ mission }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "" // Placeholder - will use fallback or provided key
  });

  const [position, setPosition] = useState(initialCenter);
  const [destination] = useState({ 
    lat: initialCenter.lat + 0.01, 
    lng: initialCenter.lng + 0.01 
  });
  const [path, setPath] = useState([initialCenter]);

  useEffect(() => {
    if (!mission || mission.status !== 'In Transit') return;

    // Simulation: Move marker towards destination every 3 seconds
    const interval = setInterval(() => {
        setPosition(prev => {
            const newLat = prev.lat + (destination.lat - prev.lat) * 0.1;
            const newLng = prev.lng + (destination.lng - prev.lng) * 0.1;
            const newPos = { lat: newLat, lng: newLng };
            setPath(currentPath => [...currentPath, newPos]);
            return newPos;
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [mission, destination]);

  return isLoaded ? (
    <div className="relative group overflow-hidden rounded-[2.5rem] border-4 border-white dark:border-white/5 shadow-2xl">
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={14}
            options={{
                styles: mapStyles,
                disableDefaultUI: true,
            }}
        >
            {/* Customer Destination */}
            <Marker 
                position={destination} 
                icon={{
                    url: "https://cdn-icons-png.flaticon.com/512/1216/1216733.png",
                    scaledSize: new window.google.maps.Size(40, 40)
                }}
            />

            {/* Moving Partner */}
            <Marker 
                position={position} 
                icon={{
                    url: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
                    scaledSize: new window.google.maps.Size(50, 50)
                }}
            />

            {/* Traveled Path */}
            <Polyline
                path={path}
                options={{
                    strokeColor: "#7c3aed",
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                    geodesic: true,
                }}
            />
        </GoogleMap>
        
        {/* Floating Stats */}
        <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-black/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center animate-pulse">
                    <img src="https://cdn-icons-png.flaticon.com/512/3063/3063822.png" className="w-6 h-6 invert" alt=""/>
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Partner Status</p>
                    <h4 className="text-sm font-black uppercase tracking-tight text-gray-900 dark:text-white">Approaching Terminal</h4>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Estimated Arrival</p>
                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase">12 mins</h4>
            </div>
        </div>
    </div>
  ) : <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-[3rem] flex items-center justify-center font-black text-gray-400 uppercase tracking-[0.5em]">Initializing Satellite Link...</div>;
};

const mapStyles = [
    { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "feature": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
    { "feature": "poi", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] },
    { "feature": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
    { "feature": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }] },
    { "feature": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }
];

export default MissionMap;
