// Add URL polyfill before anything else
import { Platform } from 'react-native';

// Polyfill URL functionality for React Native environment
if (Platform.OS !== 'web') {
  const URLPolyfill = require('url-parse');

  if (!global.URL) {
    global.URL = URLPolyfill;
  }
}

import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import App from './App';

// Register with Expo
registerRootComponent(App);

// Also register for standard React Native
AppRegistry.registerComponent('ShoppingCart', () => App);
AppRegistry.registerComponent('main', () => App);

// Export the main component
export default App;
