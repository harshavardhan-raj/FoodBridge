import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api, { getImageUrl } from '../api/axios';

const ProviderDashboard = () => {
    const [stats, setStats] = useState({ active: 0, completed: 0, impact: 0, studentDeals: 0 });
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resListings = await api.get('/listings/my-listings');
                const now = new Date();
                const allListings = resListings.data;

                // Filter listings to only show those that are still available and NOT expired
                const activeListings = allListings.filter(l =>
                    l.status === 'available' && new Date(l.expiryTime) > now
                );

                setListings(activeListings.slice(0, 5));

                setStats({
                    active: activeListings.length,
                    completed: allListings.filter(l => l.status === 'picked-up').length,
                    impact: 45, // Example impact score
                    studentDeals: allListings.filter(l => l.isDiscounted).length
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <DashboardLayout title="Dashboard Overview">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Active Listings', value: stats.active, color: 'from-blue-500 to-blue-700', icon: '📦' },
                    { label: 'Pickups Completed', value: stats.completed, color: 'from-green-500 to-green-700', icon: '✅' },
                    { label: 'Student Deals', value: stats.studentDeals, color: 'from-indigo-500 to-indigo-700', icon: '🏷️' },
                    { label: 'Impact Score', value: stats.impact, color: 'from-purple-500 to-purple-700', icon: '🌱' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
                        <div className="text-4xl mb-6">{stat.icon}</div>
                        <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">{stat.label}</div>
                        <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="px-8 py-6 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent Activity</h3>
                    <button className="text-green-600 dark:text-green-400 font-black text-sm uppercase tracking-widest hover:underline">View History</button>
                </div>
                <div className="divide-y dark:divide-slate-800">
                    {listings.length === 0 ? (
                        <div className="p-16 text-center text-slate-400 dark:text-slate-500">
                            <div className="text-5xl mb-6 grayscale opacity-30">🍽️</div>
                            <p className="font-bold">Your food redistribution journey starts here.</p>
                            <p className="text-sm mt-1">Add your first listing to see impact.</p>
                        </div>
                    ) : listings.map((item) => (
                        <div key={item._id} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-[1.25rem] overflow-hidden shadow-inner flex items-center justify-center shrink-0">
                                    {item.imageUrl ? (
                                        <img
                                            src={getImageUrl(item.imageUrl)}
                                            alt={item.foodName}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=Food' }}
                                        />
                                    ) : (
                                        <span className="text-2xl">
                                            {item.category === 'cooked' ? '🍲' : item.category === 'raw' ? '🥕' : '📦'}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-white text-lg group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                        {item.foodName}
                                        {item.isDiscounted && <span className="ml-3 text-[10px] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full font-black uppercase italic">Student Deal</span>}
                                    </h4>
                                    <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">{item.category} • {(item.quantity || 0)} {item.unit} Remaining</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="hidden sm:block text-right">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Live Status</p>
                                    <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full border ${item.status === 'available'
                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/50' :
                                        item.status === 'reserved'
                                            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800/50' :
                                            'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <button className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all">
                                    <span className="text-xl">→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProviderDashboard;
