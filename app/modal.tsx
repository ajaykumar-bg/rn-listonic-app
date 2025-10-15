import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import {
  Appbar,
  Button,
  Checkbox,
  Chip,
  Dialog,
  FAB,
  IconButton,
  List,
  Portal,
  Text,
  TextInput
} from 'react-native-paper';

import { dataService } from '@/services/dataService';
import { Category, ShoppingItem, ShoppingList } from '@/types';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [list, setList] = useState<ShoppingList | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [selectedCategory, setSelectedCategory] = useState('');

  const loadList = useCallback(async () => {
    if (!id) return;
    
    try {
      const lists = await dataService.getShoppingLists();
      const currentList = lists.find(l => l.id === id);
      setList(currentList || null);
    } catch (error) {
      console.error('Error loading list:', error);
    }
  }, [id]);

  const loadCategories = useCallback(async () => {
    try {
      const categoriesList = await dataService.getCategories();
      setCategories(categoriesList);
      if (categoriesList.length > 0 && !selectedCategory) {
        setSelectedCategory(categoriesList[0].id);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadList();
    loadCategories();
  }, [loadList, loadCategories]);

  const handleAddItem = async () => {
    if (!newItemName.trim() || !list) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    const selectedCat = categories.find(c => c.id === selectedCategory);
    
    try {
      await dataService.addItemToList(list.id, {
        name: newItemName.trim(),
        quantity: parseInt(newItemQuantity) || 1,
        category: selectedCat?.name || 'Other',
        isCompleted: false,
      });
      
      setNewItemName('');
      setNewItemQuantity('1');
      setDialogVisible(false);
      loadList();
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item');
    }
  };

  const toggleItemComplete = async (item: ShoppingItem) => {
    if (!list) return;
    
    try {
      await dataService.updateItem(list.id, item.id, {
        isCompleted: !item.isCompleted
      });
      loadList();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteItem = async (item: ShoppingItem) => {
    if (!list) return;
    
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
              await dataService.deleteItem(list.id, item.id);
              loadList();
            } catch (error) {
              console.error('Error deleting item:', error);
            }
          }
        }
      ]
    );
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#9E9E9E';
  };

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <List.Item
      title={item.name}
      description={`${item.quantity} ${item.unit || ''}`}
      left={() => (
        <Checkbox
          status={item.isCompleted ? 'checked' : 'unchecked'}
          onPress={() => toggleItemComplete(item)}
        />
      )}
      right={() => (
        <View style={styles.itemActions}>
          <Chip 
            compact 
            style={{ backgroundColor: getCategoryColor(item.category) }}
          >
            {item.category}
          </Chip>
          <IconButton icon="delete" onPress={() => deleteItem(item)} />
        </View>
      )}
      style={item.isCompleted ? styles.completedItem : undefined}
    />
  );

  if (!list) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Shopping List" />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  const completedItems = list.items.filter(item => item.isCompleted);
  const pendingItems = list.items.filter(item => !item.isCompleted);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={list.name} />
      </Appbar.Header>

      <FlatList
        data={[...pendingItems, ...completedItems]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setDialogVisible(true)}
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Add Item</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Item Name"
              value={newItemName}
              onChangeText={setNewItemName}
              style={styles.input}
            />
            <TextInput
              label="Quantity"
              value={newItemQuantity}
              onChangeText={setNewItemQuantity}
              keyboardType="numeric"
              style={styles.input}
            />
            <Text variant="bodyMedium" style={styles.categoryLabel}>
              Category:
            </Text>
            <View style={styles.categoryChips}>
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  selected={selectedCategory === category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  style={styles.categoryChip}
                >
                  {category.name}
                </Chip>
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleAddItem}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedItem: {
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  input: {
    marginBottom: 16,
  },
  categoryLabel: {
    marginBottom: 8,
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    marginBottom: 8,
  },
});
