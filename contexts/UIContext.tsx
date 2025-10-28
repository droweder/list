// contexts/UIContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Screen } from '@/types';

interface UIContextType {
  currentScreen: Screen;
  isDarkMode: boolean;
  isAddModalOpen: boolean;
  navigate: (screen: Screen) => void;
  toggleDarkMode: () => void;
  toggleAddModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.ShoppingList);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
    setCurrentScreen(screen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const toggleAddModal = () => {
    setIsAddModalOpen(prev => !prev);
  };

  return (
    <UIContext.Provider value={{
      currentScreen,
      isDarkMode,
      isAddModalOpen,
      navigate,
      toggleDarkMode,
      toggleAddModal,
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
