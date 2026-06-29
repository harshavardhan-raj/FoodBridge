import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const LandingPage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            if (user.role === 'provider') navigate('/provider/dashboard');
            else if (user.role === 'ngo') navigate('/ngo/dashboard');
            else if (user.role === 'student') navigate('/student/dashboard');
            else if (user.role === 'admin') navigate('/admin/dashboard');
            else if (user.role === 'staff') navigate('/staff/dashboard');
        }
    }, [user, loading, navigate]);

    if (loading) return null;

    return (
        <div className="page-bg min-h-screen text-white overflow-x-hidden">

            {/* Ambient background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-600/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -right-40 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-green-700/10 rounded-full blur-3xl"></div>
            </div>

            {/* Navbar */}
            <header className="relative z-50 glass border-b border-white/5">
                <nav className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-700 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-green-900/50">
                            F
                        </div>
                        <span className="text-xl font-black tracking-tight">
                            Food<span className="gradient-text">Bridge</span>
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/impact" className="text-slate-400 hover:text-white font-medium transition-colors text-sm">Live Impact</Link>
                        <a href="#how-it-works" className="text-slate-400 hover:text-white font-medium transition-colors text-sm">How It Works</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="text-slate-300 hover:text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
                            Sign In
                        </Link>
                        <Link to="/register" className="bg-green-600 hover:bg-green-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-green-900/50 pulse-glow">
                            Get Started
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 pt-24 pb-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm font-semibold text-green-400 mb-8 border border-green-500/20">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block"></span>
                            Live food redistribution — Real-time
                        </div>
                    </div>
                    <div className="text-center max-w-5xl mx-auto">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-8">
                            Bridge the Gap Between{' '}
                            <span className="gradient-text">Surplus</span>
                            {' '}and{' '}
                            <span className="gradient-text">Need</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                            Connecting restaurants, bakeries, and hotels with local NGOs to eliminate food waste and nourish communities — in real-time.
                        </p>
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register?role=provider"
                                className="flex items-center gap-3 glass border border-green-500/30 hover:border-green-500/60 text-white font-bold px-6 py-4 rounded-2xl transition-all text-base group w-full lg:w-auto justify-center"
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform">🏪</span>
                                <div className="text-left leading-tight">
                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-70">Provider</div>
                                    <div className="text-sm">Join as Partner</div>
                                </div>
                            </Link>

                            <Link
                                to="/register?role=student"
                                className="flex items-center gap-3 glass border border-indigo-500/30 hover:border-indigo-500/60 text-white font-bold px-6 py-4 rounded-2xl transition-all text-base group w-full lg:w-auto justify-center"
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform">🎓</span>
                                <div className="text-left leading-tight">
                                    <div className="text-[10px] text-indigo-300 font-black uppercase tracking-widest opacity-70">Student</div>
                                    <div className="text-sm">Grab Meal Deals</div>
                                </div>
                            </Link>

                            <Link
                                to="/register?role=ngo"
                                className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold px-6 py-4 rounded-2xl transition-all text-base w-full lg:w-auto justify-center shadow-2xl shadow-green-900/50 group"
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform">🤝</span>
                                <div className="text-left leading-tight">
                                    <div className="text-[10px] text-green-200 font-black uppercase tracking-widest opacity-70">NGO / Charity</div>
                                    <div className="text-sm">Claim Surplus</div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Hero visual — mock dashboard card */}
                    <div className="mt-20 max-w-4xl mx-auto float-animate">
                        <div className="glass rounded-3xl p-1 border border-white/10 shadow-2xl">
                            <div className="bg-slate-900/80 rounded-[22px] p-6">
                                {/* Mock UI bars */}
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                                    <div className="ml-4 flex-1 bg-white/5 rounded-full h-6 flex items-center px-3">
                                        <span className="text-slate-500 text-xs">foodbridge.app/ngo/dashboard</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {[
                                        { label: 'Available Now', value: '24', unit: 'listings', color: 'from-green-900/60 to-green-800/30', icon: '🥗' },
                                        { label: 'Meals Saved', value: '1.2K', unit: 'this week', color: 'from-blue-900/60 to-blue-800/30', icon: '🍱' },
                                        { label: 'CO₂ Avoided', value: '340', unit: 'kg', color: 'from-purple-900/60 to-purple-800/30', icon: '🌱' },
                                    ].map((stat) => (
                                        <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 border border-white/5`}>
                                            <div className="text-2xl mb-2">{stat.icon}</div>
                                            <div className="text-2xl font-black">{stat.value}</div>
                                            <div className="text-slate-400 text-xs font-medium">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { name: 'Sourdough Loaves', from: "Joe's Bakery", qty: '12 units', dist: '0.4 km', urgent: true },
                                        { name: 'Mixed Salads', from: 'Green Garden Restaurant', qty: '8 portions', dist: '1.1 km', urgent: false },
                                        { name: 'Cooked Rice', from: 'Hotel Sunrise', qty: '25 kg', dist: '2.3 km', urgent: false },
                                    ].map((item) => (
                                        <div key={item.name} className="flex items-center justify-between glass rounded-xl px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-sm">🥖</div>
                                                <div>
                                                    <div className="text-sm font-semibold flex items-center gap-2">
                                                        {item.name}
                                                        {item.urgent && <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full">URGENT</span>}
                                                    </div>
                                                    <div className="text-slate-500 text-xs">{item.from} • {item.qty}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-slate-400 text-xs">{item.dist}</span>
                                                <button onClick={() => navigate('/login')} className="bg-green-600/20 hover:bg-green-600/40 text-green-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">Claim</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="relative z-10 py-16 border-y border-white/5">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { value: '5,000+', label: 'Kg Food Saved', icon: '🥗' },
                        { value: '12,000+', label: 'Meals Distributed', icon: '🍽️' },
                        { value: '350+', label: 'Active Partners', icon: '🤝' },
                        { value: '99%', label: 'Reduction in Waste', icon: '♻️' },
                    ].map((stat) => (
                        <div key={stat.label} className="group">
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform inline-block">{stat.icon}</div>
                            <div className="text-4xl font-black gradient-text mb-1">{stat.value}</div>
                            <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="relative z-10 py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">How <span className="gradient-text">FoodBridge</span> Works</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">A seamless 3-step process from surplus to community impact.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'List Surplus', desc: 'Providers post surplus food in seconds. Add photos, quantities, and pickup windows. Go live instantly.', icon: '📦', color: 'from-green-500/20 to-emerald-500/10' },
                            { step: '02', title: 'Discover & Claim', desc: 'NGOs and Students browse real-time listings on an interactive map. NGOs claim for charity, Students grab discounted deals.', icon: '🗺️', color: 'from-blue-500/20 to-cyan-500/10' },
                            { step: '03', title: 'Pick Up & Impact', desc: 'Staff verifies collection via QR code. All parties track their unique impact, savings, and CO₂ reduction live.', icon: '✅', color: 'from-purple-500/20 to-pink-500/10' },
                        ].map((step) => (
                            <div key={step.step} className={`gradient-border bg-gradient-to-br ${step.color} rounded-3xl p-8 dash-card relative overflow-hidden`}>
                                <div className="absolute top-6 right-6 text-6xl font-black text-white/5">{step.step}</div>
                                <div className="text-4xl mb-6">{step.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative z-10 py-20 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { icon: '⚡', title: 'Real-time Listings', desc: 'Instant post-to-live in under 30 seconds.' },
                            { icon: '📍', title: 'Geo Discovery', desc: 'Find surplus food near you with maps and GPS.' },
                            { icon: '🔔', title: 'Smart Alerts', desc: 'Get notified when food matches your needs.' },
                            { icon: '📊', title: 'Impact Dashboard', desc: 'Track meals saved and CO₂ reduction live.' },
                        ].map((f) => (
                            <div key={f.title} className="glass rounded-2xl p-6 dash-card border border-white/5 hover:border-green-500/30">
                                <div className="text-3xl mb-4">{f.icon}</div>
                                <div className="font-bold text-white mb-2">{f.title}</div>
                                <div className="text-slate-400 text-sm">{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-32 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="glass rounded-3xl p-12 border border-green-500/20 glow-green shadow-indigo-500/10 shadow-2xl">
                        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Ready to Make an <span className="gradient-text">Impact?</span></h2>
                        <p className="text-slate-400 mb-10 text-lg font-medium italic">Join hundreds of providers, students, and NGOs already on the platform.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold px-10 py-4 rounded-2xl transition-all w-full sm:w-auto shadow-xl shadow-green-900/50">
                                Create Free Account ↗
                            </Link>
                            <Link to="/login" className="glass border border-white/10 hover:border-white/30 text-white font-bold px-10 py-4 rounded-2xl transition-all w-full sm:w-auto">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-700 rounded-lg flex items-center justify-center text-white font-black">F</div>
                        <span className="text-lg font-black">Food<span className="gradient-text">Bridge</span></span>
                    </div>
                    <p className="text-slate-600 text-sm">© 2026 FoodBridge Redistribution Platform. All rights reserved.</p>
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">Terms</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
