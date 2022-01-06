import { meanBy, forEach } from 'lodash';

export const rateCount = field => (field.rating_votes && field.rating_votes.length) || 0;

export const isEven = n => n % 2 === 0;

export const averageRate = field => {
  let avrRate = 0;

  if (field.rating_votes) {
    avrRate = meanBy(field.rating_votes, vote => {
      const rate = Math.round(vote.rate);

      if (rate <= 10 && rate > 0) return rate / 2;

      return 0;
    });
  }

  return avrRate;
};

export const calculateRateCurrUser = (votes, user) => {
  if (!votes) return 0;

  const vote = votes.find(r => r.voter === user);
  const rate = Math.round(vote.rate);

  return rate / 2;
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
