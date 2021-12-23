import { get, round } from 'lodash';
import * as ApiClient from '../../waivioApi/ApiClient';

export const compareTokensList = async (name, tokens) => {
  const tokensList = tokens.map(token => token.symbol);
  const userBalances = await ApiClient.getTokenBalance(name, { $in: tokensList });
  const rates = await ApiClient.getTokensRate(tokensList);

  return tokens.map(token => {
    const userBalance = userBalances.find(r => r.symbol === token.symbol);
    const rate = rates.find(r => r.symbol === token.symbol);

    return {
      ...token,
      balance: round(+get(userBalance, 'balance', 0), 3),
      rate: round(+get(rate, 'lastPrice', 1), 3),
    };
  });
};

export default null;
