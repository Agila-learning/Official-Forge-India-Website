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
  {/* Destination Marker */}
  <Marker 
  position={destination} 
  icon={{
  path: window.google.maps.SymbolPath.CIRCLE,
  fillColor: "#ef4444",
  fillOpacity: 1,
  strokeColor: "#ffffff",
  strokeWeight: 3,
  scale: 12,
  }}
  />

  {/* Vehicle/Partner Marker */}
  <Marker 
  position={position} 
  icon={{
  path: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42.99L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z",
  fillColor: "#7c3aed",
  fillOpacity: 1,
  strokeColor: "#ffffff",
  strokeWeight: 1,
  scale: 1.5,
  anchor: new window.google.maps.Point(12, 12),
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
  
  {/* Radar Scanning Overlay */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem]">
    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent animate-scan" />
  </div>

  {/* Floating Stats */}
  <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-black/90 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/20 shadow-2xl flex items-center justify-between transition-transform group-hover:translate-y-[-5px]">
  <div className="flex items-center gap-4">
  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
  <Truck className="text-white" size={24} />
  </div>
  <div>
  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Satellite Tracking</p>
  <h4 className="text-sm font-black uppercase tracking-tight text-gray-900 dark:text-white">Active Pursuit</h4>
  </div>
  </div>
  <div className="text-right">
  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">ETA</p>
  <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase">8.4 mins</h4>
  </div>
  </div>
  </div>
  ) : <div className="h-[500px] w-full bg-slate-900 overflow-hidden rounded-[3rem] flex items-center justify-center relative">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent animate-pulse" />
    <div className="relative z-10 flex flex-col items-center gap-6">
      <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60">Initializing Tactical Link</p>
    </div>
  </div>;
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
