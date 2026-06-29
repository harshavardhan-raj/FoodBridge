import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DashboardLayout from '../components/DashboardLayout';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const NGODiscoveryPage = () => {
    const { user } = useAuth();
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ ngos: 0, providers: 0 });
    const [currentLocation, setCurrentLocation] = useState(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.warn("Geolocation access denied or failed. Using fallback.");
                }
            );
        }
    }, []);

    const userLng = currentLocation?.[1] || user?.location?.coordinates?.[0] || 78.9629;
    const userLat = currentLocation?.[0] || user?.location?.coordinates?.[1] || 20.5937;

    const handleLocateMe = () => {
        if (navigator.geolocation && map) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], 13);
            });
        }
    };

    // Custom Icons
    const createIcon = (color) => new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const blueIcon = createIcon('blue');
    const redIcon = createIcon('red');

    useEffect(() => {
        const fetchNetwork = async () => {
            try {
                const params = { lat: userLat, lng: userLng, radius: 25000 };
                const [ngoRes, providerRes] = await Promise.all([
                    api.get('/discovery/ngos', { params }),
                    api.get('/discovery/providers', { params })
                ]);

                const combined = [
                    ...ngoRes.data.map(n => ({ ...n, type: 'ngo' })),
                    ...providerRes.data.map(p => ({ ...p, type: 'provider' }))
                ];

                setPartners(combined);
                setStats({
                    ngos: ngoRes.data.length,
                    providers: providerRes.data.length
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNetwork();
    }, [userLat, userLng]);

    return (
        <DashboardLayout title="Map View">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats Sidebar */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl border border-white/5">
                        <div className="space-y-6">
                            <div>
                                <p className="text-slate-400 text-xs font-black uppercase mb-2">Verified NGOs</p>
                                <h3 className="text-4xl font-black text-blue-400">{stats.ngos}</h3>
                            </div>
                            <div className="pt-6 border-t border-white/10">
                                <p className="text-slate-400 text-xs font-black uppercase mb-2">Active Providers</p>
                                <h3 className="text-4xl font-black text-red-400">{stats.providers}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-4 px-2">Network Directory</h4>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {partners.map(partner => (
                                <div key={partner._id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${partner.type === 'ngo' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                                        {partner.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate">{partner.name}</p>
                                        <p className="text-[10px] text-slate-400 truncate capitalize">{partner.type} • {partner.address}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Map View */}
                <div className="lg:col-span-3">
                    <div className="h-[700px] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative">
                        <MapContainer
                            key={`${userLat}-${userLng}`}
                            center={[userLat, userLng]}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                            ref={setMap}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {partners.map(partner => (
                                partner.location?.coordinates && (
                                    <Marker
                                        key={partner._id}
                                        position={[partner.location.coordinates[1], partner.location.coordinates[0]]}
                                        icon={partner.type === 'ngo' ? blueIcon : redIcon}
                                    >
                                        <Popup>
                                            <div className="p-2">
                                                <h3 className="font-bold text-slate-900">{partner.name}</h3>
                                                <p className="text-xs text-slate-500 mb-2">{partner.address}</p>
                                                <p className="text-xs font-bold text-slate-400 uppercase">{partner.type}</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )
                            ))}
                        </MapContainer>

                        {/* Locate Me Button */}
                        <button
                            onClick={handleLocateMe}
                            className="absolute bottom-6 right-6 z-[1000] bg-white p-3 rounded-2xl shadow-2xl hover:bg-slate-50 border border-slate-100 transition-all active:scale-95"
                            title="Locate Me"
                        >
                            <span className="text-xl">📍</span>
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default NGODiscoveryPage;
