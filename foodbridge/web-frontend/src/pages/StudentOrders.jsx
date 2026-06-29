import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api, { getImageUrl } from '../api/axios';

const StudentOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Students use the same 'requests' endpoint as NGOs 
                const res = await api.get('/requests/my-requests');
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'approved': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'picked-up': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-white/5 text-slate-400 border-white/10';
        }
    };

    return (
        <DashboardLayout title="Deal History">
            <div className="max-w-5xl mx-auto space-y-10 pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Your Reservations 📦</h2>
                        <p className="text-slate-500 font-medium">Keep track of your active and past food deal orders.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-slate-900/50 rounded-[2.5rem] border border-white/5 animate-pulse shadow-2xl"></div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="glass p-20 text-center rounded-[4rem] border border-dashed border-white/10">
                        <div className="text-7xl mb-10">🏜️</div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">No reservations yet</h3>
                        <p className="text-slate-500 mt-3 mb-12 font-medium">You haven't grabbed any special deals yet. Time to change that?</p>
                        <button
                            onClick={() => navigate('/student/marketplace')}
                            className="bg-indigo-600 text-white px-10 py-4.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-900/40 hover:bg-white hover:text-slate-900 transition-all active:scale-95"
                        >
                            Explore Marketplace
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="glass p-8 rounded-[3rem] border border-white/5 shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 flex flex-col md:flex-row items-center gap-8 group"
                            >
                                <div className="relative">
                                    <img
                                        src={getImageUrl(order.listingId?.imageUrl)}
                                        className="w-24 h-24 rounded-[2rem] object-cover shadow-2xl group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Food' }}
                                        alt="Food"
                                    />
                                    {order.status === 'completed' && (
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white border-4 border-slate-900 text-xs font-black">✓</div>
                                    )}
                                </div>

                                <div className="flex-1 text-center md:text-left space-y-2">
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-2">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/5 text-slate-500 border border-white/5">
                                            #{order._id.slice(-6)}
                                        </span>
                                    </div>
                                    <h4 className="font-black text-white text-xl uppercase tracking-tight truncate max-w-md">
                                        {order.listingId?.foodName || 'Item Unavailable'}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center justify-center md:justify-start gap-1.5">
                                        <span>🛒</span> {order.listingId?.providerId?.name} • {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex flex-col items-center md:items-end gap-3 min-w-[140px] border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
                                    <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest mb-1">Pick up cost</p>
                                    <div className="flex items-center gap-3">
                                        {order.listingId?.isDiscounted && (
                                            <p className="text-2xl font-black text-indigo-400 leading-none">${order.listingId?.price?.toFixed(2)}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => navigate(`/ngo/listing/${order.listingId?._id}`)}
                                        className="mt-4 w-full md:w-auto bg-white/5 hover:bg-white hover:text-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] transition-all uppercase tracking-widest"
                                    >
                                        Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default StudentOrders;
