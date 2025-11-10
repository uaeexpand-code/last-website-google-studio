
import React, { createContext, useContext, ReactNode } from 'react';
import { usePersistentState } from '@/hooks/usePersistentState';
import { Expense, Category, Bank, AppSettings, TranslationKey } from '@/types';
import { translations } from '@/constants/translations';
import { sendNewExpenseNotification } from '@/lib/discord';

interface AppContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;

  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;

  banks: Bank[];
  addBank: (bank: Omit<Bank, 'id'>) => void;
  deleteBank: (id: string) => void;

  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  language: 'en' | 'ar';
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: AppSettings = {
  discordWebhookUrl: '',
  reminderDays: 7,
  language: 'en',
  currency: 'AED',
};

// Default categories to get the user started
const defaultCategories: Category[] = [
    { id: 'cat-1', name: 'Food', icon: 'Utensils', color: 'Orange' },
    { id: 'cat-2', name: 'Transport', icon: 'Car', color: 'Blue' },
    { id: 'cat-3', name: 'Shopping', icon: 'Shopping', color: 'Pink' },
    { id: 'cat-4', name: 'Housing', icon: 'Home', color: 'Green' }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = usePersistentState<Expense[]>('expenses', []);
  const [categories, setCategories] = usePersistentState<Category[]>('categories', defaultCategories);
  const [banks, setBanks] = usePersistentState<Bank[]>('banks', []);
  const [settings, setSettings] = usePersistentState<AppSettings>('settings', defaultSettings);

  const t = (key: TranslationKey, replacements: Record<string, string | number> = {}) => {
    let translation = translations[settings.language][key] || translations.en[key];
    Object.keys(replacements).forEach(rKey => {
      translation = translation.replace(`{${rKey}}`, String(replacements[rKey]));
    });
    return translation;
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense = { ...expenseData, id: `exp-${Date.now()}` };
    setExpenses(prev => [...prev, newExpense]);
    const category = categories.find(c => c.id === newExpense.categoryId);
    if (settings.discordWebhookUrl && category) {
      sendNewExpenseNotification(newExpense, category, settings.discordWebhookUrl, settings.currency, t);
    }
  };

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
  };
  
  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    setCategories(prev => [...prev, { ...categoryData, id: `cat-${Date.now()}` }]);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    // Optional: Unassign category from expenses or delete them
    setExpenses(prev => prev.filter(exp => exp.categoryId !== id));
  };

  const addBank = (bankData: Omit<Bank, 'id'>) => {
    setBanks(prev => [...prev, { ...bankData, id: `bnk-${Date.now()}` }]);
  };
  
  const deleteBank = (id: string) => {
    setBanks(prev => prev.filter(b => b.id !== id));
    // Optional: Unassign bank from paid expenses
    setExpenses(prev => prev.map(exp => exp.bankId === id ? {...exp, bankId: undefined} : exp));
  };
  
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = {...settings, ...newSettings};
    if (settings.language !== updated.language) {
      // Full page reload on language change to ensure RTL/LTR is applied everywhere
      window.location.reload();
    }
    setSettings(updated);
  };
  
  const value = {
    expenses, addExpense, updateExpense, deleteExpense,
    categories, addCategory, deleteCategory,
    banks, addBank, deleteBank,
    settings, updateSettings,
    language: settings.language, t,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
