export const supportedObjectTypes = [
  'crypto',
  'currency',
  'commodity',
  'stock',
  'index',
  'cryptocurrency',
];

export const marketNames = [
  {
    name: 'Crypto',
    names: ['cryptocurrency', 'crypto'],
    intl: { id: 'wia.cryptos', defaultMessage: 'Cryptos' },
  },
  {
    name: 'Currency',
    names: ['currency'],
    intl: { id: 'wia.currencies', defaultMessage: 'Currencies' },
  },
  {
    name: 'Commodity',
    names: ['commodity'],
    intl: { id: 'wia.commodities', defaultMessage: 'Commodities' },
  },
  {
    name: 'Stock',
    names: ['stock'],
    intl: { id: 'modalAssets.stocks', defaultMessage: 'Stocks' },
  },
  {
    name: 'Index',
    names: ['index'],
    intl: { id: 'modalAssets.indices', defaultMessage: 'Indicies' },
  },
];
