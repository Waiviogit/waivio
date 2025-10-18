import { isEmpty } from 'lodash';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { HIVE_ENGINE_DEFAULT_SWAP_LIST } from '../../common/constants/swapList';

export const GET_RATES = createAsyncActionType('rates/GET_RATES');
export const GET_GLOBAL_PROPERTIES = 'rates/GET_GLOBAL_PROPERTIES';

export const getSwapEnginRates = () => dispatch =>
  dispatch({
    type: GET_RATES.ACTION,
    payload: ApiClient.getEnginePoolRate(HIVE_ENGINE_DEFAULT_SWAP_LIST)
      .then(res => {
        if (isEmpty(res)) Promise.reject(res);

        res.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.symbol]: curr.USD,
          }),
          {},
        );
      })
      .catch(e => {
        console.error(e);
      }),
  });

export const getMainCurrencyRate = rates => dispatch =>
  dispatch({
    type: GET_RATES.SUCCESS,
    payload: {
      HBD: rates?.current?.hive_dollar?.usd,
      HIVE: rates?.current?.hive?.usd,
    },
  });

export const getAllRates = rates => dispatch => {
  dispatch({
    type: GET_RATES.SUCCESS,
    payload:
      !isEmpty(rates) &&
      rates?.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.symbol]: curr.lastPrice,
        }),
        {},
      ),
  });
};

export const setRate = (symbol, rate) => dispatch => {
  dispatch({
    type: GET_RATES.SUCCESS,
    payload: { [symbol]: rate },
  });
};
