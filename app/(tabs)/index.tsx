import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import {
  Appbar,
  Button,
  Card,
  Chip,
  Dialog,
  FAB,
  IconButton,
  Paragraph,
  Portal,
  Text,
  TextInput,
  Title
} from 'react-native-paper';

import { dataService } from '@/services/dataService';
import { ShoppingList } from '@/types';

export default function ShoppingListsScreen() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newListName, setNewListName] = useState('');

  const loadLists = async () => {
    try {
      const shoppingLists = await dataService.getShoppingLists();
      setLists(shoppingLists);
    } catch (error) {
      console.error('Error loading lists:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLists();
    }, [])
  );

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    try {
      await dataService.createShoppingList(newListName.trim());
      setNewListName('');
      setDialogVisible(false);
      loadLists();
    } catch (error) {
      console.error('Error creating list:', error);
      Alert.alert('Error', 'Failed to create shopping list');
    }
  };

  const handleDeleteList = async (listId: string) => {
    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this shopping list?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await dataService.deleteShoppingList(listId);
              loadLists();
            } catch (error) {
              console.error('Error deleting list:', error);
              Alert.alert('Error', 'Failed to delete shopping list');
            }
          }
        }
      ]
    );
  };

  const getListProgress = (list: ShoppingList) => {
    if (list.items.length === 0) return 0;
    const completedItems = list.items.filter(item => item.isCompleted).length;
    return Math.round((completedItems / list.items.length) * 100);
  };

  const renderListItem = ({ item }: { item: ShoppingList }) => (
    <Card style={styles.listCard} onPress={() => router.push({ pathname: '/modal', params: { id: item.id } })}>
      <Card.Content>
        <View style={styles.listHeader}>
          <View style={styles.listInfo}>
            <Title>{item.name}</Title>
            <Paragraph>
              {item.items.length} items
              {item.items.length > 0 && ` • ${getListProgress(item)}% complete`}
            </Paragraph>
            <View style={styles.chipContainer}>
              {item.isShared && (
                <Chip icon="account-multiple" compact>
                  Shared
                </Chip>
              )}
            </View>
          </View>
          <IconButton
            icon="delete"
            onPress={() => handleDeleteList(item.id)}
          />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="My Shopping Lists" />
      </Appbar.Header>
      
      {lists.length === 0 && !loading ? (
        <View style={styles.emptyState}>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            No Shopping Lists
          </Text>
          <Text variant="bodyLarge" style={styles.emptySubtitle}>
            Create your first shopping list to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={lists}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={loadLists}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setDialogVisible(true)}
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Create New List</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="List Name"
              value={newListName}
              onChangeText={setNewListName}
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleCreateList}>Create</Button>
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
  listContainer: {
    padding: 16,
  },
  listCard: {
    marginBottom: 12,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  listInfo: {
    flex: 1,
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
