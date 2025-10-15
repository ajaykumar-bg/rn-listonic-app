import { dataService } from '@/services/dataService';
import { Category, ShoppingItem, ShoppingList } from '@/types';
import { Alert } from 'react-native';

export const listUtils = {
  /**
   * Load a specific shopping list by ID
   */
  async loadList(id: string): Promise<ShoppingList | null> {
    if (!id) return null;
    
    try {
      const lists = await dataService.getShoppingLists();
      const currentList = lists.find(l => l.id === id);
      return currentList || null;
    } catch (error) {
      console.error('Error loading list:', error);
      return null;
    }
  },

  /**
   * Load all categories
   */
  async loadCategories(): Promise<Category[]> {
    try {
      return await dataService.getCategories();
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  },

  /**
   * Add a new item to a shopping list
   */
  async addItemToList(
    listId: string,
    itemData: {
      name: string;
      quantity: string;
      categoryId: string;
      categories: Category[];
    }
  ): Promise<boolean> {
    const { name, quantity, categoryId, categories } = itemData;

    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return false;
    }

    const selectedCat = categories.find(c => c.id === categoryId);
    
    try {
      await dataService.addItemToList(listId, {
        name: name.trim(),
        quantity: parseInt(quantity) || 1,
        category: selectedCat?.name || 'Other',
        isCompleted: false,
      });
      return true;
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item');
      return false;
    }
  },

  /**
   * Toggle item completion status
   */
  async toggleItemComplete(listId: string, item: ShoppingItem): Promise<boolean> {
    try {
      await dataService.updateItem(listId, item.id, {
        isCompleted: !item.isCompleted
      });
      return true;
    } catch (error) {
      console.error('Error updating item:', error);
      return false;
    }
  },

  /**
   * Delete an item with confirmation
   */
  deleteItemWithConfirmation(listId: string, item: ShoppingItem, onSuccess: () => void): void {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await dataService.deleteItem(listId, item.id);
              onSuccess();
            } catch (error) {
              console.error('Error deleting item:', error);
            }
          }
        }
      ]
    );
  },

  /**
   * Get category color by name
   */
  getCategoryColor(categoryName: string, categories: Category[]): string {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#9E9E9E';
  },

  /**
   * Separate completed and pending items
   */
  separateItems(items: ShoppingItem[]): { pending: ShoppingItem[], completed: ShoppingItem[] } {
    return {
      completed: items.filter(item => item.isCompleted),
      pending: items.filter(item => !item.isCompleted)
    };
  }
};
