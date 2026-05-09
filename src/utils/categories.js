import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Lightbulb,
  Film,
  Heart,
  Package
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: UtensilsCrossed, color: '#f97316' },
  { id: 'transport', name: 'Transport', icon: Car, color: '#3b82f6' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: '#ec4899' },
  { id: 'bills', name: 'Bills & Utilities', icon: Lightbulb, color: '#eab308' },
  { id: 'entertainment', name: 'Entertainment', icon: Film, color: '#8b5cf6' },
  { id: 'health', name: 'Health', icon: Heart, color: '#ef4444' },
  { id: 'other', name: 'Other', icon: Package, color: '#64748b' }
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[6];
};

export const getCategoryColor = (id) => {
  const category = getCategoryById(id);
  return category.color;
};
