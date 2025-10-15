export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  category: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: Date;
  updatedAt: Date;
  isShared: boolean;
  sharedWith?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: ShoppingItem[];
  instructions: string[];
  servings: number;
  prepTime: number;
  cookTime: number;
  image?: string;
}

export type TabParamList = {
  lists: undefined;
  recipes: undefined;
  categories: undefined;
  settings: undefined;
};
