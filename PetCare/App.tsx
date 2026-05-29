import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { FavoritesProvider } from './src/context/Favorites';
import RootNavigator from './src/navigation/RootNavigator';
import React from 'react';

export default function App() {
  return (
    <FavoritesProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </FavoritesProvider>
  );
}