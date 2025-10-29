import React, { useState, useCallback } from 'react';
import type { ShoppingItem, Category } from '../../types';
import Header from '../ui/Header';
import Modal from '../ui/Modal';
import ItemForm from '../ui/ItemForm';


interface ShoppingListScreenProps {
  listName?: string;
  items?: ShoppingItem[];
  categories: Category[];
  onToggleItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onSaveItem: (item: ShoppingItem) => void;
  isAddItemModalOpen: boolean;
  onCloseAddItemModal: () => void;
  presetItems: ShoppingItem[];
  onAddPresetItem: (item: Pick<ShoppingItem, 'name' | 'category' | 'unit'>) => void;
}

const ShoppingListScreen: React.FC<ShoppingListScreenProps> = ({ listName, items = [], categories, onToggleItem, onDeleteItem, onSaveItem, isAddItemModalOpen, onCloseAddItemModal, presetItems, onAddPresetItem }) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [itemForForm, setItemForForm] = useState<ShoppingItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditItem = (item: ShoppingItem) => {
    setItemForForm(item);
    setIsFormModalOpen(true);
  };
  
  const handleSaveFromForm = (item: ShoppingItem) => {
      const isNewItemFromSearch = !item.id;
      onSaveItem(item); // Save to the current list
      
      // If it's a brand new item created via the search flow, add it to presets
      if (isNewItemFromSearch) {
          onAddPresetItem({
              name: item.name,
              category: item.category,
              unit: item.unit,
          });
      }

      setIsFormModalOpen(false);
  }
  
  const handleDeleteAndCloseForm = (itemId: string) => {
      onDeleteItem(itemId);
      setIsFormModalOpen(false);
  }

  const handleAddPresetToList = (preset: ShoppingItem) => {
    onSaveItem({ ...preset, id: '', purchased: false }); // onSaveItem generates a new ID
    handleCloseQuickAdd();
  };

  const handleOpenFormForNewItem = () => {
    onCloseAddItemModal();
    setItemForForm({
      id: '',
      name: searchTerm,
      quantity: 1,
      unit: 'un',
      category: categories.length > 0 ? categories[0].name : 'Outros',
      notes: '',
      purchased: false,
    });
    setIsFormModalOpen(true);
  };
  
  const handleCloseQuickAdd = useCallback(() => {
    onCloseAddItemModal();
    setSearchTerm('');
  }, [onCloseAddItemModal]);
  
  const filteredPresets = searchTerm
    ? presetItems.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : presetItems;

  const groupedItems = items.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const sortedCategories = Object.keys(groupedItems).sort();
  const purchasedCount = items.filter(item => item.purchased).length;
  const totalCount = items.length;

  if (!listName) {
      return (
        <div>
            <Header title="Meu Mercadin™" />
            <div className="max-w-4xl mx-auto p-4 text-center py-20">
                <p className="text-lg text-gray-600 dark:text-gray-300">Nenhuma lista selecionada.</p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Selecione uma lista na barra de navegação abaixo ou crie uma nova na tela de 'Ajustes'.
                </p>
            </div>
        </div>
      )
  }

  return (
    <div className="relative min-h-screen">
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
            sortedCategories.map(category => (
                <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 p-4 border-b border-gray-200 dark:border-gray-700">{category}</h2>
                    <ul>
                    {groupedItems[category].map(item => (
                        <li key={item.id} className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                            <div 
                                className="flex items-center flex-grow cursor-pointer"
                                onClick={() => onToggleItem(item.id)}
                            >
                                <div className="w-5 h-5 mr-4 flex items-center justify-center">
                                    {item.purchased && <CheckIcon />}
                                </div>
                                <div>
                                    <p className={`font-medium ${item.purchased ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>{item.name}</p>
                                    <p className={`text-sm ${item.purchased ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {`Qtd: ${item.quantity} ${item.unit || ''}`.trim()}
                                        {item.notes ? ` - ${item.notes}` : ''}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 flex-shrink-0">
                                <button onClick={() => handleEditItem(item)} className="p-2 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50" aria-label={`Editar ${item.name}`}>
                                    <PencilIcon />
                                </button>
                                <button onClick={() => onDeleteItem(item.id)} className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50" aria-label={`Excluir ${item.name}`}>
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

      {/* Item Form Modal (for editing and creating new items) */}
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)}>
        <ItemForm
            item={itemForForm}
            categories={categories}
            onSave={handleSaveFromForm}
            onDelete={handleDeleteAndCloseForm}
            onCancel={() => setIsFormModalOpen(false)}
        />
      </Modal>

      {/* Quick Add Item Modal */}
      <Modal isOpen={isAddItemModalOpen} onClose={handleCloseQuickAdd}>
         <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Adicionar Item Rápido</h2>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar produto..."
            autoFocus
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
          <ul className="max-h-60 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPresets.length > 0 ? (
              filteredPresets.map(preset => (
                <li key={preset.id} onClick={() => handleAddPresetToList(preset)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-md">
                  <span className="text-gray-800 dark:text-gray-200">{preset.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({preset.category})</span>
                </li>
              ))
            ) : searchTerm ? (
              <div className="p-4 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhum produto encontrado.</p>
                <button
                  onClick={handleOpenFormForNewItem}
                  className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Adicionar "{searchTerm}"
                </button>
              </div>
            ) : (
                <p className="p-4 text-center text-gray-500 dark:text-gray-400">Comece a digitar para pesquisar...</p>
            )}
          </ul>
        </div>
      </Modal>

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

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export default ShoppingListScreen;