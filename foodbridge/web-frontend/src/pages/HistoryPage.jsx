import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api, { BASE_URL } from '../api/axios';

const HistoryPage = () => {
    const [listings, setListings] = useState([]);
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('completed'); // 'completed', 'spoiled', 'rejected'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const [resListings, resRequests] = await Promise.all([
                    api.get('/listings/my-listings'),
                    api.get('/requests/provider')
                ]);
                setListings(resListings.data);
                setRequests(resRequests.data);
            } catch (err) {
                console.error('Failed to fetch history:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const now = new Date();

    const completedItems = listings.filter(l => l.status === 'picked-up');
    const spoiledItems = listings.filter(l =>
        l.status !== 'picked-up' && (l.status === 'expired' || new Date(l.expiryTime) < now)
    );
    const rejectedItems = requests.filter(r => r.status === 'rejected');

    const renderTabs = () => (
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[2rem] border border-slate-200 dark:border-slate-700/50 mb-10 w-fit">
            {[
                { id: 'completed', label: 'Completed', icon: '✅' },
                { id: 'spoiled', label: 'Spoiled', icon: '⚠️' },
                { id: 'rejected', label: 'Rejected', icon: '🚫' }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`px-8 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${filter === tab.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xl shadow-slate-200/50' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                >
                    <span className="text-sm">{tab.icon}</span>
                    {tab.label}
                </button>
            ))}
        </div>
    );

    const renderEmptyState = () => (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
            <div className="text-6xl mb-8">📜</div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase italic">No {filter} History</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">Your past activities in this category will appear here.</p>
        </div>
    );

    const renderListingCard = (item) => (
        <div key={item._id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="h-40 -mx-6 -mt-6 mb-5 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                <img
                    src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${BASE_URL}${item.imageUrl}`) : 'https://via.placeholder.com/400x300?text=No+Image'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 grayscale"
                    alt={item.foodName}
                />
                <div className="absolute top-4 left-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border backdrop-blur-md ${item.status === 'picked-up' ? 'bg-green-500/90 text-white border-green-400/50' : 'bg-red-500/90 text-white border-red-400/50'
                        }`}>
                        {item.status === 'picked-up' ? 'Completed' : 'Spoiled'}
                    </span>
                </div>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white italic mb-4">{item.foodName}</h3>
            <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Quantity</span>
                    <span className="text-slate-900 dark:text-slate-200">{item.quantity} {item.unit}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Date</span>
                    <span className="text-slate-900 dark:text-slate-200">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );

    const renderRequestCard = (req) => (
        <div key={req._id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-2xl border border-red-100 dark:border-red-800/50">🚫</div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{req.listingId?.foodName || 'Deleted Item'}</h3>
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Declined Request</p>
                </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-3 border border-slate-100 dark:border-slate-700/30">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>NGO</span>
                    <span className="text-slate-900 dark:text-slate-200">{req.ngoId?.name}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Requested</span>
                    <span className="text-slate-900 dark:text-slate-200">{req.requestedQuantity} Units</span>
                </div>
            </div>
        </div>
    );

    const renderStats = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
                { label: 'Completed', value: completedItems.length, color: 'from-green-500 to-emerald-700', icon: '✅' },
                { label: 'Total Spoiled', value: spoiledItems.length, color: 'from-orange-500 to-red-700', icon: '⚠️' },
                { label: 'Total Rejected', value: rejectedItems.length, color: 'from-slate-700 to-slate-900', icon: '🚫' },
            ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
                    <div className="text-4xl mb-4">{stat.icon}</div>
                    <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">{stat.label}</div>
                    <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</div>
                </div>
            ))}
        </div>
    );

    const itemsToShow = filter === 'completed' ? completedItems : filter === 'spoiled' ? spoiledItems : rejectedItems;

    return (
        <DashboardLayout title="Action History">
            {renderStats()}

            <div className="mt-10">
                {renderTabs()}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 border-8 border-green-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <p className="font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-sm italic">Accessing archives...</p>
                </div>
            ) : itemsToShow.length === 0 ? (
                renderEmptyState()
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filter === 'rejected'
                        ? itemsToShow.map(renderRequestCard)
                        : itemsToShow.map(renderListingCard)
                    }
                </div>
            )}
        </DashboardLayout>
    );
};

export default HistoryPage;
