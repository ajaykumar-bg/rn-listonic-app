import { MoreMenuSection } from '@/components';
import { moreMenuConfig } from '@/utils';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';

export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="More" />
      </Appbar.Header>
      
      <ScrollView style={styles.content}>
        {moreMenuConfig.map((section, index) => (
          <MoreMenuSection
            key={section.title}
            section={section}
            showDivider={index < moreMenuConfig.length - 1}
          />
        ))}
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
});
