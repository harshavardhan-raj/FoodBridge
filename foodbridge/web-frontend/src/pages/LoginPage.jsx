import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            if (user.role === 'provider') navigate('/provider/dashboard');
            else if (user.role === 'ngo') navigate('/ngo/dashboard');
            else if (user.role === 'student') navigate('/student/dashboard');
            else if (user.role === 'admin') navigate('/admin/dashboard');
            else if (user.role === 'staff') navigate('/staff/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-bg min-h-screen flex">
            {/* Ambient blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">
                <div className="max-w-md">
                    <Link to="/" className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-700 rounded-xl flex items-center justify-center font-black text-white text-lg">F</div>
                        <span className="text-2xl font-black">Food<span className="gradient-text">Bridge</span></span>
                    </Link>
                    <h2 className="text-5xl font-black mb-6 leading-tight">Welcome <br />Back! 👋</h2>
                    <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                        Log in to continue your mission of reducing food waste and feeding communities.
                    </p>
                    {/* Testimonial card */}
                    <div className="glass rounded-2xl p-6 border border-white/10">
                        <p className="text-slate-300 italic mb-4">"FoodBridge helped us save over 500kg of food this month alone. The platform is seamless."</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-xl">🏥</div>
                            <div>
                                <div className="text-sm font-bold text-white">Sarah M.</div>
                                <div className="text-xs text-slate-500">Director, Community First NGO</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
                <div className="glass rounded-3xl border border-white/10 p-10 w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">F</div>
                        <span className="text-lg font-black">Food<span className="gradient-text">Bridge</span></span>
                    </div>

                    <h3 className="text-2xl font-black text-white mb-1">Sign In</h3>
                    <p className="text-slate-400 text-sm mb-8">Access your dashboard and continue your impact.</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="input-dark"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                            </div>
                            <input
                                type="password"
                                required
                                className="input-dark"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-xl shadow-green-900/30 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing in...
                                </>
                            ) : 'Sign In →'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-green-400 font-bold hover:text-green-300 transition-colors">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
