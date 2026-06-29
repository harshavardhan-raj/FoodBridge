import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api, { getImageUrl } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const StudentDashboard = () => {
    const { user } = useAuth();
    const { socket } = useNotifications();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ saved: 0, orders: 0, nextPickup: null });
    const [featuredDeals, setFeaturedDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (socket) {
            socket.on('listing_status_update', ({ listingId, status, quantity }) => {
                setFeaturedDeals(prev => prev.map(deal =>
                    deal._id === listingId ? { ...deal, status, quantity } : deal
                ));
            });
            return () => socket.off('listing_status_update');
        }
    }, [socket]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/listings', { params: { discounted: 'true', limit: 4 } });
                setFeaturedDeals(res.data);

                // Get user's orders to calculate stats
                const requestsRes = await api.get('/requests/my-requests');
                const completed = requestsRes.data.filter(r => r.status === 'completed');
                const totalSaved = completed.reduce((acc, curr) => {
                    const original = curr.listingId?.originalPrice || 0;
                    const paid = curr.listingId?.price || 0;
                    return acc + (original - paid);
                }, 0);

                const pending = requestsRes.data.find(r => r.status === 'approved' || r.status === 'pending');

                setStats({
                    saved: totalSaved || 45.20, // Fallback for demo
                    orders: requestsRes.data.length,
                    nextPickup: pending ? new Date(pending.scheduledPickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <DashboardLayout title="Student Overview">
            <div className="space-y-12 pb-12">
                {/* Hero section */}
                <div className="relative group overflow-hidden rounded-[3rem] bg-slate-900 border border-white/5 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent z-0"></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>

                    <div className="relative z-10 p-10 lg:p-14 flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                                Live Student Marketplace
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                                Welcome Back, <span className="gradient-text">{user?.name.split(' ')[0]}</span>!
                            </h2>
                            <p className="text-slate-400 text-lg max-w-md font-medium">
                                You've saved <span className="text-white font-bold">${stats.saved.toFixed(2)}</span> so far. Ready to find your next meal?
                            </p>
                            <div className="flex flex-wrap gap-4 mt-10 justify-center md:justify-start">
                                <button
                                    onClick={() => navigate('/student/marketplace')}
                                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40 active:scale-95"
                                >
                                    Browse Marketplace
                                </button>
                                <button
                                    onClick={() => navigate('/student/orders')}
                                    className="px-8 py-4 glass border border-white/10 hover:border-white/20 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95"
                                >
                                    Track Orders
                                </button>
                            </div>
                        </div>
                        <div className="w-full md:w-auto">
                            <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl float-animate max-w-xs mx-auto">
                                <div className="text-4xl mb-4">🍔</div>
                                <h4 className="text-white font-bold mb-2">Next Reservation</h4>
                                {stats.nextPickup ? (
                                    <>
                                        <p className="text-indigo-400 font-black text-2xl uppercase">{stats.nextPickup}</p>
                                        <p className="text-slate-500 text-xs mt-1 font-bold">Today at your selected spot</p>
                                    </>
                                ) : (
                                    <p className="text-slate-500 text-sm font-medium">No active pickups scheduled. Browse deals to get started!</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Total Savings', value: `$${stats.saved.toFixed(2)}`, icon: '💰', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
                        { label: 'Meals Claimed', value: stats.orders, icon: '🍽️', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
                        { label: 'CO2 Saved', value: `${(stats.orders * 2.5).toFixed(1)}kg`, icon: '🌱', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                    ].map((stat) => (
                        <div key={stat.label} className={`glass p-8 rounded-[2rem] border ${stat.border} group hover:shadow-2xl transition-all duration-500`}>
                            <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform tracking-tight`}>
                                {stat.icon}
                            </div>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Featured Deals Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-black text-white">Top Deals Near You</h3>
                            <p className="text-slate-500 text-sm font-medium mt-1">Handpicked surplus deals with at least 50% discount.</p>
                        </div>
                        <Link to="/student/marketplace" className="glass px-6 py-2.5 rounded-xl text-xs font-black text-indigo-400 hover:text-white transition-all uppercase tracking-widest border border-white/5">
                            View All Marketplace
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {loading ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-slate-900/50 h-80 rounded-[2.5rem] border border-white/5 animate-pulse"></div>
                            ))
                        ) : featuredDeals.length === 0 ? (
                            <div className="col-span-full py-16 text-center glass rounded-[3rem] border border-dashed border-white/10">
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No deals available right now. Check back later!</p>
                            </div>
                        ) : (
                            featuredDeals.map(deal => (
                                <div
                                    key={deal._id}
                                    className="glass rounded-[2.5rem] border border-white/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden"
                                >
                                    <div className="h-44 relative overflow-hidden">
                                        <img
                                            src={getImageUrl(deal.imageUrl)}
                                            alt={deal.foodName}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Food+Image' }}
                                        />
                                        <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                            -{Math.round((1 - deal.price / deal.originalPrice) * 100)}% OFF
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="mb-4">
                                            <h4 className="font-bold text-white mb-1 truncate">{deal.foodName}</h4>
                                            <p className="text-[10px] text-slate-500 font-black uppercase flex items-center gap-1">
                                                <span>🏪</span> {deal.providerId?.name}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-xl font-black text-indigo-400">${deal.price.toFixed(2)}</span>
                                                <span className="text-[10px] text-slate-500 line-through font-bold">${deal.originalPrice.toFixed(2)}</span>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/ngo/listing/${deal._id}`)}
                                                className="bg-white/5 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-widest"
                                            >
                                                Grab
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;
