import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoIcon}>🥝</Text>
                </View>
                <Text style={styles.title}>FoodBridge</Text>
                <Text style={styles.tagline}>Redistributing Surplus, <br />Feeding Hope.</Text>
                <p style={{ display: 'none' }}>RN doesn't support br in Text, but this is a placeholder for better design</p>
                <Text style={styles.description}>
                    Connecting local food providers with organizations that help those in need.
                </Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Learn More</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 30,
        justifyContent: 'space-between',
    },
    content: {
        marginTop: 100,
        alignItems: 'center',
    },
    logoContainer: {
        width: 100,
        height: 100,
        backgroundColor: '#f0fdf4',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    logoIcon: {
        fontSize: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#16a34a',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 10,
    },
    tagline: {
        fontSize: 42,
        fontWeight: '900',
        color: '#0f172a',
        textAlign: 'center',
        lineHeight: 48,
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 24,
    },
    footer: {
        marginBottom: 40,
        gap: 15,
    },
    primaryButton: {
        backgroundColor: '#16a34a',
        paddingVertical: 20,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#64748b',
        fontSize: 16,
        fontWeight: '600',
    }
});

export default WelcomeScreen;
