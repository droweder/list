// components/modals/AddFromProductBankModal.tsx
import React, { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { ShoppingItem, Category } from '@/types';

interface AddFromProductBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: ShoppingItem) => void;
  listItems: ShoppingItem[];
}

const AddFromProductBankModal: React.FC<AddFromProductBankModalProps> = ({ isOpen, onClose, onAddItem, listItems }) => {
  const { products, categories, addProduct } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<Category | string>(Category.Alimentos);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = useMemo(() => {
    const listItemsNames = (listItems || []).map(item => item.name.toLowerCase());
    const availableProducts = products.filter(p => !listItemsNames.includes(p.name.toLowerCase()));

    const productsToDisplay = searchTerm
      ? availableProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : availableProducts;

    const grouped: Record<string, ShoppingItem[]> = {};
    productsToDisplay
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(p => {
        if (!grouped[p.category]) {
          grouped[p.category] = [];
        }
        grouped[p.category].push(p);
      });
    return grouped;
  }, [products, searchTerm, listItems]);

  const handleAddItemClick = (product: ShoppingItem) => {
    onAddItem(product);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1000);
  };

  const handleAddNewProduct = () => {
    if (newProductName.trim()) {
      const newProduct: Omit<ShoppingItem, 'id' | 'quantity' | 'notes' | 'purchased'> = {
        name: newProductName.trim(),
        category: newProductCategory,
      };
      addProduct(newProduct);
      setNewProductName('');
      setNewProductCategory(Category.Alimentos);
      setShowNewProductForm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Adicionar da Despensa</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <input
          type="text"
          placeholder="Buscar produto..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 mb-4 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <div className="flex-grow overflow-y-auto space-y-4">
          {Object.keys(filteredProducts).length > 0 ? (
            Object.keys(filteredProducts).sort().map(category => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 capitalize mb-2 sticky top-0 bg-white dark:bg-gray-800 py-1">{category}</h3>
                {filteredProducts[category].map(product => (
                  <div key={product.id} className="flex justify-between items-center py-2 px-1 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-800 dark:text-gray-200">{product.name}</span>
                    <button
                      onClick={() => handleAddItemClick(product)}
                      className={`w-28 text-center py-1 rounded-md text-sm font-semibold transition-all duration-200 ${
                        addedProductId === product.id ? 'bg-green-500 text-white'
                                : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }`}
                    >
                      {addedProductId === product.id ? 'Adicionado!' : 'Adicionar'}
                    </button>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-center my-4">
              <p className="text-gray-500 dark:text-gray-400">Nenhum produto encontrado.</p>
              {searchTerm && <p className="text-gray-500 dark:text-gray-400 mb-2">"{searchTerm}" não foi encontrado na despensa.</p>}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {showNewProductForm ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Novo Produto</h3>
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Nome do produto"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="flex-grow px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <select
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={() => setShowNewProductForm(false)} className="text-gray-600 dark:text-gray-400 mr-4">Cancelar</button>
                <button onClick={handleAddNewProduct} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-semibold">
                  Salvar Produto
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowNewProductForm(true)} className="w-full text-center py-2 rounded-md text-sm font-semibold transition-all duration-200 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200">
              Cadastrar Novo Produto
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFromProductBankModal;
