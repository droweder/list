import React from 'react';
import { Screen, ShoppingList } from '../../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  lists: ShoppingList[];
  activeListId: string | null;
  onSelectList: (listId: string) => void;
  onAddItem: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, lists, activeListId, onSelectList, onAddItem }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-[0_-2px_5px_-1px_rgba(0,0,0,0.1)] z-20">
      <div className="max-w-4xl mx-auto flex justify-between items-center h-full relative">
        <div className="flex-grow flex items-center overflow-x-auto whitespace-nowrap scrollbar-hide pl-4 pr-24">
          {lists.map(list => (
            <button
              key={list.id}
              onClick={() => onSelectList(list.id)}
              className={`flex flex-col items-center justify-center flex-shrink-0 w-24 py-2 px-1 text-center transition-colors duration-200 ${
                activeListId === list.id
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg mb-1 ${activeListId === list.id ? 'bg-primary-600' : 'bg-gray-400'}`}>
                  {list.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs mt-1 truncate max-w-full">{list.name}</span>
            </button>
          ))}
        </div>
        
        <button
          key="settings"
          onClick={() => onNavigate(Screen.Settings)}
          className="flex flex-col items-center justify-center flex-shrink-0 w-24 py-2 px-1 text-center transition-colors duration-200 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-300"
        >
          <div className="w-6 h-6"><CogIcon /></div>
          <span className="text-xs mt-1">Ajustes</span>
        </button>

         {/* Central Add Button */}
        {currentScreen === Screen.ShoppingList && (
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                <button
                    onClick={onAddItem}
                    className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform transition-transform hover:scale-110"
                    aria-label="Adicionar item"
                >
                    <PlusIcon />
                </button>
            </div>
        )}

      </div>
    </nav>
  );
};

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const CogIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export default BottomNav;