import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Enter your details to access your dashboard.</Text>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="hello@example.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.forgotPass}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('ProviderHome')}
                    >
                        <Text style={styles.loginButtonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.socialContainer}>
                    <Text style={styles.socialText}>Or continue with</Text>
                    <View style={styles.socialButtons}>
                        <TouchableOpacity style={styles.socialIcon}><Text>G</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.socialIcon}><Text>A</Text></TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity>
                    <Text style={styles.signupText}>Create Account</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 30,
    },
    content: {
        flex: 1,
        marginTop: 80,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0f172a',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        lineHeight: 24,
        marginBottom: 40,
    },
    form: {
        gap: 20,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
    },
    input: {
        backgroundColor: '#f8fafc',
        padding: 20,
        borderRadius: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    forgotPass: {
        alignSelf: 'flex-end',
    },
    forgotText: {
        color: '#16a34a',
        fontWeight: '700',
    },
    loginButton: {
        backgroundColor: '#16a34a',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    socialContainer: {
        marginTop: 40,
        alignItems: 'center',
        gap: 20,
    },
    socialText: {
        color: '#94a3b8',
        fontWeight: '500',
    },
    socialButtons: {
        flexDirection: 'row',
        gap: 20,
    },
    socialIcon: {
        width: 60,
        height: 60,
        backgroundColor: '#f8fafc',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    footerText: {
        color: '#64748b',
    },
    signupText: {
        color: '#16a34a',
        fontWeight: '700',
    }
});

export default LoginScreen;
