export enum Category {
  Alimentos = 'Alimentos',
  Bebidas = 'Bebidas',
  Higiene = 'Higiene',
  Limpeza = 'Limpeza',
  Outros = 'Outros',
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: Category | string;
  notes: string;
  purchased: boolean;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  members: Member[];
}

export enum Screen {
  Login = 'Login',
  ShoppingList = 'ShoppingList',
  Invite = 'Invite',
  Settings = 'Settings',
  ProductsAndCategories = 'ProductsAndCategories',
}
