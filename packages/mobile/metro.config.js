const { withNativeWind } = require("nativewind/metro");
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch the entire monorepo so Metro can resolve workspace packages (e.g. "shared").
config.watchFolders = [monorepoRoot];

// Prioritise the app's own node_modules, then fall back to the monorepo root.
// This establishes a deterministic resolution order across the workspace.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Force every "require('react')" and "require('react-native')" in the bundle —
// including calls from inside node_modules/react-native itself — to resolve to
// the single copy living in the app's node_modules.  Without this, the npm
// overrides in the root package.json cause a second copy of React to be
// installed at the monorepo root, and the ReactFabric renderer ends up setting
// ReactCurrentDispatcher on that copy while app code reads from the other one,
// producing "Cannot read property 'useState' of null".
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (_, name) =>
      path.join(path.resolve(projectRoot, "node_modules"), String(name)),
  }
);

module.exports = withNativeWind(config, { input: "./global.css" });
