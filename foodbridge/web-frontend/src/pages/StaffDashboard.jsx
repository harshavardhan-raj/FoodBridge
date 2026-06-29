import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../api/axios';

const StaffDashboard = () => {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchConsumerSurplus = async () => {
            try {
                // Fetch listings of type 'consumer' that are 'pending-verification'
                const res = await api.get('/listings', { params: { type: 'consumer', status: 'pending' } });
                setListings(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchConsumerSurplus();
    }, []);

    const handleVerify = async (listingId) => {
        try {
            await api.patch(`/listings/${listingId}/status`, { status: 'available' });
            setListings(listings.filter(l => l._id !== listingId));
        } catch (err) {
            alert('Verification failed');
        }
    };

    return (
        <DashboardLayout title="Consumer Surplus Verification">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b">
                    <h3 className="text-xl font-bold text-slate-900">Items Awaiting Inspection</h3>
                </div>
                <div className="divide-y">
                    {listings.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 font-medium">✅ All consumer items have been inspected!</div>
                    ) : listings.map(item => (
                        <div key={item._id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">🧺</div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{item.foodName}</h4>
                                    <p className="text-sm text-slate-500">{item.providerId?.name} • {item.quantity} {item.unit}</p>
                                    <p className="text-xs text-slate-400 mt-1">📍 {item.location?.address || 'Private Residence'}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleVerify(item._id)}
                                    className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                >
                                    Approve Safety
                                </button>
                                <button className="bg-white border border-slate-200 text-slate-400 font-bold px-6 py-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StaffDashboard;
