const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: "./global.css" });

// const path = require("path");
// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");


// // Add the CSS input option for NativeWind
// module.exports = withNativeWind(config, {
//   input: "./global.css",
// });
