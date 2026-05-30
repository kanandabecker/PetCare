import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

const STORAGE_KEY = '@petlar_favorites';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Carregar favoritos salvos
  useEffect(() => {
    carregarFavoritos();
  }, []);

  const carregarFavoritos = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);

      if (data) {
        setFavorites(JSON.parse(data));
      }
    } catch (error) {
      console.log('Erro ao carregar favoritos:', error);
    }
  };

  // Salvar favoritos no armazenamento
  const salvarFavoritos = async (novosFavoritos) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(novosFavoritos)
      );
    } catch (error) {
      console.log('Erro ao salvar favoritos:', error);
    }
  };

  // Adicionar/remover favorito
  const toggleFavorite = async (pet) => {
    try {
      const existe = favorites.some(item => item.id === pet.id);

      let novosFavoritos;

      if (existe) {
        novosFavoritos = favorites.filter(item => item.id !== pet.id);
      } else {
        novosFavoritos = [...favorites, pet];
      }

      setFavorites(novosFavoritos);

      await salvarFavoritos(novosFavoritos);
    } catch (error) {
      console.log('Erro ao alterar favorito:', error);
    }
  };

  // Verificar se já é favorito
  const isFavorite = (id) => {
    return favorites.some(item => item.id === id);
  };

  // Limpar favoritos
  const clearFavorites = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setFavorites([]); // depois do storage
    } catch (error) {
      console.log('Erro ao limpar favoritos:', error);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}