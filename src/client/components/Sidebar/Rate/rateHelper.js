import _ from 'lodash';
import { ratePercent } from '../../../../common/constants/listOfFields';

export const rateCount = field => (field.rating_votes && field.rating_votes.length) || 0;

export const averageRate = field => {
  const avrRate = 0;
  if (field.rating_votes)
    _.meanBy(field.rating_votes, vote => {
      if (vote <= 10) return ratePercent.indexOf(vote.rate) + 1;
      return 5;
    });
  return avrRate;
};

// export const getRatesWithMaxVotes = (ratings, count) => {
//   _.forEach(ratings, rate => {
//     sumRate += averageRate(rate);
//   });
//   return;
// };

export const avrRate = ratings => {
  let sumRate = 0;
  _.forEach(ratings, rate => {
    sumRate += averageRate(rate);
  });
  return sumRate > 0 && ratings.length > 0 ? sumRate / ratings.length : 0;
};
