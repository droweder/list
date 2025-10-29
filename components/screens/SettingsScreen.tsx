import React, { useState } from 'react';
import Header from '../ui/Header';
import { Screen, Member, ShoppingList } from '../../types';

interface SettingsScreenProps {
  user: Member | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  hasActiveList: boolean;
  lists: ShoppingList[];
  onAddList: (name: string) => void;
  onDeleteList: (id: string) => void;
  onRenameList: (id: string, newName: string) => void;
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <button
        type="button"
        className={`${
        checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
        } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
        role="switch"
        aria-checked={checked}
        onClick={onChange}
    >
        <span
        className={`${
            checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
        />
    </button>
);

const ListManagement: React.FC<Pick<SettingsScreenProps, 'lists' | 'onAddList' | 'onDeleteList' | 'onRenameList'>> = ({ lists, onAddList, onDeleteList, onRenameList }) => {
    const [newListName, setNewListName] = useState('');
    const [editingListId, setEditingListId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newListName.trim()) {
            onAddList(newListName.trim());
            setNewListName('');
        }
    };
    
    const handleEdit = (list: ShoppingList) => {
        setEditingListId(list.id);
        setEditingText(list.name);
    };

    const handleRename = () => {
        if (editingListId && editingText.trim()) {
            onRenameList(editingListId, editingText.trim());
        }
        setEditingListId(null);
        setEditingText('');
    };

    return (
        <div className="space-y-6 mt-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Criar Nova Lista</h2>
                <form onSubmit={handleAddSubmit} className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="Nome da nova lista"
                        required
                        className="flex-grow px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Criar
                    </button>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 p-4 border-b border-gray-200 dark:border-gray-700">Minhas Listas</h2>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {lists.length > 0 ? (
                        lists.map(list => (
                            <li key={list.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                {editingListId === list.id ? (
                                    <input 
                                        type="text" 
                                        value={editingText}
                                        onChange={(e) => setEditingText(e.target.value)}
                                        onBlur={handleRename}
                                        onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                                        autoFocus
                                        className="flex-grow px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-primary-500 rounded-md shadow-sm sm:text-sm"
                                    />
                                ) : (
                                    <div className="flex-grow">
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{list.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{list.items.length} item(s)</p>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    <button onClick={() => handleEdit(list)} className="p-2 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50">
                                        <PencilIcon />
                                    </button>
                                    <button onClick={() => onDeleteList(list.id)} className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
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
    );
}


const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, isDarkMode, onToggleDarkMode, onNavigate, onLogout, hasActiveList, ...listProps }) => {
  return (
    <div>
        <Header title="Ajustes" />
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md divide-y divide-gray-200 dark:divide-gray-700">
                <div className="p-4 flex justify-between items-center">
                    <div>
                        <h3 className="text-md font-medium text-gray-800 dark:text-gray-100">Modo Escuro</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Reduza o brilho e melhore o conforto visual.</p>
                    </div>
                    <ToggleSwitch checked={isDarkMode} onChange={onToggleDarkMode} />
                </div>
                <div className="p-4 flex justify-between items-center">
                    <div>
                        <h3 className="text-md font-medium text-gray-800 dark:text-gray-100">Notificações</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receba alertas sobre sua lista.</p>
                    </div>
                    <ToggleSwitch checked={true} onChange={() => {}} />
                </div>
                <button 
                    onClick={() => hasActiveList && onNavigate(Screen.Invite)}
                    disabled={!hasActiveList}
                    className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div>
                        <h3 className="text-md font-medium text-gray-800 dark:text-gray-100">Convidar para a Lista</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{hasActiveList ? "Compartilhe a lista ativa com outras pessoas." : "Você precisa selecionar uma lista primeiro."}</p>
                    </div>
                    <ChevronRightIcon />
                </button>
                <button onClick={() => onNavigate(Screen.ProductsAndCategories)} className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <div>
                        <h3 className="text-md font-medium text-gray-800 dark:text-gray-100">Gerenciar Produtos e Categorias</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Adicione e personalize produtos e categorias.</p>
                    </div>
                    <ChevronRightIcon />
                </button>
                <div className="p-4">
                    <h3 className="text-md font-medium text-gray-800 dark:text-gray-100 mb-2">Conta</h3>
                    {user ? (
                        <div className="flex items-center gap-4">
                           {user.avatar && (
                                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                           )}
                           <div className="text-sm text-gray-500 dark:text-gray-400">
                                <p><strong>Nome:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                           </div>
                        </div>
                    ) : (
                         <p className="text-sm text-gray-500 dark:text-gray-400">Não foi possível carregar os dados do usuário.</p>
                    )}
                </div>
            </div>

            <ListManagement {...listProps} />

             <div className="mt-6 text-center">
                <button onClick={onLogout} className="text-sm text-red-600 dark:text-red-400 hover:underline">
                    Sair da Conta
                </button>
            </div>
        </div>
    </div>
  );
};

const ChevronRightIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);
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


export default SettingsScreen;
