module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  plugins: ['react-hooks'],
  ignorePatterns: ['dist', 'node_modules', 'vite.config.ts'],
  rules: {
    'no-debugger': 'error',
    'react-hooks/rules-of-hooks': 'error',
  },
};
