import * as apiConfig from '../../waivioApi/config.json';

export const WAIVIO_META_FIELD_NAME = 'wobj';
export const WAIVIO_PARENT_PERMLINK = apiConfig[process.env.NODE_ENV].appName || 'waivio';

export const PRIMARY_COLOR = '#f87007';

export const GUEST_PREFIX = 'waivio_';
export const BXY_GUEST_PREFIX = 'bxy_';

export const BANK_ACCOUNT = 'waivio.hive';
export const GUEST_BENEFISIARY = 'waivio.hpower';

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

export const CRYPTO_FOR_VALIDATE_WALLET = {
  btc: 'bitcoin',
  ltc: 'litecoin',
  eth: 'ethereum',
};

export const notificationType = {
  сommunityActions: [
    {
      id: 'likes',
      defaultMessage: 'Likes',
      name: 'like',
    },
    {
      id: 're_blogs',
      defaultMessage: 'Re-blogs',
      name: 'reblog',
    },
    {
      id: 'replies',
      defaultMessage: 'Replies',
      name: 'reply',
    },
    {
      id: 'mentions',
      defaultMessage: 'Mentions',
      name: 'mention',
    },
    {
      id: 'downvotes',
      defaultMessage: 'Downvotes',
      name: 'downvote',
    },
    {
      id: 'follow',
      defaultMessage: 'Follow',
      name: 'follow',
    },
    {
      id: 'status_change_notify',
      defaultMessage: 'Status changed',
      name: 'statusChange',
    },
    {
      id: 'activation_campaign_notify',
      defaultMessage: 'Activation campaign',
      name: 'activationCampaign',
    },
    {
      id: 'claimed_object_updates',
      defaultMessage: 'Claimed object updates',
      name: 'objectUpdates',
    },
    {
      id: 'group_id_control',
      defaultMessage: 'Group ID control',
      name: 'objectGroupId',
    },
    {
      id: 'followed_user_threads',
      defaultMessage: 'Followed user threads',
      name: 'threadAuthorFollower',
    },
  ],
  walletTransactions: [
    {
      id: 'internal_market',
      defaultMessage: 'Internal market (HIVE/HBD conversions)',
      name: 'fillOrder',
    },
    {
      id: 'power_ups',
      defaultMessage: 'Power ups',
      name: 'powerUp',
    },
    {
      id: 'claimed_rewards',
      defaultMessage: 'Claimed rewards',
      name: 'claimReward',
    },
  ],
  myActions: [
    {
      id: 'my_posts',
      defaultMessage: 'My posts',
      name: 'myPost',
    },
    {
      id: 'my_comments',
      defaultMessage: 'My comments',
      name: 'myComment',
    },
    {
      id: 'my_likes',
      defaultMessage: 'My likes',
      name: 'myLike',
    },
  ],
};

export const roundUpToThisIndex = 2;

export const CRYPTO_LIST_FOR_WALLET = ['btc', 'ltc', 'eth'];

export const WAIVEligibleTags = ['waivio', 'neoxian', 'palnet', 'waiv', 'food'];
