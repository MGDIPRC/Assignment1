module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'standard-with-typescript',
    'prettier', // ⬅️ MUST be last
  ],
  env: {
    node: true,
    es2022: true,
  },
  ignorePatterns: ['node_modules', 'dist', 'build', '.eslintrc.cjs'],
  rules: {
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/comma-dangle': 'off',
  },
}
