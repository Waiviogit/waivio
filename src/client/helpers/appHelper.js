import { isEmpty } from 'lodash';

const getWeightHelper = (rate, rewardFund, recentClaims, rewardBalance, weight) => {
  let value;

  if (!isEmpty(rewardFund))
    value = (weight / recentClaims) * rewardBalance.replace(' HIVE', '') * rate * 1000000;

  return value;
};

export default getWeightHelper;
