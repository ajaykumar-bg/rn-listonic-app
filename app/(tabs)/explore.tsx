import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Divider, List } from 'react-native-paper';

export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="More" />
      </Appbar.Header>
      
      <ScrollView style={styles.content}>
        <List.Section>
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title="Profile"
            description="Manage your account settings"
            left={props => <List.Icon {...props} icon="account" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Sync & Backup"
            description="Backup your lists to the cloud"
            left={props => <List.Icon {...props} icon="cloud-sync" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Shopping</List.Subheader>
          <List.Item
            title="Shared Lists"
            description="Manage family and shared lists"
            left={props => <List.Icon {...props} icon="account-group" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Templates"
            description="Create and manage list templates"
            left={props => <List.Icon {...props} icon="content-copy" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Smart Suggestions"
            description="Get AI-powered shopping suggestions"
            left={props => <List.Icon {...props} icon="lightbulb" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Preferences</List.Subheader>
          <List.Item
            title="Notifications"
            description="Configure alerts and reminders"
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Theme"
            description="Choose your preferred appearance"
            left={props => <List.Icon {...props} icon="palette" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Units & Currency"
            description="Set measurement and currency preferences"
            left={props => <List.Icon {...props} icon="scale" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Support</List.Subheader>
          <List.Item
            title="Help Center"
            description="Find answers to common questions"
            left={props => <List.Icon {...props} icon="help-circle" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Send Feedback"
            description="Help us improve Listonic"
            left={props => <List.Icon {...props} icon="message-text" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="About"
            description="Version info and credits"
            left={props => <List.Icon {...props} icon="information" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>
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
