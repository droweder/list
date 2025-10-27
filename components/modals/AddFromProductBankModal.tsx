
// components/modals/AddFromProductBankModal.tsx
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { ShoppingItem } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: ShoppingItem) => void;
}

const AddFromProductBankModal: React.FC<Props> = ({ isOpen, onClose, onAddItem }) => {
  const { products, addProduct } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');

  if (!isOpen) {
    return null;
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewProduct = () => {
    if (newItemName && newItemCategory) {
      const newProduct = {
        name: newItemName,
        category: newItemCategory,
      };
      addProduct(newProduct);
      setNewItemName('');
      setNewItemCategory('');
      setShowNewProductForm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Add from Product Bank</h2>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <ul className="mt-4">
          {filteredProducts.map(product => (
            <li key={product.id} className="flex justify-between items-center p-2 border-b">
              <span>{product.name}</span>
              <button
                onClick={() => onAddItem(product)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
        {showNewProductForm ? (
          <div className="mt-4">
            <h3 className="font-bold">Add New Product</h3>
            <input
              type="text"
              placeholder="Product Name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full p-2 border rounded mt-2"
            />
            <input
              type="text"
              placeholder="Category"
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="w-full p-2 border rounded mt-2"
            />
            <button
              onClick={handleAddNewProduct}
              className="bg-green-500 text-white px-2 py-1 rounded mt-2"
            >
              Save Product
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowNewProductForm(true)}
            className="bg-gray-500 text-white px-2 py-1 rounded mt-4"
          >
            Product Not Found? Add New
          </button>
        )}
        <button onClick={onClose} className="mt-4 bg-red-500 text-white px-2 py-1 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default AddFromProductBankModal;
