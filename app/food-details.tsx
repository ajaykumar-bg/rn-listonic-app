import { fatSecretAPI } from '@/services/fatSecretAPI';
import { FoodDetails, HealthInfo } from '@/types/foodFacts';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Card, Chip, List, Text } from 'react-native-paper';

export default function FoodDetailsScreen() {
  const { foodId, foodName, imageUrl } = useLocalSearchParams<{ 
    foodId: string; 
    foodName: string; 
    imageUrl?: string;
  }>();
  
  const [foodDetails, setFoodDetails] = useState<FoodDetails | null>(null);
  const [healthInfo, setHealthInfo] = useState<HealthInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFoodDetails = async () => {
      if (!foodId || !foodName) return;
      
      try {
        const details = await fatSecretAPI.getFoodDetails(foodId);
        const health = fatSecretAPI.getHealthInfo(foodName);
        
        setFoodDetails(details);
        setHealthInfo(health);
      } catch (error) {
        console.error('Error loading food details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFoodDetails();
  }, [foodId, foodName]);

  if (loading || !foodDetails || !healthInfo) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title={foodName || 'Food Details'} />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <Text>Loading food details...</Text>
        </View>
      </View>
    );
  }

  const serving = foodDetails.servings.serving[0];

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={foodDetails.food_name} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Food Image */}
        {imageUrl && (
          <Card style={styles.imageCard}>
            <Card.Cover source={{ uri: imageUrl }} style={styles.image} />
          </Card>
        )}

        {/* Nutrition Facts */}
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              Nutrition Facts
            </Text>
            <Text variant="bodyMedium" style={styles.servingSize}>
              Per {serving.serving_description}
            </Text>
            
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text variant="headlineMedium" style={styles.calorieValue}>
                  {serving.calories || '0'}
                </Text>
                <Text variant="bodySmall">Calories</Text>
              </View>
              
              <View style={styles.nutritionColumn}>
                <View style={styles.nutritionRow}>
                  <Text variant="bodyMedium">Protein</Text>
                  <Text variant="bodyMedium">{serving.protein || '0'}g</Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text variant="bodyMedium">Carbs</Text>
                  <Text variant="bodyMedium">{serving.carbohydrate || '0'}g</Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text variant="bodyMedium">Fat</Text>
                  <Text variant="bodyMedium">{serving.fat || '0'}g</Text>
                </View>
                {serving.fiber && (
                  <View style={styles.nutritionRow}>
                    <Text variant="bodyMedium">Fiber</Text>
                    <Text variant="bodyMedium">{serving.fiber}g</Text>
                  </View>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Facts */}
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              Quick Facts
            </Text>
            {healthInfo.quickFacts.map((fact, index) => (
              <View key={index} style={styles.factItem}>
                <Text variant="bodyMedium">• {fact}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Health Benefits */}
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              Health Benefits
            </Text>
            {healthInfo.benefits.map((benefit, index) => (
              <Chip key={index} style={styles.chip} mode="outlined" compact>
                {benefit}
              </Chip>
            ))}
          </Card.Content>
        </Card>

        {/* Health Risks */}
        {healthInfo.risks.length > 0 && (
          <Card style={styles.section}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.sectionTitle}>
                Health Considerations
              </Text>
              {healthInfo.risks.map((risk, index) => (
                <View key={index} style={styles.factItem}>
                  <Text variant="bodyMedium">⚠️ {risk}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Shopping Tips */}
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              Shopping Tips
            </Text>
            {healthInfo.shoppingTips.map((tip, index) => (
              <List.Item
                key={index}
                title={tip}
                left={() => <List.Icon icon="cart" />}
                titleNumberOfLines={3}
              />
            ))}
          </Card.Content>
        </Card>

        {/* Storage Tips */}
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              How to Store
            </Text>
            {healthInfo.storageTips.map((tip, index) => (
              <List.Item
                key={index}
                title={tip}
                left={() => <List.Icon icon="fridge" />}
                titleNumberOfLines={3}
              />
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCard: {
    margin: 16,
  },
  image: {
    height: 200,
  },
  section: {
    margin: 16,
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  servingSize: {
    opacity: 0.7,
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutritionItem: {
    alignItems: 'center',
    marginRight: 32,
  },
  calorieValue: {
    fontWeight: 'bold',
  },
  nutritionColumn: {
    flex: 1,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  factItem: {
    marginBottom: 8,
  },
  chip: {
    margin: 4,
  },
});
