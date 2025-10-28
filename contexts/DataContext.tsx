// contexts/DataContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ShoppingList, ShoppingItem, Member, Category } from '@/types';
import { INITIAL_LISTS, INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/constants';

interface DataContextType {
  lists: ShoppingList[];
  activeList: ShoppingList | undefined;
  categories: string[];
  products: ShoppingItem[];
  addList: (name: string, icon: string, user: Member | null) => void;
  deleteList: (listId: string) => void;
  renameList: (listId: string, newName: string) => void;
  setActiveListId: (listId: string | null) => void;
  updateActiveList: (updatedList: Partial<ShoppingList>) => void;
  removeItemFromActiveList: (itemId: string) => void;
  undoRemoveItem: () => void;
  lastRemovedItem: ShoppingItem | null;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  updateCategory: (oldName: string, newName: string) => void;
  addProduct: (item: Pick<ShoppingItem, 'name' | 'category'>) => void;
  deleteProduct: (itemId: string) => void;
  updateProduct: (item: ShoppingItem) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [lists, setLists] = useState<ShoppingList[]>(INITIAL_LISTS);
  const [activeListId, setActiveListId] = useState<string | null>(INITIAL_LISTS[0]?.id || null);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<ShoppingItem[]>(INITIAL_PRODUCTS);
  const [lastRemovedItem, setLastRemovedItem] = useState<ShoppingItem | null>(null);

  const activeList = lists.find(list => list.id === activeListId);

  const addList = (name: string, icon: string, user: Member | null) => {
    const newList: ShoppingList = {
      id: crypto.randomUUID(),
      name,
      icon,
      items: [],
      members: user ? [user] : [],
    };
    setLists([...lists, newList]);
    setActiveListId(newList.id);
  };

  const deleteList = (listId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta lista? Esta ação não pode ser desfeita.")) {
      const newLists = lists.filter(list => list.id !== listId);
      setLists(newLists);
      if (activeListId === listId) {
        setActiveListId(newLists[0]?.id || null);
      }
    }
  };

  const renameList = (listId: string, newName: string) => {
    setLists(lists.map(list => list.id === listId ? { ...list, name: newName } : list));
  };

  const updateActiveList = (updatedList: Partial<ShoppingList>) => {
    if (!activeListId) return;
    setLists(lists.map(list =>
      list.id === activeListId ? { ...list, ...updatedList } : list
    ));
  };

  const removeItemFromActiveList = (itemId: string) => {
    if (!activeList) return;
    const itemToRemove = activeList.items.find(item => item.id === itemId);
    if (itemToRemove) {
      setLastRemovedItem(itemToRemove);
      const updatedItems = activeList.items.filter(item => item.id !== itemId);
      updateActiveList({ items: updatedItems });
    }
  };

  const undoRemoveItem = () => {
    if (lastRemovedItem && activeList) {
      const updatedItems = [...activeList.items, lastRemovedItem].sort((a, b) => a.name.localeCompare(b.name));
      updateActiveList({ items: updatedItems });
      setLastRemovedItem(null);
    }
  };

  const addCategory = (category: string) => {
    if (category && !categories.some(c => c.toLowerCase() === category.toLowerCase())) {
      setCategories([...categories, category]);
    }
  };

  const deleteCategory = (categoryToDelete: string) => {
    const updatedLists = lists.map(list => ({
      ...list,
      items: list.items.map(item =>
        item.category === categoryToDelete ? { ...item, category: Category.Outros } : item
      )
    }));
    setLists(updatedLists);
    setCategories(categories.filter(cat => cat !== categoryToDelete));
  };

  const updateCategory = (oldName: string, newName: string) => {
    if (newName && !categories.some(c => c.toLowerCase() === newName.toLowerCase())) {
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

  const addProduct = (item: Pick<ShoppingItem, 'name' | 'category'>) => {
    const newProduct: ShoppingItem = {
      ...item,
      id: crypto.randomUUID(),
      quantity: 1,
      notes: '',
      purchased: false,
    };
    setProducts([...products, newProduct]);
  };

  const deleteProduct = (itemId: string) => {
    setProducts(products.filter(item => item.id !== itemId));
  };

  const updateProduct = (updatedItem: ShoppingItem) => {
    setProducts(products.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  return (
    <DataContext.Provider value={{
      lists,
      activeList,
      categories,
      products,
      addList,
      deleteList,
      renameList,
      setActiveListId,
      updateActiveList,
      removeItemFromActiveList,
      undoRemoveItem,
      lastRemovedItem,
      addCategory,
      deleteCategory,
      updateCategory,
      addProduct,
      deleteProduct,
      updateProduct,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
