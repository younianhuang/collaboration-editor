const path = require('path');

module.exports = {
  root: true,
  settings: {
    'import/resolver': {
      'eslint-import-resolver-typescript': true,
    },
    typescript: {
      alwaysTryTypes: true,
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["airbnb", "plugin:@typescript-eslint/recommended", "react-app", "plugin:prettier/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      tsx: true,
    },
    ecmaVersion: 12,
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
    "import/no-extraneous-dependencies": 'off',
    'react/jsx-filename-extension': [2, { 'extensions': ['.js', '.jsx', '.ts', '.tsx'] }],
    "class-methods-use-this": "off",
    "no-underscore-dangle": "off",
    "comma-dangle": ["error", "always-multiline"],
    "eol-last": 0,
    "no-console": "off",
    "no-unused-vars": "off",
    "no-undef": "off",
    "quotes": "off",
    "class-methods-use-this": "off",
    "no-trailing-spaces": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "memberLike",
        "modifiers": ["private"],
        "format": ["strictCamelCase"],
        "leadingUnderscore": "require",
      },
      {
        "selector": "property",
        "format": ["strictCamelCase", "camelCase"],
      },
      {
        "selector": "property",
        "modifiers": ["private"],
        "format": ["strictCamelCase", "camelCase"],
        "leadingUnderscore": "require",
      },
      {
        "selector": "classMethod",
        "modifiers": ["public"],
        "format": ["camelCase"],
      },
      {
        "selector": "classMethod",
        "modifiers": ["protected"],
        "format": ["camelCase"],
        "leadingUnderscore": "require",
      },
      {
        "selector": "classMethod",
        "modifiers": ["private"],
        "format": ["camelCase"],
        "leadingUnderscore": "require",
      },
      {
        "selector": "classProperty",
        "modifiers": ["protected"],
        "format": ["camelCase"],
        "leadingUnderscore": "require",
      },
      {
        "selector": "classProperty",
        "modifiers": ["public"],
        "format": ["camelCase"],
      },
      {
        "selector": "classProperty",
        "modifiers": ["private"],
        "format": ["camelCase"],
        "leadingUnderscore": "require",
      },
      {
        "selector": "class",
        "format": ["PascalCase"],
        "custom": {
          "regex": "^[A-Z]",
          "match": true
        }
      },
      {
        "selector": "typeMethod",
        "modifiers": ["public"],
        "format": ["PascalCase"],
      },
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "custom": {
          "regex": "^I[A-Z]",
          "match": true
        }
      },
      {
        "selector": "typeLike",
        "format": ["PascalCase"]
      },
      {
        "selector": "variable",
        "types": ["boolean"],
        "format": ["PascalCase"],
        "prefix": ["is", "should"],
      },
    ],
    "@typescript-eslint/no-empty-interface": [
      "warn",
      {
        "allowSingleExtends": false
      }
    ],
    "eqeqeq": "error",
    "react/prefer-stateless-function": [0, { "ignorePureComponents": true }],
    "react/destructuring-assignment": [0, "always", {}],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"]
  },
};
