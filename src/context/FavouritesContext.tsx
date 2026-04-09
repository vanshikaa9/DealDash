import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'dealdash_favourites';

interface FavouritesContextType {
  favourites: Set<string>;
  toggleFavourite: (id: string) => void;
  isFavourite: (id: string) => boolean;
  count: number;
}

const FavouritesContext = createContext<FavouritesContextType | null>(null);

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [favourites, setFavourites] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favourites]));
  }, [favourites]);

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isFavourite = useCallback((id: string) => favourites.has(id), [favourites]);

  return (
    <FavouritesContext.Provider value={{ favourites, toggleFavourite, isFavourite, count: favourites.size }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used within FavouritesProvider');
  return ctx;
}
