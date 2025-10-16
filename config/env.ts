import Constants from 'expo-constants';

// Environment configuration for FatSecret API
// This file reads from environment variables using Expo Constants

const getEnvVar = (key: string, fallback: string): string => {
  // Try to get from Expo Constants extra config
  const extraValue = Constants.expoConfig?.extra?.[key];
  
  // Get specific environment variables (avoiding dynamic access)
  let processValue: string | undefined;
  if (key === 'FATSECRET_CLIENT_ID') {
    processValue = process.env.FATSECRET_CLIENT_ID;
  } else if (key === 'FATSECRET_CLIENT_SECRET') {
    processValue = process.env.FATSECRET_CLIENT_SECRET;
  }
  
  const value = extraValue || processValue || fallback;
  
  // Only warn if falling back to placeholder values
  if (value === fallback) {
    console.warn(`Environment variable ${key} not set, using fallback value`);
  }
  
  return value;
};

export const ENV_CONFIG = {
  FATSECRET_CLIENT_ID: getEnvVar('FATSECRET_CLIENT_ID', 'your_client_id'),
  FATSECRET_CLIENT_SECRET: getEnvVar('FATSECRET_CLIENT_SECRET', 'your_client_secret'),
} as const;
