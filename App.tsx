// App.tsx
import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { useUI } from './contexts/UIContext';
import { useData } from './contexts/DataContext';
import { Screen } from './types';

import LoginScreen from './components/screens/LoginScreen';
import ShoppingListScreen from './components/screens/ShoppingListScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import ProductsAndCategoriesScreen from './components/screens/ProductsAndCategoriesScreen';
import MyListsScreen from './components/screens/MyListsScreen';
import InviteScreen from './components/screens/InviteScreen';
import BottomNav from './components/ui/BottomNav';

function App() {
  const { isLoggedIn, login } = useAuth();
  const { currentScreen, navigate } = useUI();
  const { activeList } = useData();

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => login({ id: '1', name: 'Usuário Principal', email: 'voce@email.com' })} />;
  }

  const renderScreen = () => {
    if (!activeList && currentScreen === Screen.ShoppingList) {
      return <MyListsScreen />;
    }

    switch (currentScreen) {
      case Screen.ShoppingList:
        return activeList ? <ShoppingListScreen /> : <MyListsScreen />;
      case Screen.MyLists:
        return <MyListsScreen />;
      case Screen.Invite:
        return <InviteScreen />;
      case Screen.Settings:
        return <SettingsScreen />;
      case Screen.ProductsAndCategories:
        return <ProductsAndCategoriesScreen />;
      default:
        return <ShoppingListScreen />;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <main className="pb-16">{renderScreen()}</main>
      <BottomNav activeScreen={currentScreen} onNavigate={navigate} />
    </div>
  );
}

export default App;
