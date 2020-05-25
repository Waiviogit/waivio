import OBJ_TYPE from '../../client/object/const/objectTypes';
import { objectFields } from '../../common/constants/listOfFields';

export const CHART_ID = 'chartid';

export const supportedObjectTypes = [OBJ_TYPE.CRYPTOPAIRS];
export const supportedObjectFields = [
  objectFields.button,
  objectFields.name,
  objectFields.description,
  objectFields.newsFilter,
  objectFields.parent,
  objectFields.rating,
  objectFields.tagCloud,
  objectFields.workTime,
];
export const typesWithChartId = ['crypto', 'currencies', 'commodity', 'stock', 'index'];

export const marketNames = [
  {
    name: 'crypto',
    names: ['crypto'],
    intl: { id: 'wia.cryptos', defaultMessage: 'Cryptos' },
  },
];

const investArena = {
  supportedTypes: supportedObjectTypes,
  supportedFields: supportedObjectFields,
};

export const discoverObjectsContentTypes = {
  commodity: {
    intl: { id: 'wia.commodities', defaultMessage: 'Commodities' },
  },
  cryptopairs: {
    intl: { id: 'wia.cryptopairs', defaultMessage: 'Crypto pairs' },
  },
  crypto: {
    intl: { id: 'modalAssets.cryptocurrencies', defaultMessage: 'Cryptocurrencies' },
  },
  stocks: {
    intl: { id: 'modalAssets.stocks', defaultMessage: 'Stocks' },
  },
  brokers: {
    intl: { id: 'brokers', defaultMessage: 'Brokers' },
  },
  hashtag: {
    intl: { id: 'hashtags', defaultMessage: 'Hashtags' },
  },
};

export default investArena;
