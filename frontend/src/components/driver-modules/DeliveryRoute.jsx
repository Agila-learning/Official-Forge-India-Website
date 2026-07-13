import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Clock, MapPin, Navigation2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Fix for default Leaflet icon missing in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapUpdater = ({ currentLoc }) => {
  const map = useMap();
  useEffect(() => {
    if (currentLoc) {
      map.flyTo(currentLoc, map.getZoom(), { animate: true, duration: 1.5 });
    }
  }, [currentLoc, map]);
  return null;
};

const DeliveryRoute = ({ pickup, dropoff, currentLoc }) => {
  const [routeLine, setRouteLine] = useState([]);
  const [eta, setEta] = useState(12);

  const defaultCenter = currentLoc || [12.9716, 77.5946];
  const pick = pickup || [12.9750, 77.5900];
  const drop = dropoff || [12.9850, 77.6000];
  const startLoc = currentLoc || pick;

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        // OSRM requires lng,lat
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${startLoc[1]},${startLoc[0]};${drop[1]},${drop[0]}?overview=full&geometries=geojson`);
        const data = await response.json();
        
        if (data.routes && data.routes[0]) {
          const coordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
          setRouteLine(coordinates);
          setEta(Math.round(data.routes[0].duration / 60)); // convert seconds to mins
        }
      } catch (err) {
        console.error('Failed to fetch OSRM route:', err);
      }
    };
    fetchRoute();
  }, [startLoc[0], startLoc[1], drop[0], drop[1]]);

  return (
    <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
      <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between gap-4 pointer-events-none">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 dark:bg-dark-card/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 border border-gray-100 dark:border-gray-700 pointer-events-auto"
        >
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <Navigation className="text-blue-500" size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Next Turn</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">In 200m, turn left</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-xl shadow-green-500/20 flex flex-col items-center justify-center pointer-events-auto"
        >
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Arrival</p>
          <div className="text-xl font-black flex items-center gap-1">
            <Clock size={16} /> 12 Min
          </div>
        </motion.div>
      </div>

      <MapContainer 
        center={defaultCenter} 
        zoom={14} 
        className="w-full h-full z-10"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MapUpdater currentLoc={currentLoc} />
        
        <Marker position={pick}>
          <Popup>Pickup Location</Popup>
        </Marker>
        
        <Marker position={drop}>
          <Popup>Drop-off Location</Popup>
        </Marker>
        
        {currentLoc && (
          <Marker position={currentLoc}>
            <Popup className="rounded-xl">
              <div className="text-center font-bold">You are here</div>
            </Popup>
          </Marker>
        )}

        <Polyline positions={routeLine} color="#3b82f6" weight={5} opacity={0.7} />
      </MapContainer>

      <div className="absolute bottom-6 left-6 z-[1000] pointer-events-auto">
        <button className="w-14 h-14 bg-white dark:bg-dark-card rounded-full shadow-xl flex items-center justify-center text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Navigation2 size={24} />
        </button>
      </div>
    </div>
  );
};

export default DeliveryRoute;
