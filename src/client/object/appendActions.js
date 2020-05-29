import { createAsyncActionType } from '../helpers/stateHelpers';
import { postAppendWaivioObject } from '../../waivioApi/ApiClient';
import { followObject, voteObject } from './wobjActions';
import { getVotePercent } from '../reducers';

export const APPEND_WAIVIO_OBJECT = createAsyncActionType('@append/APPEND_WAIVIO_OBJECT');

export const appendObject = (postData, { follow, isLike = true } = {}) => (
  dispatch,
  getState,
) => {
  const state = getState();
  return dispatch({
    type: APPEND_WAIVIO_OBJECT.ACTION,
    payload: {
      promise: postAppendWaivioObject(postData)
        .then(res => {
          if (!res.message) {
            if (postData.votePower !== null && isLike) {
              dispatch(
                voteObject(res.author, res.permlink, postData.votePower || getVotePercent(state)),
              );
            }

            if (follow) {
              dispatch(followObject(postData.parentPermlink));
            }

            return {
              ...res,
              ...postData.field,
              fullBody: postData.body,
              creator: postData.author,
              weight: 1,
            };
          }
          return res;
        })
        .catch(e => e),
    },
  });
};
