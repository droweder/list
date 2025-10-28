import React, { useState, useEffect, useCallback } from 'react';
import { Screen, ShoppingItem, Category, ShoppingList, Member } from './types';
import { INITIAL_LISTS, INITIAL_CATEGORIES, INITIAL_PRESET_ITEMS } from './constants';
import LoginScreen from './components/screens/LoginScreen';
import ShoppingListScreen from './components/screens/ShoppingListScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import ProductsAndCategoriesScreen from './components/screens/ProductsAndCategoriesScreen';
import InviteScreen from './components/screens/InviteScreen';
import BottomNav from './components/ui/BottomNav';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Member | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.ShoppingList);
  
  const [lists, setLists] = useState<ShoppingList[]>(() => {
    const saved = window.localStorage.getItem('shoppingLists');
    return saved ? JSON.parse(saved) : INITIAL_LISTS;
  });

  const [activeListId, setActiveListId] = useState<string | null>(() => {
    const saved = window.localStorage.getItem('activeListId');
    return saved ? JSON.parse(saved) : null;
  });

  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [presetItems, setPresetItems] = useState<ShoppingItem[]>(INITIAL_PRESET_ITEMS);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  
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

  useEffect(() => {
    window.localStorage.setItem('shoppingLists', JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    window.localStorage.setItem('activeListId', JSON.stringify(activeListId));
  }, [activeListId]);
  
  useEffect(() => {
    const storedUser = window.localStorage.getItem('user');
    if (storedUser) {
      const parsedUser: Member = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);

      setLists(currentLists => currentLists.map(list => {
          if (list.members.some(member => member.id === parsedUser.id)) {
              return list;
          }
          return { ...list, members: [parsedUser, ...list.members] };
      }));
    }
  }, []);

  useEffect(() => {
    if ((!activeListId || !lists.some(l => l.id === activeListId)) && lists.length > 0) {
      setActiveListId(lists[0].id);
    }
  }, [lists, activeListId]);

  const handleCloseAddItemModal = useCallback(() => {
    setIsAddItemModalOpen(false);
  }, []);
  
  const activeList = lists.find(list => list.id === activeListId);

  const handleLogin = () => {
    const mockUser: Member = {
      id: `google-${Date.now()}`,
      name: 'Usuário do Google',
      email: 'usuario.google@example.com',
      avatar: `https://api.dicebear.com/8.x/initials/svg?seed=Usuário do Google`,
    };
    
    window.localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoggedIn(true);
    
    setLists(currentLists =>
      currentLists.map(list => {
        if (list.members.some(member => member.id === mockUser.id)) {
          return list;
        }
        return { ...list, members: [mockUser, ...list.members] };
      })
    );
  };
  
  const handleLogout = () => {
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('shoppingLists');
      window.localStorage.removeItem('activeListId');
      setUser(null);
      setIsLoggedIn(false);
      setActiveListId(null);
      setLists(INITIAL_LISTS);
      setCurrentScreen(Screen.ShoppingList);
  }

  const handleNavigate = (screen: Screen) => {
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
  
  const handleSaveItem = (itemToSave: ShoppingItem) => {
    if (!activeList) return;
    let updatedItems;
    if (itemToSave.id) { 
      updatedItems = activeList.items.map(item => item.id === itemToSave.id ? itemToSave : item);
    } else {
      updatedItems = [...activeList.items, { ...itemToSave, id: Date.now().toString(), purchased: false }];
    }
    handleUpdateItems(updatedItems);
  };
  
  const handleDeleteItem = (itemId: string) => {
    if (!activeList) return;
    const updatedItems = activeList.items.filter(item => item.id !== itemId);
    handleUpdateItems(updatedItems);
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
        name: email.split('@')[0],
        email: email,
        avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${email.split('@')[0]}`,
    };
    updateActiveList({ members: [...activeList.members, newMember] });
    alert(`Convite enviado para ${email}!`);
  };
  
  const handleDeleteMember = (memberId: string) => {
      if (!activeList || memberId === user?.id) return;
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

  const handleAddPresetItem = (item: Pick<ShoppingItem, 'name' | 'category' | 'unit'>) => {
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
    switch(currentScreen) {
      case Screen.ShoppingList:
        return <ShoppingListScreen 
                  listName={activeList?.name} 
                  items={activeList?.items} 
                  onToggleItem={handleToggleItem} 
                  onDeleteItem={handleDeleteItem}
                  onSaveItem={handleSaveItem}
                  categories={categories}
                  isAddItemModalOpen={isAddItemModalOpen}
                  onCloseAddItemModal={handleCloseAddItemModal}
                  presetItems={presetItems}
                  onAddPresetItem={handleAddPresetItem}
               />;
      case Screen.Invite:
        if (!activeList) return <ShoppingListScreen categories={categories} onSaveItem={handleSaveItem} onToggleItem={handleToggleItem} onDeleteItem={handleDeleteItem} isAddItemModalOpen={isAddItemModalOpen} onCloseAddItemModal={handleCloseAddItemModal} presetItems={presetItems} onAddPresetItem={handleAddPresetItem} />;
        return <InviteScreen 
            user={user}
            listName={activeList.name} 
            members={activeList.members}
            onInvite={handleInviteMember}
            onDeleteMember={handleDeleteMember}
        />;
      case Screen.Settings:
        return <SettingsScreen 
            user={user} 
            isDarkMode={isDarkMode} 
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
            onNavigate={handleNavigate} 
            onLogout={handleLogout} 
            hasActiveList={!!activeList}
            lists={lists}
            onAddList={handleAddList}
            onDeleteList={handleDeleteList}
            onRenameList={handleRenameList}
        />;
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
        return <ShoppingListScreen 
                  listName={activeList?.name} 
                  items={activeList?.items} 
                  onToggleItem={handleToggleItem} 
                  onDeleteItem={handleDeleteItem} 
                  onSaveItem={handleSaveItem}
                  categories={categories}
                  isAddItemModalOpen={isAddItemModalOpen}
                  onCloseAddItemModal={handleCloseAddItemModal}
                  presetItems={presetItems}
                  onAddPresetItem={handleAddPresetItem}
                />;
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <main className="pb-20">{renderScreen()}</main>
      <BottomNav 
        currentScreen={currentScreen}
        onNavigate={handleNavigate} 
        lists={lists}
        activeListId={activeListId}
        onSelectList={handleSelectList}
        onAddItem={() => activeListId && setIsAddItemModalOpen(true)}
      />
    </div>
  );
}

export default App;