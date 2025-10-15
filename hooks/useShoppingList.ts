import { Category, ShoppingList } from '@/types';
import { listUtils } from '@/utils/listUtils';
import { useCallback, useEffect, useState } from 'react';

export const useShoppingList = (listId: string) => {
  const [list, setList] = useState<ShoppingList | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadList = useCallback(async () => {
    if (!listId) return;
    
    try {
      const currentList = await listUtils.loadList(listId);
      setList(currentList);
    } catch (error) {
      console.error('Error in loadList:', error);
    }
  }, [listId]);

  const loadCategories = useCallback(async () => {
    try {
      const categoriesList = await listUtils.loadCategories();
      setCategories(categoriesList);
    } catch (error) {
      console.error('Error in loadCategories:', error);
    }
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadList(), loadCategories()]);
    setLoading(false);
  }, [loadList, loadCategories]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    list,
    categories,
    loading,
    refreshData,
    loadList
  };
};
