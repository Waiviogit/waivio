import { get } from 'lodash';
import { isEmpty } from 'lodash/lang';

export const getWaivVotePrice = (payout, rshares, rate) =>
  rshares > 0 ? (payout / rshares) * rate : 0;

const postRatioCalculate = (post, waivRates) => {
  if (!post) return {};
  const hiveRshares = post.active_votes.reduce((acc, curr) => acc + curr.rshares, 0);
  const totalPayout =
    parseFloat(get(post, 'pending_payout_value', '')) +
    parseFloat(get(post, 'total_payout_value', '')) +
    parseFloat(get(post, 'curator_payout_value', ''));

  const ratio = hiveRshares > 0 ? totalPayout / hiveRshares : 0;
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

export const addPayoutForActiveVotes = (post, waivRates) => {
  if (isEmpty(post)) return [];

  return get(post, 'active_votes', []).map(vote => {
    if (vote.sponsor) {
      return {
        ...vote,
        payout:
          post.active_votes.length > 1 || !vote.fake || vote.rsharesWAIV
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

export const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const ua = typeof window !== 'undefined' && window.navigator.userAgent;

export const isIOS = () => !!ua?.match(/iPad/i) || !!ua?.match(/iPhone/i);

export function hexToRgb(color, opacity) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);

  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    return opacity ? `rgba(${r},${g},${b}, 0.${opacity})` : `rgb(${r},${g},${b})`;
  }

  return color;
}

export default null;
