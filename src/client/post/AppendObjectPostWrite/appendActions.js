import { createAsyncActionType } from '../../helpers/stateHelpers';
import { postAppendWaivioObject } from '../../../waivioApi/ApiClient';

export const APPEND_WAIVIO_OBJECT = createAsyncActionType('@editor/APPEND_WAIVIO_OBJECT');

export const appendObject = postData => dispatch =>
  dispatch({
    type: APPEND_WAIVIO_OBJECT.ACTION,
    payload: {
      promise: postAppendWaivioObject(postData),
    },
  });
