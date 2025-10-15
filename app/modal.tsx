import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, Button, Card, Chip, FAB, Text, TextInput } from 'react-native-paper';

import { LoadingScreen, ShoppingListItem } from '@/components';
import { useShoppingList } from '@/hooks/useShoppingList';
import { ShoppingItem } from '@/types';
import { listUtils } from '@/utils';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { list, categories, loadList } = useShoppingList(id as string);
  
  const [showAddForm, setShowAddForm] = useState(false);
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
      categories: categories
    });
    
    if (success) {
      setNewItemName('');
      setNewItemQuantity('');
      setSelectedCategory(categories[0]?.id || '');
      setShowAddForm(false);
      // Reload the list to show the new item
      loadList();
    }
  }

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

      {showAddForm && (
        <Card style={styles.addItemCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.addItemTitle}>Add New Item</Text>
            
            <TextInput
              label="Item Name"
              value={newItemName}
              onChangeText={setNewItemName}
              style={styles.input}
              autoFocus={true}
              returnKeyType="next"
            />
            
            <TextInput
              label="Quantity"
              value={newItemQuantity}
              onChangeText={setNewItemQuantity}
              keyboardType="numeric"
              style={styles.input}
              returnKeyType="done"
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
            
            <View style={styles.formActions}>
              <Button mode="outlined" onPress={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button mode="contained" onPress={handleAddItem}>
                Add Item
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}

      <FlatList
        data={[...pendingItems, ...completedItems]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <FAB
        style={styles.fab}
        icon={showAddForm ? "close" : "plus"}
        onPress={() => setShowAddForm(!showAddForm)}
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
  addItemCard: {
    margin: 16,
    marginBottom: 8,
  },
  addItemTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  categoryLabel: {
    marginTop: 8,
    marginBottom: 8,
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
