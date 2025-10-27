// components/ui/BottomNav.tsx
import React from 'react';
import { Screen } from '../../types';
import { useData } from '@/contexts/DataContext';

interface BottomNavProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen, listId?: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  const { lists, activeList, setActiveListId } = useData();

  const handleListNavigation = (listId: string) => {
    setActiveListId(listId);
    onNavigate(Screen.ShoppingList, listId);
  };

  const navItems = [
    ...lists.map(list => ({
      id: list.id,
      label: list.name,
      icon: list.icon ? <span className="text-2xl">{list.icon}</span> : <ShoppingCartIcon />,
      isActive: activeScreen === Screen.ShoppingList && activeList?.id === list.id,
      onClick: () => handleListNavigation(list.id),
    })),
    {
      id: Screen.Settings,
      label: 'Ajustes',
      icon: <CogIcon />,
      isActive: activeScreen === Screen.Settings,
      onClick: () => onNavigate(Screen.Settings),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-[0_-2px_5px_-1px_rgba(0,0,0,0.1)]">
      <div className="max-w-4xl mx-auto flex justify-around">
        {navItems.map(({ id, label, icon, isActive, onClick }) => (
          <button
            key={id}
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-full py-2 px-1 text-center transition-colors duration-200 ${
              isActive
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-300'
            }`}
          >
            <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
            <span className="text-xs mt-1 truncate max-w-[10ch]">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const CogIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default BottomNav;
