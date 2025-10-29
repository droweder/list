import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabaseClient';
import { Screen, ShoppingItem, Category, ShoppingList, Member } from './types';
import LoginScreen from './components/screens/LoginScreen';
import ShoppingListScreen from './components/screens/ShoppingListScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import ProductsAndCategoriesScreen from './components/screens/ProductsAndCategoriesScreen';
import InviteScreen from './components/screens/InviteScreen';
import BottomNav from './components/ui/BottomNav';

function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<Member | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.ShoppingList);
  
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [presetItems, setPresetItems] = useState<ShoppingItem[]>([]);
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session?.user) {
      const { user: authUser } = session;
      const currentUser: Member = {
        id: authUser.id,
        name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Usuário',
        email: authUser.email!,
        avatar: authUser.user_metadata?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${authUser.email?.split('@')[0] || 'U'}`,
      };
      setUser(currentUser);
    } else {
      setUser(null);
    }
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (session) {
        // Fetch lists, categories, and products in parallel
        const [
          { data: listData, error: listError },
          { data: categoryData, error: categoryError },
          { data: productData, error: productError }
        ] = await Promise.all([
          supabase.from('shopping_lists').select('*'),
          supabase.from('categories').select('*'),
          supabase.from('products').select('*')
        ]);

        if (listError) console.error('Error fetching lists:', listError);
        else setLists(listData || []);

        if (categoryError) console.error('Error fetching categories:', categoryError);
        else setCategories(categoryData || []);

        if (productError) console.error('Error fetching products:', productError);
        else setPresetItems(productData || []);
      }
      setLoading(false);
    };
    fetchData();
  }, [session]);

  useEffect(() => {
    if ((!activeListId || !lists.some(l => l.id === activeListId)) && lists.length > 0) {
      setActiveListId(lists[0].id);
    }
  }, [lists, activeListId]);

  const handleCloseAddItemModal = useCallback(() => {
    setIsAddItemModalOpen(false);
  }, []);
  
  const activeList = lists.find(list => list.id === activeListId);

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };
  
  const updateActiveList = async (updatedList: Partial<ShoppingList>) => {
    if (!activeListId) return;
    const { data, error } = await supabase
      .from('shopping_lists')
      .update(updatedList)
      .eq('id', activeListId);
    if (error) {
      console.error('Error updating list:', error);
    } else {
      setLists(lists.map(list => (list.id === activeListId ? { ...list, ...updatedList } : list)));
    }
  };
  
  const handleUpdateItems = async (updatedItems: ShoppingItem[]) => {
    if (!activeListId) return;
    const { data, error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems })
      .eq('id', activeListId);
    if (error) {
      console.error('Error updating items:', error);
    } else {
      setLists(lists.map(list => (list.id === activeListId ? { ...list, items: updatedItems } : list)));
    }
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
  
  const handleAddCategory = async (name: string) => {
    if (name && !categories.some(c => c.name === name)) {
      const { data, error } = await supabase.from('categories').insert([{ name }]).select();
      if (error) {
        console.error('Error adding category:', error);
      } else {
        setCategories([...categories, data[0]]);
      }
    }
  };

  const handleDeleteCategory = async (id: number) => {
    // Here you might want to handle what happens to items with this category.
    // For now, we'll just delete the category.
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      console.error('Error deleting category:', error);
    } else {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };
  
  const handleUpdateCategory = async (id: number, newName: string) => {
    if (newName && !categories.some(c => c.name === newName)) {
      const { data, error } = await supabase.from('categories').update({ name: newName }).eq('id', id).select();
      if (error) {
        console.error('Error updating category:', error);
      } else {
        setCategories(categories.map(cat => (cat.id === id ? data[0] : cat)));
      }
    }
  };

  const handleAddPresetItem = async (item: Pick<ShoppingItem, 'name' | 'category' | 'unit'>) => {
    const { data, error } = await supabase.from('products').insert([item]).select();
    if (error) {
      console.error('Error adding preset item:', error);
    } else {
      setPresetItems([...presetItems, data[0]]);
    }
  };

  const handleDeletePresetItem = async (itemId: number) => {
    const { error } = await supabase.from('products').delete().eq('id', itemId);
    if (error) {
      console.error('Error deleting preset item:', error);
    } else {
      setPresetItems(presetItems.filter(item => item.id !== itemId));
    }
  };

  const handleUpdatePresetItem = async (updatedItem: ShoppingItem) => {
    const { data, error } = await supabase.from('products').update(updatedItem).eq('id', updatedItem.id).select();
    if (error) {
      console.error('Error updating preset item:', error);
    } else {
      setPresetItems(presetItems.map(item => (item.id === updatedItem.id ? data[0] : item)));
    }
  };
  
  const handleAddList = async (name: string) => {
    const newList = {
      name,
      items: [],
      members: user ? [user] : [],
    };
    const { data, error } = await supabase.from('shopping_lists').insert([newList]).select();
    if (error) {
      console.error('Error adding list:', error);
    } else {
      setLists([...lists, data[0]]);
      setActiveListId(data[0].id);
      setCurrentScreen(Screen.ShoppingList);
    }
  };
  
  const handleDeleteList = async (listId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta lista? Esta ação não pode ser desfeita.")) {
      const { error } = await supabase.from('shopping_lists').delete().eq('id', listId);
      if (error) {
        console.error('Error deleting list:', error);
      } else {
        const newLists = lists.filter(list => list.id !== listId);
        setLists(newLists);
        if (activeListId === listId) {
          setActiveListId(newLists[0]?.id || null);
        }
      }
    }
  };

  const handleRenameList = async (listId: string, newName: string) => {
    const { error } = await supabase.from('shopping_lists').update({ name: newName }).eq('id', listId);
    if (error) {
      console.error('Error renaming list:', error);
    } else {
      setLists(lists.map(list => (list.id === listId ? { ...list, name: newName } : list)));
    }
  };

  const handleSelectList = (listId: string) => {
      setActiveListId(listId);
      setCurrentScreen(Screen.ShoppingList);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Meu Mercadin<span className="text-primary-500">™</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginScreen onLogin={() => supabase.auth.signInWithOAuth({ provider: 'google' })} />;
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
            onLogout={() => supabase.auth.signOut()}
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