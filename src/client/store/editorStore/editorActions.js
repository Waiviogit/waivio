import { batch } from 'react-redux';
import assert from 'assert';
import Cookie from 'js-cookie';
import { push } from 'connected-react-router';
import { orderBy } from 'lodash';
import { createAction } from 'redux-actions';
import { createAsyncActionType } from '../../helpers/stateHelpers';
import { REFERRAL_PERCENT } from '../../helpers/constants';
import {
  addDraftMetadata,
  deleteDraftMetadata,
  deleteDraftMetadataObject,
} from '../../helpers/metadata';
import { jsonParse } from '../../helpers/formatter';
import { rewardsValues } from '../../../common/constants/rewards';
import { createPermlink, getBodyPatchIfSmaller } from '../../vendor/steemitHelpers';
import { saveSettings } from '../../settings/settingsActions';
import { notify } from '../../app/Notification/notificationActions';
import { clearBeneficiariesUsers } from '../../search/searchActions';
import { getHiveBeneficiaryAccount, getLocale } from '../reducers';
import {
  getCurrentHost,
  getIsWaivio,
  getTranslationByKey,
  getWebsiteBeneficiary,
} from '../appStore/appSelectors';
import { getAuthenticatedUserName } from '../authStore/authSelectors';

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

export const DELETE_DRAFT_OBJECT = createAsyncActionType('@editor/DELETE_DRAFT_OBJECT');

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
export const deleteDraftMetadataObj = (draftId, objPermlink) => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);

  if (!userName) dispatch({ type: DELETE_DRAFT_OBJECT.ERROR });

  return dispatch({
    type: DELETE_DRAFT_OBJECT.ACTION,
    payload: {
      promise: deleteDraftMetadataObject(draftId, userName, objPermlink),
    },
    meta: { draftId, objPermlink },
  });
};

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
  beneficiaries,
  isReview,
  isGuest,
  hiveBeneficiaryAccount,
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
  const guestHivePresent = hiveBeneficiaryAccount && isGuest ? 5000 : 0;
  const commentOptionsConfig = {
    author,
    permlink,
    allow_votes: true,
    allow_curation_rewards: true,
    max_accepted_payout: '1000000.000 HBD',
    percent_hbd: isGuest ? guestHivePresent : 10000,
    extensions: [],
  };

  if (reward === rewardsValues.none) {
    commentOptionsConfig.max_accepted_payout = '0.000 HBD';
  } else if (reward === rewardsValues.all) {
    commentOptionsConfig.percent_hbd = 0;
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

  return steemConnectAPI.broadcast(operations, isReview);
};

export function createPost(postData, beneficiaries, isReview, campaign, intl) {
  requiredFields.forEach(field => {
    assert(postData[field] != null, `Developer Error: Missing required field ${field}`);
  });

  return (dispatch, getState, { steemConnectAPI }) => {
    if (isReview) {
      // eslint-disable-next-line no-param-reassign
      postData.body += `\n***\n${intl.formatMessage({
        id: `check_review_post_add_text`,
        defaultMessage: 'This review was sponsored in part by',
      })} ${campaign.alias} ([@${campaign.guideName}](/@${campaign.guideName}))`;
    }

    const host = getCurrentHost(getState());

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

    const state = getState();
    const authUser = state.auth.user;
    const isGuest = state.auth.isGuestUser;
    const hiveBeneficiaryAccount = getHiveBeneficiaryAccount(state);
    const locale = getLocale(state);
    const follower = getAuthenticatedUserName(state);
    const isWaivio = getIsWaivio(state);
    const newBody =
      isUpdating && !isGuest && !isReview
        ? getBodyPatchIfSmaller(postData.originalBody, body)
        : body;

    const getPermLink = isUpdating
      ? Promise.resolve(postData.permlink)
      : createPermlink(title, author, parentAuthor, parentPermlink, locale, follower);

    const account = hiveBeneficiaryAccount || 'waivio.hpower';
    let weight = 9700;
    let secondBeneficiary = { account: 'waivio', weight: 300 };

    if (!isWaivio) {
      secondBeneficiary = getWebsiteBeneficiary(state);
      weight = 10000 - secondBeneficiary.weight;
    }

    const guestBeneficiary = [{ account, weight }, secondBeneficiary];
    const currentBeneficiaries = isGuest ? guestBeneficiary : beneficiaries;

    dispatch(saveSettings({ upvoteSetting: upvote, rewardSetting: reward }));

    let referral;

    if (Cookie.get('referral')) {
      const accountCreatedDaysAgo =
        (new Date().getTime() - new Date(`${authUser.created}Z`).getTime()) / 1000 / 60 / 60 / 24;

      if (accountCreatedDaysAgo < 30) {
        referral = Cookie.get('referral');
      }
    }

    const getErrorText = msg => msg.split(':')[1];

    dispatch({
      type: CREATE_POST_START,
    });

    getPermLink.then(permlink =>
      broadcastComment(
        steemConnectAPI,
        isUpdating,
        parentAuthor,
        parentPermlink,
        author,
        title,
        newBody,
        {
          ...jsonMetadata,
          host,
        },
        reward,
        beneficiary,
        !isUpdating && !isGuest && upvote,
        permlink,
        referral,
        authUser.name,
        orderBy(currentBeneficiaries, ['account'], ['asc']),
        isReview,
        isGuest,
        hiveBeneficiaryAccount,
      )
        .then(result => {
          if (draftId) {
            batch(() => {
              dispatch(deleteDraft(draftId));
              dispatch(addEditedPost(permlink));
            });
          }
          if (isGuest) {
            const getMessage = getTranslationByKey('post_publication');
            const publicMessage = getMessage(state);

            if (upvote) {
              steemConnectAPI.vote(authUser.name, authUser.name, permlink, 10000);
            }
            if (result.status === 200) {
              dispatch(notify(publicMessage, 'success'));
              dispatch(push(`/@${author}`));
            }
          } else {
            setTimeout(() => dispatch(push(`/@${author}`)), 3000);
          }
          if (window.gtag) window.gtag('event', 'publish_post');

          if (result.status === 429) {
            dispatch(notify(`To many comments from ${authUser.name} in queue`, 'error'));
            dispatch({
              type: CREATE_POST_ERROR,
            });
          }

          dispatch(clearBeneficiariesUsers());

          return result;
        })
        .catch(err => {
          let errorText = 'Error';

          dispatch({
            type: CREATE_POST_ERROR,
            payload: err,
          });
          if (err.error && err.error.message) {
            errorText = err.error.message;
          } else if (err.error_description) {
            errorText = getErrorText(err.error_description);
          }
          dispatch(notify(errorText, 'error'));
        }),
    );
  };
}
