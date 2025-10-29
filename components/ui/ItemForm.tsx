import React, { useState, useEffect } from 'react';
import type { ShoppingItem, Category } from '../../types';
import { UNITS_OF_MEASUREMENT } from '../../constants';

interface ItemFormProps {
  item: ShoppingItem | null;
  categories: Category[];
  onSave: (item: ShoppingItem) => void;
  onDelete: (itemId: string) => void;
  onCancel: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ item, categories, onSave, onDelete, onCancel }) => {
  const [formData, setFormData] = useState<Omit<ShoppingItem, 'id' | 'purchased'>>({
    name: '',
    quantity: 1,
    unit: 'un',
    category: categories[0]?.name || 'Outros',
    notes: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit || 'un',
        category: item.category,
        notes: item.notes,
      });
    } else {
        // Reset for new item
         setFormData({
            name: '',
            quantity: 1,
            unit: 'un',
            category: categories[0] || Category.Alimentos,
            notes: '',
        });
    }
  }, [item, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'quantity' ? Math.max(1, parseInt(value)) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave({
        ...formData,
        id: item?.id || '',
        purchased: item?.purchased || false,
      });
    }
  };

  return (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6" id="modal-title">{item ? 'Editar Item' : 'Adicionar Item'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Item</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
            </div>
            
            <div className="flex items-end gap-4">
                <div className="flex-grow">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantidade</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="1"
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                </div>
                <div className="w-1/3">
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unidade</label>
                    <select
                        id="unit"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    >
                        {UNITS_OF_MEASUREMENT.map(unit => (
                            <option key={unit.value} value={unit.value}>{unit.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
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
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Ex: com baixo teor de sódio"
                />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4">
                <button type="button" onClick={onCancel} className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Cancelar
                </button>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {item && (
                        <button type="button" onClick={() => onDelete(item.id)} className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            Excluir Item
                        </button>
                    )}
                    <button type="submit" className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Salvar
                    </button>
                </div>
            </div>
        </form>
    </div>
  );
};

export default ItemForm;