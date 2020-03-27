export const BTC = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'BTC',
};

export const ETH = {
  id: 'ethereum',
  name: 'Ethereum',
  symbol: 'ETH',
};

export const HIVE = {
  id: 'hive',
  name: 'Hive',
  symbol: 'HIVE',
  coinGeckoId: 'hive',
};

export const HBD = {
  id: 'hive-dollars',
  name: 'Hive Dollars',
  symbol: 'HBD',
  coinGeckoId: 'hive_dollar',
};

export const CRYPTO_MAP = {
  [BTC.symbol]: BTC,
  [ETH.symbol]: ETH,
  [HIVE.symbol]: HIVE,
  [HBD.symbol]: HBD,
};
