import { get, floor, isString } from 'lodash';
import * as ApiClient from '../../waivioApi/ApiClient';

export const compareTokensList = async (name, tokens) => {
  const tokensList = tokens.map(token => token.symbol || token);
  const userBalances = await ApiClient.getTokenBalance(name, { $in: tokensList });
  const rates = await ApiClient.getTokensRate(tokensList);
  const tokensInfo = await ApiClient.getTokensInformation(tokensList);
  const compareList = tokens.map(token => {
    const tokenName = token.symbol || token;
    const userBalanceInfo = userBalances.find(r => r.symbol === tokenName);
    const rate = rates.find(r => r.symbol === tokenName);
    const info = tokensInfo.find(r => r.symbol === tokenName);
    const balance = +get(userBalanceInfo, 'balance', 0);
    const balancePrecision = balance > 0.001 ? 3 : 7;

    return {
      ...(isString(token) ? {} : token),
      symbol: tokenName,
      balance: floor(balance, balancePrecision),
      rate: floor(+get(rate, 'lastPrice', 1), 3),
      precision: info.precision,
    };
  });

  return compareList.sort((a, b) => {
    if (a.symbol === 'WAIV') return -1;
    if (b.symbol === 'WAIV') return 1;
    if (!b.balance || !a.balance) return a.symbol > b.symbol ? 1 : -1;

    return b.balance - a.balance;
  });
};

export default null;
