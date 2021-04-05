import { calculateVoteValue, calculateVotingPower } from '../vendor/steemitHelpers';

export const getUserRank = vests => {
  let rank = 'Plankton';

  if (vests >= 1000000000) {
    rank = 'Whale';
  } else if (vests >= 100000000) {
    rank = 'Orca';
  } else if (vests >= 10000000) {
    rank = 'Dolphin';
  } else if (vests >= 1000000) {
    rank = 'Minnow';
  }

  return rank;
};

export const getUserRankKey = vests => {
  let rank = 'plankton';

  if (vests >= 1000000000) {
    rank = 'whale';
  } else if (vests >= 100000000) {
    rank = 'orca';
  } else if (vests >= 10000000) {
    rank = 'dolphin';
  } else if (vests >= 1000000) {
    rank = 'minnow';
  }

  return `rank_${rank}`;
};

export const getTotalShares = user =>
  parseFloat(user.vesting_shares) +
  parseFloat(user.received_vesting_shares) -
  parseFloat(user.delegated_vesting_shares) -
  Math.min(
    parseFloat(user.vesting_withdraw_rate),
    (parseFloat(user.to_withdraw) - parseFloat(user.withdrawn)) / 100000,
  );

export const getVoteValue = (user, recentClaims, rewardBalance, rate, weight = 10000) =>
  calculateVoteValue(
    getTotalShares(user),
    parseFloat(recentClaims),
    parseFloat(rewardBalance),
    rate,
    calculateVotingPower(user) * 10000,
    weight,
  );

export const calculateVotePower = (account, rewardFund, price) => {
  const vests =
    parseFloat(account.vesting_shares) +
    parseFloat(account.received_vesting_shares) -
    parseFloat(account.delegated_vesting_shares);

  const secondsago =
    (new Date().getTime() - new Date(`${account.last_vote_time}Z`).getTime()) / 1000;
  const accountVotingPower = Math.min(10000, account.voting_power + (10000 * secondsago) / 432000);

  const power = Math.round((accountVotingPower + 49) / 50);
  const rshares = vests * power * 100 - 50000000;

  const s = parseFloat(rewardFund.content_constant);
  const tclaims = (rshares * (rshares + 2 * s)) / (rshares + 4 * s);

  const rewards = parseFloat(rewardFund.reward_balance) / parseFloat(rewardFund.recent_claims);

  return tclaims * rewards * price;
};

export default null;
