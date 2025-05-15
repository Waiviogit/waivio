import { get, isEmpty } from 'lodash';
import { message } from 'antd';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import {
  getAuthorityFields,
  getChangedField,
  getUpdatesList,
  postAppendWaivioObject,
} from '../../waivioApi/ApiClient';
import { followObject, GET_CHANGED_WOBJECT_UPDATE } from '../wObjectStore/wobjActions';
import { subscribeTypes } from '../../common/constants/blockTypes';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getIsAuthenticated,
  isGuestUser,
} from '../authStore/authSelectors';

import { getLocale, getVotePercent } from '../settingsStore/settingsSelectors';
import { getAppendList, getAuthorityList } from './appendSelectors';
import {
  SET_AFFILIATE_OBJECTS,
  setAffiliateObjects,
} from '../affiliateCodes/affiliateCodesActions';
import { getObjectName } from '../../common/helpers/wObjectHelper';

export const APPEND_WAIVIO_OBJECT = createAsyncActionType('@append/APPEND_WAIVIO_OBJECT');

export const GET_OBJECT_UPDATES = createAsyncActionType('@append/GET_OBJECT_UPDATES');

export const UPDATE_COUNTER = '@append/UPDATE_COUNTER';

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

export const updateCounter = post => dispatch => {
  dispatch({
    type: UPDATE_COUNTER,
    payload: {
      post,
    },
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
  appendObj,
  isUpdatesPage,
  id,
) => async (dispatch, getState, { busyAPI }) => {
  const state = getState();
  const locale = getLocale(state);
  const voter = getAuthenticatedUserName(state);
  const isGuest = isGuestUser(state);
  // const updatePosts = ['pin'].includes(fieldName);
  const fieldType = isNew ? fieldName : type;

  const subscribeCallback = () =>
    dispatch({
      type: GET_CHANGED_WOBJECT_FIELD.ACTION,
      payload: {
        promise: getChangedField(authorPermlink, fieldName, author, permlink, locale, voter)
          .then(res => {
            dispatch({
              type: GET_CHANGED_WOBJECT_UPDATE.SUCCESS,
              payload: res,
              meta: { isNew },
            });

            return res;
          })
          .catch(() => {
            // message.error('An error has occurred, please reload the page');
            dispatch({
              type: GET_CHANGED_WOBJECT_FIELD.ERROR,
            });
          }),
      },
      meta: { isNew },
    });
  // const updatePostCallback = () => {
  //   dispatch(
  //     getObjectPosts({
  //       username: authorPermlink,
  //       object: authorPermlink,
  //     }),
  //   ).then(() => subscribeCallback());
  //
  //   if (typeof window !== 'undefined') window.scrollTo(0, 0);
  // };

  if (isGuest) {
    setTimeout(() => {
      if (isNew) dispatch(getUpdates(authorPermlink, fieldType, 'createdAt', locale));
      subscribeCallback();
    }, 10000);
  } else {
    busyAPI.instance.sendAsync(subscribeTypes.subscribeTransactionId, [voter, id]);
    busyAPI.instance.subscribe((datad, j) => {
      if (j?.success && j?.permlink === id && j.parser === 'main') {
        if (isNew) dispatch(getUpdates(authorPermlink, fieldType, 'createdAt', locale));
        subscribeCallback();
      }
    });
  }
};

export const VOTE_APPEND = createAsyncActionType('@append/VOTE_APPEND');

export const voteAppends = (
  author,
  permlink,
  weight = 10000,
  name = '',
  isNew = false,
  type,
  appendObj,
  isUpdatesPage,
  isObjectPage,
) => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const fields = getAppendList(state);
  const isGuest = isGuestUser(state);
  const post = fields?.find(field => field.permlink === permlink) || null;
  const wobj = get(state, ['object', 'wobject'], {});
  const voter = getAuthenticatedUserName(state);
  const fieldName = name || post.name;
  const hideMessageFields = ['authority', 'pin'].includes(fieldName);

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
    .then(res => {
      if (!hideMessageFields) {
        message.success('Please wait, we are processing your update');
      }

      isObjectPage &&
        dispatch(
          getChangedWobjectField(
            wobj.author_permlink,
            fieldName,
            author,
            permlink,
            isNew,
            type,
            appendObj,
            isUpdatesPage,
            res.id || res?.result?.id,
          ),
        );
    })
    .catch(() =>
      steemConnectAPI.appendVote(voter, isGuest, author, permlink, weight).then(res => {
        if (!hideMessageFields) {
          message.success('Please wait, we are processing your update');
        }
        dispatch(
          getChangedWobjectField(
            wobj.author_permlink,
            fieldName,
            author,
            permlink,
            isNew,
            type,
            appendObj,
            isUpdatesPage,
            res.id || res.result.id,
          ),
        );
      }),
    );
};
export const AUTHORITY_VOTE_APPEND = createAsyncActionType('@append/AUTHORITY_VOTE_APPEND');

export const authorityVoteAppend = (author, authorPermlink, permlink, weight, isObjectPage) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const state = getState();
  const voter = getAuthenticatedUserName(state);
  const isGuest = isGuestUser(state);

  if (!getIsAuthenticated(state)) return null;

  dispatch({
    type: AUTHORITY_VOTE_APPEND.START,
    payload: {
      permlink,
    },
  });

  return steemConnectAPI.appendVote(voter, isGuest, author, permlink, weight).then(res => {
    if (isObjectPage)
      dispatch(
        getChangedWobjectField(
          authorPermlink,
          'authority',
          author,
          permlink,
          '',
          '',
          '',
          '',
          res.result.id,
        ),
      );
  });
};
export const AFFILIATE_CODE_VOTE_APPEND = createAsyncActionType(
  '@append/AFFILIATE_CODE_VOTE_APPEND',
);

export const affiliateCodeVoteAppend = (
  author,
  authorPermlink,
  permlink,
  weight,
  userName,
  host,
) => (dispatch, getState, { steemConnectAPI, busyAPI }) => {
  const state = getState();
  const voter = getAuthenticatedUserName(state);
  const isGuest = isGuestUser(state);

  if (!getIsAuthenticated(state)) return null;

  dispatch({
    type: AFFILIATE_CODE_VOTE_APPEND.START,
    payload: {
      permlink,
    },
  });

  dispatch({
    type: SET_AFFILIATE_OBJECTS.START,
    payload: {
      authorPermlink,
    },
  });

  return steemConnectAPI.appendVote(voter, isGuest, author, permlink, weight).then(res => {
    busyAPI.instance.sendAsync(subscribeTypes.subscribeTransactionId, [
      voter,
      res?.result?.id || res?.id,
    ]);
    busyAPI.instance.subscribe((response, mess) => {
      if (mess?.success && mess?.permlink === res.result.id) {
        dispatch(setAffiliateObjects(userName, host));
      }
    });
  });
};

export const setAuthorityForObject = (wobject, match, adminAuthority = 'administrative') => (
  dispatch,
  getState,
) => {
  const isObjectPage = match.params.name === wobject.author_permlink;
  const user = getAuthenticatedUser(getState());
  const userUpVotePower = getVotePercent(getState());
  const language = getLocale(getState());
  const authorityList = getAuthorityList(getState());
  const activeHeart = authorityList[wobject.author_permlink];
  const downVotePower = 1;
  const getWobjectData = () => ({
    author: user.name,
    parentAuthor: wobject.author,
    parentPermlink: wobject.author_permlink,
    body: `@${user.name} added authority: administrative`,
    title: '',
    lastUpdated: Date.now(),
    wobjectName: getObjectName(wobject),
    votePower: userUpVotePower,
    field: { body: adminAuthority, locale: language, name: 'authority' },
    permlink: `${user?.name}-${Math.random()
      .toString(36)
      .substring(2)}`,
  });

  if (activeHeart) {
    dispatch(removeObjectFromAuthority(wobject.author_permlink));
  } else {
    dispatch(setObjectinAuthority(wobject.author_permlink));
  }

  getAuthorityFields(wobject.author_permlink).then(postInformation => {
    if (
      isEmpty(postInformation) ||
      isEmpty(postInformation.filter(p => p.creator === user.name && p.body === adminAuthority))
    ) {
      const data = getWobjectData();

      dispatch(appendObject(data, { votePercent: userUpVotePower, isLike: true, isObjectPage }));
    } else {
      const authority = postInformation.find(
        post => post.creator === user.name && post.body === adminAuthority,
      );

      dispatch(
        authorityVoteAppend(
          authority?.author,
          wobject.author_permlink,
          authority?.permlink,
          activeHeart ? downVotePower : userUpVotePower,
          isObjectPage,
        ),
      );
    }
  });
};

export const SET_OBJECT_IN_AUTHORITY = '@append/SET_OBJECT_IN_AUTHORITY';
export const setObjectinAuthority = permlink => ({
  type: SET_OBJECT_IN_AUTHORITY,
  permlink,
});

export const REMOVE_OBJECT_FROM_AUTHORITY = '@append/REMOVE_OBJECT_FROM_AUTHORITY';
export const removeObjectFromAuthority = permlink => ({
  type: REMOVE_OBJECT_FROM_AUTHORITY,
  permlink,
});

const followAndLikeAfterCreateAppend = (
  data,
  isLike,
  follow,
  isObjectPage,
  isUpdatesPage,
  appendObj,
) => (dispatch, getState) => {
  const type = data.field.name === 'listItem' ? data.field.type : null;
  const state = getState();

  if (isLike) {
    if (data.field.name === 'authority') {
      dispatch(
        authorityVoteAppend(
          data.author,
          data.parentPermlink,
          data.permlink,
          data.votePower || 10000,
          isObjectPage,
        ),
      );
    } else {
      dispatch(
        voteAppends(
          data.author,
          data.permlink,
          data.votePower || 10000,
          data.field.name,
          true,
          type,
          appendObj,
          isUpdatesPage,
          isObjectPage,
        ),
      );
    }
  } else {
    const fields = getAppendList(state);
    const post = fields.find(field => field.permlink === data.permlink) || null;
    const wobj = get(state, ['object', 'wobject'], {});
    const fieldName = data.field.name || post.name;

    dispatch(
      getChangedWobjectField(
        wobj.author_permlink,
        fieldName,
        data.author,
        data.permlink,
        true,
        type,
        appendObj,
      ),
    );
  }
  if (follow) dispatch(followObject(data.parentPermlink));

  dispatch({ type: APPEND_WAIVIO_OBJECT.SUCCESS });
};

export const appendObject = (
  postData,
  { follow, isLike, votePercent, isObjectPage, isUpdatesPage, host } = {},
) => (dispatch, getState, { busyAPI }) => {
  dispatch({
    type: APPEND_WAIVIO_OBJECT.START,
  });
  const state = getState();
  const userName = getAuthenticatedUserName(state);

  return postAppendWaivioObject({ ...postData, votePower: undefined, isLike: undefined })
    .then(async res => {
      const voter = getAuthenticatedUserName(getState());
      const websocketCallback = async () => {
        await dispatch(
          followAndLikeAfterCreateAppend(
            { ...postData, votePower: votePercent, ...res },
            isLike,
            follow,
            isObjectPage,
            isUpdatesPage,
            true,
          ),
        );

        if (postData.field.name === 'affiliateCode') {
          dispatch(setAffiliateObjects(userName, host));
        }
      };

      busyAPI.instance.sendAsync(subscribeTypes.subscribeTransactionId, [voter, res.transactionId]);
      busyAPI.instance.subscribe((datad, j) => {
        if (j?.success && j?.permlink === res.transactionId) {
          websocketCallback();
        }
      });
      dispatch({ type: APPEND_WAIVIO_OBJECT.SUCCESS });

      return res;
    })
    .catch(() => dispatch({ type: APPEND_WAIVIO_OBJECT.ERROR }));
};
