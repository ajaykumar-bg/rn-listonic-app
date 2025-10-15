import { Category, ShoppingItem, ShoppingList } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  SHOPPING_LISTS: '@listonic_shopping_lists',
  CATEGORIES: '@listonic_categories',
};

export const defaultCategories: Category[] = [
  { id: '1', name: 'Fruits & Vegetables', icon: 'fruit-grapes', color: '#4CAF50' },
  { id: '2', name: 'Dairy & Eggs', icon: 'cow', color: '#2196F3' },
  { id: '3', name: 'Meat & Seafood', icon: 'fish', color: '#F44336' },
  { id: '4', name: 'Bakery', icon: 'bread-slice', color: '#FF9800' },
  { id: '5', name: 'Beverages', icon: 'cup', color: '#9C27B0' },
  { id: '6', name: 'Pantry', icon: 'package-variant-closed', color: '#795548' },
  { id: '7', name: 'Frozen', icon: 'snowflake', color: '#00BCD4' },
  { id: '8', name: 'Household', icon: 'home', color: '#607D8B' },
  { id: '9', name: 'Personal Care', icon: 'face-woman', color: '#E91E63' },
  { id: '10', name: 'Other', icon: 'shopping', color: '#9E9E9E' },
];

class DataService {
  async getShoppingLists(): Promise<ShoppingList[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SHOPPING_LISTS);
      if (data) {
        const lists = JSON.parse(data);
        return lists.map((list: any) => ({
          ...list,
          createdAt: new Date(list.createdAt),
          updatedAt: new Date(list.updatedAt),
          items: list.items.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          })),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading shopping lists:', error);
      return [];
    }
  }

  async saveShoppingLists(lists: ShoppingList[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SHOPPING_LISTS, JSON.stringify(lists));
    } catch (error) {
      console.error('Error saving shopping lists:', error);
    }
  }

  async createShoppingList(name: string): Promise<ShoppingList> {
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isShared: false,
    };

    const lists = await this.getShoppingLists();
    lists.push(newList);
    await this.saveShoppingLists(lists);
    
    return newList;
  }

  async updateShoppingList(listId: string, updates: Partial<ShoppingList>): Promise<void> {
    const lists = await this.getShoppingLists();
    const index = lists.findIndex(list => list.id === listId);
    
    if (index !== -1) {
      lists[index] = {
        ...lists[index],
        ...updates,
        updatedAt: new Date(),
      };
      await this.saveShoppingLists(lists);
    }
  }

  async deleteShoppingList(listId: string): Promise<void> {
    const lists = await this.getShoppingLists();
    const filteredLists = lists.filter(list => list.id !== listId);
    await this.saveShoppingLists(filteredLists);
  }

  async addItemToList(listId: string, item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const lists = await this.getShoppingLists();
    const listIndex = lists.findIndex(list => list.id === listId);
    
    if (listIndex !== -1) {
      const newItem: ShoppingItem = {
        ...item,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      lists[listIndex].items.push(newItem);
      lists[listIndex].updatedAt = new Date();
      await this.saveShoppingLists(lists);
    }
  }

  async updateItem(listId: string, itemId: string, updates: Partial<ShoppingItem>): Promise<void> {
    const lists = await this.getShoppingLists();
    const listIndex = lists.findIndex(list => list.id === listId);
    
    if (listIndex !== -1) {
      const itemIndex = lists[listIndex].items.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        lists[listIndex].items[itemIndex] = {
          ...lists[listIndex].items[itemIndex],
          ...updates,
          updatedAt: new Date(),
        };
        lists[listIndex].updatedAt = new Date();
        await this.saveShoppingLists(lists);
      }
    }
  }

  async deleteItem(listId: string, itemId: string): Promise<void> {
    const lists = await this.getShoppingLists();
    const listIndex = lists.findIndex(list => list.id === listId);
    
    if (listIndex !== -1) {
      lists[listIndex].items = lists[listIndex].items.filter(item => item.id !== itemId);
      lists[listIndex].updatedAt = new Date();
      await this.saveShoppingLists(lists);
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data) {
        return JSON.parse(data);
      }
      // Return default categories if none exist
      await this.saveCategories(defaultCategories);
      return defaultCategories;
    } catch (error) {
      console.error('Error loading categories:', error);
      return defaultCategories;
    }
  }

  async saveCategories(categories: Category[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }
}

export const dataService = new DataService();
