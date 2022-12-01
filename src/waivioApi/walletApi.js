import fetch from 'isomorphic-fetch';
import config from './routes';
import { headers } from './ApiClient';
import { getGuestAccessToken } from '../common/helpers/localStorageHelpers';
import { compareTokensList } from '../store/swapStore/helper';

export const getGuestWaivTransferHistory = (guestName, symbol) =>
  fetch(`${config.apiPrefix}${config.user}/${guestName}${config.guestWallet}?symbol=${symbol}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getGuestWaivBalance = guestName =>
  fetch(`${config.apiPrefix}${config.user}/${guestName}${config.guestBalance}?symbol=WAIV`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const sendGuestTransferWAIV = async ({
  to,
  amount,
  memo,
  app,
  symbol = 'WAIV',
  account,
  id = 'transferFromGuest',
}) =>
  fetch(`${config.objectsBotApiPrefix}${config.guestTranfer}`, {
    method: 'POST',
    headers: { ...headers, 'access-token': getGuestAccessToken(), 'waivio-auth': true },
    body: JSON.stringify({
      id,
      account,
      data: {
        to,
        app,
        quantity: amount,
        symbol,
        memo,
      },
    }),
  })
    .then(res => res.json())
    .catch(err => err);

export const withdrawGuest = async ({ account, data }) =>
  fetch(`${config.objectsBotApiPrefix}${config.guestWithdraw}`, {
    method: 'POST',
    headers: { ...headers, 'access-token': getGuestAccessToken(), 'waivio-auth': true },
    body: JSON.stringify({
      id: 'guestWithdraw',
      account,
      data,
    }),
  })
    .then(res => res.json())
    .catch(err => err);

export const getTokenListForRebalancing = name =>
  fetch(`${config.arbitrageApiPrefix}${config.profit}${config.tokens}`, {
    method: 'GET',
    headers,
  })
    .then(res => res.json())
    .then(res => compareTokensList(name, res))
    .catch(err => err);
export default null;
