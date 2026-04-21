import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Globe } from 'lucide-react';

const center = {
  lat: 12.9716, // Bangalore default
  lng: 77.5946
};

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '2rem'
};

const ShopLocationPicker = ({ onLocationSelect }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [markerPosition, setMarkerPosition] = useState(center);
  const [address, setAddress] = useState('');
  const [map, setMap] = useState(null);

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    
    // Reverse Geocoding
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const addr = results[0].formatted_address;
        setAddress(addr);
        onLocationSelect({ lat, lng, address: addr });
      }
    });
  }, [onLocationSelect]);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  if (!isLoaded) {
    return (
      <div className="h-[300px] w-full bg-gray-100 dark:bg-dark-bg/40 animate-pulse rounded-[2rem] flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800">
        <Globe className="text-gray-300 mb-4 animate-spin" size={40} />
        <p className="font-black uppercase tracking-widest text-[10px] text-gray-400 mb-2">Initialising Maps Protocol...</p>
        <p className="text-[9px] text-gray-500 font-medium max-w-[200px]">
          If this persists, please verify your Google Maps API Key and Billing status in the .env configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative group overflow-hidden rounded-[2.5rem] border-4 border-white dark:border-dark-card shadow-2xl">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={markerPosition}
          zoom={12}
          onLoad={onLoad}
          onClick={onMapClick}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            styles: [
                { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#747474" }] },
                { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }] },
                { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
                { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] }
            ]
          }}
        >
          <Marker position={markerPosition} />
        </GoogleMap>
      </div>
      {address && (
        <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Selected Shop Address</p>
          <p className="text-xs font-bold text-gray-600 dark:text-gray-400 italic">"{address}"</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(ShopLocationPicker);
