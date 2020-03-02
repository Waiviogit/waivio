import { meanBy, forEach } from 'lodash';
import { ratePercent } from '../../../../common/constants/listOfFields';

export const rateCount = field => (field.rating_votes && field.rating_votes.length) || 0;

export const isEven = n => n % 2 === 0;

export const averageRate = field => {
  let avrRate = 0;
  if (field.rating_votes)
    avrRate = meanBy(field.rating_votes, vote => {
      const rate = Math.round(vote.rate);
      if (rate <= 10 && rate > 0) {
        if (isEven(rate)) return ratePercent.indexOf(rate) + 1;
        return ratePercent.indexOf(rate + 1) + 1;
      }
      return 0;
    });
  return avrRate;
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
