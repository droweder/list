// components/screens/LoginScreen.tsx
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const ShoppingCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-69.5 69.5c-23.6-22.6-55.2-36.4-90.4-36.4-69.1 0-125.5 56.4-125.5 125.5s56.4 125.5 125.5 125.5c78.8 0 102.7-56.9 105.8-83.6H248v-90.8h239.3c1.3 12.3 2.7 24.6 2.7 36.8z"></path>
  </svg>
);


const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <div className="flex justify-center mb-6">
            <ShoppingCartIcon />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Meu Mercadin<span className="text-primary-500">™</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 mb-10">Sua lista de compras, mais inteligente.</p>

        <button 
            onClick={() => login({ id: '1', name: 'Usuário Principal', email: 'voce@email.com' })}
            className="w-full flex items-center justify-center gap-3 bg-primary-600 text-white font-bold py-3 rounded-lg hover:bg-primary-700 transition duration-300 transform hover:scale-105 shadow-lg"
        >
          <GoogleIcon />
          Continuar com o Google
        </button>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-8">
            Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
