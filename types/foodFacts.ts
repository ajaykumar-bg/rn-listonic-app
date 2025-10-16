// FatSecret API Types
export interface FoodItem {
  food_id: string;
  food_name: string;
  food_type: string;
  food_url: string;
  food_description?: string;
}

export interface FoodSearchResult {
  foods: {
    food: FoodItem[];
  };
}

export interface NutrientInfo {
  nutrient_id: string;
  nutrient_name: string;
  nutrient_value: string;
  nutrient_unit: string;
}

export interface FoodDetails {
  food_id: string;
  food_name: string;
  food_type: string;
  food_url: string;
  servings: {
    serving: {
      calcium?: string;
      calories?: string;
      carbohydrate?: string;
      cholesterol?: string;
      fat?: string;
      fiber?: string;
      iron?: string;
      measurement_description: string;
      metric_serving_amount?: string;
      metric_serving_unit?: string;
      monounsaturated_fat?: string;
      number_of_units?: string;
      polyunsaturated_fat?: string;
      potassium?: string;
      protein?: string;
      saturated_fat?: string;
      serving_description: string;
      serving_id: string;
      serving_url: string;
      sodium?: string;
      sugar?: string;
      trans_fat?: string;
      vitamin_a?: string;
      vitamin_c?: string;
    }[];
  };
}

// Enhanced food item for our app
export interface EnhancedFoodItem extends FoodItem {
  image_url?: string;
  calories?: string;
  protein?: string;
  carbs?: string;
  fat?: string;
}

// Food facts categories
export interface FoodFactsCategory {
  id: string;
  name: string;
  icon: string;
  searchTerms: string[];
}

// Nutrition data for details page
export interface NutritionData {
  calories: string;
  protein: string;
  carbohydrate: string;
  fat: string;
  fiber?: string;
  sugar?: string;
  sodium?: string;
  cholesterol?: string;
}

// Health information
export interface HealthInfo {
  benefits: string[];
  risks: string[];
  quickFacts: string[];
  shoppingTips: string[];
  storageTips: string[];
}
