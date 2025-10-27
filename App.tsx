import React, { useState, useEffect } from 'react';
import { Screen, ShoppingItem, Category, ShoppingList, Member } from './types';
import { INITIAL_LISTS, INITIAL_CATEGORIES, INITIAL_PRESET_ITEMS } from './constants';
import LoginScreen from './components/screens/LoginScreen';
import ShoppingListScreen from './components/screens/ShoppingListScreen';
import ItemFormScreen from './components/screens/ItemFormScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import ProductsAndCategoriesScreen from './components/screens/ProductsAndCategoriesScreen';
import MyListsScreen from './components/screens/MyListsScreen';
import InviteScreen from './components/screens/InviteScreen';
import BottomNav from './components/ui/BottomNav';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Member | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.ShoppingList);
  const [lists, setLists] = useState<ShoppingList[]>(INITIAL_LISTS);
  const [activeListId, setActiveListId] = useState<string | null>(INITIAL_LISTS[0]?.id || null);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [presetItems, setPresetItems] = useState<ShoppingItem[]>(INITIAL_PRESET_ITEMS);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('darkMode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);
  
  const activeList = lists.find(list => list.id === activeListId);

  const handleLogin = () => {
    // Simulate fetching user data after login
    const loggedInUser = { id: '1', name: 'Usuário Principal', email: 'voce@email.com' };
    setUser(loggedInUser);
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
      setUser(null);
      setIsLoggedIn(false);
      setCurrentScreen(Screen.ShoppingList); // Reset to a default screen
  }

  const handleNavigate = (screen: Screen) => {
    setEditingItem(null);
    setCurrentScreen(screen);
  };
  
  const updateActiveList = (updatedList: Partial<ShoppingList>) => {
      if (!activeListId) return;
      setLists(lists.map(list => 
          list.id === activeListId ? { ...list, ...updatedList } : list
      ));
  };
  
  const handleUpdateItems = (updatedItems: ShoppingItem[]) => {
      updateActiveList({ items: updatedItems });
  }

  const handleAddItem = () => {
    setEditingItem(null);
    setCurrentScreen(Screen.ItemForm);
  };
  
  const handleEditItem = (item: ShoppingItem) => {
    setEditingItem(item);
    setCurrentScreen(Screen.ItemForm);
  };
  
  const handleSaveItem = (itemToSave: ShoppingItem) => {
    if (!activeList) return;
    let updatedItems;
    if (itemToSave.id) { 
      updatedItems = activeList.items.map(item => item.id === itemToSave.id ? itemToSave : item);
    } else {
      updatedItems = [...activeList.items, { ...itemToSave, id: Date.now().toString(), purchased: false }];
    }
    handleUpdateItems(updatedItems);
    setCurrentScreen(Screen.ShoppingList);
    setEditingItem(null);
  };
  
  const handleDeleteItem = (itemId: string) => {
    if (!activeList) return;
    const updatedItems = activeList.items.filter(item => item.id !== itemId);
    handleUpdateItems(updatedItems);
    setCurrentScreen(Screen.ShoppingList);
    setEditingItem(null);
  };
  
  const handleToggleItem = (itemId: string) => {
    if (!activeList) return;
    const updatedItems = activeList.items.map(item => item.id === itemId ? { ...item, purchased: !item.purchased } : item);
    handleUpdateItems(updatedItems);
  };

  const handleInviteMember = (email: string) => {
    if (!activeList) return;
    if (activeList.members.some(m => m.email.toLowerCase() === email.toLowerCase())) {
        alert("Este membro já foi convidado.");
        return;
    }
    const newMember: Member = {
        id: `member-${Date.now()}`,
        name: email.split('@')[0], // Simple name generation
        email: email,
    };
    updateActiveList({ members: [...activeList.members, newMember] });
    alert(`Convite enviado para ${email}!`);
  };
  
  const handleDeleteMember = (memberId: string) => {
      if (!activeList) return;
      const updatedMembers = activeList.members.filter(m => m.id !== memberId);
      updateActiveList({ members: updatedMembers });
  };
  
  const handleAddCategory = (category: string) => {
    if (category && !categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    const updatedLists = lists.map(list => ({
        ...list,
        items: list.items.map(item =>
            item.category === categoryToDelete ? { ...item, category: Category.Outros } : item
        )
    }));
    setLists(updatedLists);
    setCategories(categories.filter(cat => cat !== categoryToDelete));
  };
  
  const handleUpdateCategory = (oldName: string, newName: string) => {
    if (newName && !categories.includes(newName)) {
      const updatedLists = lists.map(list => ({
          ...list,
          items: list.items.map(item =>
            item.category === oldName ? { ...item, category: newName } : item
          )
      }));
      setLists(updatedLists);
      setCategories(categories.map(cat => cat === oldName ? newName : cat));
    }
  };

  const handleAddPresetItem = (item: Pick<ShoppingItem, 'name' | 'category'>) => {
    const newPreset: ShoppingItem = {
      ...item,
      id: `preset-${Date.now()}`,
      quantity: 1,
      notes: '',
      purchased: false,
    };
    setPresetItems([...presetItems, newPreset]);
  };

  const handleDeletePresetItem = (itemId: string) => {
    setPresetItems(presetItems.filter(item => item.id !== itemId));
  };

  const handleUpdatePresetItem = (updatedItem: ShoppingItem) => {
    setPresetItems(presetItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  };
  
  const handleAddList = (name: string) => {
      const newList: ShoppingList = {
          id: `list-${Date.now()}`,
          name,
          items: [],
          members: user ? [user] : [],
      };
      setLists([...lists, newList]);
      setActiveListId(newList.id);
      setCurrentScreen(Screen.ShoppingList);
  };
  
  const handleDeleteList = (listId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta lista? Esta ação não pode ser desfeita.")) {
      const newLists = lists.filter(list => list.id !== listId);
      setLists(newLists);
      if (activeListId === listId) {
        setActiveListId(newLists[0]?.id || null);
        if(!newLists.length){
            setCurrentScreen(Screen.MyLists)
        }
      }
    }
  };

  const handleRenameList = (listId: string, newName: string) => {
    setLists(lists.map(list => list.id === listId ? { ...list, name: newName } : list));
  };

  const handleSelectList = (listId: string) => {
      setActiveListId(listId);
      setCurrentScreen(Screen.ShoppingList);
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderScreen = () => {
    if (!activeList && ![Screen.MyLists, Screen.Settings, Screen.ProductsAndCategories].includes(currentScreen)) {
        return <MyListsScreen 
            lists={lists} 
            activeListId={activeListId} 
            onSelectList={handleSelectList} 
            onAddList={handleAddList}
            onDeleteList={handleDeleteList}
            onRenameList={handleRenameList}
        />;
    }

    switch(currentScreen) {
      case Screen.ShoppingList:
        return <ShoppingListScreen listName={activeList!.name} items={activeList!.items} onToggleItem={handleToggleItem} onEditItem={handleEditItem} onAddItem={handleAddItem} />;
      case Screen.ItemForm:
        return <ItemFormScreen item={editingItem} categories={categories} onSave={handleSaveItem} onDelete={handleDeleteItem} onCancel={() => setCurrentScreen(Screen.ShoppingList)} />;
      case Screen.MyLists:
        return <MyListsScreen 
            lists={lists} 
            activeListId={activeListId} 
            onSelectList={handleSelectList} 
            onAddList={handleAddList}
            onDeleteList={handleDeleteList}
            onRenameList={handleRenameList}
        />;
      case Screen.Invite:
        return <InviteScreen 
            listName={activeList!.name} 
            members={activeList!.members}
            onInvite={handleInviteMember}
            onDeleteMember={handleDeleteMember}
        />;
      case Screen.Settings:
        return <SettingsScreen user={user} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} onNavigate={handleNavigate} onLogout={handleLogout} hasActiveList={!!activeList} />;
      case Screen.ProductsAndCategories:
        return <ProductsAndCategoriesScreen 
                    categories={categories} 
                    onAddCategory={handleAddCategory} 
                    onDeleteCategory={handleDeleteCategory} 
                    onUpdateCategory={handleUpdateCategory}
                    presetItems={presetItems}
                    onAddPresetItem={handleAddPresetItem}
                    onDeletePresetItem={handleDeletePresetItem}
                    onUpdatePresetItem={handleUpdatePresetItem}
                />;
      default:
        return <ShoppingListScreen listName={activeList!.name} items={activeList!.items} onToggleItem={handleToggleItem} onEditItem={handleEditItem} onAddItem={handleAddItem} />;
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <main className="pb-16">{renderScreen()}</main>
      <BottomNav activeScreen={currentScreen} onNavigate={handleNavigate} />
    </div>
  );
}

export default App;