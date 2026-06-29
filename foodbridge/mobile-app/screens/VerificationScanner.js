import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:5000/api';

const VerificationScanner = () => {
    const [scanning, setScanning] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleScanMock = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            // In a real app, this would be a real scan result
            // We'll mock a request completion
            Alert.alert(
                "Scan Successful",
                "Request #FB-1024 verified. Mark as collected?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Confirm Collection",
                        onPress: async () => {
                            try {
                                // Mock endpoint or use request controller update
                                await axios.patch(`${API_BASE_URL}/requests/65d1a2b3c4d5e6f7a8b9c0d1`, { status: 'completed' }, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                Alert.alert("Success", "Pickup verified and completed!");
                            } catch (e) {
                                Alert.alert("Error", "Failed to update status");
                            }
                        }
                    }
                ]
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.scannerHeader}>
                <Text style={styles.title}>Pickup Verification</Text>
                <Text style={styles.subtitle}>Scan the NGO's QR code to verify collection</Text>
            </View>

            <View style={styles.scannerBoxContainer}>
                <View style={styles.scannerBox}>
                    <View style={styles.cornerTopLeft} />
                    <View style={styles.cornerTopRight} />
                    <View style={styles.cornerBottomLeft} />
                    <View style={styles.cornerBottomRight} />
                    <Text style={styles.scannerText}>Align QR Code within frame</Text>
                </View>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.scanBtn}
                    onPress={handleScanMock}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.scanBtnText}>Simulate Scan</Text>
                    )}
                </TouchableOpacity>
                <Text style={styles.helpText}>Need help? Contact support</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        padding: 40,
    },
    scannerHeader: {
        marginTop: 60,
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
    },
    scannerBoxContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scannerBox: {
        width: 250,
        height: 250,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cornerTopLeft: {
        position: 'absolute',
        top: -2,
        left: -2,
        width: 40,
        height: 40,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderColor: '#16a34a',
    },
    cornerTopRight: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 40,
        height: 40,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderColor: '#16a34a',
    },
    cornerBottomLeft: {
        position: 'absolute',
        bottom: -2,
        left: -2,
        width: 40,
        height: 40,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderColor: '#16a34a',
    },
    cornerBottomRight: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 40,
        height: 40,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderColor: '#16a34a',
    },
    scannerText: {
        color: '#64748b',
        fontSize: 12,
        fontWeight: '700',
    },
    controls: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    scanBtn: {
        backgroundColor: '#16a34a',
        width: '100%',
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
    },
    helpText: {
        color: '#475569',
        marginTop: 20,
        fontSize: 12,
        fontWeight: '700',
    }
});

export default VerificationScanner;
