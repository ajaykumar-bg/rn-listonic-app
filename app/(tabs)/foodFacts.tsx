import { FoodCard } from '@/components';
import { foodCategories } from '@/data/foodCategories';
import { fatSecretAPI } from '@/services/fatSecretAPI';
import { EnhancedFoodItem, FoodFactsCategory } from '@/types/foodFacts';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, Chip, Searchbar, Text } from 'react-native-paper';

export default function FoodFactsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [foods, setFoods] = useState<EnhancedFoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load initial popular foods
  useEffect(() => {
    loadInitialFoods();
  }, []);

  const loadInitialFoods = async () => {
    setLoading(true);
    try {
      // Load some popular foods as default
      const popularFoods = await fatSecretAPI.searchFood('apple');
      setFoods(popularFoods);
    } catch (error) {
      console.error('Error loading initial foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadInitialFoods();
      return;
    }

    setLoading(true);
    try {
      const results = await fatSecretAPI.searchFood(query);
      setFoods(results);
    } catch (error) {
      console.error('Error searching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = async (category: FoodFactsCategory) => {
    const isSelected = selectedCategory === category.id;
    const newSelectedCategory = isSelected ? null : category.id;
    setSelectedCategory(newSelectedCategory);

    if (!isSelected) {
      // Search for foods in this category
      setLoading(true);
      try {
        // Search for the first few terms in the category
        const searchTerms = category.searchTerms.slice(0, 3);
        const allResults: EnhancedFoodItem[] = [];
        
        for (const term of searchTerms) {
          const results = await fatSecretAPI.searchFood(term);
          allResults.push(...results);
        }
        
        // Remove duplicates and limit results
        const uniqueResults = allResults.filter((food, index, self) => 
          index === self.findIndex(f => f.food_id === food.food_id)
        ).slice(0, 10);
        
        setFoods(uniqueResults);
      } catch (error) {
        console.error('Error loading category foods:', error);
      } finally {
        setLoading(false);
      }
    } else {
      loadInitialFoods();
    }
  };

  const handleFoodPress = (food: EnhancedFoodItem) => {
    router.push({
      pathname: '/food-details',
      params: {
        foodId: food.food_id,
        foodName: food.food_name,
        imageUrl: food.image_url
      }
    });
  };

  const renderFood = ({ item }: { item: EnhancedFoodItem }) => (
    <FoodCard food={item} onPress={handleFoodPress} />
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Food Facts" />
      </Appbar.Header>

      <View style={styles.content}>
        <Searchbar
          placeholder="Search foods..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={() => handleSearch(searchQuery)}
          style={styles.searchBar}
        />

        <View style={styles.categoriesContainer}>
          <Text variant="titleMedium" style={styles.categoriesTitle}>
            Categories
          </Text>
          <View style={styles.categories}>
            {foodCategories.map((category) => (
              <Chip
                key={category.id}
                selected={selectedCategory === category.id}
                onPress={() => handleCategoryPress(category)}
                style={styles.categoryChip}
                icon={category.icon}
              >
                {category.name}
              </Chip>
            ))}
          </View>
        </View>

        <FlatList
          data={foods}
          renderItem={renderFood}
          keyExtractor={(item) => item.food_id}
          numColumns={2}
          contentContainerStyle={styles.foodList}
          refreshing={loading}
          onRefresh={loadInitialFoods}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text variant="bodyLarge" style={styles.emptyText}>
                {searchQuery ? 'No foods found. Try a different search.' : 'Search for foods to see nutrition facts'}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  searchBar: {
    margin: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoriesTitle: {
    marginBottom: 12,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  foodList: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 60,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
