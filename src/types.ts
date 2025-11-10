import { LucideProps } from 'lucide-react';
import React from 'react';

export interface Expense {
  id: string;
  categoryId: string;
  description?: string;
  amount: number;
  date: string; // YYYY-MM-DD
  isPaid: boolean;
  bankId?: string | null;
}

export interface Category {
  id: string;
  name: string;
  icon: IconName;
  color: ColorName;
}

export interface Bank {
  id: string;
  name: string;
}

export interface AppSettings {
  discordWebhookUrl: string;
  reminderDays: number;
  language: 'en' | 'ar';
  currency: 'AED';
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export type IconName = "Utensils" | "Car" | "Shopping" | "Home" | "Coffee" | "Briefcase" | "Plane" | "Gift" | "Book" | "Music" | "Gaming" | "Shirt" | "Fitness" | "Savings" | "Card" | "Building" | "Energy" | "Heart" | "Tag";

export type ColorName = "Blue" | "Green" | "Red" | "Orange" | "Purple" | "Pink" | "Yellow" | "Indigo" | "Teal" | "Cyan";

export type IconComponent = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;

export type TranslationKey = keyof typeof import('./constants/translations').translations.en;