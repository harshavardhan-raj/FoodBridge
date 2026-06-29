import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:5000/api'; // Android Emulator URL

const NGOHomeScreen = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/listings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setListings(res.data);
        } catch (error) {
            console.error('Fetch listings failed', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async (listingId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/requests`, { listingId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Alert.alert('Success', 'Food claim request sent to provider!');
            fetchListings(); // Refresh list
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to claim food');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Find Food</Text>
                <TouchableOpacity style={styles.filterBtn}>
                    <Text>🔔</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    placeholder="Search items or locations"
                    style={styles.searchInput}
                />
            </View>

            <View style={styles.mapContainer}>
                <View style={styles.mapMock}>
                    <Text style={styles.mapText}>Interactive Map View</Text>
                    {/* Markers */}
                    <View style={[styles.marker, { top: 50, left: 100 }]} />
                    <View style={[styles.marker, { top: 120, left: 200 }]} />
                    <View style={[styles.marker, { top: 180, left: 80 }]} />
                </View>
            </View>

            <View style={styles.listSection}>
                <Text style={styles.sectionTitle}>Available Nearby</Text>
                {loading ? (
                    <ActivityIndicator color="#16a34a" size="large" />
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        {listings.length === 0 ? (
                            <Text style={{ marginLeft: 25, color: '#64748b' }}>No food available right now.</Text>
                        ) : listings.map(listing => (
                            <TouchableOpacity
                                key={listing._id}
                                style={styles.foodCard}
                                onPress={() => handleClaim(listing._id)}
                            >
                                <View style={styles.foodImagePlaceholder}>
                                    <Text style={styles.foodEmoji}>🥗</Text>
                                </View>
                                <View style={styles.foodInfo}>
                                    <Text style={styles.foodName}>{listing.title}</Text>
                                    <Text style={styles.foodDist}>{listing.providerId?.name || 'Local Store'}</Text>
                                    <View style={styles.foodFooter}>
                                        <Text style={styles.foodQty}>{listing.quantity} {listing.unit}</Text>
                                        <Text style={styles.foodTime}>{new Date(listing.expiryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingTop: 70,
        paddingHorizontal: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0f172a',
    },
    filterBtn: {
        width: 50,
        height: 50,
        backgroundColor: '#f8fafc',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        marginHorizontal: 25,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginBottom: 25,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontWeight: '600',
    },
    mapContainer: {
        flex: 1,
        paddingHorizontal: 25,
        marginBottom: 25,
    },
    mapMock: {
        flex: 1,
        backgroundColor: '#cbd5e1',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    mapText: {
        color: '#64748b',
        fontWeight: 'bold',
    },
    marker: {
        position: 'absolute',
        width: 20,
        height: 20,
        backgroundColor: '#16a34a',
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#fff',
    },
    listSection: {
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a',
        marginHorizontal: 25,
        marginBottom: 15,
    },
    horizontalScroll: {
        paddingLeft: 25,
    },
    foodCard: {
        width: 200,
        backgroundColor: '#fff',
        borderRadius: 24,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    foodImagePlaceholder: {
        height: 120,
        backgroundColor: '#f0fdf4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    foodEmoji: {
        fontSize: 40,
    },
    foodInfo: {
        padding: 15,
    },
    foodName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 4,
    },
    foodDist: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 10,
    },
    foodFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    foodQty: {
        fontSize: 10,
        fontWeight: '900',
        color: '#16a34a',
        textTransform: 'uppercase',
    },
    foodTime: {
        fontSize: 10,
        color: '#94a3b8',
        fontWeight: '700',
    }
});

export default NGOHomeScreen;
