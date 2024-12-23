import { get, isString } from 'lodash';
import * as ApiClient from '../../waivioApi/ApiClient';
import { guestUserRegex } from '../../common/helpers/regexHelpers';
import { getGuestWaivBalance } from '../../waivioApi/walletApi';

export const compareTokensList = async (name, tokens) => {
  const tokensList = tokens?.map(token => token.symbol || token);

  if (tokensList.length === 0) return Promise.reject('No tokens provided');

  const isGuest = guestUserRegex.test(name);
  const userBalances = isGuest
    ? await getGuestWaivBalance(name)
    : await ApiClient.getTokenBalance(name, { $in: tokensList });
  const tokensInfo = await ApiClient.getTokensInformation(tokensList);
  const compareList = tokens?.map(token => {
    const tokenName = token.symbol || token;
    const userBalanceInfo = isGuest
      ? userBalances
      : userBalances?.find(r => r.symbol === tokenName);
    const info = tokensInfo.find(r => r.symbol === tokenName);
    const balance = isGuest ? userBalanceInfo.WAIV : +get(userBalanceInfo, 'balance', 0);

    return {
      ...(isString(token) ? {} : token),
      symbol: tokenName,
      balance,
      precision: info?.precision,
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
