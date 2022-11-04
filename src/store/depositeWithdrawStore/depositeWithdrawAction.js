import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import {
  converHiveEngineCoins,
  getDepositWithdrawPair,
  getHiveEngineCoins,
} from '../../waivioApi/ApiClient';
import { compareTokensList } from '../swapStore/helper';
import { getAuthenticatedUserName, isGuestUser } from '../authStore/authSelectors';

export const GET_DEPOSIT_WITHDRAW_PAIR = createAsyncActionType(
  '@depositWithdraw/GET_DEPOSIT_WITHDRAW_PAIR',
);

export const getDepositWithdrawPairs = () => (dispatch, getState) => {
  const state = getState();
  const name = getAuthenticatedUserName(state);
  const isGuest = isGuestUser(state);

  return dispatch({
    type: GET_DEPOSIT_WITHDRAW_PAIR.ACTION,
    payload: getDepositWithdrawPair().then(async res => {
      const coinList = await getHiveEngineCoins();
      const compliteList = res.map(pair => {
        const curr = coinList.find(coin => coin.symbol === pair.from_coin_symbol);

        return {
          ...pair,
          ...curr,
        };
      });
      const depositPairs = [
        ...compliteList,
        {
          from_coin_symbol: 'HIVE',
          to_coin_symbol: 'SWAP.HIVE',
          display_name: 'HIVE',
          account: 'honey-swap',
          pair: 'HIVE -> SWAP.HIVE',
          memo: {
            id: 'ssc-mainnet-hive',
            json: { contractName: 'hivepegged', contractAction: 'buy', contractPayload: {} },
          },
        },
      ]
        .filter(
          pair =>
            !pair.from_coin_symbol.startsWith('SWAP') && pair.to_coin_symbol.startsWith('SWAP'),
        )
        .sort((a, b) => (b.display_name > a.display_name ? -1 : 1));

      const withdrawPairsFilteredList = [
        ...compliteList,
        {
          from_coin_symbol: 'SWAP.HIVE',
          to_coin_symbol: 'HIVE',
          symbol: 'SWAP.HIVE',
          account: 'honey-swap',
          ex_rate: 1,
          pair: 'HIVE -> SWAP.HIVE',
        },
      ].filter(
        pair => pair.from_coin_symbol.startsWith('SWAP') && !pair.to_coin_symbol.startsWith('SWAP'),
      );
      const withdrawPairs = await compareTokensList(name, [
        ...(isGuest ? [] : withdrawPairsFilteredList),
        {
          from_coin_symbol: 'WAIV',
          to_coin_symbol: 'LTC',
          symbol: 'WAIV',
          ex_rate: 1,
          pair: 'WAIV -> SWAP.LTC',
          title: 'WAIV - LTC',
        },
        {
          from_coin_symbol: 'WAIV',
          to_coin_symbol: 'BTC',
          symbol: 'WAIV',
          ex_rate: 1,
          pair: 'WAIV -> SWAP.BTC',
          title: 'WAIV - BTC',
        },
        {
          from_coin_symbol: 'WAIV',
          to_coin_symbol: 'ETH',
          symbol: 'WAIV',
          ex_rate: 1,
          pair: 'WAIV -> SWAP.ETH',
          title: 'WAIV - ETH',
        },
        {
          from_coin_symbol: 'WAIV',
          to_coin_symbol: 'HIVE',
          symbol: 'WAIV',
          ex_rate: 1,
          pair: 'WAIV -> SWAP.HIVE',
          title: 'WAIV - HIVE',
        },
      ]);

      return {
        withdrawPairs: withdrawPairs.filter(pair => pair.balance),
        depositPairs,
      };
    }),
  });
};

export const SET_TOKEN_PAIR = createAsyncActionType('@depositWithdraw/SET_TOKEN_PAIR');

export const setTokenPair = (pair, destination) => dispatch => {
  if (pair.from_coin_symbol === 'HIVE') {
    return dispatch({
      type: SET_TOKEN_PAIR.SUCCESS,
      payload: pair,
    });
  }

  return dispatch({
    type: SET_TOKEN_PAIR.ACTION,
    payload: converHiveEngineCoins({
      from_coin: pair.from_coin_symbol,
      to_coin: pair.to_coin_symbol,
      destination,
    }).then(res => ({ ...pair, ...res })),
  });
};

export const RESET_TOKEN_PAIR = '@depositWithdraw/RESET_TOKEN_PAIR';

export const resetSelectPair = () => ({
  type: RESET_TOKEN_PAIR,
});

export const SET_DEPOSITE_INFO_FOR_CHAIN = createAsyncActionType(
  '@depositWithdraw/SET_DEPOSITE_INFO_FOR_CHAIN',
);

export const setDepositeInfo = (destination, pair) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => ({
  type: SET_DEPOSITE_INFO_FOR_CHAIN.ACTION,
  payload: steemConnectAPI.hiveEngineDepositWithdraw(destination, {
    ...pair,
    userName: destination,
    type: 'deposit',
    from_coin: pair.from_coin_symbol,
    to_coin: pair.to_coin_symbol,
    destination,
  }),
});

export const SET_WITHDRAW_PAIR = '@depositWithdraw/SET_WITHDRAW_PAIR';

export const setWithdrawPair = pair => ({
  type: SET_WITHDRAW_PAIR,
  payload: pair,
});

export const TOGGLE_WITHDRAW_MODAL = '@depositWithdraw/TOGGLE_WITHDRAW_MODAL';

export const toggleWithdrawModal = (isOpen, token = '') => ({
  type: TOGGLE_WITHDRAW_MODAL,
  payload: { isOpen, token },
});

export const SET_DEPOSITE_SYMBOL = '@depositWithdraw/SET_DEPOSITE_SYMBOL';

export const setDepositeSymbol = symbol => ({
  type: SET_DEPOSITE_SYMBOL,
  payload: symbol,
});
