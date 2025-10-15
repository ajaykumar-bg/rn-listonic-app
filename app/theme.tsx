import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, List, RadioButton } from 'react-native-paper';

export default function ThemeScreen() {
  const { themeMode, setThemeMode } = useTheme();

  const themeOptions = [
    {
      value: 'light' as const,
      title: 'Light',
      description: 'Always use light theme',
      icon: 'weather-sunny',
    },
    {
      value: 'dark' as const,
      title: 'Dark',
      description: 'Always use dark theme',
      icon: 'weather-night',
    },
    {
      value: 'system' as const,
      title: 'System Default',
      description: 'Follow system appearance setting',
      icon: 'cog',
    },
  ];

  const handleThemeChange = (value: string) => {
    setThemeMode(value as 'light' | 'dark' | 'system');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Theme" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <RadioButton.Group 
          onValueChange={handleThemeChange} 
          value={themeMode}
        >
          {themeOptions.map((option) => (
            <List.Item
              key={option.value}
              title={option.title}
              description={option.description}
              left={(props) => <List.Icon {...props} icon={option.icon} />}
              right={() => (
                <RadioButton 
                  value={option.value}
                  status={themeMode === option.value ? 'checked' : 'unchecked'}
                />
              )}
              onPress={() => handleThemeChange(option.value)}
              style={styles.listItem}
            />
          ))}
        </RadioButton.Group>
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
  listItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
