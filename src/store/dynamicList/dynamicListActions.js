import { message } from 'antd';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { getAuthenticatedUserName, isGuestUser } from '../authStore/authSelectors';
import { changeCounterFollow } from '../usersStore/usersActions';
import { unfollowUser, followUser } from '../userStore/userActions';
import { unfollowWobject, followWobject } from '../wObjectStore/wobjActions';
import { getDynamicList } from './dynamicListSelectors';
import { getGroupObjectUserList } from '../../waivioApi/ApiClient';

export const GET_OBJECT_LIST = createAsyncActionType('@dynamicList/GET_OBJECT_LIST');

export const getObjectsList = (fetcher, limit, skip, type, isOnlyHashtags) => (
  dispatch,
  getState,
) => {
  const authName = getAuthenticatedUserName(getState());

  dispatch({
    type: GET_OBJECT_LIST.START,
  });

  return fetcher(skip, authName, isOnlyHashtags).then(res =>
    dispatch({
      type: GET_OBJECT_LIST.SUCCESS,
      payload: res,
      meta: type,
    }),
  );
};
export const GET_OBJECT_MORE_LIST = createAsyncActionType('@dynamicList/GET_OBJECT_MORE_LIST');

export const getObjectsMoreList = (fetcher, limit, skip, type, isOnlyHashtags) => (
  dispatch,
  getState,
) => {
  const authName = getAuthenticatedUserName(getState());

  dispatch({
    type: GET_OBJECT_MORE_LIST.START,
  });

  return fetcher(skip, authName, isOnlyHashtags).then(res =>
    dispatch({
      type: GET_OBJECT_MORE_LIST.SUCCESS,
      payload: res,
      meta: type,
    }),
  );
};
export const UNFOLLOW_OBLECT_IN_LIST = createAsyncActionType(
  '@dynamicList/UNFOLLOW_OBLECT_IN_LIST',
);

export const unfollowObjectInList = (permlink, username, type) => (dispatch, getState) => {
  const state = getState();
  const isGuest = isGuestUser(state);

  const { list } = getDynamicList(state, type);
  const matchWobjIndex = list.findIndex(wobj => wobj.author_permlink === permlink);
  const wobjectsArray = [...list];

  wobjectsArray.splice(matchWobjIndex, 1, {
    ...wobjectsArray[matchWobjIndex],
    pending: true,
  });

  dispatch({
    type: UNFOLLOW_OBLECT_IN_LIST.START,
    payload: wobjectsArray,
    meta: type,
  });

  dispatch(unfollowWobject(permlink)).then(res => {
    if ((res.value.ok && isGuest) || !res.message) {
      wobjectsArray.splice(matchWobjIndex, 1, {
        ...wobjectsArray[matchWobjIndex],
        youFollows: false,
        pending: false,
      });
    } else {
      message.error(res.value.statusText);
      wobjectsArray.splice(matchWobjIndex, 1, {
        ...wobjectsArray[matchWobjIndex],
        pending: false,
      });
    }
    dispatch(changeCounterFollow(username, 'object'));

    dispatch({
      type: UNFOLLOW_OBLECT_IN_LIST.SUCCESS,
      payload: wobjectsArray,
      meta: type,
    });
  });
};

export const FOLLOW_OBLECT_IN_LIST = createAsyncActionType('@dynamicList/FOLLOW_OBLECT_IN_LIST');

export const followObjectInList = (permlink, username, type) => (dispatch, getState) => {
  const state = getState();
  const isGuest = isGuestUser(state);
  const { list } = getDynamicList(state, type);

  const matchWobjIndex = list.findIndex(wobj => wobj.author_permlink === permlink);
  const wobjectsArray = [...list];

  wobjectsArray.splice(matchWobjIndex, 1, {
    ...wobjectsArray[matchWobjIndex],
    pending: true,
  });

  dispatch({
    type: FOLLOW_OBLECT_IN_LIST.START,
    payload: wobjectsArray,
    meta: type,
  });

  dispatch(followWobject(permlink)).then(res => {
    if ((res.value.ok && isGuest) || !res.message) {
      wobjectsArray.splice(matchWobjIndex, 1, {
        ...wobjectsArray[matchWobjIndex],
        youFollows: true,
        pending: false,
      });
    } else {
      message.error(res.value.statusText);
      wobjectsArray.splice(matchWobjIndex, 1, {
        ...wobjectsArray[matchWobjIndex],
        pending: false,
      });
    }
    dispatch(changeCounterFollow(username, 'object'));

    dispatch({
      type: FOLLOW_OBLECT_IN_LIST.SUCCESS,
      payload: wobjectsArray,
      meta: type,
    });
  });
};

export const GET_USERS_LIST = createAsyncActionType('@dynamicList/GET_USERS_LIST');
export const UPDATE_USERS_LIST = '@dynamicList/UPDATE_USERS_LIST';

export const setUsersList = (name, authUser, limit, cursor) => dispatch => {
  dispatch({
    type: GET_USERS_LIST.START,
  });

  return getGroupObjectUserList(name, authUser, limit, cursor).then(res =>
    dispatch({
      type: GET_USERS_LIST.SUCCESS,
      payload: { users: res.result, ...res },
      meta: name,
    }),
  );
};
export const updateUsersList = (user, name) => dispatch => {
  dispatch({
    type: UPDATE_USERS_LIST,
    payload: user,
    meta: name,
  });
};
export const setMoreUsersList = (name, authUser, limit, cursor) => dispatch => {
  dispatch({
    type: GET_USERS_LIST_MORE.START,
  });

  return getGroupObjectUserList(name, authUser, limit, cursor).then(res =>
    dispatch({
      type: GET_USERS_LIST_MORE.SUCCESS,
      payload: { users: res.result, ...res },
      meta: name,
    }),
  );
};

export const getUsersList = (fetcher, limit, skip, type, usersList, sorting) => (
  dispatch,
  getState,
) => {
  const authName = getAuthenticatedUserName(getState());

  dispatch({
    type: GET_USERS_LIST.START,
  });

  return fetcher(usersList, authName, sorting).then(res =>
    dispatch({
      type: GET_USERS_LIST.SUCCESS,
      payload: res,
      meta: type,
      sorting,
    }),
  );
};
export const GET_USERS_LIST_MORE = createAsyncActionType('@dynamicList/GET_USERS_LIST_MORE');

export const getUsersMoreList = (fetcher, limit, skip, type, usersList, sorting) => (
  dispatch,
  getState,
) => {
  const authName = getAuthenticatedUserName(getState());

  dispatch({
    type: GET_USERS_LIST_MORE.START,
  });

  return fetcher(usersList, authName, sorting, skip).then(res =>
    dispatch({
      type: GET_USERS_LIST_MORE.SUCCESS,
      payload: res,
      meta: type,
      sorting,
    }),
  );
};

export const UNFOLLOW_USER_IN_LIST = createAsyncActionType('@dynamicList/UNFOLLOW_USER_IN_LIST');

export const unfollowUserInList = (permlink, username, type) => (dispatch, getState) => {
  const state = getState();
  const isGuest = isGuestUser(state);

  const { list } = getDynamicList(state, type);
  const matchWobjIndex = list.findIndex(wobj => wobj.name === permlink);
  const usersArray = [...list];

  usersArray.splice(matchWobjIndex, 1, {
    ...usersArray[matchWobjIndex],
    pending: true,
  });

  dispatch({
    type: UNFOLLOW_USER_IN_LIST.START,
    payload: usersArray,
    meta: type,
  });

  dispatch(unfollowUser(permlink)).then(res => {
    if ((res.value.ok && isGuest) || !res.message) {
      usersArray.splice(matchWobjIndex, 1, {
        ...usersArray[matchWobjIndex],
        youFollows: false,
        pending: false,
      });
    } else {
      message.error(res.value.statusText);
      usersArray.splice(matchWobjIndex, 1, {
        ...usersArray[matchWobjIndex],
        pending: false,
      });
    }
    dispatch(changeCounterFollow(username, 'user'));

    dispatch({
      type: UNFOLLOW_USER_IN_LIST.SUCCESS,
      payload: usersArray,
      meta: type,
    });
  });
};

export const FOLLOW_USER_IN_LIST = createAsyncActionType('@dynamicList/FOLLOW_USER_IN_LIST');

export const followUserInList = (permlink, username, type) => (dispatch, getState) => {
  const state = getState();
  const isGuest = isGuestUser(state);
  const { list } = getDynamicList(state, type);
  const matchWobjIndex = list.findIndex(wobj => wobj.name === permlink);
  const usersArray = [...list];

  usersArray.splice(matchWobjIndex, 1, {
    ...usersArray[matchWobjIndex],
    pending: true,
  });

  dispatch({
    type: FOLLOW_USER_IN_LIST.START,
    payload: usersArray,
    meta: type,
  });

  dispatch(followUser(permlink)).then(res => {
    if ((res.value.ok && isGuest) || !res.message) {
      usersArray.splice(matchWobjIndex, 1, {
        ...usersArray[matchWobjIndex],
        youFollows: true,
        pending: false,
      });
    } else {
      message.error(res.value.statusText);
      usersArray.splice(matchWobjIndex, 1, {
        ...usersArray[matchWobjIndex],
        pending: false,
      });
    }
    dispatch(changeCounterFollow(username, 'user'));

    dispatch({
      type: FOLLOW_USER_IN_LIST.SUCCESS,
      payload: usersArray,
      meta: type,
    });
  });
};

export const RESET_LISTS = '@dynamicList/RESET_LISTS';

export const resetLists = () => ({ type: RESET_LISTS });
