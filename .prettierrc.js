/** @type {import('prettier').Config} */
module.exports = {
  trailingComma: 'es5',
  tabWidth: 2,
  printWidth: 100,
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  bracketSpacing: true,
  useTabs: false,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: ['<THIRD_PARTY_MODULES>', '^[./]'],
  importOrderCaseInsensitive: false,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'decorators-legacy']
}
