// components/screens/ShoppingListScreen.tsx
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useUI } from '@/contexts/UIContext';
import { ShoppingItem } from '@/types';
import Header from '../ui/Header';
import Toast from '../ui/Toast';
import EditItemModal from '../modals/EditItemModal';
import AddFromProductBankModal from '../modals/AddFromProductBankModal';

const ShoppingListScreen: React.FC = () => {
  const { activeList, removeItemFromActiveList, undoRemoveItem, lastRemovedItem, updateActiveList } = useData();
  const { isAddModalOpen, toggleAddModal } = useUI();
  const [showToast, setShowToast] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ShoppingItem | null>(null);

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

  const handleOpenEditModal = (item: ShoppingItem) => {
    setCurrentItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveItem = (updatedItem: ShoppingItem) => {
    const updatedItems = activeList.items.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    updateActiveList({ items: updatedItems });
  };

  const handleAddItem = (item: ShoppingItem) => {
    const newItem = { ...item, id: crypto.randomUUID(), purchased: false };
    const updatedItems = [...activeList.items, newItem];
    updateActiveList({ items: updatedItems });
  };

  const groupedItems = (items || []).reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  Object.keys(groupedItems).forEach(category => {
    groupedItems[category].sort((a, b) => a.name.localeCompare(b.name));
  });

  const categories = Object.keys(groupedItems).sort();

  return (
    <div>
      <Header title={listName}>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">{items.length} itens</span>
        </div>
      </Header>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">Sua lista está vazia.</p>
            <p className="text-gray-500 dark:text-gray-400">Clique no botão central para adicionar itens.</p>
          </div>
        ) : (
          categories.map(category => (
            <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 p-4 border-b border-gray-200 dark:border-gray-700">{category}</h2>
              <ul>
                {groupedItems[category].map(item => (
                  <li key={item.id} className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div className="flex-1">
                      <p className='text-gray-900 dark:text-gray-100'>{item.name}</p>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {item.quantity > 1 ? `Qtd: ${item.quantity}` : ''}
                        {item.notes ? ` - ${item.notes}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleOpenEditModal(item)} className="p-2 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50" aria-label="Editar item">
                        <PencilIcon />
                      </button>
                      <button onClick={() => handleRemoveItem(item.id)} className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                        <TrashIcon />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      {showToast && lastRemovedItem && (
        <Toast
          message={`${lastRemovedItem.name} removido.`}
          onUndo={handleUndoRemove}
          onDismiss={() => setShowToast(false)}
        />
      )}

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={currentItem}
        onSave={handleSaveItem}
      />

      <AddFromProductBankModal
        isOpen={isAddModalOpen}
        onClose={toggleAddModal}
        onAddItem={handleAddItem}
        listItems={items}
      />
    </div>
  );
};

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default ShoppingListScreen;
