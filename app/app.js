// import './global.css'; // Temporarily disabled
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/Home';
import MainLayout from './layouts/MainLayout';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainLayout>
          <Stack.Navigator 
            screenOptions={{ 
              headerShown: false,
              contentStyle: { backgroundColor: '#000000' }
            }} 
            initialRouteName="Home"
          >
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </MainLayout>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
