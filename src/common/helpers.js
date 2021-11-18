export const getWaivVotePrice = (payout, rshares, rate) => {
  const waivPayout = payout / 2;

  return rshares > 0 ? (waivPayout / rshares) * rate : 0;
};

export default null;
