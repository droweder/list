// contexts/UIContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Screen, ShoppingItem } from '@/types';

interface UIContextType {
  currentScreen: Screen;
  editingItem: ShoppingItem | null;
  isDarkMode: boolean;
  navigate: (screen: Screen) => void;
  setEditingItem: (item: ShoppingItem | null) => void;
  toggleDarkMode: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.ShoppingList);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('darkMode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const navigate = (screen: Screen) => {
    setEditingItem(null);
    setCurrentScreen(screen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <UIContext.Provider value={{
      currentScreen,
      editingItem,
      isDarkMode,
      navigate,
      setEditingItem,
      toggleDarkMode,
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
