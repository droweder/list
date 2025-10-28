import { ShoppingItem, Category, ShoppingList, Member } from './types';

export const INITIAL_CATEGORIES: string[] = Object.values(Category);

export const UNITS_OF_MEASUREMENT: { value: string; label: string }[] = [
  { value: 'kg', label: 'kg – quilograma' },
  { value: 'g', label: 'g – grama' },
  { value: 'L', label: 'L – litro' },
  { value: 'mL', label: 'mL – mililitro' },
  { value: 'un', label: 'un – unidade' },
  { value: 'pct', label: 'pct – pacote' },
  { value: 'cx', label: 'cx – caixa' },
  { value: 'dz', label: 'dz – dúzia' },
  { value: 'm', label: 'm – metro' },
  { value: 'cm', label: 'cm – centímetro' },
];

const MOCK_ITEMS: ShoppingItem[] = [
  {
    id: '1',
    name: 'Leite Integral',
    quantity: 2,
    unit: 'un',
    category: Category.Alimentos,
    notes: 'Caixa longa vida',
    purchased: false,
  },
  {
    id: '2',
    name: 'Pão de Forma',
    quantity: 1,
    unit: 'pct',
    category: Category.Alimentos,
    notes: 'Integral',
    purchased: false,
  },
  {
    id: '3',
    name: 'Sabonete',
    quantity: 4,
    unit: 'un',
    category: Category.Higiene,
    notes: '',
    purchased: true,
  },
  {
    id: '4',
    name: 'Detergente',
    quantity: 1,
    unit: 'un',
    category: Category.Limpeza,
    notes: 'Maçã',
    purchased: false,
  },
    {
    id: '5',
    name: 'Refrigerante',
    quantity: 1,
    unit: 'L',
    category: Category.Bebidas,
    notes: '2L, guaraná',
    purchased: false,
  },
];

const MOCK_MEMBERS: Member[] = [];

export const INITIAL_LISTS: ShoppingList[] = [
    {
        id: 'list-1',
        name: 'Lista da Semana',
        items: MOCK_ITEMS,
        members: MOCK_MEMBERS,
    },
    {
        id: 'list-2',
        name: 'Churrasco Fim de Semana',
        items: [
            { id: 'c1', name: 'Picanha', quantity: 2, unit: 'kg', category: Category.Alimentos, notes: '', purchased: false },
            { id: 'c2', name: 'Carvão', quantity: 1, unit: 'pct', category: Category.Outros, notes: 'grande', purchased: false },
            { id: 'c3', name: 'Cerveja', quantity: 12, unit: 'un', category: Category.Bebidas, notes: 'latão', purchased: false },
        ],
        members: MOCK_MEMBERS,
    }
];

export const INITIAL_PRESET_ITEMS: ShoppingItem[] = [
  { id: 'p1', name: 'Leite', quantity: 1, unit: 'un', category: Category.Alimentos, notes: '', purchased: false },
  { id: 'p2', name: 'Pão', quantity: 1, unit: 'un', category: Category.Alimentos, notes: '', purchased: false },
  { id: 'p3', name: 'Café', quantity: 1, unit: 'un', category: Category.Alimentos, notes: '', purchased: false },
  { id: 'p4', name: 'Shampoo', quantity: 1, unit: 'un', category: Category.Higiene, notes: '', purchased: false },
  { id: 'p5', name: 'Sabonete', quantity: 1, unit: 'un', category: Category.Higiene, notes: '', purchased: false },
  { id: 'p6', name: 'Água Sanitária', quantity: 1, unit: 'un', category: Category.Limpeza, notes: '', purchased: false },
];
