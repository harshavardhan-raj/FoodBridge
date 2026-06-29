import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:5000/api';

const ProviderHomeScreen = () => {
    const [stats, setStats] = useState({ active: 0, meals: 0, impact: 0 });
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const [statsRes, requestsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/stats`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/requests/provider`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setStats({
                    active: statsRes.data.current.activeListings,
                    meals: statsRes.data.current.totalMealsSaved,
                    impact: Math.floor(statsRes.data.current.totalMealsSaved / 5) // Mocked impact simple calc
                });
                setRequests(requestsRes.data.filter(r => r.status === 'pending'));
            } catch (error) {
                console.error('Fetch data failed', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color="#16a34a" /></View>;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello,</Text>
                    <Text style={styles.name}>Your Bakery</Text>
                </View>
                <TouchableOpacity style={styles.profileBadge}>
                    <Text style={styles.profileText}>YB</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
                <View style={[styles.statCard, { backgroundColor: '#eff6ff' }]}>
                    <Text style={styles.statIcon}>📦</Text>
                    <Text style={styles.statValue}>{stats.active}</Text>
                    <Text style={styles.statLabel}>Active</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#f0fdf4' }]}>
                    <Text style={styles.statIcon}>🍱</Text>
                    <Text style={styles.statValue}>{stats.meals}</Text>
                    <Text style={styles.statLabel}>Meals</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#faf5ff' }]}>
                    <Text style={styles.statIcon}>🌱</Text>
                    <Text style={styles.statValue}>{stats.impact}</Text>
                    <Text style={styles.statLabel}>Impact</Text>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Pending Requests</Text>
                    <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
                </View>

                {requests.length === 0 ? (
                    <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 20 }}>No pending requests.</Text>
                ) : requests.map(req => (
                    <View key={req._id} style={styles.listingCard}>
                        <View style={styles.listingInfo}>
                            <Text style={styles.listingName}>{req.listingId?.title}</Text>
                            <Text style={styles.listingStatus}>{req.status}</Text>
                        </View>
                        <View style={styles.listingDetails}>
                            <Text style={styles.detailText}>{req.ngoId?.name}</Text>
                            <Text style={styles.detailTime}>Qty: {req.listingId?.quantity}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <TouchableOpacity style={styles.fab}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 80,
        paddingBottom: 40,
    },
    greeting: {
        fontSize: 16,
        color: '#64748b',
        fontWeight: '600',
    },
    name: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0f172a',
    },
    profileBadge: {
        width: 50,
        height: 50,
        backgroundColor: '#f8fafc',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    profileText: {
        fontWeight: 'bold',
        color: '#0f172a',
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 25,
        gap: 15,
        marginBottom: 40,
    },
    statCard: {
        flex: 1,
        padding: 20,
        borderRadius: 24,
        alignItems: 'flex-start',
    },
    statIcon: {
        fontSize: 24,
        marginBottom: 10,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0f172a',
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
    },
    section: {
        paddingHorizontal: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a',
    },
    viewAll: {
        color: '#16a34a',
        fontWeight: '700',
    },
    listingCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginBottom: 15,
    },
    listingInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    listingName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
    },
    listingStatus: {
        fontSize: 10,
        fontWeight: '900',
        color: '#16a34a',
        backgroundColor: '#f0fdf4',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        textTransform: 'uppercase',
    },
    listingDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailText: {
        color: '#64748b',
        fontSize: 14,
    },
    detailTime: {
        color: '#f43f5e',
        fontSize: 12,
        fontWeight: '700',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 70,
        height: 70,
        backgroundColor: '#0f172a',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    fabText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '300',
    }
});

export default ProviderHomeScreen;
