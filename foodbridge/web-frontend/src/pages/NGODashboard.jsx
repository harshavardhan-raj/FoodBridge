import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import NGOFoodMap from '../components/NGOFoodMap';
import api, { getImageUrl } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const NGODashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [filters, setFilters] = useState({ category: '', radius: 25000, search: '' });
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
    const [currentLocation, setCurrentLocation] = useState(null);

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

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    };

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                const res = await api.get('/listings', {
                    params: { lat: userLat, lng: userLng, ...filters }
                });
                setListings(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, [filters, userLat, userLng]);

    return (
        <DashboardLayout title="Find Surplus Food">
            {/* Search & Filters */}
            <div className="flex flex-col xl:flex-row gap-4 mb-8 items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex-1 relative w-full">
                    <input
                        type="text"
                        placeholder="Search for food, provider, or dish..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none shadow-inner outline-none focus:ring-2 focus:ring-green-600/20 font-medium"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50">🔍</span>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-4 w-full xl:w-auto">
                    <div className="flex-1 md:flex-none flex items-center gap-2 bg-slate-50 px-4 rounded-2xl border border-slate-100">
                        <span className="text-xs font-black text-slate-400 uppercase">Category:</span>
                        <select
                            className="bg-transparent py-4 outline-none font-bold text-slate-900 pr-4"
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        >
                            <option value="">All</option>
                            <option value="cooked">Cooked</option>
                            <option value="raw">Raw</option>
                            <option value="packaged">Packaged</option>
                        </select>
                    </div>

                    <div className="flex-1 md:flex-none flex items-center gap-2 bg-slate-50 px-4 rounded-2xl border border-slate-100 italic">
                        <span className="text-xs font-black text-slate-400 uppercase">Within:</span>
                        <select
                            className="bg-transparent py-4 outline-none font-bold text-slate-900 pr-4"
                            value={filters.radius}
                            onChange={(e) => setFilters({ ...filters, radius: parseInt(e.target.value) })}
                        >
                            <option value={1000}>1 km</option>
                            <option value={2000}>2 km</option>
                            <option value={5000}>5 km</option>
                            <option value={10000}>10 km</option>
                            <option value={25000}>25 km</option>
                        </select>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            LIST
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            MAP
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* List View */}
                <div className={`${viewMode === 'map' ? 'hidden lg:block' : 'block'} space-y-4`}>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span>📍</span> Available Nearby ({listings.length})
                    </h3>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-[2rem]"></div>
                            ))}
                        </div>
                    ) : listings.length === 0 ? (
                        <div className="bg-white p-12 text-center rounded-[2rem] border border-dashed border-slate-200">
                            <p className="text-slate-400">No surplus food found in this area yet.</p>
                        </div>
                    ) : listings.map((listing) => (
                        <div key={listing._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-4">
                                    <img
                                        src={getImageUrl(listing.imageUrl)}
                                        alt={listing.foodName}
                                        className="w-16 h-16 rounded-2xl object-cover shadow-sm"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found' }}
                                    />
                                    <div>
                                        <h4 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors">{listing.foodName}</h4>
                                        <p className="text-sm text-slate-500">
                                            {listing.providerId.name} • {
                                                listing.location?.coordinates && userLat && userLng
                                                    ? calculateDistance(userLat, userLng, listing.location.coordinates[1], listing.location.coordinates[0])
                                                    : '?'
                                            } km away
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                    {listing.quantity} {listing.unit} Available
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-6">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                                    <span>⏰ Pickup by:</span>
                                    <span className="text-slate-700">{new Date(listing.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                {new Date(listing.expiryTime) < new Date() ? (
                                    <button
                                        disabled
                                        className="bg-red-500/10 text-red-500 text-sm font-black px-6 py-2.5 rounded-xl border border-red-500/20 cursor-not-allowed uppercase tracking-widest"
                                    >
                                        Spoiled ⚠️
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => navigate(`/ngo/listing/${listing._id}`)}
                                        className="bg-slate-900 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-green-600 transition-colors"
                                    >
                                        Reserve
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Map Interface */}
                <div className={`${viewMode === 'list' ? 'hidden lg:block' : 'block'}`}>
                    <NGOFoodMap listings={listings} userLocation={[userLat, userLng]} />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default NGODashboard;
