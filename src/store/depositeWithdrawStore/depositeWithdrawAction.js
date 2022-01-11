import { createAsyncActionType } from '../../client/helpers/stateHelpers';
import {
  converHiveEngineCoins,
  getDepositWithdrawPair,
  getHiveEngineCoins,
} from '../../waivioApi/ApiClient';

export const GET_DEPOSIT_WITHDRAW_PAIR = createAsyncActionType(
  '@depositWithdraw/GET_DEPOSIT_WITHDRAW_PAIR',
);

export const getDepositWithdrawPairs = () => ({
  type: GET_DEPOSIT_WITHDRAW_PAIR.ACTION,
  payload: getDepositWithdrawPair().then(async res => {
    const coinList = await getHiveEngineCoins();

    return res.map(pair => {
      const curr = coinList.find(coin => coin.symbol === pair.from_coin_symbol);

      return {
        ...pair,
        ...curr,
      };
    });
  }),
});

export const SET_TOKEN_PAIR = createAsyncActionType('@depositWithdraw/SET_TOKEN_PAIR');

export const setTokenPair = (pair, destination) => ({
  type: SET_TOKEN_PAIR.ACTION,
  payload: converHiveEngineCoins({
    from_coin: pair.from_coin_symbol,
    to_coin: pair.to_coin_symbol,
    destination,
  }).then(res => ({ ...pair, ...res })),
});
