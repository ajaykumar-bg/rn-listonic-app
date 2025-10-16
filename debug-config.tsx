// Debug script to test environment variable loading
import { ENV_CONFIG } from './config/env';
import { fatSecretAPI } from './services/fatSecretAPI';

console.log('=== Environment Configuration Debug ===');
console.log('ENV_CONFIG:', {
  clientId: ENV_CONFIG.FATSECRET_CLIENT_ID?.substring(0, 8) + '...',
  clientSecret: ENV_CONFIG.FATSECRET_CLIENT_SECRET?.substring(0, 8) + '...',
});

console.log('API Status:', fatSecretAPI.getAPIStatus());

export default function DebugConfig() {
  return null;
}
