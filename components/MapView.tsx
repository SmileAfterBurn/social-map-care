import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Organization } from '../types';
import { Navigation, MapPin, ZoomIn, ZoomOut, LocateFixed } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// @ts-ignore
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';


// Fix for default icon path in Leaflet with bundlers
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface MapViewProps {
  organizations: Organization[];
  selectedOrgId: string | null;
  onSelectOrg: (id: string) => void;
  onOpenReferral: (org: Organization) => void;
  center?: [number, number];
  zoom?: number;
  isDarkMode?: boolean;
}

const ActiveOrgEffect: React.FC<{ activeOrg: Organization | null }> = ({ activeOrg }) => {
    const map = useMap();
    useEffect(() => {
      if (activeOrg && typeof activeOrg.lat === 'number') {
        map.flyTo([activeOrg.lat, activeOrg.lng], 15);
      }
    }, [activeOrg, map]);
    return null;
};
  

export const MapView: React.FC<MapViewProps> = ({
  organizations = [],
  selectedOrgId,
  onSelectOrg,
  center = [48.3794, 31.1656],
  zoom = 6,
  isDarkMode = false
}) => {
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const mapRef = useRef<L.Map>(null);

  const mapCenter: [number, number] = useMemo(() => {
    const defaultCenter: [number, number] = [48.3794, 31.1656];
    if (!Array.isArray(center) || center.length < 2) return defaultCenter;
    const lat = Number(center[0]);
    const lng = Number(center[1]);
    if (isNaN(lat) || isNaN(lng) || !Number.isFinite(lat)) return defaultCenter;
    return [lat, lng];
  }, [center]);

  useEffect(() => {
    const org = organizations.find(o => o.id === selectedOrgId);
    if (org) {
        setActiveOrg(org);
    }
  }, [selectedOrgId, organizations]);

  const getMarkerIcon = (isSelected: boolean) => {
    const primaryColor = isSelected ? (isDarkMode ? '#818cf8' : '#4f46e5') : (isDarkMode ? '#2dd4bf' : '#0d9488');
    const strokeColor = isDarkMode ? '#0f172a' : '#ffffff';
    const svg = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 38C20 38 34 26.8629 34 16C34 8.26801 27.732 2 20 2C12.268 2 6 8.26801 6 16C6 26.8629 20 38 20 38Z" fill="${primaryColor}" stroke="${strokeColor}" stroke-width="2.5"/><circle cx="20" cy="16" r="6" fill="${strokeColor}"/></svg>`;
    return new L.DivIcon({
        html: svg,
        className: '',
        iconSize: [isSelected ? 42 : 36, isSelected ? 42 : 36],
        iconAnchor: [isSelected ? 21 : 18, isSelected ? 42 : 36],
        popupAnchor: [1, -34]
    });
  };

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleLocateUser = () => {
    mapRef.current?.locate().on('locationfound', (e) => {
        mapRef.current?.flyTo(e.latlng, 14);
    }).on('locationerror', () => {
        alert("Дозвольте доступ до геолокації.");
    });
  }

  return (
    <div className="h-full w-full relative overflow-hidden rounded-[2.5rem] shadow-2xl">
        <MapContainer 
            center={mapCenter} 
            zoom={zoom} 
            style={{ height: '100%', width: '100%' }}
            className={isDarkMode ? 'dark-map' : ''}
            // @ts-ignore
            ref={mapRef}
            zoomControl={false}
        >
        <TileLayer
          url={isDarkMode ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <MarkerClusterGroup>
            {organizations.filter(org => org && typeof org.lat === 'number' && Number.isFinite(org.lat)).map((org) => {
                const isSelected = selectedOrgId === org.id;
                return (
                    <Marker
                        key={org.id}
                        position={[org.lat, org.lng]}
                        icon={getMarkerIcon(isSelected)}
                        eventHandlers={{
                            click: () => {
                                onSelectOrg(org.id);
                            },
                        }}
                    />
                );
            })}
        </MarkerClusterGroup>

        {activeOrg && (
            <Popup position={[activeOrg.lat, activeOrg.lng]}>
                 <div className="p-1 min-w-[220px] text-slate-900 font-sans">
                    <h3 className="font-black text-xs uppercase mb-1">{activeOrg.name}</h3>
                    <p className="text-[10px] text-slate-500 mb-3 flex items-center gap-1"><MapPin size={10} /> {activeOrg.address}</p>
                    <div className="flex gap-2">
                        {activeOrg.phone && <a href={`tel:${activeOrg.phone.replace(/[^\d+]/g, '')}`} className="flex-1 py-2.5 bg-teal-600 text-white text-[9px] font-black uppercase rounded-lg text-center">Дзвінок</a>}
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${activeOrg.lat},${activeOrg.lng}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-lg"><Navigation size={18} /></a>
                    </div>
                </div>
            </Popup>
        )}

        <ActiveOrgEffect activeOrg={activeOrg} />

      </MapContainer>

      <div className="absolute bottom-8 right-8 flex flex-col gap-3 z-[1000]">
        <div className="flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 font-sans">
          <button onClick={handleZoomIn} className="w-10 h-10 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 transition-colors"><ZoomIn size={18}/></button>
          <button onClick={handleZoomOut} className="w-10 h-10 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"><ZoomOut size={18}/></button>
        </div>
        <button 
          onClick={handleLocateUser}
          className="w-10 h-10 bg-teal-600 text-white shadow-xl shadow-teal-600/30 rounded-2xl flex items-center justify-center hover:bg-teal-700 active:scale-90 transition-all"
        ><LocateFixed size={16} /></button>
      </div>
    </div>
  );
};