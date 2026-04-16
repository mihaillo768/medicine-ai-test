/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['dist', 'node_modules'],
  overrides: [
    {
      files: ['*.cjs', 'vite.config.ts'],
      env: { node: true },
    },
  ],
}
