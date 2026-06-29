import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api, { getImageUrl } from '../api/axios';

const MyListings = () => {
    const [listings, setListings] = useState([]);
    const [filter, setFilter] = useState('active'); // 'active' or 'archived'
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchListings = async () => {
        setLoading(true);
        try {
            const res = await api.get('/listings/my-listings');
            setListings(res.data);
        } catch (err) {
            console.error('Failed to fetch listings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.patch(`/listings/${id}/status`, { status: newStatus });
            fetchListings();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const filteredListings = listings.filter(item =>
        filter === 'active' ? item.status !== 'archived' : item.status === 'archived'
    );

    return (
        <DashboardLayout title="Manage My Inventory">
            {/* Header / Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[2rem] border border-slate-200 dark:border-slate-700/50">
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-10 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${filter === 'active' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xl shadow-slate-200/50' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                    >
                        Active Listings
                    </button>
                    <button
                        onClick={() => setFilter('archived')}
                        className={`px-10 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${filter === 'archived' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xl shadow-slate-200/50' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                    >
                        Archived
                    </button>
                </div>

                <button
                    onClick={() => navigate('/provider/add-listing')}
                    className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-black px-8 py-4 rounded-[1.75rem] transition-all shadow-xl shadow-green-200 dark:shadow-none uppercase tracking-widest text-xs"
                >
                    <span className="text-xl">+</span> Add New Food
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 border-8 border-green-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <p className="font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-sm italic">Loading your inventory...</p>
                </div>
            ) : filteredListings.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
                    <div className="text-6xl mb-8">🍱</div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase italic">No {filter} Items Found</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto mb-10">Start by adding surplus food items to your inventory to share them with NGOs.</p>
                    {filter === 'active' && (
                        <button onClick={() => navigate('/provider/add-listing')} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black px-12 py-5 rounded-[2rem] hover:scale-105 transition-transform uppercase tracking-widest">Post Food Item</button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredListings.map((item) => (
                        <div key={item._id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500">
                            <div className="h-48 -mx-6 -mt-6 mb-5 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                                <img
                                    src={getImageUrl(item.imageUrl)}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt={item.foodName}
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found' }}
                                />
                                <div className="absolute top-4 left-4">
                                    {new Date(item.expiryTime) < new Date() ? (
                                        <span className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border backdrop-blur-md bg-red-500/90 text-white border-red-400/50 shadow-lg shadow-red-900/20">
                                            Spoiled ⚠️
                                        </span>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border backdrop-blur-md ${item.status === 'available' ? 'bg-green-500/90 text-white border-green-400/50' :
                                                item.status === 'archived' ? 'bg-slate-500/90 text-white border-slate-400/50' :
                                                    'bg-amber-500/90 text-white border-amber-400/50'
                                                }`}>
                                                {item.status}
                                            </span>
                                            {item.isDiscounted && (
                                                <span className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border backdrop-blur-md bg-indigo-600/90 text-white border-indigo-400/50 shadow-lg shadow-indigo-900/20">
                                                    🏷️ Student Deal
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white italic group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{item.foodName}</h3>
                                    {item.isDiscounted && (
                                        <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-1 uppercase italic tracking-wider">
                                            ${item.price} <span className="text-slate-400 line-through text-xs font-bold leading-none ml-2">${item.originalPrice}</span>
                                        </p>
                                    )}
                                </div>
                                <span className="text-xs font-black text-slate-300 dark:text-slate-600">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center gap-4 mb-6 border border-slate-100 dark:border-slate-700/30">
                                <div className="text-2xl">📦</div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Remaining Stock</p>
                                    <p className="font-bold text-slate-900 dark:text-slate-200">
                                        {item.quantity} {item.unit} Available
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate(`/provider/edit-listing/${item._id}`)}
                                    className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-4 rounded-2xl hover:bg-emerald-600 dark:hover:bg-emerald-400 dark:hover:text-white transition-all uppercase tracking-widest text-xs"
                                >
                                    Edit
                                </button>
                                {item.status === 'archived' ? (
                                    <button
                                        onClick={() => handleStatusUpdate(item._id, 'available')}
                                        className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 text-slate-900 dark:text-white font-black py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all uppercase tracking-widest text-xs"
                                    >
                                        Unarchive
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleStatusUpdate(item._id, 'archived')}
                                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-black py-4 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-900/50 transition-all uppercase tracking-widest text-xs"
                                    >
                                        Archive
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
};

export default MyListings;
