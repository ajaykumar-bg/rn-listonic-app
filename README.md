# Listonic - Smart Grocery Shopping List App 🛒

A modern, intuitive grocery shopping list app built with React Native and Expo, inspired by [Listonic](https://listonic.com/). This app helps you plan shopping, reduce food waste, and stay organized—whether you're at home or in the store.

## ✨ Features

### 📋 Shopping List Management

- **Create Multiple Lists**: Create and manage multiple shopping lists for different stores or occasions
- **Smart Organization**: Lists display item count and completion percentage
- **Progress Tracking**: Visual indicators show how much of your shopping is complete
- **Quick Actions**: Easily create, edit, and delete shopping lists

### 🛍️ Item Management

- **Add Items**: Add items with name, quantity, and category selection
- **Category Organization**: Items are automatically organized by predefined grocery categories
- **Check Off Items**: Mark items as completed while shopping
- **Smart Sorting**: Completed items are moved to the bottom of the list
- **Delete Items**: Remove items you no longer need

### 🏷️ Category System

- **Pre-defined Categories**: 10 grocery categories with intuitive icons and colors:
  - 🍇 Fruits & Vegetables
  - 🥛 Dairy & Eggs
  - 🥩 Meat & Seafood
  - 🍞 Bakery
  - ☕ Beverages
  - 🥫 Pantry
  - 🧊 Frozen
  - 🏠 Household
  - 💄 Personal Care
  - 🛒 Other
- **Visual Organization**: Color-coded categories for easy identification
- **Category Browse**: Dedicated categories screen to explore all options

### 🎨 Modern UI/UX

- **Material Design**: Built with React Native Paper for consistent Material Design 3
- **Dark/Light Theme**: Automatic theme switching based on system preferences
- **Responsive Design**: Works seamlessly on phones, tablets, and web
- **Touch-Friendly**: Optimized for mobile interaction patterns
- **Beautiful Animations**: Smooth transitions and micro-interactions

### 💾 Data Persistence

- **Local Storage**: All data is stored locally using AsyncStorage
- **Offline First**: Works completely offline, no internet required
- **Auto Save**: Changes are automatically saved as you make them
- **Data Safety**: Robust error handling to prevent data loss

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (optional but recommended)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/ajaykumar-bg/rn-listonic-app.git
   cd rn-listonic-app
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Configure environment variables (optional - for Food Facts with real API data)

   ```bash
   # Copy the environment template
   cp .env.example .env
   ```

   Then edit the `.env` file and replace with your actual FatSecret API credentials:

   ```env
   FATSECRET_CLIENT_ID=your_actual_client_id_here
   FATSECRET_CLIENT_SECRET=your_actual_client_secret_here
   ```

   **How to get FatSecret API credentials:**

   1. Sign up at [FatSecret Platform API](https://platform.fatsecret.com/)
   2. Create a new application
   3. Copy the Client ID and Client Secret
   4. Add them to your `.env` file

   **Note:** The app works with mock data even without API credentials!

4. Start the development server
   ```bash
   npm start
   ```

### Running on Different Platforms

- **Web**: Press `w` in the terminal or visit `http://localhost:8081`
- **iOS Simulator**: Press `i` in the terminal (requires Xcode)
- **Android Emulator**: Press `a` in the terminal (requires Android Studio)
- **Physical Device**: Scan QR code with Expo Go app

## 🛠️ Technical Stack

### Core Technologies

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and toolchain
- **TypeScript** - Type-safe JavaScript
- **Expo Router** - File-based navigation system

### UI/UX Libraries

- **React Native Paper** - Material Design 3 components
- **React Navigation** - Navigation library integration
- **Expo Vector Icons** - Comprehensive icon library

### Data Management

- **AsyncStorage** - Local data persistence
- **React Hooks** - State and lifecycle management

## 📱 App Structure

```
app/
├── _layout.tsx          # Root layout with theme providers
├── modal.tsx            # Shopping list detail screen
└── (tabs)/
    ├── _layout.tsx      # Tab navigation layout
    ├── index.tsx        # Shopping lists screen
    ├── categories.tsx   # Categories browser
    ├── foodFacts.tsx    # Food Facts with nutrition info
    └── explore.tsx      # More options and settings

components/
├── ui/                  # Reusable UI components
└── ...                  # App-specific components

services/
├── dataService.ts       # Data management and storage
└── ...

types/
└── index.ts             # TypeScript type definitions
```

## 🎯 Usage Guide

### Creating Your First Shopping List

1. Open the app and tap the **+** button on the Lists tab
2. Enter a name for your list (e.g., "Weekly Groceries")
3. Tap "Create" to add your new list

### Adding Items to Your List

1. Tap on any shopping list to open it
2. Tap the **+** button to add a new item
3. Enter the item name and quantity
4. Select the appropriate category
5. Tap "Add" to save the item

### Shopping with Your List

1. Open your shopping list
2. Tap the checkbox next to items as you collect them
3. Completed items will be moved to the bottom and dimmed
4. Your progress is automatically tracked

### Managing Categories

1. Visit the Categories tab to see all available categories
2. Each category has a unique icon and color
3. Categories help organize your shopping list by store sections

## 🔮 Coming Soon

- **� Enhanced Food Search**: Expanded food database with more nutrition details
- **☁️ Cloud Sync**: Sync your lists across devices
- **👥 Shared Lists**: Share lists with family members
- **🤖 Smart Suggestions**: AI-powered shopping recommendations
- **📍 Store Maps**: Navigate stores with integrated maps
- **💰 Price Tracking**: Track prices and find deals

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using React Native and Expo**
