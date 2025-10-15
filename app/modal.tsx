import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, FAB } from 'react-native-paper';

import { AddItemDialog, LoadingScreen, ShoppingListItem } from '@/components';
import { useShoppingList } from '@/hooks/useShoppingList';
import { ShoppingItem } from '@/types';
import { listUtils } from '@/utils';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { list, categories, loadList } = useShoppingList(id as string);
  
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Set default category when categories load
  React.useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const handleAddItem = async () => {
    if (!list) return;

    const success = await listUtils.addItemToList(list.id, {
      name: newItemName,
      quantity: newItemQuantity,
      categoryId: selectedCategory,
      categories
    });

    if (success) {
      setNewItemName('');
      setNewItemQuantity('1');
      setDialogVisible(false);
      loadList();
    }
  };

  const handleToggleComplete = async (item: ShoppingItem) => {
    if (!list) return;
    
    const success = await listUtils.toggleItemComplete(list.id, item);
    if (success) {
      loadList();
    }
  };

  const handleDeleteItem = (item: ShoppingItem) => {
    if (!list) return;
    
    listUtils.deleteItemWithConfirmation(list.id, item, loadList);
  };

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <ShoppingListItem
      item={item}
      categories={categories}
      onToggleComplete={handleToggleComplete}
      onDelete={handleDeleteItem}
    />
  );

  if (!list) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Shopping List" />
        </Appbar.Header>
        <LoadingScreen message="Loading list..." />
      </View>
    );
  }

  const { pending: pendingItems, completed: completedItems } = listUtils.separateItems(list.items);

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

      <AddItemDialog
        visible={dialogVisible}
        itemName={newItemName}
        quantity={newItemQuantity}
        selectedCategory={selectedCategory}
        categories={categories}
        onDismiss={() => setDialogVisible(false)}
        onItemNameChange={setNewItemName}
        onQuantityChange={setNewItemQuantity}
        onCategorySelect={setSelectedCategory}
        onAdd={handleAddItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
