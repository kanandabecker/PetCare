import {
  createContext,
  useContext,
  useState,
  useMemo,
} from 'react';

const FavoritesContext = createContext({});

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Adicionar/remover favorito
  const toggleFavorite = (pet) => {
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.find(
        item => item.id === pet.id
      );

      if (exists) {
        return prevFavorites.filter(
          item => item.id !== pet.id
        );
      }

      return [...prevFavorites, pet];
    });
  };

  // Verificar favorito
  const isFavorite = (id) => {
    return favorites.some(item => item.id === id);
  };

  // Limpar favoritos
  const clearFavorites = () => {
    setFavorites([]);
  };

  // Evita rerenderizações desnecessárias
  const value = useMemo(() => ({
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  }), [favorites]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}