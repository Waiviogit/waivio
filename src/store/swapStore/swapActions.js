import { message } from 'antd';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { getHiveEngineSwap } from '../../waivioApi/ApiClient';
import { compareTokensList } from './helper';
import { getSwapListFromStore, getTokenFrom, getTokenTo } from './swapSelectors';
import { getAuthenticatedUserName } from '../authStore/authSelectors';

export const GET_SWAP_LIST = createAsyncActionType('@swap/GET_SWAP_LIST');

export const getSwapList = () => (dispatch, getState) => {
  const state = getState();
  const name = getAuthenticatedUserName(state);
  const from = getTokenFrom(state);
  const toFromState = getTokenTo(state);

  return dispatch({
    type: GET_SWAP_LIST.ACTION,
    payload: getHiveEngineSwap().then(async res => {
      const fromList = await compareTokensList(name, Object.keys(res));
      const toList = await compareTokensList(name, res[from.symbol]);
      const toChildList = await compareTokensList(name, res[toList[0].symbol]);
      const to = toFromState?.symbol
        ? fromList.find(item => item.symbol === toFromState.symbol)
        : {};

      return {
        list: res,
        from: toChildList.find(item => item.symbol === from.symbol),
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
      tokenFrom: swapList[token.symbol].find(pair => pair.symbol === from.symbol),
    },
  });
};

export const SET_BOTH_TOKENS = '@swap/SET_BOTH_TOKENS';

export const setBothTokens = (symbolFrom, symbolTo) => ({
  type: SET_BOTH_TOKENS,
  payload: {
    tokenTo: { symbol: symbolTo },
    tokenFrom: { symbol: symbolFrom },
  },
});

export const SET_FROM_TOKEN = '@swap/SET_FROM_TOKEN';

export const setFromToken = token => async (dispatch, getState) => {
  const state = getState();
  const swapList = getSwapListFromStore(state);
  const name = getAuthenticatedUserName(state);
  const list = token.symbol ? await compareTokensList(name, swapList[token.symbol]) : null;

  return dispatch({
    type: SET_FROM_TOKEN,
    payload: {
      token,
      list,
    },
  });
};

export const SHOW_MODAL = '@swap/SHOW_MODAL';

export const toggleModal = (isOpen, symbol) => ({
  type: SHOW_MODAL,
  payload: { isOpen, symbol },
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
