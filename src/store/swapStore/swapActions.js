import { message } from 'antd';
import { isNil, uniq } from 'lodash';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { getHiveEngineSwap } from '../../waivioApi/ApiClient';
import { compareTokensList } from './helper';
import { getSwapListFromStore, getTokenFrom, getTokenTo } from './swapSelectors';
import { getAuthenticatedUserName } from '../authStore/authSelectors';

export const GET_SWAP_LIST = createAsyncActionType('@swap/GET_SWAP_LIST');

const swaps = ['SWAP.LTC', 'SWAP.BTC', 'SWAP.ETH'];

export const getSwapList = () => (dispatch, getState) => {
  const state = getState();
  const name = getAuthenticatedUserName(state);
  const from = getTokenFrom(state);
  const toFromState = getTokenTo(state);

  return dispatch({
    type: GET_SWAP_LIST.ACTION,
    payload: getHiveEngineSwap().then(async res => {
      const swapList = {
        ...res,
        'SWAP.LTC': [...res['SWAP.LTC'], { symbol: 'WAIV', pair: 'SWAP.LTC:WAIV' }],
        'SWAP.BTC': [...res['SWAP.BTC'], { symbol: 'WAIV', pair: 'SWAP.BTC:WAIV' }],
        'SWAP.ETH': [...res['SWAP.ETH'], { symbol: 'WAIV', pair: 'SWAP.ETH:WAIV' }],
      };
      const fromSymbolList = Object.keys(swapList);
      const toSymbolList = swapList[from.symbol]?.map(i => i.symbol);
      const toSymbolChildList = swapList[toFromState.symbol || toSymbolList[0]]?.map(i => i.symbol);
      const allSymbolList = await compareTokensList(
        name,
        uniq([...fromSymbolList, ...toSymbolList, ...toSymbolChildList]),
      );
      const fromList = allSymbolList.filter(i => fromSymbolList.includes(i.symbol));
      const toList = allSymbolList.filter(i => toSymbolList.includes(i.symbol));
      const toChildList = allSymbolList.filter(i => toSymbolChildList.includes(i.symbol));
      const to = toFromState?.symbol
        ? {
            ...res[from.symbol].find(item => item.symbol === toFromState.symbol),
            ...fromList.find(item => item.symbol === toFromState.symbol),
          }
        : {};

      return {
        list: swapList,
        from:
          to.symbol === 'WAIV' && swaps.includes(from.symbol)
            ? {
                ...allSymbolList.find(item => item.symbol === from.symbol),
                pair: `WAIV:${from.symbol}`,
              }
            : { ...to, ...toChildList.find(item => item.symbol === from.symbol) },
        to,
        toList,
        fromList,
      };
    }),
  });
};

export const SET_TO_TOKEN = '@swap/SET_TO_TOKEN';

export const setToToken = token => (dispatch, getState) => {
  const state = getState();
  const swapList = getSwapListFromStore(state);
  const from = getTokenFrom(state);

  return dispatch({
    type: SET_TO_TOKEN,
    payload: {
      token,
      tokenFrom:
        token.symbol === 'WAIV' && swaps.includes(from.symbol)
          ? { ...from, pair: `WAIV:${from.symbol}` }
          : swapList[token.symbol].find(pair => pair.symbol === from.symbol),
    },
  });
};

export const SET_BOTH_TOKENS = '@swap/SET_BOTH_TOKENS';

export const setBothTokens = (tokenFrom, tokenTo) => ({
  type: SET_BOTH_TOKENS,
  payload: {
    tokenTo,
    tokenFrom,
  },
});

export const SET_FROM_TOKEN = '@swap/SET_FROM_TOKEN';

export const setFromToken = (token, initList = null) => async (dispatch, getState) => {
  const state = getState();
  const swapList = getSwapListFromStore(state);
  const name = getAuthenticatedUserName(state);
  const list =
    token.symbol && isNil(initList) ? await compareTokensList(name, swapList[token.symbol]) : null;

  return dispatch({
    type: SET_FROM_TOKEN,
    payload: {
      token,
      list: !isNil(initList) ? initList : list,
    },
  });
};

export const SHOW_MODAL = '@swap/SHOW_MODAL';
export const SHOW_CONVERT_HBD_MODAL = '@swap/SHOW_CONVERT_HBD_MODAL';

export const toggleModal = (isOpen, symbol, to) => ({
  type: SHOW_MODAL,
  payload: { isOpen, symbol, to },
});
export const toggleConvertHbdModal = (isOpen, symbol, to) => ({
  type: SHOW_CONVERT_HBD_MODAL,
  payload: { isOpen, symbol, to },
});

export const SHOW_MODAL_IN_REBALANCE = '@swap/SHOW_MODAL_IN_REBALANCE';

export const toggleModalInRebalance = (isOpen, bdPair) => ({
  type: SHOW_MODAL_IN_REBALANCE,
  payload: { isOpen, bdPair },
});

export const RESET_MODAL_DATA = '@swap/RESET_MODAL_DATA';

export const resetModalData = () => ({
  type: RESET_MODAL_DATA,
});

export const CHANGED_TOKENS = createAsyncActionType('@swap/CHANGED_TOKENS');

export const changetTokens = token => async (dispatch, getState) => {
  const state = getState();
  const swapList = getSwapListFromStore(state);
  const name = getAuthenticatedUserName(state);

  dispatch({ type: CHANGED_TOKENS.START });

  try {
    const list = token.symbol ? await compareTokensList(name, swapList[token.symbol]) : null;

    return dispatch({
      type: CHANGED_TOKENS.SUCCESS,
      list,
    });
  } catch (e) {
    message.error('Something went wrong!');

    return dispatch({
      type: CHANGED_TOKENS.ERROR,
    });
  }
};
