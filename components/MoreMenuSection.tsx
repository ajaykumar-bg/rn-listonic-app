import { MoreMenuSection as MoreMenuSectionType } from '@/utils/moreMenuConfig';
import { router } from 'expo-router';
import React from 'react';
import { Divider, List } from 'react-native-paper';

interface MoreMenuSectionProps {
  section: MoreMenuSectionType;
  showDivider?: boolean;
}

export const MoreMenuSection: React.FC<MoreMenuSectionProps> = ({
  section,
  showDivider = true
}) => {
  const handleItemPress = (item: MoreMenuSectionType['items'][0]) => {
    if (item.route) {
      router.push(item.route as any);
    } else if (item.onPress) {
      item.onPress();
    }
  };

  return (
    <>
      <List.Section>
        <List.Subheader>{section.title}</List.Subheader>
        {section.items.map((item, index) => (
          <List.Item
            key={`${section.title}-${index}`}
            title={item.title}
            description={item.description}
            left={props => <List.Icon {...props} icon={item.icon} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => handleItemPress(item)}
          />
        ))}
      </List.Section>
      {showDivider && <Divider />}
    </>
  );
};
