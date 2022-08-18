import { get } from 'lodash';
import { message } from 'antd';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { getChangedField, getUpdatesList, postAppendWaivioObject } from '../../waivioApi/ApiClient';
import { followObject, GET_CHANGED_WOBJECT_UPDATE } from '../wObjectStore/wobjActions';
import { getLastBlockNum } from '../../client/vendor/steemitHelpers';
import { subscribeMethod, subscribeTypes } from '../../common/constants/blockTypes';
import { getAuthenticatedUserName, getIsAuthenticated } from '../authStore/authSelectors';

import { getLocale } from '../settingsStore/settingsSelectors';
import { getAppendList } from './appendSelectors';

export const APPEND_WAIVIO_OBJECT = createAsyncActionType('@append/APPEND_WAIVIO_OBJECT');

export const GET_OBJECT_UPDATES = createAsyncActionType('@append/GET_OBJECT_UPDATES');

export const getUpdates = (authorPermlink, type, sort, locale) => dispatch => {
  dispatch({
    type: GET_OBJECT_UPDATES.ACTION,
    payload: {
      promise: getUpdatesList(authorPermlink, 0, { type, sort, locale }),
    },
  });
};

export const RESET_UPDATES_LIST = '@append/RESET_UPDATES_LIST';

export const resetUpdateList = () => dispatch => {
  dispatch({
    type: RESET_UPDATES_LIST,
  });
};

export const GET_MORE_OBJECT_UPDATES = createAsyncActionType('@append/GET_MORE_OBJECT_UPDATES');

export const getMoreUpdates = (authorPermlink, skip, type, sort, locale) => dispatch => {
  dispatch({
    type: GET_MORE_OBJECT_UPDATES.ACTION,
    payload: {
      promise: getUpdatesList(authorPermlink, skip, { type, sort, locale }),
    },
  });
};

export const GET_CHANGED_WOBJECT_FIELD = createAsyncActionType('@append/GET_CHANGED_WOBJECT_FIELD');

export const getChangedWobjectField = (
  authorPermlink,
  fieldName,
  author,
  permlink,
  isNew = false,
  type = '',
) => async (dispatch, getState, { busyAPI }) => {
  const state = getState();
  const locale = getLocale(state);
  const voter = getAuthenticatedUserName(state);

  const subscribeCallback = () =>
    dispatch({
      type: GET_CHANGED_WOBJECT_FIELD.ACTION,
      payload: {
        promise: getChangedField(authorPermlink, fieldName, author, permlink, locale).then(res => {
          dispatch({
            type: GET_CHANGED_WOBJECT_UPDATE.SUCCESS,
            payload: res,
            meta: { isNew },
          });
          if (isNew) dispatch(getUpdates(authorPermlink, type || fieldName, 'createdAt', locale));

          return res;
        }),
      },
      meta: { isNew },
    });

  const blockNumber = await getLastBlockNum();

  if (!blockNumber) throw new Error('Something went wrong');
  busyAPI.instance.sendAsync(subscribeMethod, [voter, blockNumber, subscribeTypes.votes]);
  busyAPI.instance.subscribeBlock(subscribeTypes.votes, blockNumber, subscribeCallback);
};

export const VOTE_APPEND = createAsyncActionType('@append/VOTE_APPEND');

export const voteAppends = (author, permlink, weight = 10000, name = '', isNew = false, type) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const state = getState();
  const fields = getAppendList(state);
  const post = fields.find(field => field.permlink === permlink) || null;
  const wobj = get(state, ['object', 'wobject'], {});
  const voter = getAuthenticatedUserName(state);
  const fieldName = name || post.name;

  if (!getIsAuthenticated(state)) return null;

  dispatch({
    type: VOTE_APPEND.START,
    payload: {
      post,
      permlink,
    },
  });

  return steemConnectAPI
    .vote(voter, author, permlink, weight)
    .then(() => {
      dispatch(
        getChangedWobjectField(wobj.author_permlink, fieldName, author, permlink, isNew, type),
      );
    })
    .catch(e => {
      message.error(e.error_description);

      return dispatch({
        type: VOTE_APPEND.ERROR,
        payload: {
          post,
          permlink,
        },
      });
    });
};

const followAndLikeAfterCreateAppend = (data, isLike, follow) => dispatch => {
  const type = data.field.name === 'listItem' ? data.field.type : null;

  if (isLike)
    dispatch(
      voteAppends(data.author, data.permlink, data.votePower || 10000, data.field.name, true, type),
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
      const websocketCallback = async () => {
        await dispatch(
          followAndLikeAfterCreateAppend(
            { ...postData, votePower: votePercent, ...res },
            isLike,
            follow,
          ),
        );
      };

      busyAPI.instance.sendAsync(subscribeMethod, [voter, blockNumber, subscribeTypes.posts]);
      busyAPI.instance.subscribeBlock(subscribeTypes.posts, blockNumber, websocketCallback);
      dispatch({ type: APPEND_WAIVIO_OBJECT.SUCCESS });

      return res;
    })
    .catch(() => dispatch({ type: APPEND_WAIVIO_OBJECT.ERROR }));
};
