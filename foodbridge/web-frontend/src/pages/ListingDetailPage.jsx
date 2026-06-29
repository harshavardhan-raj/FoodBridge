import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import DashboardLayout from '../components/DashboardLayout';
import NGOFoodMap from '../components/NGOFoodMap';
import api, { getImageUrl } from '../api/axios';

const ListingDetailPage = () => {
    const { user } = useAuth();
    const { socket } = useNotifications();
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [requestedQuantity, setRequestedQuantity] = useState(1);
    const [scheduledPickupTime, setScheduledPickupTime] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if (socket) {
            socket.on('listing_status_update', ({ listingId, status, quantity }) => {
                if (listingId === id) {
                    setListing(prev => ({ ...prev, status, quantity }));
                }
            });
            return () => socket.off('listing_status_update');
        }
    }, [socket, id]);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await api.get(`/listings/${id}`);
                const fetchedListing = res.data;

                setListing(fetchedListing);
                setRequestedQuantity(1);
                setScheduledPickupTime(fetchedListing.pickupTime ? new Date(fetchedListing.pickupTime).toISOString().slice(0, 16) : '');
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [id]);

    const handleRequest = async () => {
        if (!scheduledPickupTime) {
            alert('Please select a pickup time');
            return;
        }

        try {
            await api.post('/requests', {
                listingId: id,
                requestedQuantity,
                scheduledPickupTime,
                notes
            });
            setShowSuccessModal(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send request');
        }
    };

    if (loading) return <DashboardLayout title="Loading Details..."></DashboardLayout>;
    if (!listing) return <DashboardLayout title="Not Found">Listing not found.</DashboardLayout>;

    return (
        <DashboardLayout title="Food Item Details">
            <div className={`grid grid-cols-1 ${(user?.role === 'ngo' || (user?.role === 'student' && listing.isDiscounted)) ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-10`}>
                {/* Left Column: Details and Map */}
                <div className={`${(user?.role === 'ngo' || (user?.role === 'student' && listing.isDiscounted)) ? 'lg:col-span-2' : 'lg:col-span-1'} space-y-8`}>
                    {/* Main Details Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-300">
                        <img
                            src={getImageUrl(listing.imageUrl)}
                            className="w-full h-[400px] object-cover"
                            alt={listing.foodName}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x400?text=Image+Not+Found' }}
                        />
                        <div className="p-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight italic">{listing.foodName}</h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                        <span className="text-xl grayscale opacity-50">🏠</span> Distributed by {listing.providerId?.name}
                                    </p>
                                </div>
                                {new Date(listing.expiryTime) < new Date() ? (
                                    <span className="px-5 py-2 rounded-full font-black uppercase text-[10px] tracking-widest border bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800/50">
                                        Spoiled
                                    </span>
                                ) : (
                                    <span className={`px-5 py-2 rounded-full font-black uppercase text-[10px] tracking-widest border ${listing.status === 'available' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/50' :
                                        'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                        }`}>
                                        {listing.status === 'picked-up' ? 'Sold' : listing.status}
                                    </span>
                                )}
                                {listing.isDiscounted && (
                                    <div className="flex flex-col items-end">
                                        <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg mb-1">Student Deal</span>
                                        <span className="text-2xl font-black text-indigo-600">${listing.price?.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Status and Action Hub */}
                            <div className={`p-8 rounded-[2.5rem] mb-10 flex flex-col md:flex-row gap-8 items-center border border-white/5 shadow-2xl transition-all duration-500 ${new Date(listing.expiryTime) < new Date()
                                ? 'bg-red-600 dark:bg-red-900/40 text-white shadow-red-200 dark:shadow-none'
                                : 'bg-slate-900 dark:bg-slate-800 text-white shadow-slate-200 dark:shadow-none'
                                }`}>
                                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-[2rem] flex items-center justify-center text-3xl font-black shrink-0 shadow-lg">
                                    {listing.providerId?.name?.[0]?.toUpperCase()}
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-3xl font-black mb-1 uppercase italic tracking-tight">
                                        {new Date(listing.expiryTime) < new Date() ? 'Item has Spoiled' :
                                            listing.status === 'picked-up' ? 'Deal Sold Out' : 'Ready for Pickup'}
                                    </h2>
                                    <p className="text-white/70 font-medium">
                                        {new Date(listing.expiryTime) < new Date()
                                            ? 'This food item has passed its expiration time and is no longer available.'
                                            : listing.status === 'picked-up'
                                                ? 'This deal has already been claimed and picked up.'
                                                : user?.role === 'student'
                                                    ? 'Grab this exclusive student deal before it expires!'
                                                    : 'This surplus food is verified and waiting to be claimed by an NGO.'
                                        }
                                    </p>
                                </div>
                                {new Date(listing.expiryTime) >= new Date() && listing.status !== 'picked-up' && listing.providerId?.phone && (
                                    <a
                                        href={`tel:${listing.providerId.phone}`}
                                        className="w-full md:w-auto bg-white text-slate-900 hover:bg-green-400 hover:text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 whitespace-nowrap"
                                    >
                                        Establish Contact
                                    </a>
                                )}
                            </div>

                            <div className="space-y-4 mb-10">
                                <h5 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Listing Description</h5>
                                <p className="text-xl font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">"{listing.description || "Fresh surplus food ready for redistribution."}"</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Category</p>
                                    <p className="font-black text-slate-900 dark:text-white capitalize">{listing.category}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Available Inventory</p>
                                    <span className="text-2xl font-black text-slate-900">{listing.quantity} {listing.unit}</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Window</p>
                                    <p className="font-black text-slate-900 dark:text-white">
                                        {new Date(listing.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-red-50 dark:border-red-900/20">
                                    <p className="text-[10px] font-black text-red-400/80 dark:text-red-500/80 uppercase tracking-widest mb-1">Expires By</p>
                                    <p className="font-black text-red-600 dark:text-red-400">
                                        {new Date(listing.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-wrap gap-3 p-10 pt-0">
                            {listing.isConsumerSurplus && (
                                <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800/50">🏠 Household Surplus</span>
                            )}
                            {listing.bulkQuantity && (
                                <span className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-100 dark:border-amber-800/50">📦 Bulk Quantity</span>
                            )}
                            {listing.advanceListing && (
                                <span className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-purple-100 dark:border-purple-800/50">⏰ Advance Posting</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Map Interaction */}
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <span className="text-3xl">📍</span> Pickup Logistics
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{listing.address?.split(',')[0]} Area</p>
                    </div>
                    {listing.location?.coordinates && (
                        <div className="h-[450px] rounded-[2.5rem] overflow-hidden mb-6 border-8 border-slate-50 dark:border-slate-800 shadow-inner group relative">
                            <NGOFoodMap
                                listings={[listing]}
                                userLocation={[listing.location.coordinates[1], listing.location.coordinates[0]]}
                            />
                            <div className="absolute inset-0 pointer-events-none border border-black/5 dark:border-white/5 rounded-[2rem]"></div>
                        </div>
                    )}
                    <p className="text-lg font-bold text-slate-500 dark:text-slate-400 ml-2 italic">"{listing.address || "Location details provided upon request approval."}"</p>
                </div>

                {/* Right Column: Interaction Hub (NGO Only) */}
                {user?.role === 'ngo' && new Date(listing.expiryTime) >= new Date() && listing.status !== 'picked-up' && (
                    <div className="space-y-8">
                        <div className="bg-slate-900 dark:bg-slate-950 text-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 dark:shadow-none transition-all duration-500 border border-white/5">
                            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/10">
                                <span className="text-3xl">📥</span>
                                <h3 className="text-2xl font-black tracking-tight">Acquisition Hub</h3>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Volume Selection</label>
                                    <div className="flex items-center gap-4 bg-white/5 dark:bg-black/20 rounded-[1.75rem] p-3 border border-white/5">
                                        <button
                                            onClick={() => setRequestedQuantity(Math.max(1, requestedQuantity - 1))}
                                            className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-emerald-600 transition-all font-black text-2xl"
                                        >-</button>
                                        <div className="flex-1 text-center">
                                            <input
                                                type="number"
                                                className="w-full bg-transparent text-center font-black text-3xl outline-none"
                                                value={requestedQuantity}
                                                onChange={(e) => {
                                                    setRequestedQuantity(Math.min(listing.quantity, parseInt(e.target.value) || 1));
                                                }}
                                            />
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{listing.unit} UNIT</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setRequestedQuantity(Math.min(listing.quantity, requestedQuantity + 1));
                                            }}
                                            className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-emerald-600 transition-all font-black text-2xl"
                                        >+</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Arrival Window</label>
                                    <div className="relative group">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-lg opacity-50 group-focus-within:opacity-100 transition-opacity">📅</span>
                                        <input
                                            type="datetime-local"
                                            className="w-full bg-white/5 dark:bg-black/20 border border-white/5 rounded-[1.75rem] pl-14 pr-6 py-5 font-black text-sm outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            value={scheduledPickupTime}
                                            onChange={(e) => setScheduledPickupTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Manifest Notes</label>
                                    <textarea
                                        className="w-full bg-white/5 dark:bg-black/20 border border-white/5 rounded-[1.75rem] p-6 font-bold text-sm outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[140px] resize-none"
                                        placeholder="Specify transport requirements or distribution plan..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="pt-6 border-t border-white/10 space-y-3">
                                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-500">
                                        <span>Current Stock Level</span>
                                        <span>{listing.quantity} {listing.unit}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-2xl font-black">
                                        <span className="text-slate-400 italic">Allocation</span>
                                        <span className="text-green-500">{requestedQuantity} {listing.unit}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleRequest}
                                    className="w-full bg-green-600 hover:bg-emerald-500 text-white font-black py-6 rounded-[2rem] transition-all shadow-2xl shadow-green-900/40 uppercase tracking-[0.2em] text-xs disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group"
                                    disabled={listing.status !== 'available' || listing.quantity <= 0}
                                >
                                    {(listing.status === 'available' && listing.quantity > 0) ? (
                                        <span className="flex items-center justify-center gap-3">
                                            Initialize Request <span className="translate-x-0 group-hover:translate-x-2 transition-transform">→</span>
                                        </span>
                                    ) : 'Supply Exhausted'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-green-100 dark:border-green-800/50">🛡️</div>
                                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Food Integrity Protocol</h4>
                            </div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                                Provider warrants that all surplus items are curated, stored, and staged under strict compliance with regional health standards and cold-chain integrity protocols.
                            </p>
                        </div>
                    </div>
                )}

                {/* Right Column: Interaction Hub (Student Only for Deals) */}
                {user?.role === 'student' && listing.isDiscounted && new Date(listing.expiryTime) >= new Date() && (
                    <div className="space-y-8">
                        <div className="bg-indigo-900 text-white p-10 rounded-[3rem] shadow-2xl shadow-indigo-200 transition-all duration-500 border border-white/5">
                            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/10">
                                <span className="text-3xl">🛍️</span>
                                <h3 className="text-2xl font-black uppercase italic tracking-widest">Student Deal Hub</h3>
                            </div>

                            <div className="space-y-8">
                                <div className="p-8 rounded-[2rem] bg-indigo-800/50 border border-indigo-400/20 text-center">
                                    <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-2 italic">You Pay</p>
                                    <h3 className="text-5xl font-black italic tracking-tighter">${listing.price?.toFixed(2)}</h3>
                                    <p className="text-xs text-indigo-200 mt-2 font-black line-through opacity-60">Originally ${listing.originalPrice?.toFixed(2)}</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] ml-1">Special Pickup Notes</label>
                                    <textarea
                                        className="w-full bg-indigo-800/30 border border-indigo-400/20 rounded-[1.75rem] p-6 font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-500/40 focus:border-white/20 transition-all min-h-[140px] resize-none text-white placeholder-indigo-300/50"
                                        placeholder="Let the provider know when you're coming by..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    ></textarea>
                                </div>

                                <button
                                    onClick={handleRequest}
                                    className="w-full bg-white text-indigo-900 font-black py-6 rounded-[2rem] transition-all shadow-2xl shadow-indigo-900/40 uppercase tracking-[0.2em] text-xs hover:bg-slate-900 hover:text-white group disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={listing.status !== 'available'}
                                >
                                    {listing.status === 'available' ? (
                                        <span className="flex items-center justify-center gap-3">
                                            Reserve Deal Now <span className="translate-x-0 group-hover:translate-x-2 transition-transform">→</span>
                                        </span>
                                    ) : listing.status === 'picked-up' ? 'Deal Sold' : 'Deal Grabbed'}
                                </button>

                                <p className="text-[10px] text-center text-indigo-200/60 font-black uppercase tracking-widest mt-4 italic">
                                    Show student ID at pickup location
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-indigo-100">🎓</div>
                                <h4 className="font-black text-slate-900 uppercase tracking-tighter">Student Privilege</h4>
                            </div>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                                This price is exclusively for students. By grabbing this deal, you agree to show your valid student ID upon arrival at the provider location.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500"></div>
                    <div className="relative glass w-full max-w-lg rounded-[3.5rem] p-10 lg:p-16 border border-white/10 shadow-2xl text-center transform animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-[2.5rem] flex items-center justify-center text-4xl mb-8 mx-auto shadow-2xl shadow-green-500/20 float-animate">
                            ✨
                        </div>
                        <h2 className="text-4xl font-black text-white mb-4 tracking-tight uppercase italic">Order Confirmed!</h2>
                        <p className="text-slate-400 font-medium text-lg leading-relaxed mb-10">
                            Your reservation is locked in. The provider has been notified and is preparing your meal.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    if (user?.role === 'student') navigate('/student/orders');
                                    else navigate('/ngo/requests');
                                }}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-900/40 uppercase tracking-widest text-xs active:scale-95"
                            >
                                Track Your Order
                            </button>
                            <button
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    if (user?.role === 'student') navigate('/student/dashboard');
                                    else navigate('/ngo/dashboard');
                                }}
                                className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-5 rounded-2xl transition-all border border-white/10 uppercase tracking-widest text-xs"
                            >
                                Return to Dashboard
                            </button>
                        </div>

                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-8 opacity-50">
                            FoodBridge • Secure Transaction
                        </p>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ListingDetailPage;
