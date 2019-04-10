import _ from 'lodash';
import { ratePercent } from '../../../../common/constants/listOfFields';

export const rateCount = field => (field.rating_votes && field.rating_votes.length) || 0;

export const averageRate = field =>
  _.meanBy(field.rating_votes, vote => ratePercent.indexOf(vote.rate) + 1);

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
