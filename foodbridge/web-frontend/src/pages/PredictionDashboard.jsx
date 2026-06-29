import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, Legend, Cell
} from 'recharts';

const PredictionDashboard = () => {
    const { user } = useAuth();
    const [predictions, setPredictions] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isTraining, setIsTraining] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const userId = user?._id || user?.id;

            if (user.role === 'provider' && userId) {
                const predRes = await api.get(`/predictions/predict/${userId}`);
                // Check if result is a valid prediction (not the "no data" message)
                const hasPrediction = predRes.data && (predRes.data._id || predRes.data.expectedQuantity !== undefined);
                setPredictions(hasPrediction ? [predRes.data] : []);

                const statRes = await api.get('/predictions/accuracy');
                setStats(statRes.data);
            } else if (user.role === 'ngo') {
                const forecastRes = await api.get('/predictions/forecasts');
                setPredictions(forecastRes.data);
            }
        } catch (err) {
            console.error('Error fetching prediction data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleTrainModel = async () => {
        try {
            setIsTraining(true);
            await api.post('/predictions/train');
            await fetchData();
            alert('ML Model trained successfully! Forecast updated.');
        } catch (err) {
            console.error('Training failed:', err);
            alert('Failed to train model. Please try again.');
        } finally {
            setIsTraining(false);
        }
    };

    // Mock data for the timeline chart if no predictions exist
    const chartData = predictions.length > 0
        ? predictions.map(p => ({
            time: new Date(p.timeWindowStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            quantity: p.expectedQuantity,
            probability: p.probability * 100
        }))
        : [];

    const renderProviderView = () => (
        <div className="space-y-10">
            {/* Prediction Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 flex items-center gap-3">
                    {predictions[0]?.isDemo && (
                        <span className="bg-amber-500/10 text-amber-500 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                            Demo Mode
                        </span>
                    )}
                    <span className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                        AI Model Active 🤖
                    </span>
                </div>

                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 italic">Surplus Forecast</h2>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
                        Our ML model analyzes your historical sales patterns and event impacts to predict upcoming surplus food before it happens.
                    </p>
                    {predictions.length > 0 && (
                        <button
                            onClick={handleTrainModel}
                            disabled={isTraining}
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 dark:hover:bg-emerald-400 dark:hover:text-white transition-all disabled:opacity-50"
                        >
                            {isTraining ? 'Regenerating...' : 'Generate New Scenario'}
                        </button>
                    )}
                </div>

                {predictions.length > 0 && predictions[0].isDemo && (
                    <div className="mb-8 px-6 py-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-center gap-3">
                        <span className="text-lg">ℹ️</span>
                        <p className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wide">
                            Demo prediction using simulated historical data
                        </p>
                    </div>
                )}

                {predictions.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-700">
                                <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Next Predicted Surplus</div>
                                <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                                    ~{predictions[0].expectedQuantity} <span className="text-xl font-bold text-slate-400">Items</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-400 to-green-600 transition-all duration-1000"
                                            style={{ width: `${predictions[0].probability * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-black text-emerald-500">{Math.round(predictions[0].probability * 100)}% Match</span>
                                </div>
                            </div>

                            {/* Top Foods Section */}
                            {predictions[0].topFoods && predictions[0].topFoods.length > 0 && (
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-700">
                                    <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Items Likely to have Surplus</div>
                                    <div className="flex flex-wrap gap-3">
                                        {predictions[0].topFoods.map((item, idx) => (
                                            <div key={idx} className="bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-600 flex items-center gap-2 shadow-sm">
                                                <span className="text-emerald-500">🥘</span>
                                                <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-6">
                                <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                                    <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Time Window</div>
                                    <div className="text-lg font-black text-slate-900 dark:text-white">
                                        {new Date(predictions[0].timeWindowStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                        {new Date(predictions[0].timeWindowEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                                    <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Confidence Score</div>
                                    <div className="text-lg font-black text-slate-900 dark:text-white">
                                        {Math.round(predictions[0].confidenceScore)}/100
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: 'none', color: '#fff' }}
                                        cursor={{ fill: '#f8fafc' }}
                                    />
                                    <Bar dataKey="quantity" radius={[8, 8, 0, 0]}>
                                        <Cell fill="#10b981" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700">
                        <div className="text-5xl mb-6">{isTraining ? '⚙️' : '📉'}</div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                            {isTraining ? 'Simulating Historical Data...' : 'Establishing Baseline'}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium mb-8">
                            {isTraining
                                ? 'We are generating 7 days of synthetic South Indian food listings to build your custom forecast engine instantly.'
                                : 'We need more historical data from your listings to generate an accurate forecast.'}
                        </p>
                        {!isTraining && (
                            <button
                                onClick={handleTrainModel}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                            >
                                Train ML Model Now
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Smart Ranking Recommendation */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div>
                        <h3 className="text-2xl font-black mb-2 italic">Smart Recommended Partners</h3>
                        <p className="text-slate-400 font-medium max-w-md">
                            Based on predicted item quantity and urgency, these nearby NGOs are the best match for your next batch.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        {[1, 2].map(i => (
                            <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col items-center min-w-[160px]">
                                <div className="w-12 h-12 bg-white/20 rounded-full mb-4 flex items-center justify-center text-xl">🏠</div>
                                <div className="text-xs font-black uppercase tracking-widest text-emerald-400">98% Match</div>
                                <div className="font-bold text-sm">Hope Shelter</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px]"></div>
            </div>
        </div>
    );

    const renderNGOView = () => (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white italic">Surplus Early Alerts</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Upcoming predicted food surplus from restaurants in your area.</p>
                </div>
                <div className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-full text-xs font-black animate-pulse">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    LIVE FORECAST
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {predictions.map((p, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6">
                            <div className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-orange-500/20">
                                ~{Math.round(p.confidenceScore)}% Confidence
                            </div>
                        </div>
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">
                            🏢
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">{p.providerId.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-6 line-clamp-1">📍 {p.providerId.address}</p>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Expected Surplus</span>
                                <span className="text-2xl font-black text-slate-900 dark:text-white">{p.expectedQuantity} {p.expectedUnit}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Time Window</span>
                                <span className="font-bold text-sm text-slate-900 dark:text-white">
                                    {new Date(p.timeWindowStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                    {new Date(p.timeWindowEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>

                        <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest group-hover:bg-emerald-600 dark:hover:bg-emerald-400 dark:hover:text-white transition-all shadow-lg shadow-slate-200 dark:shadow-none">
                            Pre-register Interest
                        </button>
                    </div>
                ))}

                {predictions.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-800/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700">
                        <div className="text-5xl mb-4">💤</div>
                        <p className="text-slate-500 dark:text-slate-400 font-bold">No upcoming surplus alerts for your area yet.</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <DashboardLayout title={user.role === 'provider' ? 'Intelligence Dashboard' : 'Early Alerts System'}>
            {loading ? (
                <div className="h-[60vh] flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : user.role === 'provider' ? renderProviderView() : renderNGOView()}
        </DashboardLayout>
    );
};

export default PredictionDashboard;
