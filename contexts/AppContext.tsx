import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { usePersistentState } from '@/hooks/usePersistentState';
import { Expense, Category, Bank, AppSettings, TranslationKey } from '@/types';
import { translations } from '@/constants/translations';
import { sendNewExpenseNotification } from '@/lib/discord';

interface AppContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  banks: Bank[];
  addBank: (bank: Omit<Bank, 'id'>) => Promise<void>;
  deleteBank: (id: string) => Promise<void>;

  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  language: 'en' | 'ar';
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;

  isSupabaseConnected: boolean;
  isLoading: boolean;
  supabase: SupabaseClient | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: AppSettings = {
  discordWebhookUrl: '',
  reminderDays: 7,
  language: 'en',
  currency: 'AED',
  // FIX: Cast `import.meta` to `any` to bypass TypeScript error when `vite/client` types are not available.
  supabaseUrl: (import.meta as any).env.VITE_SUPABASE_URL || '',
  // FIX: Cast `import.meta` to `any` to bypass TypeScript error when `vite/client` types are not available.
  supabaseAnonKey: (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '',
};

const defaultCategories: Category[] = [
    { id: 'cat-1', name: 'Food', icon: 'Utensils', color: 'Orange' },
    { id: 'cat-2', name: 'Transport', icon: 'Car', color: 'Blue' },
    { id: 'cat-3', name: 'Shopping', icon: 'Shopping', color: 'Pink' },
    { id: 'cat-4', name: 'Housing', icon: 'Home', color: 'Green' }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = usePersistentState<AppSettings>('settings', defaultSettings);
  
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [banks, setBanks] = useState<Bank[]>([]);

  useEffect(() => {
    document.documentElement.lang = settings.language;
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
  }, [settings.language]);

  useEffect(() => {
    if (settings.supabaseUrl && settings.supabaseAnonKey) {
      try {
        const client = createClient(settings.supabaseUrl, settings.supabaseAnonKey);
        setSupabase(client);
        setIsSupabaseConnected(true);
      } catch (e) {
        console.error("Failed to create Supabase client:", e);
        setSupabase(null);
        setIsSupabaseConnected(false);
      }
    } else {
      setSupabase(null);
      setIsSupabaseConnected(false);
    }
  }, [settings.supabaseUrl, settings.supabaseAnonKey]);

  useEffect(() => {
    if (!isSupabaseConnected || !supabase) {
      setIsLoading(false);
      setExpenses([]);
      setCategories(defaultCategories);
      setBanks([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [expensesRes, categoriesRes, banksRes] = await Promise.all([
          supabase.from('expenses').select('*').order('date', { ascending: false }),
          supabase.from('categories').select('*'),
          supabase.from('banks').select('*')
        ]);

        if (expensesRes.error) throw expensesRes.error;
        if (categoriesRes.error) throw categoriesRes.error;
        if (banksRes.error) throw banksRes.error;

        const mappedExpenses = expensesRes.data.map(e => ({...e, categoryId: e.category_id, bankId: e.bank_id }));

        setExpenses(mappedExpenses || []);
        setCategories(categoriesRes.data.length > 0 ? categoriesRes.data : defaultCategories);
        setBanks(banksRes.data || []);
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
        setIsSupabaseConnected(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isSupabaseConnected, supabase]);

  const t = (key: TranslationKey, replacements: Record<string, string | number> = {}) => {
    let translation = translations[settings.language][key] || translations.en[key];
    Object.keys(replacements).forEach(rKey => {
      translation = translation.replace(`{${rKey}}`, String(replacements[rKey]));
    });
    return translation;
  };

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'isPaid' | 'bankId'> & { isPaid?: boolean; bankId?: string | null; }) => {
    if (!supabase) return;
    const { categoryId, bankId, ...rest } = expenseData;
    const dbPayload = { ...rest, category_id: categoryId, bank_id: bankId, is_paid: expenseData.isPaid || false };
    
    const { data, error } = await supabase.from('expenses').insert(dbPayload).select().single();
    if (error) throw error;
    
    const newExpense = { ...data, categoryId: data.category_id, bankId: data.bank_id };
    setExpenses(prev => [newExpense, ...prev]);
    
    const category = categories.find(c => c.id === newExpense.categoryId);
    if (settings.discordWebhookUrl && category) {
      sendNewExpenseNotification(newExpense, category, settings.discordWebhookUrl, settings.currency, t);
    }
  };

  const updateExpense = async (updatedExpense: Expense) => {
    if (!supabase) return;
    const { id, categoryId, bankId, ...rest } = updatedExpense;
    const dbPayload = { ...rest, category_id: categoryId, bank_id: bankId, is_paid: updatedExpense.isPaid };
    
    const { data, error } = await supabase.from('expenses').update(dbPayload).eq('id', id).select().single();
    if (error) throw error;
    
    const newExpense = { ...data, categoryId: data.category_id, bankId: data.bank_id };
    setExpenses(prev => prev.map(exp => (exp.id === id ? newExpense : exp)));
  };

  const deleteExpense = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    if (!supabase) return;
    const { data, error } = await supabase.from('categories').insert(categoryData).select().single();
    if (error) throw error;
    setCategories(prev => [...prev, data]);
  };

  const deleteCategory = async (id: string) => {
    if (!supabase) return;
    await deleteExpenseWithCategory(id);
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };
    
  const deleteExpenseWithCategory = async (categoryId: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('expenses').delete().eq('category_id', categoryId);
    if (error) throw error;
    setExpenses(prev => prev.filter(exp => exp.categoryId !== categoryId));
  }


  const addBank = async (bankData: Omit<Bank, 'id'>) => {
    if (!supabase) return;
    const { data, error } = await supabase.from('banks').insert(bankData).select().single();
    if (error) throw error;
    setBanks(prev => [...prev, data]);
  };

  const deleteBank = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('banks').delete().eq('id', id);
    if (error) throw error;
    setBanks(prev => prev.filter(b => b.id !== id));
    setExpenses(prev => prev.map(exp => exp.bankId === id ? {...exp, bankId: null} : exp));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    if (settings.language !== updated.language) {
      setSettings(updated);
      window.location.reload();
    } else {
      setSettings(updated);
    }
  };

  const value = {
    expenses, addExpense, updateExpense, deleteExpense,
    categories, addCategory, deleteCategory,
    banks, addBank, deleteBank,
    settings, updateSettings,
    language: settings.language, t,
    isSupabaseConnected, isLoading, supabase
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