import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api, { getImageUrl } from '../api/axios';
import { useNotifications } from '../context/NotificationContext';

const StudentMarketplace = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ category: '', search: '' });
    const { socket } = useNotifications();
    const navigate = useNavigate();

    useEffect(() => {
        if (socket) {
            socket.on('listing_status_update', ({ listingId, status, quantity }) => {
                setDeals(prev => prev.map(deal =>
                    deal._id === listingId ? { ...deal, status, quantity } : deal
                ));
            });
            return () => socket.off('listing_status_update');
        }
    }, [socket]);

    useEffect(() => {
        const fetchDeals = async () => {
            setLoading(true);
            try {
                const res = await api.get('/listings', {
                    params: { discounted: 'true', ...filters }
                });
                setDeals(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDeals();
    }, [filters]);

    return (
        <DashboardLayout title="Deal Tracker">
            <div className="space-y-10 pb-12">
                {/* Search & Filters Section */}
                <div className="glass p-8 rounded-[3rem] border border-white/5 shadow-2xl space-y-6">
                    <div>
                        <h2 className="text-2xl font-black text-white mb-1">Local Savings 🗺️</h2>
                        <p className="text-slate-500 text-sm font-medium">Find exclusive student discounts on nearby surplus food.</p>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-4 items-center">
                        <div className="flex-1 relative w-full">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-50">🔍</span>
                            <input
                                type="text"
                                placeholder="Search for food, bakery, or dish name..."
                                className="w-full pl-14 pr-4 py-5 rounded-[2rem] bg-white/5 border border-white/5 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium transition-all"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-wrap md:flex-nowrap gap-4 w-full xl:w-auto">
                            <div className="flex-1 md:flex-none flex items-center gap-3 bg-white/5 px-6 rounded-[2rem] border border-white/5">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Category:</span>
                                <select
                                    className="bg-transparent py-5 outline-none font-bold text-white pr-4 appearance-none cursor-pointer"
                                    value={filters.category}
                                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                >
                                    <option value="" className="bg-slate-900">All Items</option>
                                    <option value="cooked" className="bg-slate-900">Cooked Meals</option>
                                    <option value="raw" className="bg-slate-900">Ingredients</option>
                                    <option value="packaged" className="bg-slate-900">Packaged Goods</option>
                                    <option value="beverages" className="bg-slate-900">Beverages</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Marketplace Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {loading ? (
                        [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="bg-slate-900/50 h-[28rem] rounded-[3rem] border border-white/5 animate-pulse"></div>
                        ))
                    ) : deals.length === 0 ? (
                        <div className="col-span-full py-24 text-center glass rounded-[4rem] border border-dashed border-white/10">
                            <div className="text-7xl mb-8">🍔</div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Nothing here yet</h3>
                            <p className="text-slate-500 mt-3 font-medium max-w-sm mx-auto">No student deals match your search. Try broadening your criteria or checking back later!</p>
                        </div>
                    ) : deals.map(deal => (
                        <div
                            key={deal._id}
                            className="glass rounded-[3rem] border border-white/5 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 overflow-hidden group flex flex-col h-full bg-gradient-to-b from-transparent to-white/5"
                        >
                            <div className="h-56 relative overflow-hidden">
                                <img
                                    src={getImageUrl(deal.imageUrl)}
                                    alt={deal.foodName}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Food+Image' }}
                                />
                                <div className="absolute top-5 left-5 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl">
                                    -{Math.round((1 - deal.price / deal.originalPrice) * 100)}% OFF
                                </div>
                                {deal.status === 'picked-up' && (
                                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                        <div className="bg-red-600 text-white px-8 py-3 rounded-2xl font-black text-2xl uppercase italic tracking-tighter shadow-2xl border-2 border-white/20 -rotate-12 animate-in zoom-in-50 duration-300">
                                            Sold Out
                                        </div>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-5 right-5 glass px-4 py-2 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                                    ⏰ {new Date(deal.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-1">
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest truncate">
                                            {deal.providerId?.name}
                                        </p>
                                    </div>
                                    <h4 className="font-black text-white text-xl leading-tight truncate">
                                        {deal.foodName}
                                    </h4>
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/5">
                                    <div className="flex items-end justify-between mb-8">
                                        <div className="flex flex-col">
                                            <span className="text-3xl font-black text-indigo-400 leading-none">${deal.price?.toFixed(2)}</span>
                                            <span className="text-xs text-slate-600 line-through font-bold mt-2 tracking-wider">${deal.originalPrice?.toFixed(2)}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-600 uppercase mb-1 tracking-widest">Available until</p>
                                            <p className="text-xs font-bold text-white">{new Date(deal.pickupTime).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/ngo/listing/${deal._id}`)}
                                        className="w-full bg-indigo-600 text-white py-4.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/40 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={deal.status === 'picked-up' || deal.quantity <= 0}
                                    >
                                        {deal.status === 'picked-up' ? 'Deal Sold Out' : 'Grab Deal ↗'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentMarketplace;
