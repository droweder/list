// components/modals/AddFromProductBankModal.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { ShoppingItem } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: ShoppingItem) => void;
  listItems: ShoppingItem[];
}

const AddFromProductBankModal: React.FC<Props> = ({ isOpen, onClose, onAddItem, listItems }) => {
  const { products, categories, addProduct } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(categories[0] || '');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  const filteredProducts = useMemo(() =>
    products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [products, searchTerm]);

  const groupedProducts = useMemo(() =>
    filteredProducts.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, ShoppingItem[]>), [filteredProducts]);

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName && newItemCategory && newItemUnit) {
      const newProduct = {
        name: newItemName,
        category: newItemCategory,
        unit: newItemUnit,
      };
      addProduct(newProduct);
      setNewItemName('');
      setNewItemCategory(categories[0] || '');
      setNewItemUnit('');
      setShowNewProductForm(false);
      setSearchTerm('');
    }
  };

  const handleAddItemClick = (item: ShoppingItem) => {
    onAddItem(item);
    setAddedItemId(item.id);
  };

  useEffect(() => {
    if (addedItemId) {
      const timer = setTimeout(() => setAddedItemId(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [addedItemId]);

  const handleClose = () => {
    setSearchTerm('');
    setShowNewProductForm(false);
    onClose();
  }

  if (!isOpen) {
    return null;
  }

  const isItemInList = (itemId: string) => {
    return listItems.some(item => item.id === itemId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md flex flex-col" style={{maxHeight: '80vh'}}>
        <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {showNewProductForm ? 'Adicionar Novo Produto' : 'Adicionar da Despensa'}
          </h2>
          <button onClick={handleClose} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XIcon />
          </button>
        </header>

        <div className="p-4 flex-grow overflow-y-auto">
          {showNewProductForm ? (
            <form onSubmit={handleAddNewProduct} className="space-y-4">
              <div>
                <label htmlFor="new-item-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Produto</label>
                <input
                  id="new-item-name"
                  type="text"
                  placeholder="Ex: Leite Integral"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  required
                  className="mt-1 w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label htmlFor="new-item-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unidade</label>
                <input
                  id="new-item-unit"
                  type="text"
                  placeholder="Ex: kg, L, Unidade"
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value)}
                  required
                  className="mt-1 w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label htmlFor="new-item-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</label>
                <select
                  id="new-item-category"
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="mt-1 w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowNewProductForm(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                  Salvar Produto
                </button>
              </div>
            </form>
          ) : (
            <>
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="space-y-4">
                {Object.keys(groupedProducts).sort().map(category => (
                  <div key={category} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h3 className="text-md font-semibold text-gray-600 dark:text-gray-300 p-3 border-b border-gray-200 dark:border-gray-700">{category}</h3>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {groupedProducts[category].map(product => (
                        <li key={product.id} className="flex justify-between items-center py-2 px-3">
                          <span className="text-gray-800 dark:text-gray-100">{product.name}</span>
                          <button
                            onClick={() => handleAddItemClick(product)}
                            disabled={isItemInList(product.id)}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                              addedItemId === product.id
                                ? 'bg-green-500 text-white'
                                : isItemInList(product.id)
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                : 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/50'
                            }`}
                          >
                            {addedItemId === product.id ? 'Adicionado!' : isItemInList(product.id) ? 'Adicionado' : 'Adicionar'}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                   <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum produto encontrado.</p>
                )}
              </div>
            </>
          )}
        </div>

        {!showNewProductForm && (
          <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowNewProductForm(true)}
              className="w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Não encontrou o produto? Adicione um novo
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default AddFromProductBankModal;
