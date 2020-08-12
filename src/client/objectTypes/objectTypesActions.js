import { createAsyncActionType } from '../helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { getLocale } from '../reducers';

export const GET_OBJECT_TYPES = createAsyncActionType('@objectTypes/GET_OBJECT_TYPES');

export const getObjectTypes = (limit = 100, skip = 0, wobjectsCount = 0) => (
  dispatch,
  getState,
) => {
  const locale = getLocale(getState());
  dispatch({
    type: GET_OBJECT_TYPES.ACTION,
    payload: ApiClient.getObjectTypes(limit, skip, wobjectsCount, locale),
  });
};
