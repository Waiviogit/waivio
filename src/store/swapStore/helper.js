import { get, round, isString } from 'lodash';
import * as ApiClient from '../../waivioApi/ApiClient';

export const compareTokensList = async (name, tokens) => {
  const tokensList = tokens.map(token => token.symbol || token);
  const userBalances = await ApiClient.getTokenBalance(name, { $in: tokensList });
  const rates = await ApiClient.getTokensRate(tokensList);
  const compareList = tokens.map(token => {
    const tokenName = token.symbol || token;
    const userBalance = userBalances.find(r => r.symbol === tokenName);
    const rate = rates.find(r => r.symbol === tokenName);

    return {
      ...(isString(token) ? {} : token),
      symbol: tokenName,
      balance: round(+get(userBalance, 'balance', 0), 3),
      rate: round(+get(rate, 'lastPrice', 1), 3),
    };
  });

  return compareList
    .sort((a, b) => {
      if (a.symbol === 'WAIV') return -1;
      if (b.symbol === 'WAIV') return 1;
      if (!b.balance || !a.balance) return a.symbol > b.symbol ? 1 : -1;

      return b.balance - a.balance;
    })
    .filter(pair => pair.balance);
};

export default null;
