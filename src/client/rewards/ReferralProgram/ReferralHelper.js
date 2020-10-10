import { size } from 'lodash';

export const getCurrentOfferPercent = value => `${100 - value}%`;
export const handleOffersReward = value => `$${value.toFixed(2)}`;
export const handleOffersPercent = value => `${value}%`;
export const handleFeesValue = value => `$${value}`;
export const getCurrentFeesValue = value => value * (value / 100);
export const handleProcessingFees = (staticValue, currentValue) =>
  `$${(staticValue * (staticValue / 100) * currentValue) / 100}`;
export const handleRefName = refName => refName.replace(/^"(.+(?="$))"$/, '$1');

export const handleLoadMoreUserStatusCards = ({
  username,
  currentUserCards,
  isLoadingMoreUserCards,
  getMoreUserCards,
  sort,
}) => {
  let skip = 0;
  const limit = 10;
  const userCardsLength = size(currentUserCards);
  if (userCardsLength >= limit) {
    skip = userCardsLength;
  }
  if (!isLoadingMoreUserCards) {
    getMoreUserCards(username, skip, limit, sort);
  }
};

export const mockStatusData = () => ({
  users: [
    {
      name: 'wiv01',
      alias: '',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 30,
    },
    {
      name: 'wias',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 3,
    },
    {
      name: 'marco',
      alias: '',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 19,
    },
    {
      name: 'polo',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 24,
    },
    {
      name: 'alex',
      alias: '',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 18,
    },
    {
      name: 'miha',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 14,
    },
    {
      name: 'sam',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 2,
    },
    {
      name: 'arthur',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 26,
    },
    {
      name: 'ronald',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 3,
    },
    {
      name: 'sima',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 17,
    },
    {
      name: 'dinara',
      alias: '',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 1,
    },
    {
      name: 'das',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 3,
    },
    {
      name: 'kiko',
      alias: '',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 18,
    },
    {
      name: 'franco',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 29,
    },
    {
      name: 'grass',
      alias: '',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 14,
    },
    {
      name: 'omega',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 13,
    },
    {
      name: 'guran',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 1,
    },
    {
      name: 'mixao',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 4,
    },
    {
      name: 'samuel',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 30,
    },
    {
      name: 'adma',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 15,
    },
    {
      name: 'simka',
      alias: '',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 30,
    },
    {
      name: 'grom',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 3,
    },
    {
      name: 'franchesca',
      alias: '',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 19,
    },
    {
      name: 'richard',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 24,
    },
    {
      name: 'antonio',
      alias: '',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 18,
    },
    {
      name: 'hassle',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 14,
    },
    {
      name: 'enemy',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 2,
    },
    {
      name: 'every',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 26,
    },
    {
      name: 'william',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 3,
    },
    {
      name: 'coolio',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 17,
    },

    {
      name: 'frank',
      alias: '',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 1,
    },
    {
      name: 'dyson',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 3,
    },
    {
      name: 'chel',
      alias: '',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 18,
    },
    {
      name: 'chelios',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 29,
    },
    {
      name: 'entry',
      alias: '',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 14,
    },
    {
      name: 'qwerty',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 13,
    },
    {
      name: 'aspire',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 1,
    },
    {
      name: 'liam',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 4,
    },
    {
      name: 'fiona',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 30,
    },
    {
      name: 'rock',
      alias: '',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 15,
    },
  ],
  hasMore: false,
});
