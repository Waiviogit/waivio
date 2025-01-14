import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { getLocale } from '../settingsStore/settingsSelectors';

export const GET_OBJECT_TYPES = createAsyncActionType('@objectTypes/GET_OBJECT_TYPES');

export const getObjectTypes = (limit = 100, skip = 0, wobjectsCount = 0) => (
  dispatch,
  getState,
) => {
  const locale = getLocale(getState());

  return dispatch({
    type: GET_OBJECT_TYPES.ACTION,
    payload: ApiClient.getObjectTypes(limit, skip, wobjectsCount, locale),
  });
};

export const GET_OBJECT_TYPES_BY_DEPARTMENT = createAsyncActionType(
  '@objectTypes/GET_OBJECT_TYPES_BY_DEPARTMENT',
);

export const getObjectsByDepartment = (
  userName,
  departments,
  schema,
  host,
  skip,
  wobjects_count,
) => dispatch =>
  dispatch({
    type: GET_OBJECT_TYPES_BY_DEPARTMENT.ACTION,
    payload: ApiClient.getObjectsByDepartment(
      userName,
      departments,
      schema,
      host,
      skip,
      wobjects_count,
    ),
  });

export const GET_MORE_OBJECT_TYPES_BY_DEPARTMENT = createAsyncActionType(
  '@objectTypes/GET_MORE_OBJECT_TYPES_BY_DEPARTMENT',
);

export const getMoreObjectsByDepartment = (
  userName,
  departments,
  schema,
  host,
  skip,
  wobjects_count,
) => dispatch =>
  dispatch({
    type: GET_MORE_OBJECT_TYPES_BY_DEPARTMENT.ACTION,
    payload: ApiClient.getObjectsByDepartment(
      userName,
      departments,
      schema,
      host,
      skip,
      wobjects_count,
    ),
  });

export const RESET_OBJECT_TYPES_BY_DEPARTMENT = '@objectTypes/RESET_OBJECT_TYPES_BY_DEPARTMENT';

export const resetObjectsByDepartment = () => dispatch =>
  dispatch({
    type: RESET_OBJECT_TYPES_BY_DEPARTMENT,
  });
