import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Screens
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import ProviderHomeScreen from './screens/ProviderHome';
import NGOHomeScreen from './screens/NGOHome';
import VerificationScanner from './screens/VerificationScanner'; // Added import

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="ProviderHome" component={ProviderHomeScreen} />
                <Stack.Screen name="NGOHome" component={NGOHomeScreen} />
                <Stack.Screen name="Scanner" component={VerificationScanner} /> {/* Added screen registration */}
            </Stack.Navigator>
            <StatusBar style="auto" />
        </NavigationContainer>
    );
}
