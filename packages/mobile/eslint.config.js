// https://docs.expo.dev/guides/using-eslint/
// Using a custom flat config due to compatibility issues with eslint-config-expo v10 and ESLint 10
const coreConfig = require('eslint-config-expo/flat/utils/core.js');
const expoConfig = require('eslint-config-expo/flat/utils/expo.js');
const reactConfig = require('eslint-config-expo/flat/utils/react.js');
const typescriptConfig = require('eslint-config-expo/flat/utils/typescript.js');
const { allExtensions } = require('eslint-config-expo/flat/utils/extensions.js');
const globals = require('globals');

module.exports = [
  {
    ignores: ['dist/', '.expo/', 'node_modules/'],
  },
  ...coreConfig,
  ...typescriptConfig,
  ...reactConfig,
  ...expoConfig,
  {
    settings: {
      'import/extensions': allExtensions,
      'import/resolver': {
        node: { extensions: allExtensions },
      },
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        __DEV__: 'readonly',
        ErrorUtils: false,
        FormData: false,
        XMLHttpRequest: false,
        alert: false,
        cancelAnimationFrame: false,
        cancelIdleCallback: false,
        clearImmediate: false,
        fetch: false,
        navigator: false,
        process: false,
        requestAnimationFrame: false,
        requestIdleCallback: false,
        setImmediate: false,
        window: false,
        'shared-node-browser': true,
      },
    },
  },
  {
    files: ['*.web.*'],
  },
  {
    files: ['__mocks__/**', '__tests__/**'],
    languageOptions: {
      globals: {
        jest: true,
      },
    },
  },
];
