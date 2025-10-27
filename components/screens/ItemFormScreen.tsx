// components/screens/ItemFormScreen.tsx
import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { useUI } from '@/contexts/UIContext';
import { ShoppingItem, Category, Screen } from '@/types';
import Header from '../ui/Header';

const ItemFormScreen: React.FC = () => {
  const { categories, activeList, updateActiveList } = useData();
  const { editingItem, navigate, setEditingItem } = useUI();
  const [formData, setFormData] = useState<Omit<ShoppingItem, 'id' | 'purchased'>>({
    name: '',
    quantity: 1,
    category: Category.Alimentos,
    notes: '',
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        quantity: editingItem.quantity,
        category: editingItem.category,
        notes: editingItem.notes,
      });
    }
  }, [editingItem]);

  const handleSaveItem = (itemToSave: ShoppingItem) => {
    if (!activeList) return;
    let updatedItems;
    if (itemToSave.id) {
      updatedItems = activeList.items.map(item => item.id === itemToSave.id ? itemToSave : item);
    } else {
      updatedItems = [...activeList.items, { ...itemToSave, id: crypto.randomUUID(), purchased: false }];
    }
    updateActiveList({ items: updatedItems });
    navigate(Screen.ShoppingList);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!activeList) return;
    const updatedItems = activeList.items.filter(item => item.id !== itemId);
    updateActiveList({ items: updatedItems });
    navigate(Screen.ShoppingList);
    setEditingItem(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'quantity' ? Math.max(1, parseInt(value)) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      handleSaveItem({
        ...formData,
        id: editingItem?.id || '',
        purchased: editingItem?.purchased || false,
      });
    }
  };

  return (
    <div>
      <Header title={editingItem ? 'Editar Item' : 'Adicionar Item'} />
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Item</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantidade</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Anotações</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Ex: com baixo teor de sódio"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <button type="button" onClick={() => navigate(Screen.ShoppingList)} className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Cancelar
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {editingItem && (
                <button type="button" onClick={() => handleDeleteItem(editingItem.id)} className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Excluir Item
                </button>
              )}
              <button type="submit" className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Salvar Alterações
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemFormScreen;
