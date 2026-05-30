import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { FavoritesProvider } from './src/context/Favorites';
import RootNavigator from './src/navigation/RootNavigator';
import { PetsProvider } from './src/context/Pets';
import { NotificationProvider } from './src/context/Notification';
import NotificationBanner from './src/components/NotificationBanner';
import React from 'react';

export default function App() {
  return (
    <FavoritesProvider>
      <NotificationProvider>
        <PetsProvider>
          <StatusBar style="light" />
          <RootNavigator />
          <NotificationBanner />
        </PetsProvider>
      </NotificationProvider>
    </FavoritesProvider>
  );
}