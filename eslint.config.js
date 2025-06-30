import js from '@eslint/js';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import reactPlugin from 'eslint-plugin-react';
const { node, mocha, browser, es2021 } = globals;

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
        ...globals.browser
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: reactPlugin
    },
    rules: {
      'no-unused-vars': ['warn', { 
        varsIgnorePattern: '^React$',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }],
      'no-console': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error'
    }
  },
  {
    files: ['**/*.jsx', '**/*.tsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react']
        }
      }
    },
    rules: {
      'no-unused-vars': 'off', // Desabilitar para JSX, usar regras específicas do React
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error'
    }
  },
  // Node.js para scripts, configs e arquivos JS padrão
  {
    files: [
      '*.js',
      'scripts/**/*.js',
      'config/**/*.js',
      'hardhat.config.js',
      'test/**/*.js'
    ],
    ignores: [
      'node_modules/**',
      'artifacts/**',
      'cache/**',
      'coverage/**',
      'deployments/**',
      'docs/**',
      'docs-oddproxy/**',
      'site-oddproxy/**',
      'admin-dashboard/**',
      'trustwallet-assets/**',
      'trustwallet-submission/**',
      'assets/**',
      '*.config.js',
      '.docusaurus/**'
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: node
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-var': 'error',
      'semi': ['error', 'always'],
      'quotes': ['warn', 'single'],
      'indent': ['warn', 2],
      'comma-dangle': ['warn', 'never'],
      'no-trailing-spaces': 'warn',
      'eol-last': 'warn'
    }
  },
  // Mocha para testes
  {
    files: ['test/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...node, ...mocha }
    }
  },
  // React para arquivos JSX e JS com JSX
  {
    files: [
      '**/*.jsx',
      'admin-dashboard/src/**/*.js',
      'site-oddproxy/src/**/*.js',
      'docs-oddproxy/src/**/*.js'
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react']
        }
      },
      globals: { ...browser, ...es2021 }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-var': 'error',
      'semi': ['error', 'always'],
      'quotes': ['warn', 'single'],
      'indent': ['warn', 2],
      'comma-dangle': ['warn', 'never'],
      'no-trailing-spaces': 'warn',
      'eol-last': 'warn'
    }
  }
];
