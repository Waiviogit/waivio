import { createAsyncActionType } from '../helpers/stateHelpers';
import { postAppendWaivioObject } from '../../waivioApi/ApiClient';
import { followObject, voteObject } from './wobjActions';
import { getVotePercent } from '../reducers';

export const APPEND_WAIVIO_OBJECT = createAsyncActionType('@append/APPEND_WAIVIO_OBJECT');

export const appendObject = (postData, { follow, votePower } = { follow: false }) => (
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
            if (votePower !== null) {
              dispatch(voteObject(res.author, res.permlink, votePower || getVotePercent(state)));
            }
            if (follow) {
              dispatch(followObject(postData.parentPermlink));
            }

            return { ...res, ...postData.field, creator: postData.author, weight: 1 };
          }
          return res;
        })
        .catch(e => e),
    },
  });
};
