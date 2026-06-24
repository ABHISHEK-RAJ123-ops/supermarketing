const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const { resolver } = config;

const MAPS_STUB = path.resolve(__dirname, './src/mocks/react-native-maps.web.tsx');

config.resolver = {
  ...resolver,
  resolveRequest: (context, moduleName, platform) => {
    if (platform === 'web') {
      // Intercept top-level import and all internal spec/native modules
      if (
        moduleName === 'react-native-maps' ||
        moduleName.startsWith('react-native-maps/')
      ) {
        return {
          filePath: MAPS_STUB,
          type: 'sourceFile',
        };
      }
    }
    // Fall back to default resolution
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;
