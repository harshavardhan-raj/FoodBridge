import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';

const ProfileSettings = () => {
    const { user, setUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        university: user?.university || '',
        studentId: user?.studentId || '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await api.patch('/auth/profile', formData);
            setUser(res.data);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async () => {
        const confirmFirst = window.confirm("⚠️ ATTENTION: Are you absolutely sure? This will PERMANENTLY delete your account and all associated food listings.");
        if (confirmFirst) {
            const confirmSecond = window.confirm("Final Confirmation: Do you really want to leave FoodBridge? This action cannot be undone.");
            if (confirmSecond) {
                try {
                    setLoading(true);
                    await api.delete('/auth/deactivate');
                    logout();
                    navigate('/');
                } catch (err) {
                    setMessage({ type: 'error', text: 'Deactivation failed. Please try again.' });
                } finally {
                    setLoading(false);
                }
            }
        }
    };

    return (
        <DashboardLayout title="Settings & Preferences">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Theme Preference Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Visual Theme</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Toggle between Light and Dark mode for the interface.</p>
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => theme === 'dark' && toggleTheme()}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all ${theme === 'light' ? 'bg-white text-slate-900 shadow-lg shadow-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <span>☀️</span> Light
                            </button>
                            <button
                                onClick={() => theme === 'light' && toggleTheme()}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all ${theme === 'dark' ? 'bg-slate-700 text-white shadow-lg shadow-slate-900' : 'text-slate-500 hover:text-slate-400'}`}
                            >
                                <span>🌙</span> Dark
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-10">
                        <div className="flex items-center gap-8 border-b dark:border-slate-800 pb-10">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-600 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-emerald-100 dark:shadow-none">
                                {user?.name?.[0]}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{user?.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-800/50">
                                        {user?.role} ACCOUNT
                                    </span>
                                    {user?.isVerified && (
                                        <span className="text-blue-500 text-sm" title="Verified Account">Verified ✅</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {message.text && (
                            <div className={`p-5 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800/50' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/50'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Organization Name</label>
                                <div className="relative group">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg grayscale group-focus-within:grayscale-0 transition-all">🏢</span>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] pl-14 pr-6 py-4.5 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                                        placeholder="Username / Organization Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Account Email</label>
                                <div className="relative group">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg grayscale group-focus-within:grayscale-0 transition-all">📧</span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] pl-14 pr-6 py-4.5 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                                        placeholder="contact@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Contact Phone</label>
                                <div className="relative group">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg grayscale group-focus-within:grayscale-0 transition-all">📞</span>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] pl-14 pr-6 py-4.5 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>

                            {user?.role === 'student' && (
                                <>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">University / College</label>
                                        <div className="relative group">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg grayscale group-focus-within:grayscale-0 transition-all">🏫</span>
                                            <input
                                                type="text"
                                                name="university"
                                                value={formData.university}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] pl-14 pr-6 py-4.5 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                                                placeholder="e.g. Stanford University"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Student ID Number</label>
                                        <div className="relative group">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg grayscale group-focus-within:grayscale-0 transition-all">🆔</span>
                                            <input
                                                type="text"
                                                name="studentId"
                                                value={formData.studentId}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] pl-14 pr-6 py-4.5 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                                                placeholder="STU-2024-XXXX"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="space-y-3 md:col-span-2">
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Primary Address</label>
                                <div className="relative group">
                                    <span className="absolute left-5 top-5 text-lg grayscale group-focus-within:grayscale-0 transition-all">📍</span>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] pl-14 pr-6 py-4.5 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none resize-none"
                                        placeholder="Full organizational address..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t dark:border-slate-800 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black px-12 py-5 rounded-[1.75rem] hover:bg-emerald-600 dark:hover:bg-emerald-400 dark:hover:text-white transition-all shadow-xl shadow-slate-100 dark:shadow-none disabled:opacity-50 uppercase tracking-widest"
                            >
                                {loading ? 'Processing...' : 'Apply All Update'}
                            </button>
                        </div>
                    </form>
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-red-100 dark:border-red-900/30 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>
                        <div className="p-8 lg:p-12">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-xl font-black text-red-600 dark:text-red-500 mb-1 uppercase italic">Danger Zone</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg text-sm">
                                        Permanently deactivate your FoodBridge account. This action will delete your profile and all active listings. <span className="text-red-500 font-bold">This cannot be undone.</span>
                                    </p>
                                </div>
                                <button
                                    onClick={handleDeactivate}
                                    disabled={loading}
                                    className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-black px-10 py-5 rounded-[1.75rem] border border-red-100 dark:border-red-900/50 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all uppercase tracking-widest text-xs"
                                >
                                    Deactivate Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProfileSettings;
