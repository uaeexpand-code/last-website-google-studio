import {
  Utensils, Car, ShoppingCart, Home, Coffee, Briefcase, Plane, Gift, Book, Music, Gamepad2, Shirt, Dumbbell, PiggyBank, CreditCard, Building, Zap, Heart, Tag
} from 'lucide-react';
import { IconComponent, IconName } from '@/types';

export const ICONS: Record<IconName, IconComponent> = {
  Utensils,
  Car,
  Shopping: ShoppingCart,
  Home,
  Coffee,
  Briefcase,
  Plane,
  Gift,
  Book,
  Music,
  Gaming: Gamepad2,
  Shirt,
  Fitness: Dumbbell,
  Savings: PiggyBank,
  Card: CreditCard,
  Building,
  Energy: Zap,
  Heart,
  Tag,
};

export const ICON_NAMES = Object.keys(ICONS) as IconName[];