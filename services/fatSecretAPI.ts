import { ENV_CONFIG } from '@/config/env';
import { EnhancedFoodItem, FoodDetails, HealthInfo } from '@/types/foodFacts';

// FatSecret API configuration
const FATSECRET_CONFIG = {
  BASE_URL: 'https://platform.fatsecret.com/rest/server.api',
  CLIENT_ID: ENV_CONFIG.FATSECRET_CLIENT_ID,
  CLIENT_SECRET: ENV_CONFIG.FATSECRET_CLIENT_SECRET,
};

// OAuth signature generator for FatSecret API
class FatSecretAPI {
  private generateOAuthSignature(_params: Record<string, string>, _method = 'GET'): string {
    // This is a simplified OAuth signature generation
    // In a real app, you'd want to use a proper OAuth library with crypto-js
    
    // Validate that API credentials are configured
    if (!FATSECRET_CONFIG.CLIENT_ID || !FATSECRET_CONFIG.CLIENT_SECRET) {
      console.warn('FatSecret API credentials not configured. Using mock data.');
    }
    
    // For demo purposes, return a mock signature
    return 'mock_signature_' + Date.now();
  }

  private buildParamString(params: Record<string, string>): string {
    return Object.keys(params)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
  }

  async searchFood(query: string): Promise<EnhancedFoodItem[]> {
    try {
      // For demo purposes, return mock data
      // In production, replace with actual API calls
      return this.getMockFoodData(query);
    } catch (error) {
      console.error('Error searching food:', error);
      return [];
    }
  }

  async getFoodDetails(foodId: string): Promise<FoodDetails | null> {
    try {
      // For demo purposes, return mock data
      // In production, replace with actual API calls
      return this.getMockFoodDetails(foodId);
    } catch (error) {
      console.error('Error getting food details:', error);
      return null;
    }
  }

  // Mock data for demonstration
  private getMockFoodData(query: string): EnhancedFoodItem[] {
    const mockFoods: EnhancedFoodItem[] = [
      {
        food_id: '1',
        food_name: 'Apple',
        food_type: 'fruit',
        food_url: 'https://example.com',
        image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop',
        calories: '52',
        protein: '0.3g',
        carbs: '14g',
        fat: '0.2g',
      },
      {
        food_id: '2',
        food_name: 'Banana',
        food_type: 'fruit',
        food_url: 'https://example.com',
        image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop',
        calories: '89',
        protein: '1.1g',
        carbs: '23g',
        fat: '0.3g',
      },
      {
        food_id: '3',
        food_name: 'Broccoli',
        food_type: 'vegetable',
        food_url: 'https://example.com',
        image_url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=200&fit=crop',
        calories: '34',
        protein: '2.8g',
        carbs: '7g',
        fat: '0.4g',
      },
      {
        food_id: '4',
        food_name: 'Chicken Breast',
        food_type: 'meat',
        food_url: 'https://example.com',
        image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=200&fit=crop',
        calories: '165',
        protein: '31g',
        carbs: '0g',
        fat: '3.6g',
      },
      {
        food_id: '5',
        food_name: 'Salmon',
        food_type: 'fish',
        food_url: 'https://example.com',
        image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop',
        calories: '208',
        protein: '22g',
        carbs: '0g',
        fat: '12g',
      },
    ];

    return mockFoods.filter(food => 
      food.food_name.toLowerCase().includes(query.toLowerCase())
    );
  }

  private getMockFoodDetails(foodId: string): FoodDetails {
    return {
      food_id: foodId,
      food_name: 'Apple',
      food_type: 'fruit',
      food_url: 'https://example.com',
      servings: {
        serving: [{
          serving_id: '1',
          serving_description: '1 medium apple',
          serving_url: 'https://example.com',
          measurement_description: 'medium',
          metric_serving_amount: '182',
          metric_serving_unit: 'g',
          calories: '95',
          carbohydrate: '25',
          protein: '0.47',
          fat: '0.31',
          fiber: '4.4',
          sugar: '19',
          sodium: '2',
          potassium: '195',
          vitamin_c: '8.4',
        }]
      }
    };
  }

  getHealthInfo(foodName: string): HealthInfo {
    // Mock health information - in production, this could come from a database or API
    const healthData: Record<string, HealthInfo> = {
      apple: {
        benefits: [
          'Rich in fiber for digestive health',
          'Contains antioxidants that may reduce disease risk',
          'Good source of vitamin C for immune support',
          'May help with weight management'
        ],
        risks: [
          'Seeds contain small amounts of cyanide compounds',
          'May cause digestive issues if eaten in large quantities'
        ],
        quickFacts: [
          'One of the most popular fruits worldwide',
          'Contains about 4g of fiber per medium apple',
          'Over 7,500 varieties exist globally',
          'Peak season is fall in most regions'
        ],
        shoppingTips: [
          'Choose firm apples with smooth skin',
          'Avoid apples with soft spots or wrinkles',
          'Store-bought apples may have wax coating',
          'Organic options reduce pesticide exposure'
        ],
        storageTips: [
          'Store in refrigerator crisper drawer',
          'Keep away from strong-smelling foods',
          'Can last 1-2 months when properly stored',
          'Store separately from other fruits to prevent rapid ripening'
        ]
      }
    };

    return healthData[foodName.toLowerCase()] || {
      benefits: ['Nutritional information available upon further research'],
      risks: ['Consult healthcare provider for dietary restrictions'],
      quickFacts: ['Popular food item with various nutritional properties'],
      shoppingTips: ['Select fresh, high-quality items', 'Check for proper color and texture'],
      storageTips: ['Follow general food storage guidelines', 'Store in appropriate temperature conditions']
    };
  }
}

export const fatSecretAPI = new FatSecretAPI();
