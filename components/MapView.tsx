import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { GoogleMap, MarkerF, InfoWindowF, MarkerClusterer, useJsApiLoader } from '@react-google-maps/api';
import { Organization } from '../types';
import { AlertTriangle, Navigation, MapPin, RefreshCw, Key, ShieldAlert } from 'lucide-react';
import { fetchAppCheckTokenForMaps } from '../firebase-setup';

interface MapViewProps {
  organizations: Organization[];
  selectedOrgId: string | null;
  onSelectOrg: (id: string) => void;
  onOpenReferral: (org: Organization) => void;
  center?: [number, number];
  zoom?: number;
  isDarkMode?: boolean;
  onResetKey?: () => void;
  onAuthError?: () => void;
}

const mapContainerStyle = { width: '100%', height: '100%', minHeight: '400px' };

const MODERN_MAP_STYLES = (isDark: boolean) => [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { elementType: "geometry", stylers: [{ color: isDark ? "#0f172a" : "#f1f5f9" }] },
  { elementType: "labels.text.fill", stylers: [{ color: isDark ? "#94a3b8" : "#475569" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: isDark ? "#0f172a" : "#f1f5f9" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: isDark ? "#1e293b" : "#cbd5e1" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: isDark ? "#1e293b" : "#ffffff" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: isDark ? "#020617" : "#bae6fd" }] }
];

const libraries: ("marker" | "maps")[] = ["marker", "maps"];

export const MapView: React.FC<MapViewProps> = ({
  organizations = [],
  selectedOrgId,
  onSelectOrg,
  center = [48.3794, 31.1656],
  zoom = 6,
  isDarkMode = false,
  onResetKey,
  onAuthError
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Отримуємо ключ виключно з process.env.API_KEY
  const apiKey = process.env.API_KEY || '';

  useEffect(() => {
    // Глобальний обробник помилок Google Maps (викликається автоматично API)
    (window as any).gm_authFailure = () => {
      console.error("Google Maps authentication failed (InvalidKeyMapError)");
      setAuthError("InvalidKeyMapError: Ключ API недійсний для Maps JavaScript API. Будь ласка, оберіть проект з активованим Google Maps.");
      // Якщо є можливість, автоматично скидаємо стан ключа в App для повторного вибору
      if (onAuthError) {
        onAuthError();
      }
    };
    return () => {
      delete (window as any).gm_authFailure;
    };
  }, [onAuthError]);

  const { isLoaded, loadError: apiLoadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries
  });

  useEffect(() => {
    if (isLoaded && (window as any).google?.maps) {
      const initAppCheck = async () => {
        try {
          const { Settings } = await (window as any).google.maps.importLibrary('core');
          if (Settings?.getInstance) {
             Settings.getInstance().fetchAppCheckToken = async () => {
               return await fetchAppCheckTokenForMaps();
             };
          }
        } catch (e) {
          console.warn("App Check for Maps init skipped:", e);
        }
      };
      initAppCheck();
    }
  }, [isLoaded]);

  const mapCenter = useMemo(() => {
    const defaultCenter = { lat: 48.3794, lng: 31.1656 };
    if (!Array.isArray(center) || center.length < 2) return defaultCenter;
    const lat = Number(center[0]);
    const lng = Number(center[1]);
    if (isNaN(lat) || isNaN(lng) || !Number.isFinite(lat)) return defaultCenter;
    return { lat, lng };
  }, [center]);

  useEffect(() => {
    if (selectedOrgId && map) {
      const org = organizations.find(o => o.id === selectedOrgId);
      if (org && typeof org.lat === 'number' && Number.isFinite(org.lat)) {
        map.panTo({ lat: org.lat, lng: org.lng });
        setActiveOrg(org);
      }
    }
  }, [selectedOrgId, map, organizations]);

  const getMarkerIcon = useCallback((isSelected: boolean) => {
    if (!(window as any).google?.maps?.Size || !(window as any).google?.maps?.Point) return undefined;
    const primaryColor = isSelected ? (isDarkMode ? '#818cf8' : '#4f46e5') : (isDarkMode ? '#2dd4bf' : '#0d9488');
    const strokeColor = isDarkMode ? '#0f172a' : '#ffffff';
    const svg = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 38C20 38 34 26.8629 34 16C34 8.26801 27.732 2 20 2C12.268 2 6 8.26801 6 16C6 26.8629 20 38 20 38Z" fill="${primaryColor}" stroke="${strokeColor}" stroke-width="2.5"/><circle cx="20" cy="16" r="6" fill="${strokeColor}"/></svg>`;
    return {
      url: `data:image/svg+xml;base64,${btoa(svg)}`,
      scaledSize: new (window as any).google.maps.Size(isSelected ? 42 : 36, isSelected ? 42 : 36),
      anchor: new (window as any).google.maps.Point(isSelected ? 21 : 18, isSelected ? 42 : 36),
    };
  }, [isDarkMode]);

  if (!apiKey) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] p-8 text-center border-2 border-dashed border-indigo-200 dark:border-indigo-900/30">
        <ShieldAlert size={48} className="text-indigo-600 mb-6" />
        <h3 className="text-xl font-black dark:text-white uppercase mb-4 tracking-tight">Потрібна активація Карт</h3>
        <p className="max-w-md text-sm text-slate-500 font-bold mb-8 italic">Для відображення мапи необхідно підключити проект з діючим ключем API.</p>
        <button onClick={onResetKey} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 flex items-center gap-2 transition-all">
          <Key size={14} /> Підключити Ключ
        </button>
      </div>
    );
  }

  if (apiLoadError || authError) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] p-8 text-center border-2 border-dashed border-rose-200 dark:border-rose-900/30 overflow-y-auto">
        <AlertTriangle size={48} className="text-rose-600 mb-6" />
        <h3 className="text-xl font-black dark:text-white uppercase mb-4 tracking-tight text-rose-600">Помилка API Карт</h3>
        <div className="max-w-md space-y-4 mb-8 text-sm text-slate-500 font-bold font-sans">
           <p>{authError || apiLoadError?.message || "Не вдалося ініціалізувати Google Maps. Це може бути через InvalidKeyMapError або відсутність дозволів."}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => window.location.reload()} className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-teal-700 shadow-xl active:scale-95 flex items-center gap-2 transition-all"><RefreshCw size={14} /> Оновити</button>
          <button onClick={onResetKey} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 shadow-xl active:scale-95 flex items-center gap-2 transition-all"><Key size={14} /> Змінити Ключ</button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-[2.5rem]">
        <div className="w-16 h-16 rounded-full border-4 border-teal-100 dark:border-teal-900/30 border-t-teal-600 animate-spin"></div>
        <span className="mt-6 text-[10px] font-black uppercase tracking-widest text-teal-600 animate-pulse font-sans">Завантаження мапи...</span>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative overflow-hidden rounded-[2.5rem] shadow-2xl transition-all duration-700">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={zoom}
        onLoad={(m) => setMap(m)}
        options={{
          styles: MODERN_MAP_STYLES(isDarkMode),
          disableDefaultUI: true,
          zoomControl: false,
          gestureHandling: 'greedy',
          clickableIcons: false,
          mapId: 'DEMO_MAP_ID' // Додавання Map ID часто вирішує проблеми з сучасними маркерами та певними обмеженнями ключів
        }}
      >
        <MarkerClusterer options={{ gridSize: 50, minimumClusterSize: 3 }}>
          {(clusterer) => (
            <>
              {organizations.filter(org => org && typeof org.lat === 'number' && Number.isFinite(org.lat)).map((org) => {
                const isSelected = selectedOrgId === org.id;
                return (
                  <MarkerF
                    key={org.id}
                    position={{ lat: org.lat, lng: org.lng }}
                    clusterer={clusterer}
                    onClick={() => { setActiveOrg(org); onSelectOrg(org.id); map?.panTo({ lat: org.lat, lng: org.lng }); }}
                    icon={getMarkerIcon(isSelected)}
                  />
                );
              })}
            </>
          )}
        </MarkerClusterer>

        {activeOrg && typeof activeOrg.lat === 'number' && (
          <InfoWindowF position={{ lat: activeOrg.lat, lng: activeOrg.lng }} onCloseClick={() => setActiveOrg(null)}>
            <div className="p-3 min-w-[240px] bg-white rounded-xl shadow-2xl text-slate-900 font-sans">
              <h3 className="font-black text-xs uppercase mb-1">{activeOrg.name}</h3>
              <p className="text-[10px] text-slate-500 mb-3 flex items-center gap-1"><MapPin size={10} /> {activeOrg.address}</p>
              <div className="flex gap-2">
                {activeOrg.phone && <a href={`tel:${activeOrg.phone.replace(/[^\d+]/g, '')}`} className="flex-1 py-2.5 bg-teal-600 text-white text-[9px] font-black uppercase rounded-lg text-center">Дзвінок</a>}
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${activeOrg.lat},${activeOrg.lng}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-lg"><Navigation size={18} /></a>
              </div>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>

      <div className="absolute bottom-8 right-8 flex flex-col gap-3 z-10">
        <div className="flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 font-sans">
          <button onClick={() => map?.setZoom((map.getZoom() || 6) + 1)} className="w-10 h-10 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 transition-colors">+</button>
          <button onClick={() => map?.setZoom((map.getZoom() || 6) - 1)} className="w-10 h-10 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors">-</button>
        </div>
        <button 
          onClick={() => {
            navigator.geolocation.getCurrentPosition((pos) => {
              const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
              if (Number.isFinite(userPos.lat)) {
                map?.panTo(userPos);
                map?.setZoom(14);
              }
            }, () => alert("Дозвольте доступ до геолокації."));
          }}
          className="w-10 h-10 bg-teal-600 text-white shadow-xl shadow-teal-600/30 rounded-2xl flex items-center justify-center hover:bg-teal-700 active:scale-90 transition-all"
        ><Navigation size={20} className="fill-current" /></button>
      </div>
    </div>
  );
};