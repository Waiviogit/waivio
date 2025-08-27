import { message } from 'antd';
import { isEmpty, some } from 'lodash';
import Cookie from 'js-cookie';
import { setGoogleTagEvent } from '../../common/helpers';
import { createAsyncActionType, getPostKey } from '../../common/helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { setCurrentShownPost } from '../appStore/appActions';
import { getAuthenticatedUserName } from '../authStore/authSelectors';
import { getLocale } from '../settingsStore/settingsSelectors';
import { getVideoForPreview } from '../../common/helpers/postHelpers';
import { parseJSON } from '../../common/helpers/parseJSON';
import { setGuestMana } from '../usersStore/usersActions';
import {
  getAuthorityFields,
  getMinRejectVote,
  getUpdateByBody,
  getUserProfileBlog,
} from '../../waivioApi/ApiClient';
import { getAppendDownvotes, getAppendUpvotes } from '../../common/helpers/voteHelpers';
import { objectFields } from '../../common/constants/listOfFields';
import { getAppendData } from '../../common/helpers/wObjectHelper';
import { getUsedLocale } from '../appStore/appSelectors';
import { setPinnedPostsUrls } from '../feedStore/feedActions';
import {
  appendObject,
  authorityVoteAppend,
  setObjectinAuthority,
  voteAppends,
} from '../appendStore/appendActions';
import { getAuthorityList } from '../appendStore/appendSelectors';
import { subscribeTypes } from '../../common/constants/blockTypes';
import { FAKE_COMMENT_SUCCESS } from '../commentsStore/commentsActions';
import { getMetadata } from '../../common/helpers/postingMetadata';
import api from '../../client/steemConnectAPI';
import { ACCOUNT_UPDATE } from '../../common/constants/accountHistory';
import { updateAuthProfile } from '../authStore/authActions';

export const GET_CONTENT = createAsyncActionType('@post/GET_CONTENT');
export const GET_SOCIAL_INFO_POST = createAsyncActionType('@post/GET_SOCIAL_INFO_POST');

export const LIKE_POST = createAsyncActionType('@post/LIKE_POST');
export const FAKE_REBLOG_POST = '@post/FAKE_REBLOG_POST';
export const LIKE_POST_HISTORY = '@post/LIKE_POST_HISTORY';

export const getContent = (author, permlink, afterLike, isComment = false) => (
  dispatch,
  getState,
) => {
  if (!author || !permlink) {
    return null;
  }
  const state = getState();
  const locale = getLocale(state);
  const follower = getAuthenticatedUserName(state);

  return dispatch({
    type: GET_CONTENT.ACTION,
    payload: {
      promise: ApiClient.getContent(author, permlink, locale, follower).then(async res => {
        if (res.id === 0) throw new Error('There is no such post');
        if (res.message) throw new Error(res.message);

        dispatch(setCurrentShownPost(res));
        const embed = getVideoForPreview(res)[0];
        let videoPreview = embed?.thumbnail;

        if (embed?.provider_name === 'TikTok') {
          try {
            let tiktokRes = await fetch(
              `https://www.tiktok.com/oembed?url=https://www.tiktok.com/${embed.url.replace(
                /\?.*/,
                '',
              )}`,
            );

            tiktokRes = await tiktokRes.json();
            videoPreview = tiktokRes?.thumbnail_url;
          } catch (e) {
            console.error(e);
          }
        }

        if (embed?.provider_name === '3Speak') {
          try {
            let speakRes = await fetch('https://hive-api.3speak.tv/', {
              method: 'POST',
              body: JSON.stringify({
                id: 0,
                jsonrpc: '2.0',
                method: 'condenser_api.get_content',
                params: embed?.id.split('/'),
              }),
            });

            speakRes = await speakRes.json();
            videoPreview = parseJSON(speakRes?.result?.json_metadata).image[0];
          } catch (e) {
            console.error(e);
          }
        }
        if (isComment) {
          dispatch({
            type: FAKE_COMMENT_SUCCESS,
            meta: { commentId: `${author}/${permlink}` },
          });
        }

        return { ...res, videoPreview };
      }),
    },
    meta: {
      author,
      permlink,
      afterLike,
    },
  }).catch(() => {});
};

export const votePost = (postId, author, permlink, weight = 10000, isThread = false) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const { auth, posts } = getState();
  const isGuest = auth.isGuestUser;
  const authUser = getAuthenticatedUserName(getState());
  const post = posts.list[postId];
  const voter = auth.user.name;

  if (!auth.isAuthenticated) return null;

  dispatch({
    type: LIKE_POST.START,
    meta: { postId, voter, weight },
  });

  return (
    steemConnectAPI
      .vote(voter, author, post.permlink, weight)
      // eslint-disable-next-line consistent-return
      .then(async data => {
        if (data.error) throw new Error();
        setGoogleTagEvent('add_vote');
        if (!isThread) {
          if (isGuest && !data.ok) {
            const guestMana = await dispatch(setGuestMana(authUser));

            if (guestMana.payload < 0.1) {
              message.error('Guest mana is too low. Please wait for recovery.');

              return dispatch({
                type: LIKE_POST.ERROR,
                meta: getPostKey(post),
              });
            }
            throw new Error(data.message);
          }

          return ApiClient.likePost({ voter, author, permlink: post.permlink, weight }).then(
            res => {
              if (res.message) {
                message.error(res.message);

                return dispatch({
                  type: LIKE_POST.ERROR,
                  meta: getPostKey(post),
                });
              }

              return dispatch({
                type: LIKE_POST.SUCCESS,
                payload: res,
                meta: { postId, voter, weight },
              });
            },
          );
        }
      })
      .catch(e => {
        message.error(e.error_description);

        dispatch({
          type: LIKE_POST.ERROR,
          meta: getPostKey(post),
        });
      })
  );
};

export const ADD_POST_IN_SHORTED_LIST = '@post/ADD_POST_IN_SHORTED_LIST';

export const sendPostError = postId => (dispatch, getState, { busyAPI }) => {
  const state = getState();
  const authUser = getAuthenticatedUserName(state);
  const shortedPosts = state.posts.shortedPosts;

  if (!shortedPosts.includes(postId)) {
    dispatch({ type: ADD_POST_IN_SHORTED_LIST, payload: postId });
    busyAPI.instance.sendAsync(subscribeTypes.clientError, [authUser, `shortened post ${postId}`]);
  }
};

export const voteComment = (comment, weight) => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const voter = getAuthenticatedUserName(state);

  if (!voter) {
    return null;
  }

  return dispatch({
    type: LIKE_POST_HISTORY,
    payload: {
      promise: steemConnectAPI
        .vote(voter, comment.author, comment.permlink, weight)
        .then(res => res),
    },
  });
};

export const reblogPost = (postId, userName) => dispatch =>
  dispatch({
    type: FAKE_REBLOG_POST,
    payload: { postId, userName },
  });

export const FOLLOWING_POST_AUTHOR = createAsyncActionType('FOLLOWING_POST_AUTHOR');

export const unpinUserPost = (user, hiveAuth, intl) => dispatch => {
  const profile =
    user?.posting_json_metadata && user?.posting_json_metadata !== ''
      ? getMetadata(user)?.profile || {}
      : {};

  delete profile.pinned;
  Cookie.remove('userPin');
  const postingMeta = { profile };
  const operation = [
    'account_update2',
    {
      account: user.name,
      json_metadata: '',
      posting_json_metadata: JSON.stringify(postingMeta),
      extensions: [],
    },
  ];

  if (hiveAuth) {
    const brodc = () => api.broadcast([operation], null, 'posting');

    brodc()
      .then(() => {
        message.success(
          intl.formatMessage({
            id: 'unpin_success',
            defaultMessage: 'Post has been unpinned successfully',
          }),
        );
      })
      .catch(() => {
        message.error(
          intl.formatMessage({
            id: 'transaction_fail',
            defaultMessage: 'Transaction failed',
          }),
        );
      });
  } else {
    const profileDateEncoded = [
      ACCOUNT_UPDATE,
      {
        account: user.name,
        extensions: [],
        json_metadata: '',
        posting_json_metadata: JSON.stringify({
          profile: { ...profile },
        }),
      },
    ];

    dispatch(updateAuthProfile(user.name, profileDateEncoded, history, intl));
  }
};
export const handlePinPost = (
  post,
  pinnedPostsUrls,
  user,
  match,
  wobject,
  userVotingPower,
) => async (dispatch, getState) => {
  const locale = getUsedLocale(getState());
  const currUpdate = await getUpdateByBody(
    wobject.author_permlink,
    'pin',
    'en-US',
    `${post.author}/${post.permlink}`,
  );
  const authorityList = getAuthorityList(getState());
  const activeHeart = authorityList[wobject.author_permlink];
  const isObjectPage = match.params.name === wobject.author_permlink;
  const upVotes = currUpdate?.active_votes && getAppendUpvotes(currUpdate?.active_votes);
  const isLiked = currUpdate?.isLiked || some(upVotes, { voter: user.name });
  const downVotes = getAppendDownvotes(currUpdate?.active_votes);
  const isReject = currUpdate?.isReject || some(downVotes, { voter: user.name });
  let voteWeight;
  const getAuthority = newPin => {
    getAuthorityFields(wobject.author_permlink).then(postInformation => {
      const authority = postInformation.find(
        p => p.creator === user.name && p.body === 'administrative',
      );

      const voteForAuthority = () =>
        !activeHeart &&
        dispatch(
          authorityVoteAppend(
            authority?.author,
            wobject.author_permlink,
            authority?.permlink,
            userVotingPower,
            isObjectPage,
          ),
        );

      if (newPin) {
        if (
          !isEmpty(postInformation) ||
          !isEmpty(
            postInformation.filter(p => p.creator === user.name && p.body === 'administrative'),
          )
        ) {
          voteForAuthority();
        }
      } else {
        voteForAuthority();
      }
    });
  };

  if (pinnedPostsUrls.includes(post.url)) {
    dispatch(setPinnedPostsUrls(pinnedPostsUrls.filter(p => p !== post.url)));
    if (post?.currentUserPin) {
      if (isReject) voteWeight = 0;
      else {
        voteWeight =
          isEmpty(upVotes) || (isLiked && upVotes?.length === 1)
            ? 1
            : (
                await getMinRejectVote(
                  user.name,
                  currUpdate?.author,
                  currUpdate?.permlink,
                  match.params.name,
                )
              )?.result;
      }
      dispatch(voteAppends(currUpdate?.author, currUpdate?.permlink, voteWeight, 'pin', false));
    }
  } else if (currUpdate.message) {
    dispatch(setObjectinAuthority(wobject.author_permlink));
    dispatch(setPinnedPostsUrls([...pinnedPostsUrls, post.url]));
    const pageContentField = {
      name: objectFields.pin,
      body: `${post.author}/${post.permlink}`,
      locale,
    };

    const bodyMessage = `@${user.name} pinned post: author: ${post.author}, permlink: ${post.permlink}`;
    const postData = getAppendData(user.name, wobject, bodyMessage, pageContentField);

    getAuthority(true);
    dispatch(
      appendObject(postData, { votePercent: userVotingPower, isLike: true, isObjectPage: true }),
    );
  } else {
    dispatch(setObjectinAuthority(wobject.author_permlink));
    dispatch(setPinnedPostsUrls([...pinnedPostsUrls, post.url]));
    getAuthority(false);
    dispatch(
      voteAppends(currUpdate.author, currUpdate.permlink, userVotingPower, 'pin', false, true),
    );
  }
};

export const followingPostAuthor = postId => dispatch =>
  dispatch({
    type: FOLLOWING_POST_AUTHOR.SUCCESS,
    payload: postId,
  });

export const pendingFollowingPostAuthor = postId => dispatch =>
  dispatch({
    type: FOLLOWING_POST_AUTHOR.START,
    payload: postId,
  });

export const errorFollowingPostAuthor = postId => dispatch =>
  dispatch({
    type: FOLLOWING_POST_AUTHOR.ERROR,
    payload: postId,
  });

export const getSocialInfoPost = (author, permlink) => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);

  return dispatch({
    type: GET_SOCIAL_INFO_POST.ACTION,
    payload: {
      promise: ApiClient.getSocialInfoPost(author, permlink, userName),
    },
    meta: {
      author,
      permlink,
    },
  });
};

export const HIDE_POST = createAsyncActionType('HIDE_POST');

export const handleHidePost = post => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);
  const action = post.isHide ? 'unhide' : 'hide';

  return dispatch({
    type: HIDE_POST.ACTION,
    payload: {
      promise: steemConnectAPI.hidePost(userName, post.author, post.permlink, action),
    },
    meta: {
      post,
    },
  });
};
export const REMOVE_POST = 'REMOVE_POST';
export const handleRemovePost = post => dispatch =>
  dispatch({
    type: REMOVE_POST,
    meta: {
      post,
    },
  });

export const MUTE_POSTS_AUTHOR = createAsyncActionType('MUTE_POSTS_AUTHOR');

export const muteAuthorPost = post => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);
  const action = post.muted ? [] : ['ignore'];

  return dispatch({
    type: MUTE_POSTS_AUTHOR.ACTION,
    payload: {
      promise: steemConnectAPI.muteUser(userName, post.author, action),
    },
    meta: {
      post,
      userName,
    },
  });
};

export const RECOMMENTED_POSTS = createAsyncActionType('RECOMMENTED_POSTS');

export const getPostsByAuthor = author => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);
  const locale = getUsedLocale(state);

  return dispatch({
    type: RECOMMENTED_POSTS.ACTION,
    payload: {
      promise: getUserProfileBlog(author, userName, { limit: 4 }, locale),
    },
  });
};

export const RESET_RECOMMENTED_POSTS = '@posts/RESET_RECOMMENTED_POSTS';

export const resetRecommendetPosts = () => ({
  type: RESET_RECOMMENTED_POSTS,
});
