import { get } from 'lodash';

export const getWaivVotePrice = (payout, rshares, rate) => {
  const waivPayout = payout / 2;

  return rshares > 0 ? (waivPayout / rshares) * rate : 0;
};

const postRatioCalculate = (post, waivRates) => {
  if (!post) return {};

  const totalPayout =
    parseFloat(get(post, 'pending_payout_value', '')) +
    parseFloat(get(post, 'total_payout_value', '')) +
    parseFloat(get(post, 'curator_payout_value', ''));

  const ratio = post.net_rshares > 0 ? totalPayout / post.net_rshares : 0;
  const waivRatio = getWaivVotePrice(
    get(post, 'total_payout_WAIV', 0),
    get(post, 'net_rshares_WAIV', 0),
    waivRates,
  );

  return { ratio, waivRatio };
};

export const postPayoutCalculate = (post, rshares, rsharesWAIV = 0, waivRates) => {
  const { ratio, waivRatio } = postRatioCalculate(post, waivRates);

  return rshares * ratio + rsharesWAIV * waivRatio;
};

export const addPayoutForActiveVotes = (post, waivRates, name) => {
  if (!post) return [];

  return post.active_votes.map(vote => {
    if (vote.sponsor && vote.fake) {
      return {
        ...(vote.voter === name ? vote : { sponsor: true }),
        payout:
          post.active_votes.length > 1
            ? postPayoutCalculate(post, vote.rshares, vote.rsharesWAIV, waivRates)
            : vote.rshares,
      };
    }

    return {
      ...vote,
      payout: postPayoutCalculate(post, vote.rshares, vote.rsharesWAIV, waivRates),
    };
  });
};

export default null;
