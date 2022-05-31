import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { getUpdatesList, postAppendWaivioObject } from '../../waivioApi/ApiClient';
import { followObject, voteAppends } from '../wObjectStore/wobjActions';
import { getLastBlockNum } from '../../client/vendor/steemitHelpers';
import { subscribeMethod, subscribeTypes } from '../../common/constants/blockTypes';
import { getAuthenticatedUserName } from '../authStore/authSelectors';

export const APPEND_WAIVIO_OBJECT = createAsyncActionType('@append/APPEND_WAIVIO_OBJECT');

export const GET_OBJECT_UPDATES = createAsyncActionType('@objects/GET_OBJECT_UPDATES');

export const getUpdates = (authorPermlink, type, sort, locale) => dispatch => {
  dispatch({
    type: GET_OBJECT_UPDATES.ACTION,
    payload: {
      promise: getUpdatesList(authorPermlink, 0, { type, sort, locale }),
    },
  });
};

export const GET_MORE_OBJECT_UPDATES = createAsyncActionType('@objects/GET_MORE_OBJECT_UPDATES');

export const getMoreUpdates = (authorPermlink, skip, type, sort, locale) => dispatch => {
  dispatch({
    type: GET_MORE_OBJECT_UPDATES.ACTION,
    payload: {
      promise: getUpdatesList(authorPermlink, skip, { type, sort, locale }),
    },
  });
};

const followAndLikeAfterCreateAppend = (data, isLike, follow) => dispatch => {
  if (isLike)
    dispatch(
      voteAppends(data.author, data.permlink, data.votePower || 10000, data.field.name, true),
    );
  if (follow) dispatch(followObject(data.parentPermlink));

  dispatch({ type: APPEND_WAIVIO_OBJECT.SUCCESS });
};

export const appendObject = (postData, { follow, isLike, votePercent } = {}) => (
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
        dispatch(
          followAndLikeAfterCreateAppend(
            { ...postData, votePower: votePercent, ...res },
            isLike,
            follow,
          ),
        );

      busyAPI.instance.sendAsync(subscribeMethod, [voter, blockNumber, subscribeTypes.posts]);
      busyAPI.instance.subscribeBlock(subscribeTypes.posts, blockNumber, websocketCallback);

      return res;
    })
    .catch(() => dispatch({ type: APPEND_WAIVIO_OBJECT.ERROR }));
};
