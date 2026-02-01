module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  extends: ['standard-with-typescript'],
  env: {
    node: true,
    es2022: true,
  },
  ignorePatterns: ['node_modules', 'dist', 'build', '.eslintrc.cjs'],
}
