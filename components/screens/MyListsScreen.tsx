// components/screens/MyListsScreen.tsx
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useUI } from '@/contexts/UIContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '../ui/Header';
import IconPicker from '../ui/IconPicker';
import { ShoppingList, Screen } from '@/types';

const MyListsScreen: React.FC = () => {
  const { lists, activeList, addList, deleteList, renameList, setActiveListId } = useData();
  const { navigate } = useUI();
  const { user } = useAuth();
  const [newListName, setNewListName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🛒');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      addList(newListName.trim(), selectedIcon, user);
      setNewListName('');
      setSelectedIcon('🛒');
      navigate(Screen.ShoppingList);
    }
  };

  const handleSelectList = (id: string) => {
    setActiveListId(id);
    navigate(Screen.ShoppingList);
  };

  const handleEdit = (list: ShoppingList) => {
    setEditingListId(list.id);
    setEditingText(list.name);
  };

  const handleRename = () => {
    if (editingListId && editingText.trim()) {
      renameList(editingListId, editingText.trim());
    }
    setEditingListId(null);
    setEditingText('');
  };

  return (
    <div>
      <Header title="Minhas Listas" />
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Criar Nova Lista</h2>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Nome da nova lista"
              required
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            <IconPicker selectedIcon={selectedIcon} onSelectIcon={setSelectedIcon} />
            <button
              type="submit"
              className="w-full px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Criar Lista
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {lists.length > 0 ? (
              lists.map(list => (
                <li key={list.id} className={`p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${list.id === activeList?.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                  {editingListId === list.id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={handleRename}
                      onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                      autoFocus
                      className="flex-grow px-2 py-1 bg-white dark:bg-gray-700 border border-primary-500 rounded-md shadow-sm sm:text-sm"
                    />
                  ) : (
                    <div onClick={() => handleSelectList(list.id)} className="flex-grow cursor-pointer flex items-center gap-4">
                      <span className="text-2xl">{list.icon || '🛒'}</span>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{list.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{list.items.length} item(s)</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button onClick={() => handleEdit(list)} className="p-2 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50">
                      <PencilIcon />
                    </button>
                    <button onClick={() => deleteList(list.id)} className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                      <TrashIcon />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="p-4 text-center text-gray-500 dark:text-gray-400">Nenhuma lista encontrada. Crie uma acima!</p>
            )}
          </ul>
        </div>
      </div>
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

export default MyListsScreen;
