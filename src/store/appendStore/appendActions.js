import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { postAppendWaivioObject } from '../../waivioApi/ApiClient';
import { followObject, voteAppends } from '../wObjectStore/wobjActions';
import { getLastBlockNum } from '../../client/vendor/steemitHelpers';
import { subscribeMethod, subscribeTypes } from '../../common/constants/blockTypes';
import { getAuthenticatedUserName } from '../authStore/authSelectors';

export const APPEND_WAIVIO_OBJECT = createAsyncActionType('@append/APPEND_WAIVIO_OBJECT');

const followAndLikeAfterCreateAppend = (data, isLike, follow) => dispatch => {
  if (isLike)
    dispatch(
      voteAppends(data.author, data.permlink, data.votePower || 10000, data.field.name, true),
    );
  if (follow) dispatch(followObject(data.parentPermlink));

  dispatch({ type: APPEND_WAIVIO_OBJECT.SUCCESS });
};

export const appendObject = (postData, { follow, isLike } = {}) => (
  dispatch,
  getState,
  { busyAPI },
) => {
  dispatch({
    type: APPEND_WAIVIO_OBJECT.START,
  });

  return postAppendWaivioObject(postData)
    .then(async res => {
      const blockNumber = await getLastBlockNum();
      const voter = getAuthenticatedUserName(getState());
      const websocketCallback = () =>
        dispatch(followAndLikeAfterCreateAppend({ ...postData, ...res }, isLike, follow));

      busyAPI.instance.sendAsync(subscribeMethod, [voter, blockNumber, subscribeTypes.posts]);
      busyAPI.instance.subscribeBlock(subscribeTypes.posts, blockNumber, websocketCallback);

      return res;
    })
    .catch(() => dispatch({ type: APPEND_WAIVIO_OBJECT.ERROR }));
};
