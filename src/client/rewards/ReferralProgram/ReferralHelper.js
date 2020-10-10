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
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 30,
    },
    {
      name: 'wias',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 3,
    },
    {
      name: 'marco',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 19,
    },
    {
      name: 'polo',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 24,
    },
    {
      name: 'alex',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 18,
    },
    {
      name: 'miha',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 14,
    },
    {
      name: 'sam',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 2,
    },
    {
      name: 'arthur',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 26,
    },
    {
      name: 'ronald',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 3,
    },
    {
      name: 'sima',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 17,
    },
    {
      name: 'dinara',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 1,
    },
    {
      name: 'das',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 3,
    },
    {
      name: 'kiko',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 18,
    },
    {
      name: 'franco',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 29,
    },
    {
      name: 'grass',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 14,
    },
    {
      name: 'omega',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 13,
    },
    {
      name: 'guran',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 1,
    },
    {
      name: 'mixao',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 4,
    },
    {
      name: 'samuel',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 30,
    },
    {
      name: 'adma',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 15,
    },
    {
      name: 'simka',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 30,
    },
    {
      name: 'grom',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 3,
    },
    {
      name: 'franchesca',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 19,
    },
    {
      name: 'richard',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 24,
    },
    {
      name: 'antonio',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 18,
    },
    {
      name: 'hassle',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 14,
    },
    {
      name: 'enemy',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 2,
    },
    {
      name: 'every',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 26,
    },
    {
      name: 'william',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 3,
    },
    {
      name: 'coolio',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 17,
    },

    {
      name: 'frank',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 1,
    },
    {
      name: 'dyson',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 3,
    },
    {
      name: 'chel',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 18,
    },
    {
      name: 'chelios',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 29,
    },
    {
      name: 'entry',
      started: '2020-08-27T07:00:25.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 14,
    },
    {
      name: 'qwerty',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 13,
    },
    {
      name: 'aspire',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 1,
    },
    {
      name: 'liam',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 4,
    },
    {
      name: 'fiona',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 30,
    },
    {
      name: 'rock',
      started: '2020-08-27T07:00:22.324Z',
      ended: '2020-09-27T07:00:25.324Z',
      daysLeft: 15,
    },
  ],
  hasMore: false,
});
