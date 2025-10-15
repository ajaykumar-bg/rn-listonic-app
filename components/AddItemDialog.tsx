import { Category } from '@/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Chip, Dialog, Portal, Text, TextInput } from 'react-native-paper';

interface AddItemDialogProps {
  visible: boolean;
  itemName: string;
  quantity: string;
  selectedCategory: string;
  categories: Category[];
  onDismiss: () => void;
  onItemNameChange: (name: string) => void;
  onQuantityChange: (quantity: string) => void;
  onCategorySelect: (categoryId: string) => void;
  onAdd: () => void;
}

export const AddItemDialog: React.FC<AddItemDialogProps> = ({
  visible,
  itemName,
  quantity,
  selectedCategory,
  categories,
  onDismiss,
  onItemNameChange,
  onQuantityChange,
  onCategorySelect,
  onAdd
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Add Item</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Item Name"
            value={itemName}
            onChangeText={onItemNameChange}
            style={styles.input}
          />
          <TextInput
            label="Quantity"
            value={quantity}
            onChangeText={onQuantityChange}
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
                onPress={() => onCategorySelect(category.id)}
                style={styles.categoryChip}
              >
                {category.name}
              </Chip>
            ))}
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={onAdd}>Add</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
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
