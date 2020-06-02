import { batch } from 'react-redux';
import assert from 'assert';
import Cookie from 'js-cookie';
import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';
import { get } from 'lodash';
import {
  BENEFICIARY_ACCOUNT,
  BENEFICIARY_PERCENT,
  REFERRAL_PERCENT,
} from '../../helpers/constants';
import { addDraftMetadata, deleteDraftMetadata } from '../../helpers/metadata';
import { jsonParse } from '../../helpers/formatter';
import { rewardsValues } from '../../../common/constants/rewards';
import { createPermlink, getBodyPatchIfSmaller } from '../../vendor/steemitHelpers';
import { saveSettings } from '../../settings/settingsActions';
import { notify } from '../../app/Notification/notificationActions';
import { getAuthenticatedUserName, getTranslations } from '../../reducers';
import { attachPostInfo } from '../../helpers/postHelpers';
import { getUserProfileBlog } from '../../../waivioApi/ApiClient';

export const CREATE_POST = '@editor/CREATE_POST';
export const CREATE_POST_START = '@editor/CREATE_POST_START';
export const CREATE_POST_SUCCESS = '@editor/CREATE_POST_SUCCESS';
export const CREATE_POST_ERROR = '@editor/CREATE_POST_ERROR';

export const NEW_POST = '@editor/NEW_POST';
export const newPost = createAction(NEW_POST);

export const SAVE_DRAFT = '@editor/SAVE_DRAFT';
export const SAVE_DRAFT_START = '@editor/SAVE_DRAFT_START';
export const SAVE_DRAFT_SUCCESS = '@editor/SAVE_DRAFT_SUCCESS';
export const SAVE_DRAFT_ERROR = '@editor/SAVE_DRAFT_ERROR';

export const DELETE_DRAFT = '@editor/DELETE_DRAFT';
export const DELETE_DRAFT_START = '@editor/DELETE_DRAFT_START';
export const DELETE_DRAFT_SUCCESS = '@editor/DELETE_DRAFT_SUCCESS';
export const DELETE_DRAFT_ERROR = '@editor/DELETE_DRAFT_ERROR';

export const ADD_EDITED_POST = '@editor/ADD_EDITED_POST';
export const addEditedPost = createAction(ADD_EDITED_POST);

export const DELETE_EDITED_POST = '@editor/DELETE_EDITED_POST';
export const deleteEditedPost = createAction(DELETE_EDITED_POST);

export const CREATE_WAIVIO_OBJECT = '@editor/CREATE_WAIVIO_OBJECT';

export const UPLOAD_IMG_START = '@editor/UPLOAD_IMG_START';
export const UPLOAD_IMG_FINISH = '@editor/UPLOAD_IMG_FINISH';

export const imageUploading = () => dispatch => dispatch({ type: UPLOAD_IMG_START });
export const imageUploaded = () => dispatch => dispatch({ type: UPLOAD_IMG_FINISH });

export const saveDraft = (draft, redirect, intl) => dispatch =>
  dispatch({
    type: SAVE_DRAFT,
    payload: {
      promise: addDraftMetadata(draft).catch(err => {
        const isLoggedOut = err.error === 'invalid_grant';

        const errorMessage = intl.formatMessage({
          id: isLoggedOut ? 'draft_save_auth_error' : 'draft_save_error',
          defaultMessage: isLoggedOut
            ? "Couldn't save this draft, because you are logged out. Please backup your post and log in again."
            : "Couldn't save this draft. Make sure you are connected to the internet and don't have too much drafts already",
        });

        dispatch(notify(errorMessage, 'error'));

        throw new Error();
      }),
    },
    meta: { postId: draft.draftId },
  }).then(() => {
    if (redirect) dispatch(push(`/editor?draft=${draft.draftId}`));
  });

export const deleteDraft = draftIds => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);
  if (!userName) dispatch({ type: DELETE_DRAFT_ERROR });

  return dispatch({
    type: DELETE_DRAFT,
    payload: {
      promise: deleteDraftMetadata(draftIds, userName),
    },
    meta: { ids: draftIds },
  });
};

export const editPost = (
  { id, author, permlink, title, body, json_metadata, parent_author, parent_permlink, reward }, // eslint-disable-line
  intl,
) => dispatch => {
  const jsonMetadata = jsonParse(json_metadata);
  const draft = {
    author,
    body,
    draftId: id,
    isUpdating: true,
    jsonMetadata,
    lastUpdated: Date.now(),
    originalBody: body,
    parentAuthor: parent_author,
    parentPermlink: parent_permlink,
    permlink,
    reward,
    title,
  };
  dispatch(saveDraft(draft, true, intl));
};

const requiredFields = 'parentAuthor,parentPermlink,author,permlink,title,body,jsonMetadata'.split(
  ',',
);

const broadcastComment = (
  steemConnectAPI,
  isUpdating,
  parentAuthor,
  parentPermlink,
  author,
  title,
  body,
  jsonMetadata,
  reward,
  beneficiary,
  upvote,
  permlink,
  referral,
  authUsername,
) => {
  const operations = [];
  const commentOp = [
    'comment',
    {
      parent_author: parentAuthor,
      parent_permlink: parentPermlink,
      author,
      permlink,
      title,
      body,
      json_metadata: JSON.stringify(jsonMetadata),
    },
  ];
  operations.push(commentOp);

  if (isUpdating) return steemConnectAPI.broadcast(operations);

  const commentOptionsConfig = {
    author,
    permlink,
    allow_votes: true,
    allow_curation_rewards: true,
    max_accepted_payout: '1000000.000 HBD',
    percent_steem_dollars: 10000,
    extensions: [],
  };

  if (reward === rewardsValues.none) {
    commentOptionsConfig.max_accepted_payout = '0.000 HBD';
  } else if (reward === rewardsValues.all) {
    commentOptionsConfig.percent_steem_dollars = 0;
  }

  const beneficiaries = [];

  if (beneficiary) {
    beneficiaries.push({ account: BENEFICIARY_ACCOUNT, weight: BENEFICIARY_PERCENT });
  }

  if (referral && referral !== authUsername) {
    beneficiaries.push({ account: referral, weight: REFERRAL_PERCENT });
  }

  if (beneficiaries.length !== 0) {
    commentOptionsConfig.extensions.push([0, { beneficiaries }]);
  }

  operations.push(['comment_options', commentOptionsConfig]);

  if (upvote) {
    operations.push([
      'vote',
      {
        voter: author,
        author,
        permlink,
        weight: 10000,
      },
    ]);
  }

  return steemConnectAPI.broadcast(operations);
};

export function createPost(postData) {
  requiredFields.forEach(field => {
    assert(postData[field] != null, `Developer Error: Missing required field ${field}`);
  });
  return (dispatch, getState, { steemConnectAPI }) => {
    const {
      parentAuthor,
      parentPermlink,
      author,
      title,
      body,
      jsonMetadata,
      reward,
      beneficiary,
      upvote,
      draftId,
      isUpdating,
    } = postData;
    const getPermLink = isUpdating
      ? Promise.resolve(postData.permlink)
      : createPermlink(title, author, parentAuthor, parentPermlink);
    const state = getState();
    const authUser = state.auth.user;
    const isGuest = state.auth.isGuestUser;
    getPermLink.then(permlink => {
      const newBody =
        isUpdating && !isGuest
          ? getBodyPatchIfSmaller(postData.originalBody, body)
          : attachPostInfo(postData, permlink);

      dispatch(saveSettings({ upvoteSetting: upvote, rewardSetting: reward }));

      let referral;
      if (Cookie.get('referral')) {
        const accountCreatedDaysAgo =
          (new Date().getTime() - new Date(`${authUser.created}Z`).getTime()) / 1000 / 60 / 60 / 24;
        if (accountCreatedDaysAgo < 30) {
          referral = Cookie.get('referral');
        }
      }

      const dispatchPostNotification = () => {
        setTimeout(() => {
          getUserProfileBlog(authUser.name, {})
            .then(posts => {
              const lastPost = get(posts, '[0].permlink', '');
              if (lastPost === permlink) {
                const postIsPublishedMessage = getTranslations(state).post_post_is_published;
                dispatch(notify(postIsPublishedMessage, 'success'));
              } else {
                const postWillPublishedMessage = getTranslations(state)
                  .post_post_will_published_soon;
                dispatch(notify(postWillPublishMessage, 'success'));
              }
              dispatch(push(`/@${authUser.name}`));
            })
            .catch(err => console.error(err));
        }, 6000);
      };

      dispatch({
        type: CREATE_POST,
        payload: {
          promise: broadcastComment(
            steemConnectAPI,
            isUpdating,
            parentAuthor,
            parentPermlink,
            author,
            title,
            newBody,
            jsonMetadata,
            reward,
            beneficiary,
            !isUpdating && !isGuest && upvote,
            permlink,
            referral,
            authUser.name,
          )
            // eslint-disable-next-line consistent-return
            .then(result => {
              if (isGuest) {
                if (result.ok) {
                  if (draftId) {
                    batch(() => {
                      dispatch(deleteDraft(draftId));
                      dispatch(addEditedPost(permlink));
                    });
                  }
                  if (upvote) {
                    steemConnectAPI.vote(authUser.name, authUser.name, permlink, 10000);
                  }

                  if (window.analytics) {
                    window.analytics.track('Post', {
                      category: 'post',
                      label: 'submit',
                      value: 10,
                    });
                  }
                  dispatchPostNotification();
                  return result;
                }

                result.json().then(err => {
                  dispatch(notify(err.error.message || err.error_description, 'error'));
                });
              } else {
                if (draftId) {
                  batch(() => {
                    dispatch(deleteDraft(draftId));
                    dispatch(addEditedPost(permlink));
                  });
                }

                if (window.analytics) {
                  window.analytics.track('Post', {
                    category: 'post',
                    label: 'submit',
                    value: 10,
                  });
                }
              }
              dispatchPostNotification();
            })
            .catch(err => {
              dispatch(notify(err.error.message || err.error_description, 'error'));
            }),
        },
      });
    });
  };
}
