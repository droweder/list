// components/screens/ShoppingListScreen.tsx
import React from 'react';
import { useData } from '@/contexts/DataContext';
import { useUI } from '@/contexts/UIContext';
import { Screen, ShoppingItem } from '@/types';
import Header from '../ui/Header';

const ShoppingListScreen: React.FC = () => {
  const { activeList, updateActiveList } = useData();
  const { navigate, setEditingItem } = useUI();

  if (!activeList) {
    return null;
  }

  const { name: listName, items } = activeList;

  const handleToggleItem = (itemId: string) => {
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, purchased: !item.purchased } : item
    );
    updateActiveList({ items: updatedItems });
  };

  const handleEditItem = (item: ShoppingItem) => {
    setEditingItem(item);
    navigate(Screen.ItemForm);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    navigate(Screen.ItemForm);
  };

  const groupedItems = items.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const categories = Object.keys(groupedItems).sort();
  const purchasedCount = items.filter(item => item.purchased).length;
  const totalCount = items.length;

  return (
    <div>
      <Header title={listName}>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <span>{purchasedCount}/{totalCount}</span>
          <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
            <div
              className="h-2 bg-primary-500 rounded-full"
              style={{ width: `${totalCount > 0 ? (purchasedCount / totalCount) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </Header>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">Sua lista está vazia.</p>
            <p className="text-gray-500 dark:text-gray-400">Clique em "+" para adicionar itens.</p>
          </div>
        ) : (
          categories.map(category => (
            <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 p-4 border-b border-gray-200 dark:border-gray-700">{category}</h2>
              <ul>
                {groupedItems[category].map(item => (
                  <li key={item.id} onClick={() => handleEditItem(item)} className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={item.purchased}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleItem(item.id);
                        }}
                        className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="ml-4">
                        <p className={`font-medium ${item.purchased ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>{item.name}</p>
                        <p className={`text-sm ${item.purchased ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>
                          {item.quantity > 1 ? `Qtd: ${item.quantity}` : ''}
                          {item.notes ? ` - ${item.notes}` : ''}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      <button
        onClick={handleAddItem}
        className="fixed bottom-20 right-4 bg-primary-600 text-white rounded-full p-4 shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform transition-transform hover:scale-110"
        aria-label="Adicionar item"
      >
        <PlusIcon />
      </button>
    </div>
  );
};

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
)

export default ShoppingListScreen;
