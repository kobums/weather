import { useState, useEffect, useCallback } from 'react';

export interface FavoriteLocation {
  id: string;
  locationName: string;
  nickname?: string;
  city: string;
  fullName: string;
}

const FAVORITES_KEY = 'weather_favorites';
const MAX_FAVORITES = 6;

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback(
    (location: Omit<FavoriteLocation, 'id'>) => {
      if (favorites.length >= MAX_FAVORITES) {
        return false;
      }

      if (favorites.some((fav) => fav.locationName === location.locationName)) {
        return false;
      }

      const newFavorite: FavoriteLocation = {
        ...location,
        id: Date.now().toString(),
      };

      setFavorites([...favorites, newFavorite]);
      return true;
    },
    [favorites]
  );

  const removeFavorite = useCallback(
    (id: string) => {
      setFavorites(favorites.filter((fav) => fav.id !== id));
    },
    [favorites]
  );

  const updateNickname = useCallback(
    (id: string, nickname: string) => {
      setFavorites(
        favorites.map((fav) => (fav.id === id ? { ...fav, nickname } : fav))
      );
    },
    [favorites]
  );

  const isFavorite = useCallback(
    (locationName: string) => {
      return favorites.some((fav) => fav.locationName === locationName);
    },
    [favorites]
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    updateNickname,
    isFavorite,
    canAddMore: favorites.length < MAX_FAVORITES,
  };
}
