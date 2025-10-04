const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: "./global.css" });


// const { getDefaultConfig } = require('expo/metro-config');
// const path = require('path');

// const projectRoot = __dirname;
// const monorepoRoot = path.resolve(projectRoot, '../..'); // adjust as needed

// const config = getDefaultConfig(projectRoot);

// // Watch for changes in the entire monorepo
// config.watchFolders = [monorepoRoot];

// // Resolve node modules both from project and monorepo root
// config.resolver.nodeModulesPaths = [
//   path.resolve(projectRoot, 'node_modules'),
//   path.resolve(monorepoRoot, 'node_modules'),
// ];

// module.exports = config;
