import OBJ_TYPE from '../../client/object/const/objectTypes';
import { objectFields } from '../../common/constants/listOfFields';

export const CHART_ID = 'chartid';

export const supportedObjectTypes = [
  OBJ_TYPE.CRYPTO,
  OBJ_TYPE.CURRENCIES,
  OBJ_TYPE.COMMODITY,
  OBJ_TYPE.STOCKS,
  OBJ_TYPE.INDICES,
];
export const supportedObjectFields = [
  objectFields.button,
  objectFields.name,
  objectFields.newsFilter,
  objectFields.parent,
  objectFields.rating,
  objectFields.tagCloud,
  objectFields.workTime,
];
export const typesWithChartId = ['crypto', 'currencies', 'commodity', 'stock', 'index'];

export const marketNames = [
  {
    name: 'Crypto',
    names: ['cryptocurrency', 'crypto'],
    intl: { id: 'wia.cryptos', defaultMessage: 'Cryptos' },
  },
  {
    name: 'Currencies',
    names: ['currencies'],
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

const investArena = {
  supportedTypes: supportedObjectTypes,
  supportedFields: supportedObjectFields,
};

export const tradingObject = {
  'commodity': {
    intl: { id: 'wia.commodities', defaultMessage: 'Commodities' }
    },
  'crypto': {
    intl: { id: 'modalAssets.cryptocurrencies', defaultMessage: 'Cryptocurrencies' }
  },
  'currencies': {
    intl: { id: 'wia.currencies', defaultMessage: 'Currencies' }
  },
  'indices': {
    intl: { id: 'modalAssets.indices', defaultMessage: 'Indicies' },
  },
  'stocks': {
    intl: { id: 'modalAssets.stocks', defaultMessage: 'Stocks' }
  }
};

export default investArena;
