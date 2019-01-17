import { createAsyncActionType } from '../helpers/stateHelpers';
import { postAppendWaivioObject } from '../../waivioApi/ApiClient';
import { voteObject } from './wobjActions';

export const APPEND_WAIVIO_OBJECT = createAsyncActionType('@editor/APPEND_WAIVIO_OBJECT');

export const appendObject = postData => dispatch =>
  dispatch({
    type: APPEND_WAIVIO_OBJECT.ACTION,
    payload: {
      promise: postAppendWaivioObject(postData).then(res => {
        dispatch(voteObject(res.author, res.permlink));
        return res;
      }),
    },
  });
