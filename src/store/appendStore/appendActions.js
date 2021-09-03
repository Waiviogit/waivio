import { createAsyncActionType } from '../../client/helpers/stateHelpers';
import { postAppendWaivioObject } from '../../waivioApi/ApiClient';
import { followObject, voteAppends } from '../wObjectStore/wobjActions';

export const APPEND_WAIVIO_OBJECT = createAsyncActionType('@append/APPEND_WAIVIO_OBJECT');

export const appendObject = (postData, type, { follow, isLike } = {}) => dispatch => {
  dispatch({
    type: APPEND_WAIVIO_OBJECT.START,
  });

  return postAppendWaivioObject(postData)
    .then(res => {
      if (!res.message && isLike) {
        dispatch(
          voteAppends(res.author, res.permlink, postData.votePower, postData.field.name, true),
        );
        if (follow) dispatch(followObject(postData.parentPermlink));
      }
      dispatch({ type: APPEND_WAIVIO_OBJECT.SUCCESS });

      return res;
    })
    .catch(() => dispatch({ type: APPEND_WAIVIO_OBJECT.ERROR }));
};
