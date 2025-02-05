import { meanBy, forEach, isEmpty } from 'lodash';

export const rateCount = field => (field.rating_votes && field.rating_votes.length) || 0;

export const isEven = n => n % 2 === 0;

export const averageRate = field => {
  let avrRate = 0;

  if (field?.rating_votes) {
    avrRate = meanBy(field?.rating_votes, vote => {
      const rate = Math.round(vote.rate);

      if (rate <= 10 && rate > 0) return rate / 2;

      return 0;
    });
  }

  return avrRate;
};

export const formatAverageRate = rate => {
  if (rate <= 10 && rate > 0) return rate / 2;

  return 0;
};

export const calculateRateCurrUser = (votes, user) => {
  if (!votes) return 0;

  const vote = votes.find(r => r.voter === user);
  const rate = Math.round(vote.rate);

  return rate / 2;
};

export const getRatingForSocial = ratings => {
  if (!ratings) return null;
  const filtered = ratings.filter(i => i.average_rating_weight);

  if (!isEmpty(filtered)) {
    const sortingList = filtered.sort((a, b) => b.average_rating_weight - a.average_rating_weight);

    return sortingList[0];
  }

  const valueRating = ratings.find(o => o.body === 'Value');

  return valueRating || ratings[0];
};

export const avrRate = ratings => {
  let sumRate = 0;
  let votedRatesCount = 0;

  forEach(ratings, rate => {
    if (rate.rating_votes) votedRatesCount += 1;
    sumRate += averageRate(rate);
  });

  return sumRate > 0 && votedRatesCount > 0 ? sumRate / votedRatesCount : 0;
};
