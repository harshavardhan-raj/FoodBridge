import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

const RegisterPage = () => {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role');

    const [step, setStep] = useState(initialRole ? 2 : 1);
    const [role, setRole] = useState(initialRole || '');
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '',
        address: '', providerType: 'restaurant', registrationNumber: '',
        university: '', studentId: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        setStep(2);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/register', { ...formData, role });
            navigate('/login?registered=true');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { key: 'provider', icon: '🏪', title: 'Food Provider', desc: 'Restaurants, hotels, bakeries with surplus food.' },
        { key: 'ngo', icon: '🤝', title: 'NGO / Charity', desc: 'Organizations collecting food for communities.' },
        { key: 'student', icon: '🎓', title: 'Student Buyer', desc: 'Grab discounted surplus food for yourself.' },
    ];

    const inputClass = "input-dark";

    return (
        <div className="page-bg min-h-screen flex">
            {/* Ambient blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-600/15 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full flex">
                {/* Sidebar */}
                <div className="hidden lg:flex lg:w-80 xl:w-96 glass border-r border-white/5 flex-col p-10">
                    <Link to="/" className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-700 rounded-xl flex items-center justify-center font-black text-white text-lg">F</div>
                        <span className="text-xl font-black">Food<span className="gradient-text">Bridge</span></span>
                    </Link>
                    <h2 className="text-3xl font-black text-white mb-3">Join Our Mission</h2>
                    <p className="text-slate-400 mb-12 leading-relaxed">Create an account to start impacting lives and reducing waste.</p>

                    {/* Steps */}
                    <div className="space-y-6">
                        {[
                            { n: 1, label: 'Choose Role', desc: 'Provider or NGO' },
                            { n: 2, label: 'Your Details', desc: 'Fill in your info' },
                        ].map((s) => (
                            <div key={s.n} className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 transition-all ${step === s.n ? 'bg-green-600 text-white shadow-lg shadow-green-900/50' : step > s.n ? 'bg-green-900/50 text-green-400' : 'border border-white/10 text-slate-600'}`}>
                                    {step > s.n ? '✓' : s.n}
                                </div>
                                <div>
                                    <div className={`font-bold text-sm ${step >= s.n ? 'text-white' : 'text-slate-600'}`}>{s.label}</div>
                                    <div className="text-slate-500 text-xs">{s.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 flex items-center justify-center p-6 py-12">
                    <div className="w-full max-w-lg">
                        {/* Mobile header */}
                        <div className="flex items-center gap-2 mb-8 lg:hidden">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">F</div>
                            <span className="text-lg font-black">Food<span className="gradient-text">Bridge</span></span>
                        </div>

                        {step === 1 ? (
                            <div>
                                <h3 className="text-3xl font-black text-white mb-2">Select Your Role</h3>
                                <p className="text-slate-400 mb-10">How will you use FoodBridge?</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {roles.map((r) => (
                                        <button
                                            key={r.key}
                                            onClick={() => handleRoleSelect(r.key)}
                                            className="glass rounded-2xl p-8 text-left border border-white/5 hover:border-green-500/50 transition-all group dash-card"
                                        >
                                            <div className="text-4xl mb-5 group-hover:scale-110 transition-transform inline-block">{r.icon}</div>
                                            <h4 className="text-lg font-bold text-white mb-2">{r.title}</h4>
                                            <p className="text-slate-500 text-sm leading-relaxed">{r.desc}</p>
                                            <div className="mt-4 text-green-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Select →</div>
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-8 text-center text-slate-500 text-sm">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-green-400 font-bold hover:text-green-300">Sign in</Link>
                                </p>
                            </div>
                        ) : (
                            <div>
                                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-green-400 font-bold mb-6 hover:text-green-300 transition-colors text-sm">
                                    ← Back
                                </button>
                                <h3 className="text-3xl font-black text-white mb-1">
                                    {role === 'provider' ? '🏪' : '🤝'} Complete Profile
                                </h3>
                                <p className="text-slate-400 mb-8 text-sm">Registering as a <span className="text-green-400 font-semibold">{
                                    role === 'provider' ? 'Food Provider' :
                                        role === 'student' ? 'Student Buyer' :
                                            'NGO / Charity'
                                }</span></p>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium">
                                        ⚠️ {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            {role === 'student' ? 'Full Name' : 'Organization Name'}
                                        </label>
                                        <input type="text" name="name" required className={inputClass} placeholder={role === 'student' ? "Alex Johnson" : "e.g. Green Kitchen Restaurant"} value={formData.name} onChange={handleInputChange} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                                            <input type="email" name="email" required className={inputClass} placeholder="you@example.com" value={formData.email} onChange={handleInputChange} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone</label>
                                            <input type="tel" name="phone" required className={inputClass} placeholder="+1 555 0100" value={formData.phone} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Address</label>
                                        <input type="text" name="address" required className={inputClass} placeholder="123 Main Street, City" value={formData.address} onChange={handleInputChange} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                                            <input type="password" name="password" required className={inputClass} placeholder="Min. 8 characters" value={formData.password} onChange={handleInputChange} />
                                        </div>
                                        {role === 'provider' ? (
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Provider Type</label>
                                                <select name="providerType" className={inputClass} value={formData.providerType} onChange={handleInputChange}>
                                                    <option value="restaurant">Restaurant</option>
                                                    <option value="hotel">Hotel</option>
                                                    <option value="bakery">Bakery</option>
                                                    <option value="event">Event Host</option>
                                                </select>
                                            </div>
                                        ) : role === 'ngo' ? (
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Registration ID</label>
                                                <input type="text" name="registrationNumber" required className={inputClass} placeholder="NGO-12345" value={formData.registrationNumber} onChange={handleInputChange} />
                                            </div>
                                        ) : (
                                            <>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">University / College</label>
                                                    <input type="text" name="university" required className={inputClass} placeholder="e.g. Stanford University" value={formData.university} onChange={handleInputChange} />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Student ID Number</label>
                                                    <input type="text" name="studentId" required className={inputClass} placeholder="STU-2024-XXXX" value={formData.studentId} onChange={handleInputChange} />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-xl shadow-green-900/30 flex items-center justify-center gap-2 mt-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Creating Account...
                                            </>
                                        ) : 'Create Account →'}
                                    </button>
                                </form>

                                <p className="mt-6 text-center text-slate-500 text-sm">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-green-400 font-bold hover:text-green-300">Sign in</Link>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
