export interface MoreMenuItem {
  title: string;
  description: string;
  icon: string;
  onPress?: () => void;
  route?: string;
}

export interface MoreMenuSection {
  title: string;
  items: MoreMenuItem[];
}

export const moreMenuConfig: MoreMenuSection[] = [
  {
    title: 'Account',
    items: [
      {
        title: 'Profile',
        description: 'Manage your account settings',
        icon: 'account',
        onPress: () => console.log('Profile pressed')
      },
      {
        title: 'Sync & Backup',
        description: 'Backup your lists to the cloud',
        icon: 'cloud-sync',
        onPress: () => console.log('Sync & Backup pressed')
      }
    ]
  },
  {
    title: 'Shopping',
    items: [
      {
        title: 'Shared Lists',
        description: 'Manage family and shared lists',
        icon: 'account-group',
        onPress: () => console.log('Shared Lists pressed')
      },
      {
        title: 'Templates',
        description: 'Create and manage list templates',
        icon: 'content-copy',
        onPress: () => console.log('Templates pressed')
      },
      {
        title: 'Smart Suggestions',
        description: 'Get AI-powered shopping suggestions',
        icon: 'lightbulb',
        onPress: () => console.log('Smart Suggestions pressed')
      }
    ]
  },
  {
    title: 'Preferences',
    items: [
      {
        title: 'Notifications',
        description: 'Configure alerts and reminders',
        icon: 'bell',
        onPress: () => console.log('Notifications pressed')
      },
      {
        title: 'Theme',
        description: 'Choose your preferred appearance',
        icon: 'palette',
        route: '/theme'
      },
      {
        title: 'Units & Currency',
        description: 'Set measurement and currency preferences',
        icon: 'scale',
        onPress: () => console.log('Units & Currency pressed')
      }
    ]
  },
  {
    title: 'Support',
    items: [
      {
        title: 'Help Center',
        description: 'Find answers to common questions',
        icon: 'help-circle',
        onPress: () => console.log('Help Center pressed')
      },
      {
        title: 'Send Feedback',
        description: 'Help us improve Listonic',
        icon: 'message-text',
        onPress: () => console.log('Send Feedback pressed')
      },
      {
        title: 'About',
        description: 'Version info and credits',
        icon: 'information',
        onPress: () => console.log('About pressed')
      }
    ]
  }
];
