import { Category } from '@/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text, TextInput } from 'react-native-paper';

interface AddItemFormProps {
  itemName: string;
  quantity: string;
  selectedCategory: string;
  categories: Category[];
  onItemNameChange: (name: string) => void;
  onQuantityChange: (quantity: string) => void;
  onCategorySelect: (categoryId: string) => void;
  onAdd: () => void;
  onCancel: () => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({
  itemName,
  quantity,
  selectedCategory,
  categories,
  onItemNameChange,
  onQuantityChange,
  onCategorySelect,
  onAdd,
  onCancel
}) => {
  return (
    <Card style={styles.addItemCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.addItemTitle}>Add New Item</Text>
        
        <TextInput
          label="Item Name"
          value={itemName}
          onChangeText={onItemNameChange}
          style={styles.input}
          autoFocus={true}
          returnKeyType="next"
        />
        
        <TextInput
          label="Quantity"
          value={quantity}
          onChangeText={onQuantityChange}
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
              onPress={() => onCategorySelect(category.id)}
              style={styles.categoryChip}
            >
              {category.name}
            </Chip>
          ))}
        </View>
        
        <View style={styles.formActions}>
          <Button mode="outlined" onPress={onCancel}>
            Cancel
          </Button>
          <Button mode="contained" onPress={onAdd}>
            Add Item
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
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
