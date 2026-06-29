import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../api/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, pendingVerifications: 0, activeListings: 0 });
    const [pendingUsers, setPendingUsers] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [pendingRes, statsRes, logsRes] = await Promise.all([
                    api.get('/admin/pending-verifications'),
                    api.get('/stats'),
                    api.get('/admin/audit-logs')
                ]);
                setPendingUsers(pendingRes.data);
                setAuditLogs(logsRes.data);
                setStats({
                    totalUsers: statsRes.data.current.totalProviders + statsRes.data.current.totalNGOs,
                    pendingVerifications: pendingRes.data.length,
                    activeListings: statsRes.data.current.activeListings
                });
            } catch (err) {
                console.error('Admin data fetch failed', err);
            }
        };
        fetchAdminData();
    }, []);

    const handleVerify = async (userId) => {
        try {
            await api.patch(`/admin/verify/${userId}`);
            setPendingUsers(pendingUsers.filter(u => u._id !== userId));
            setStats(prev => ({ ...prev, pendingVerifications: prev.pendingVerifications - 1 }));
            alert('User verified successfully!');
        } catch (err) {
            alert('Verification failed');
        }
    };

    const handleReject = async (userId) => {
        if (!window.confirm('Are you sure you want to reject and remove this organization?')) return;
        try {
            await api.delete(`/admin/reject/${userId}`);
            setPendingUsers(pendingUsers.filter(u => u._id !== userId));
            setStats(prev => ({ ...prev, pendingVerifications: prev.pendingVerifications - 1 }));
            alert('User rejected and removed.');
        } catch (err) {
            alert('Rejection failed');
        }
    };

    return (
        <DashboardLayout title="Admin Overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <p className="text-slate-500 font-bold uppercase text-xs mb-2">Total Users</p>
                    <p className="text-4xl font-black text-slate-900">{stats.totalUsers}</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 italic">
                    <p className="text-slate-500 font-bold uppercase text-xs mb-2 text-amber-600">Pending Approvals</p>
                    <p className="text-4xl font-black text-slate-900">{stats.pendingVerifications}</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <p className="text-slate-500 font-bold uppercase text-xs mb-2 text-green-600">Live Listings</p>
                    <p className="text-4xl font-black text-slate-900">{stats.activeListings}</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b">
                    <h3 className="text-xl font-bold text-slate-900">Pending Verifications</h3>
                </div>
                <div className="divide-y">
                    {pendingUsers.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 font-medium">✨ All organizations are verified!</div>
                    ) : pendingUsers.map(user => (
                        <div key={user._id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl">🏢</div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{user.name}</h4>
                                    <p className="text-sm text-slate-500">{user.role.toUpperCase()} • {user.email}</p>
                                    <p className="text-xs text-slate-400 mt-1">{user.address}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleVerify(user._id)}
                                    className="bg-green-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                                >
                                    Verify
                                </button>
                                <button
                                    onClick={() => handleReject(user._id)}
                                    className="bg-white border border-slate-200 text-slate-400 font-bold px-6 py-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-12 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b">
                    <h3 className="text-xl font-bold text-slate-900">System Audit Logs</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Timestamp</th>
                                <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Action</th>
                                <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 italic">
                            {auditLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-10 text-center text-slate-400 font-medium">No activity logged yet.</td>
                                </tr>
                            ) : auditLogs.map(log => (
                                <tr key={log._id} className="hover:bg-slate-50 transition-all">
                                    <td className="px-8 py-4 text-sm text-slate-500 whitespace-nowrap">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="text-sm font-bold text-slate-900">{log.userId?.name}</div>
                                        <div className="text-xs text-slate-400 capitalize">{log.userId?.role}</div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-md ${log.action.includes('CREATE') ? 'bg-blue-100 text-blue-700' :
                                            log.action.includes('UPDATE') ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-sm text-slate-600">
                                        {log.details}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
