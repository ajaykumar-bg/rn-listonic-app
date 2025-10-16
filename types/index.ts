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



export type TabParamList = {
  lists: undefined;
  foodFacts: undefined;
  categories: undefined;
  settings: undefined;
};

// Re-export food facts types
export * from './foodFacts';

