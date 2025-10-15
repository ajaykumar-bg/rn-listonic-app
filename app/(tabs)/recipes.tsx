import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

export default function RecipesScreen() {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Recipes" />
      </Appbar.Header>
      
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.comingSoon}>
          Recipes Coming Soon
        </Text>
        <Text variant="bodyLarge" style={styles.description}>
          Discover delicious recipes and automatically add ingredients to your shopping list.
        </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  comingSoon: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
