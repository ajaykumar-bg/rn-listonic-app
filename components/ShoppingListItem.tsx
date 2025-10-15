import { Category, ShoppingItem } from '@/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Checkbox, Chip, IconButton, List } from 'react-native-paper';

interface ShoppingListItemProps {
  item: ShoppingItem;
  categories: Category[];
  onToggleComplete: (item: ShoppingItem) => void;
  onDelete: (item: ShoppingItem) => void;
}

export const ShoppingListItem: React.FC<ShoppingListItemProps> = ({
  item,
  categories,
  onToggleComplete,
  onDelete
}) => {
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#9E9E9E';
  };

  return (
    <List.Item
      title={item.name}
      description={`${item.quantity} ${item.unit || ''}`}
      left={() => (
        <Checkbox
          status={item.isCompleted ? 'checked' : 'unchecked'}
          onPress={() => onToggleComplete(item)}
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
          <IconButton icon="delete" onPress={() => onDelete(item)} />
        </View>
      )}
      style={item.isCompleted ? styles.completedItem : undefined}
    />
  );
};

const styles = StyleSheet.create({
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedItem: {
    opacity: 0.6,
  },
});
