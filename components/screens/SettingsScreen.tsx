// components/screens/SettingsScreen.tsx
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUI } from '@/contexts/UIContext';
import { useData } from '@/contexts/DataContext';
import Header from '../ui/Header';
import { Screen } from '@/types';

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    className={`${checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
    role="switch"
    aria-checked={checked}
    onClick={onChange}
  >
    <span
      className={`${checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
    />
  </button>
);

const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode, navigate } = useUI();
  const { activeList } = useData();
  const hasActiveList = !!activeList;

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
            <ToggleSwitch checked={isDarkMode} onChange={toggleDarkMode} />
          </div>
          <div className="p-4 flex justify-between items-center">
            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-100">Notificações</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receba alertas sobre sua lista.</p>
            </div>
            <ToggleSwitch checked={true} onChange={() => { }} />
          </div>
          <button
            onClick={() => hasActiveList && navigate(Screen.Invite)}
            disabled={!hasActiveList}
            className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-100">Convidar para a Lista</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{hasActiveList ? "Compartilhe a lista ativa com outras pessoas." : "Você precisa selecionar uma lista primeiro."}</p>
            </div>
            <ChevronRightIcon />
          </button>
          <button onClick={() => navigate(Screen.ProductsAndCategories)} className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-100">Gerenciar Produtos e Categorias</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Adicione e personalize produtos e categorias.</p>
            </div>
            <ChevronRightIcon />
          </button>
          <div className="p-4">
            <h3 className="text-md font-medium text-gray-800 dark:text-gray-100">Conta</h3>
            {user ? (
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <p><strong>Nome:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Não foi possível carregar os dados do usuário.</p>
            )}
          </div>
        </div>
        <div className="mt-6 text-center">
          <button onClick={logout} className="text-sm text-red-600 dark:text-red-400 hover:underline">
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
};

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export default SettingsScreen;
