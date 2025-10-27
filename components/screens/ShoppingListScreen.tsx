// components/screens/ShoppingListScreen.tsx
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useUI } from '@/contexts/UIContext';
import { Screen, ShoppingItem } from '@/types';
import Header from '../ui/Header';
import Toast from '../ui/Toast';
import AddFromProductBankModal from '../modals/AddFromProductBankModal';

const ShoppingListScreen: React.FC = () => {
  const { activeList, removeItemFromActiveList, undoRemoveItem, lastRemovedItem, updateActiveList } = useData();
  const { navigate, setEditingItem } = useUI();
  const [showToast, setShowToast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!activeList) {
    return null;
  }

  const { name: listName, items } = activeList;

  const handleRemoveItem = (itemId: string) => {
    removeItemFromActiveList(itemId);
    setShowToast(true);
  };

  const handleUndoRemove = () => {
    undoRemoveItem();
    setShowToast(false);
  };

  const handleAddItemFromBank = (item: ShoppingItem) => {
    if (!activeList) return;

    const newItem = { ...item, id: crypto.randomUUID(), purchased: false, quantity: 1 };
    const updatedItems = [...activeList.items, newItem];
    updateActiveList({ items: updatedItems });
  };

  const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <Header title={listName}>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">{items.length} itens</span>
        </div>
      </Header>

      <div className="max-w-4xl mx-auto p-4">
        {items.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">Sua lista está vazia.</p>
            <p className="text-gray-500 dark:text-gray-400">Clique em "+" para adicionar itens.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedItems.map(item => (
                <li key={item.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{item.category}</span>
                    <div>
                      <p className='text-gray-900 dark:text-gray-100'>{item.name}</p>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleRemoveItem(item.id)} className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-4 bg-primary-600 text-white rounded-full p-4 shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform transition-transform hover:scale-110"
        aria-label="Adicionar item"
      >
        <PlusIcon />
      </button>

      {showToast && lastRemovedItem && (
        <Toast
          message={`${lastRemovedItem.name} removido.`}
          onUndo={handleUndoRemove}
          onDismiss={() => setShowToast(false)}
        />
      )}

      <AddFromProductBankModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddItem={handleAddItemFromBank}
      />
    </div>
  );
};

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default ShoppingListScreen;
