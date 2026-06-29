import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProviderDashboard from './pages/ProviderDashboard';
import AddListingPage from './pages/AddListingPage';
import NGODashboard from './pages/NGODashboard';
import NGODiscoveryPage from './pages/NGODiscoveryPage';
import ListingDetailPage from './pages/ListingDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import ImpactDashboard from './pages/ImpactDashboard';
import StaffDashboard from './pages/StaffDashboard';
import ProfileSettings from './pages/ProfileSettings';
import EditListingPage from './pages/EditListingPage';
import MyListings from './pages/MyListings';

import MyRequests from './pages/MyRequests';
import HistoryPage from './pages/HistoryPage';
import PredictionDashboard from './pages/PredictionDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentMarketplace from './pages/StudentMarketplace';
import StudentOrders from './pages/StudentOrders';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

    return children;
};

const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <NotificationProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />

                            {/* Provider Routes */}
                            <Route
                                path="/provider/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['provider']}>
                                        <ProviderDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/provider/listings"
                                element={
                                    <ProtectedRoute allowedRoles={['provider']}>
                                        <MyListings />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/provider/add-listing"
                                element={
                                    <ProtectedRoute allowedRoles={['provider']}>
                                        <AddListingPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/provider/edit-listing/:id"
                                element={
                                    <ProtectedRoute allowedRoles={['provider']}>
                                        <EditListingPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/provider/requests"
                                element={
                                    <ProtectedRoute allowedRoles={['provider']}>
                                        <MyRequests />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/provider/history"
                                element={
                                    <ProtectedRoute allowedRoles={['provider']}>
                                        <HistoryPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/provider/forecast"
                                element={
                                    <ProtectedRoute allowedRoles={['provider']}>
                                        <PredictionDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* NGO Routes */}
                            <Route
                                path="/ngo/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['ngo']}>
                                        <NGODashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/ngo/alerts"
                                element={
                                    <ProtectedRoute allowedRoles={['ngo']}>
                                        <PredictionDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/ngo/browse"
                                element={
                                    <ProtectedRoute allowedRoles={['ngo']}>
                                        <NGODashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/ngo/discovery"
                                element={
                                    <ProtectedRoute allowedRoles={['ngo', 'provider', 'admin']}>
                                        <NGODiscoveryPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/ngo/listing/:id"
                                element={
                                    <ProtectedRoute allowedRoles={['ngo', 'provider', 'student']}>
                                        <ListingDetailPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/ngo/requests"
                                element={
                                    <ProtectedRoute allowedRoles={['ngo']}>
                                        <MyRequests />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Admin Routes */}
                            <Route
                                path="/admin/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Staff Routes */}
                            <Route
                                path="/staff/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['staff']}>
                                        <StaffDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Student Routes */}
                            <Route
                                path="/student/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['student']}>
                                        <StudentDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/student/marketplace"
                                element={
                                    <ProtectedRoute allowedRoles={['student']}>
                                        <StudentMarketplace />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/student/orders"
                                element={
                                    <ProtectedRoute allowedRoles={['student']}>
                                        <StudentOrders />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Public Routes */}
                            <Route path="/impact" element={<ImpactDashboard />} />

                            {/* Shared Protected Routes */}
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute allowedRoles={['ngo', 'provider', 'admin', 'staff', 'student']}>
                                        <ProfileSettings />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Router>
                </NotificationProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
