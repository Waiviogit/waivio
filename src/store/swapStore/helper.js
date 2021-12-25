import { get, round, isString } from 'lodash';
import * as ApiClient from '../../waivioApi/ApiClient';

export const compareTokensList = async (name, tokens) => {
  const tokensList = tokens.map(token => token.symbol || token);
  const userBalances = await ApiClient.getTokenBalance(name, { $in: tokensList });
  const rates = await ApiClient.getTokensRate(tokensList);

  return tokens.map(token => {
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
};

export default null;
