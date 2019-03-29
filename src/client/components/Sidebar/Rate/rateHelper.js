import _ from 'lodash';
import { ratePercent } from '../../../../common/constants/listOfFields';

export const rateCount = field => (field.rating_votes && field.rating_votes.length) || 0;

export const averageRate = field =>
  _.meanBy(field.rating_votes, vote => ratePercent.indexOf(vote.rate) + 1);
