import * as apiConfig from '../../waivioApi/config.json';

export const WAIVIO_META_FIELD_NAME = 'wobj';
export const WAIVIO_PARENT_PERMLINK = apiConfig[process.env.NODE_ENV].appName || 'waivio';

export const MAX_NEW_OBJECTS_NUMBER = 5;

export const WAIVIO_POST_TYPE = {
  CREATE_POST: 'CREATE_POST',
  APPEND_OBJECT: 'APPEND_OBJECT',
};

export const PRIMARY_COLOR = '#f87007';

export const GUEST_PREFIX = 'waivio_';

export const BANK_ACCOUNT = 'waiviobank';

export const newUserRecommendTopics = {
  news: ['politics', 'science'],
  lifestyle: ['food', 'health', 'travel'],
  entertainment: ['movies', 'music', 'art', 'photography'],
  cryptos: ['bitcoin', 'ethereum', 'eos', 'hive', 'crypto', 'currency', 'blockchain'],
  stocks: ['trading', 'gold', 'stocks'],
  more: ['funny', 'cats', 'beer', 'poll'],
};
export const newUserRecommendExperts = {
  politics: ['theouterlight', 'honeybee', 'ura-soul', 'johnvibes', 'corbettreport'],
  economy: ['themoneygps', 'joshsigurdson', 'x22report'],
  science: ['steemstem', 'emperorhassy', 'loveforlove'],
  hive: ['theycallmedan', 'taskmaster4450', 'themarkymark'],
  cryptos: ['jrcornel', 'jondoe', 'vlemon', 'louisthomas'],
  entertainment: ['dedicatedguy', 'newtrailers', 'traf'],
  health: ['anaestrada12', 'riccc96', 'naturalmedicine'],
  travel: ['koenau', 'travelgirl', 'jarvie'],
};

export const POST_AUTHOR_FOR_REWARDS_COMMENTS = 'monterey';
