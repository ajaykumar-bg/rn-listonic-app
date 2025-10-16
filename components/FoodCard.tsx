import { EnhancedFoodItem } from '@/types/foodFacts';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

interface FoodCardProps {
  food: EnhancedFoodItem;
  onPress: (food: EnhancedFoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, onPress }) => {
  return (
    <Card style={styles.card} onPress={() => onPress(food)}>
      <Card.Cover 
        source={{ uri: food.image_url || 'https://via.placeholder.com/150' }} 
        style={styles.image}
      />
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
          {food.food_name}
        </Text>
        <View style={styles.nutritionInfo}>
          {food.calories && (
            <Text variant="bodySmall" style={styles.nutritionText}>
              {food.calories} cal
            </Text>
          )}
          {food.protein && (
            <Text variant="bodySmall" style={styles.nutritionText}>
              Protein: {food.protein}
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    flex: 1,
    maxWidth: '45%',
  },
  image: {
    height: 120,
  },
  content: {
    padding: 12,
  },
  title: {
    marginBottom: 8,
    lineHeight: 20,
  },
  nutritionInfo: {
    gap: 4,
  },
  nutritionText: {
    opacity: 0.7,
  },
});
