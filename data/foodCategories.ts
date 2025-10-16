import { FoodFactsCategory } from '@/types/foodFacts';

export const foodCategories: FoodFactsCategory[] = [
  {
    id: 'fruits',
    name: 'Fruits',
    icon: 'food-apple',
    searchTerms: ['apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry', 'mango', 'pineapple']
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    icon: 'carrot',
    searchTerms: ['broccoli', 'carrot', 'spinach', 'tomato', 'potato', 'onion', 'pepper', 'lettuce']
  },
  {
    id: 'proteins',
    name: 'Proteins',
    icon: 'food-steak',
    searchTerms: ['chicken', 'beef', 'fish', 'salmon', 'tuna', 'eggs', 'tofu', 'beans']
  },
  {
    id: 'dairy',
    name: 'Dairy',
    icon: 'glass-mug-variant',
    searchTerms: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'cottage cheese']
  },
  {
    id: 'grains',
    name: 'Grains',
    icon: 'grain',
    searchTerms: ['rice', 'wheat', 'oats', 'quinoa', 'bread', 'pasta', 'cereal']
  },
  {
    id: 'nuts',
    name: 'Nuts & Seeds',
    icon: 'peanut',
    searchTerms: ['almond', 'walnut', 'cashew', 'peanut', 'sunflower seeds', 'chia seeds']
  }
];
