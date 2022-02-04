import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { getHiveEngineSwap } from '../../waivioApi/ApiClient';
import { compareTokensList } from './helper';
import { getSwapListFromStore } from './swapSelectors';
import { getAuthenticatedUserName } from '../authStore/authSelectors';

export const GET_SWAP_LIST = createAsyncActionType('@swap/GET_SWAP_LIST');

export const getSwapList = () => (dispatch, getState) => {
  const state = getState();
  const name = getAuthenticatedUserName(state);

  return dispatch({
    type: GET_SWAP_LIST.ACTION,
    payload: getHiveEngineSwap().then(async res => {
      const from = await compareTokensList(name, Object.keys(res));
      const to = await compareTokensList(name, res.WAIV);

      return {
        list: res,
        to,
        from,
      };
    }),
  });
};

export const SET_TO_TOKEN = '@swap/SET_TO_TOKEN';

export const setToToken = token => ({
  type: SET_TO_TOKEN,
  payload: {
    token,
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

export const toggleModal = isOpen => ({
  type: SHOW_MODAL,
  payload: isOpen,
});

export const RESET_MODAL_DATA = '@swap/RESET_MODAL_DATA';

export const resetModalData = () => ({
  type: RESET_MODAL_DATA,
});

export const CHANGED_TOKENS = '@swap/CHANGED_TOKENS';

export const changetTokens = token => async (dispatch, getState) => {
  const state = getState();
  const swapList = getSwapListFromStore(state);
  const name = getAuthenticatedUserName(state);
  const list = token.symbol ? await compareTokensList(name, swapList[token.symbol]) : null;

  return dispatch({
    type: CHANGED_TOKENS,
    list,
  });
};
