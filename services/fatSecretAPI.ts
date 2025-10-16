import axios from 'axios';
import CryptoJS from 'crypto-js';

import { ENV_CONFIG } from '@/config/env';
import { EnhancedFoodItem, FoodDetails, FoodSearchResult, HealthInfo } from '@/types/foodFacts';

// FatSecret API configuration
const FATSECRET_CONFIG = {
  BASE_URL: 'https://platform.fatsecret.com/rest/server.api',
  CLIENT_ID: ENV_CONFIG.FATSECRET_CLIENT_ID,
  CLIENT_SECRET: ENV_CONFIG.FATSECRET_CLIENT_SECRET,
};

// OAuth signature generator for FatSecret API
class FatSecretAPI {
  private isConfigured(): boolean {
    const hasCredentials = !!(FATSECRET_CONFIG.CLIENT_ID && FATSECRET_CONFIG.CLIENT_SECRET);
    const notPlaceholder = FATSECRET_CONFIG.CLIENT_ID !== 'your_client_id' && 
                          FATSECRET_CONFIG.CLIENT_SECRET !== 'your_client_secret';
    
    // Check if credentials look like actual API keys (length and format)
    const looksLikeRealCredentials = !!(FATSECRET_CONFIG.CLIENT_ID && 
                                       FATSECRET_CONFIG.CLIENT_SECRET &&
                                       FATSECRET_CONFIG.CLIENT_ID.length > 20 && 
                                       FATSECRET_CONFIG.CLIENT_SECRET.length > 20);
    
    return hasCredentials && notPlaceholder && looksLikeRealCredentials;
  }
  private generateOAuthSignature(params: Record<string, string>, method = 'GET'): string {
    // Generate OAuth 1.0 signature for FatSecret API
    
    // Validate that API credentials are configured
    if (!this.isConfigured()) {
      console.warn('FatSecret API credentials not configured. Using mock data.');
      return 'mock_signature_' + Date.now();
    }

    // Add OAuth parameters
    const oauthParams = {
      ...params,
      oauth_consumer_key: FATSECRET_CONFIG.CLIENT_ID,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
      oauth_nonce: Math.random().toString(36).substring(2, 15),
      oauth_version: '1.0',
    };

    // Create parameter string
    const paramString = this.buildParamString(oauthParams);
    
    // Create signature base string
    const baseString = `${method}&${encodeURIComponent(FATSECRET_CONFIG.BASE_URL)}&${encodeURIComponent(paramString)}`;
    
    // Create signing key
    const signingKey = `${encodeURIComponent(FATSECRET_CONFIG.CLIENT_SECRET)}&`;
    
    // Generate signature
    const signature = CryptoJS.HmacSHA1(baseString, signingKey).toString(CryptoJS.enc.Base64);
    
    return signature;
  }

  private buildParamString(params: Record<string, string>): string {
    return Object.keys(params)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
  }

  private async makeAPICall(params: Record<string, string>): Promise<any> {
    try {
      // Check if API credentials are configured
      if (!this.isConfigured()) {
        console.warn('FatSecret API credentials not properly configured. Using mock data.');
        return null;
      }

      // Generate OAuth signature
      const signature = this.generateOAuthSignature(params);
      
      // Add signature to parameters
      const requestParams = {
        ...params,
        oauth_consumer_key: FATSECRET_CONFIG.CLIENT_ID,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
        oauth_nonce: Math.random().toString(36).substring(2, 15),
        oauth_version: '1.0',
        oauth_signature: signature,
      };

      // Make API request
      const response = await axios.post(FATSECRET_CONFIG.BASE_URL, null, {
        params: requestParams,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000, // 10 second timeout
      });

      return response.data;
    } catch (error) {
      console.error('FatSecret API call failed:', error);
      return null;
    }
  }

  async searchFood(query: string): Promise<EnhancedFoodItem[]> {
    try {
      // Make API call to search for foods
      const apiResponse = await this.makeAPICall({
        method: 'foods.search',
        search_expression: query,
        format: 'json'
      });

      // If API call failed or no credentials, fall back to mock data
      if (!apiResponse) {
        console.log('Using mock data for food search');
        return this.getMockFoodData(query);
      }

      // Parse API response
      const searchResult: FoodSearchResult = apiResponse;
      
      if (!searchResult.foods || !searchResult.foods.food) {
        return [];
      }

      // Convert API response to our format
      const foods = Array.isArray(searchResult.foods.food) 
        ? searchResult.foods.food 
        : [searchResult.foods.food];

      return foods.map((food, index) => ({
        food_id: food.food_id,
        food_name: food.food_name,
        food_type: food.food_type,
        food_url: food.food_url,
        food_description: food.food_description,
        // Add placeholder image URLs since FatSecret doesn't provide images
        image_url: this.getFoodImageUrl(food.food_name, index),
      }));

    } catch (error) {
      console.error('Error searching food:', error);
      // Fall back to mock data on error
      return this.getMockFoodData(query);
    }
  }

  async getFoodDetails(foodId: string): Promise<FoodDetails | null> {
    try {
      // Make API call to get food details
      const apiResponse = await this.makeAPICall({
        method: 'food.get',
        id: foodId,
        format: 'json'
      });

      // If API call failed or no credentials, fall back to mock data
      if (!apiResponse) {
        console.log('Using mock data for food details');
        return this.getMockFoodDetails(foodId);
      }

      // Parse API response
      const foodDetails: FoodDetails = apiResponse.food;
      
      if (!foodDetails) {
        return null;
      }

      return foodDetails;

    } catch (error) {
      console.error('Error getting food details:', error);
      // Fall back to mock data on error
      return this.getMockFoodDetails(foodId);
    }
  }

  private getFoodImageUrl(foodName: string, index: number): string {
    // Generate appropriate food images from Unsplash based on food name
    const foodImages: Record<string, string> = {
      apple: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop',
      banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop',
      orange: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop',
      broccoli: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=200&fit=crop',
      carrot: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=200&h=200&fit=crop',
      chicken: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=200&fit=crop',
      salmon: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop',
      bread: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop',
      milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop',
      egg: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop',
    };

    // Try to match food name with available images
    const lowerFoodName = foodName.toLowerCase();
    for (const [key, url] of Object.entries(foodImages)) {
      if (lowerFoodName.includes(key)) {
        return url;
      }
    }

    // Fallback to generic food images
    const genericImages = [
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=200&h=200&fit=crop',
    ];

    return genericImages[index % genericImages.length];
  }

  // Mock data for demonstration (expanded dataset)
  private getMockFoodData(query: string): EnhancedFoodItem[] {
    const mockFoods: EnhancedFoodItem[] = [
      // Fruits
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
        food_id: '6',
        food_name: 'Orange',
        food_type: 'fruit',
        food_url: 'https://example.com',
        image_url: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop',
        calories: '47',
        protein: '0.9g',
        carbs: '12g',
        fat: '0.1g',
      },
      {
        food_id: '7',
        food_name: 'Strawberry',
        food_type: 'fruit',
        food_url: 'https://example.com',
        image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop',
        calories: '32',
        protein: '0.7g',
        carbs: '8g',
        fat: '0.3g',
      },
      // Vegetables
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
        food_id: '8',
        food_name: 'Carrot',
        food_type: 'vegetable',
        food_url: 'https://example.com',
        image_url: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=200&h=200&fit=crop',
        calories: '41',
        protein: '0.9g',
        carbs: '10g',
        fat: '0.2g',
      },
      {
        food_id: '9',
        food_name: 'Spinach',
        food_type: 'vegetable',
        food_url: 'https://example.com',
        image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop',
        calories: '23',
        protein: '2.9g',
        carbs: '4g',
        fat: '0.4g',
      },
      // Proteins
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
      {
        food_id: '10',
        food_name: 'Eggs',
        food_type: 'protein',
        food_url: 'https://example.com',
        image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop',
        calories: '155',
        protein: '13g',
        carbs: '1g',
        fat: '11g',
      },
      // Grains
      {
        food_id: '11',
        food_name: 'Brown Rice',
        food_type: 'grain',
        food_url: 'https://example.com',
        image_url: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=200&h=200&fit=crop',
        calories: '111',
        protein: '3g',
        carbs: '23g',
        fat: '0.9g',
      },
      {
        food_id: '12',
        food_name: 'Oats',
        food_type: 'grain',
        food_url: 'https://example.com',
        image_url: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=200&h=200&fit=crop',
        calories: '389',
        protein: '17g',
        carbs: '66g',
        fat: '7g',
      },
    ];

    if (!query.trim()) {
      return mockFoods.slice(0, 8); // Return first 8 items for empty query
    }

    return mockFoods.filter(food => 
      food.food_name.toLowerCase().includes(query.toLowerCase()) ||
      food.food_type.toLowerCase().includes(query.toLowerCase())
    );
  }

  private getMockFoodDetails(foodId: string): FoodDetails {
    // Mock detailed nutrition data for different foods
    const mockDetails: Record<string, any> = {
      '1': { // Apple
        food_name: 'Apple',
        food_type: 'fruit',
        serving: {
          serving_description: '1 medium apple',
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
        }
      },
      '2': { // Banana
        food_name: 'Banana',
        food_type: 'fruit',
        serving: {
          serving_description: '1 medium banana',
          metric_serving_amount: '118',
          metric_serving_unit: 'g',
          calories: '105',
          carbohydrate: '27',
          protein: '1.3',
          fat: '0.4',
          fiber: '3.1',
          sugar: '14',
          sodium: '1',
          potassium: '422',
          vitamin_c: '10.3',
        }
      },
      '4': { // Chicken Breast
        food_name: 'Chicken Breast',
        food_type: 'meat',
        serving: {
          serving_description: '100g cooked',
          metric_serving_amount: '100',
          metric_serving_unit: 'g',
          calories: '165',
          carbohydrate: '0',
          protein: '31',
          fat: '3.6',
          fiber: '0',
          sugar: '0',
          sodium: '74',
          potassium: '256',
        }
      },
    };

    const details = mockDetails[foodId] || mockDetails['1']; // Default to apple

    return {
      food_id: foodId,
      food_name: details.food_name,
      food_type: details.food_type,
      food_url: 'https://example.com',
      servings: {
        serving: [{
          serving_id: '1',
          serving_description: details.serving.serving_description,
          serving_url: 'https://example.com',
          measurement_description: 'serving',
          ...details.serving
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

  // Public method to check if API is properly configured
  getAPIStatus(): { configured: boolean; message: string } {
    if (this.isConfigured()) {
      return {
        configured: true,
        message: 'FatSecret API is properly configured and ready to use.'
      };
    } else {
      return {
        configured: false,
        message: 'FatSecret API credentials not configured. Using mock data. Please add your credentials to the .env file.'
      };
    }
  }
}

export const fatSecretAPI = new FatSecretAPI();
