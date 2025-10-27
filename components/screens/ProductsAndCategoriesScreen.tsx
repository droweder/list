import React, { useState } from 'react';
import Header from '../ui/Header';
import { ShoppingItem } from '../../types';

interface ProductsAndCategoriesScreenProps {
  categories: string[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onUpdateCategory: (oldName: string, newName: string) => void;
  presetItems: ShoppingItem[];
  onAddPresetItem: (item: Pick<ShoppingItem, 'name' | 'category'>) => void;
  onDeletePresetItem: (itemId: string) => void;
  onUpdatePresetItem: (item: ShoppingItem) => void;
}

const ProductsAndCategoriesScreen: React.FC<ProductsAndCategoriesScreenProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  return (
    <div>
      <Header title="Produtos e Categorias" />
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
                <li className="mr-2" role="presentation">
                    <button 
                        className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'products' ? 'border-primary-600 text-primary-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                        onClick={() => setActiveTab('products')}
                        role="tab"
                        aria-controls="products"
                        aria-selected={activeTab === 'products'}
                    >
                        Produtos
                    </button>
                </li>
                <li className="mr-2" role="presentation">
                     <button 
                        className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'categories' ? 'border-primary-600 text-primary-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                        onClick={() => setActiveTab('categories')}
                        role="tab"
                        aria-controls="categories"
                        aria-selected={activeTab === 'categories'}
                    >
                        Categorias
                    </button>
                </li>
            </ul>
        </div>
        <div>
            {activeTab === 'products' && <ProductManagementTab {...props} />}
            {activeTab === 'categories' && <CategoryManagementTab {...props} />}
        </div>
      </div>
    </div>
  );
};

const ProductManagementTab: React.FC<ProductsAndCategoriesScreenProps> = ({ presetItems, categories, onAddPresetItem, onUpdatePresetItem, onDeletePresetItem }) => {
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState(categories[0] || '');
    const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddPresetItem({ name: newItemName, category: newItemCategory });
        setNewItemName('');
    };
    
    const handleEdit = (item: ShoppingItem) => {
        setEditingItem(item);
    };
    
    const handleUpdate = () => {
        if (editingItem) {
            onUpdatePresetItem(editingItem);
            setEditingItem(null);
        }
    };
    
    const handleCancelEdit = () => {
        setEditingItem(null);
    }

    const groupedItems = presetItems.reduce((acc, item) => {
        const category = item.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
    }, {} as Record<string, ShoppingItem[]>);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Adicionar Novo Produto</h2>
                <form onSubmit={handleAddSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="Nome do produto" required className="sm:col-span-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500" />
                    <select value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value)} className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500">
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <button type="submit" className="sm:col-span-3 w-full px-6 py-2 border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">Adicionar Produto</button>
                </form>
            </div>

            <div className="space-y-4">
                {Object.keys(groupedItems).sort().map(category => (
                    <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 p-4 border-b border-gray-200 dark:border-gray-700">{category}</h2>
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {groupedItems[category].map(item => (
                                <li key={item.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    {editingItem?.id === item.id ? (
                                        <div className="flex-grow w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <input type="text" value={editingItem.name} onChange={(e) => setEditingItem({...editingItem, name: e.target.value })} className="px-2 py-1 bg-white dark:bg-gray-700 border border-primary-500 rounded-md" />
                                            <select value={editingItem.category} onChange={(e) => setEditingItem({...editingItem, category: e.target.value })} className="px-2 py-1 bg-white dark:bg-gray-700 border border-primary-500 rounded-md">
                                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                    ) : (
                                        <span className="text-gray-800 dark:text-gray-100">{item.name}</span>
                                    )}
                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        {editingItem?.id === item.id ? (
                                            <>
                                                <button onClick={handleUpdate} className="p-1 text-green-500 hover:text-green-700"><CheckIcon /></button>
                                                <button onClick={handleCancelEdit} className="p-1 text-gray-500 hover:text-gray-700"><XIcon /></button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(item)} className="p-1 text-blue-500 hover:text-blue-700"><PencilIcon /></button>
                                                <button onClick={() => onDeletePresetItem(item.id)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon /></button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CategoryManagementTab: React.FC<ProductsAndCategoriesScreenProps> = ({ categories, onAddCategory, onDeleteCategory, onUpdateCategory }) => {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCategory(newCategory.trim());
    setNewCategory('');
  };
  
  const handleEdit = (category: string) => {
    setEditingCategory(category);
    setEditingText(category);
  };
  
  const handleUpdate = () => {
    if (editingCategory && editingText.trim()) {
        onUpdateCategory(editingCategory, editingText.trim());
        setEditingCategory(null);
        setEditingText('');
    }
  };
  
  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditingText('');
  }
  
  const handleDelete = (category: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a categoria "${category}"? Os itens nesta categoria serão movidos para "Outros".`)) {
        onDeleteCategory(category);
    }
  };

  return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Adicionar Nova Categoria</h2>
          <form onSubmit={handleAddSubmit} className="flex flex-col sm:flex-row gap-2">
            <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Nome da categoria" required className="flex-grow px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500" />
            <button type="submit" className="px-6 py-2 border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">Adicionar</button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 p-4 border-b border-gray-200 dark:border-gray-700">Minhas Categorias</h2>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map(category => (
                <li key={category} className="p-4 flex justify-between items-center">
                {editingCategory === category ? (
                    <input type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)} onBlur={handleUpdate} onKeyDown={(e) => e.key === 'Enter' && handleUpdate()} autoFocus className="flex-grow px-2 py-1 bg-white dark:bg-gray-700 border border-primary-500 rounded-md" />
                ) : (
                    <span className="text-gray-800 dark:text-gray-100">{category}</span>
                )}
                <div className="flex items-center gap-2">
                    {editingCategory === category ? (
                        <>
                           <button onClick={handleUpdate} className="p-1 text-green-500 hover:text-green-700"><CheckIcon /></button>
                           <button onClick={handleCancelEdit} className="p-1 text-gray-500 hover:text-gray-700"><XIcon /></button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => handleEdit(category)} className="p-1 text-blue-500 hover:text-blue-700"><PencilIcon /></button>
                            <button onClick={() => handleDelete(category)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon /></button>
                        </>
                    )}
                </div>
                </li>
            ))}
            </ul>
        </div>
      </div>
  );
};

const PencilIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>);
const XIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);

export default ProductsAndCategoriesScreen;