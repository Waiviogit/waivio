export const supportedObjectTypes = [
  'crypto','currency', 'commodity', 'stock', 'index'
];

export const marketNames = [
  {
    name: 'Crypto',
    names: ['CryptoCurrency', 'Crypto'],
    intl: { id: 'wia.cryptos', defaultMessage: 'Cryptos' },
  },
  {
    name: 'Currency',
    names: ['Currency'],
    intl: { id: 'wia.currencies', defaultMessage: 'Currencies' },
  },
  {
    name: 'Commodity',
    names: ['Commodity'],
    intl: { id: 'wia.commodities', defaultMessage: 'Commodities' },
  },
  {
    name: 'Stock',
    names: ['Stock'],
    intl: { id: 'modalAssets.stocks', defaultMessage: 'Stocks' },
  },
  {
    name: 'Index',
    names: ['Index'],
    intl: { id: 'modalAssets.indices', defaultMessage: 'Indicies' },
  },
];
