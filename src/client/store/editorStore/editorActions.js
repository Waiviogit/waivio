/* eslint-disable arrow-body-style */
import { batch } from 'react-redux';
import assert from 'assert';
import Cookie from 'js-cookie';
import { push } from 'connected-react-router';
import { forEach, get, has, includes, isEmpty, isEqual, kebabCase, map, orderBy, uniqWith } from 'lodash';
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
import { saveSettings } from '../settingsStore/settingsActions';
import { notify } from '../../app/Notification/notificationActions';
import { clearBeneficiariesUsers } from '../searchStore/searchActions';
import {
  getCurrentHost,
  getIsWaivio,
  getTranslationByKey,
  getWebsiteBeneficiary,
} from '../appStore/appSelectors';
import { getAuthenticatedUser, getAuthenticatedUserName } from '../authStore/authSelectors';
import { getHiveBeneficiaryAccount, getLocale } from '../settingsStore/settingsSelectors';
import { getObjectsByIds, getReviewCheckInfo } from "../../../waivioApi/ApiClient";
import { getCurrentLoadObjects, getNewLinkedObjectsCards, getReviewTitle } from "../../helpers/editorHelper";
import {
  getCurrentDraft,
  getEditor,
  getEditorDraftId, getEditorExtended,
  getEditorLinkedObjects, getEditorLinkedObjectsCards,
  getIsEditorSaving,
  getLinkedObjects
} from "./editorSelectors";
import { getSuitableLanguage } from "../reducers";
import { getObjectName } from "../../helpers/wObjectHelper";
import { createPostMetadata, getObjectUrl } from "../../helpers/postHelpers";
import { Entity } from "../../components/EditorExtended";
import { handlePastedLink, QUERY_APP } from "../../components/EditorExtended/util/editorHelper";
import { convertToRaw } from "draft-js";

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
export const SET_EDITOR_STATE = '@editor/SET_EDITOR_STATE';

export const imageUploading = () => dispatch => dispatch({ type: UPLOAD_IMG_START });
export const imageUploaded = () => dispatch => dispatch({ type: UPLOAD_IMG_FINISH });
export const setEditorState = payload => ({ type: SET_EDITOR_STATE, payload });

export const saveDraft = (draftId, intl) => (dispatch, getState) => {
  const state = getState();
  const saving = getIsEditorSaving(state);
  const editorDraftId = getEditorDraftId(state);

  if (saving) return;
  const draft = dispatch(buildPost(draftId));

  const postBody = draft.originalBody || draft.body;

  if (!postBody) return;
  const redirect = draftId !== editorDraftId;

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
    meta: {postId: draft.draftId},
  }).then(() => {
    if (redirect) dispatch(push(`/editor?draft=${draft.draftId}`));
  });
}
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

export const SET_UPDATED_EDITOR_DATA = '@editor/SET_UPDATED_EDITOR_DATA';
export const setUpdatedEditorData = payload => ({ type: SET_UPDATED_EDITOR_DATA, payload })

export const reviewCheckInfo = ({ campaignId, isPublicReview, postPermlinkParam }, needReviewTitle = false) => {
  return (dispatch, getState) => {
    const state = getState();
    const userName = getAuthenticatedUserName(state);
    const locale = getSuitableLanguage(state);
    const linkedObjects = getLinkedObjects(state);
    const postPermlink = postPermlinkParam || isPublicReview;

    return getReviewCheckInfo({ campaignId, locale, userName, postPermlink })
      .then(campaignData => {
        const reviewedTitle = needReviewTitle ? getReviewTitle(campaignData, linkedObjects) : {};
        const updatedEditorData = {
          ...reviewedTitle,
          campaign: campaignData,
        };

        dispatch(setUpdatedEditorData(updatedEditorData));
      })
      .catch(error => {
        // message.error(
        //   this.props.intl.formatMessage(
        //     {
        //       id: 'imageSetter_link_is_already_added',
        //       defaultMessage: `Failed to get campaign data: {error}`,
        //     },
        //     { error },
        //   ),
        // );
        console.log('error', error);
      });
  }
}

export const buildPost = (draftId) => (dispatch, getState) => {
  const state = getState();
  const host = getCurrentHost(state);
  const user = getAuthenticatedUser(state);
  const currDraft = getCurrentDraft(state, { draftId });
  const {linkedObjects, topics, campaign, content, isUpdating, settings, titleValue, permlink, parentPermlink, objPercentage, originalBody} = getEditor(state);
  const currentObject = get(linkedObjects, '[0]', {});
  const objName = currentObject.author_permlink;

  if (currentObject.type === 'hashtag' || (currentObject.object_type === 'hashtag' && objName)) {
    setUpdatedEditorData({topics: uniqWith([...topics, objName], isEqual)});
  }
  const campaignId = get(campaign, '_id', null);
  const postData = {
    body: content,
    lastUpdated: Date.now(),
    isUpdating,
    draftId,
    ...settings,
  };

  if (titleValue) {
    postData.title = titleValue;
    postData.permlink = permlink || kebabCase(titleValue);
  }

  postData.parentAuthor = '';
  postData.parentPermlink = parentPermlink;
  postData.author = user.name || '';

  const oldMetadata = currDraft && currDraft.jsonMetadata;

  const waivioData = {
    wobjects: linkedObjects && linkedObjects
      .filter(obj => get(objPercentage, `[${obj.id}].percent`, 0) > 0)
      .map(obj => ({
        object_type: obj.object_type,
        objectName: getObjectName(obj),
        author_permlink: obj.author_permlink,
        percent: get(objPercentage, [obj.id, 'percent']),
      })),
  };

  postData.jsonMetadata = createPostMetadata(
    content,
    topics,
    oldMetadata,
    waivioData,
    campaignId,
    host,
  );
  if (originalBody) {
    postData.originalBody = originalBody;
  }

  return postData;
};

export const handleObjectSelect = object => (dispatch, getState) => {
  const state = getState();
  const { content, titleValue, topics } = getEditor(state);
  const objName = getObjectName(object).toLowerCase();
  const objPermlink = object.author_permlink;
  const separator = content.slice(-1) === '\n' ? '' : '\n';

  dispatch(setUpdatedEditorData({
    draftContent: {
      title: titleValue,
      body: `${content}${separator}[${objName}](${getObjectUrl(
        object.id || objPermlink,
      )})&nbsp;\n`,
    },
    topics: uniqWith(
      object.type === 'hashtag' ||
      (object.object_type === 'hashtag' && [...topics, objPermlink]),
      isEqual,
    ),
  }));
}

export const getObjectIds = (rawContent, newObject, draftId) => (dispatch, getState) => {
  const isReview = includes(draftId, 'review');
  const state = getState();
  const linkedObjects = getEditorLinkedObjects(state);
  const isLinked = string =>
    linkedObjects.some(item => item.defaultShowLink.includes(string));

  return Object.values(rawContent.entityMap)
    // eslint-disable-next-line array-callback-return,consistent-return
    .filter(entity => {
      if (entity.type === Entity.OBJECT) {
        return has(entity, 'data.object.id');
      }
      if (!isReview && entity.type === Entity.LINK) {
        const string = get(entity, 'data.url', '');
        const queryString = string.match(handlePastedLink(QUERY_APP));

        if (queryString) {
          return has(entity, 'data.url');
        }

        return null;
      }
    })
    // eslint-disable-next-line array-callback-return,consistent-return
    .map(entity => {
      if (
        entity.type === Entity.OBJECT &&
        (isLinked(get(entity, ['data', 'object', 'id'], '')) || newObject)
      ) {
        return get(entity, 'data.object.id', '');
      }
      if (
        !isReview &&
        entity.type === Entity.LINK &&
        (isLinked(get(entity, 'data.url', '')) || newObject)
      ) {
        return this.getCurrentLinkPermlink(entity);
      }
    })
    .filter(item => item);
};

export const getRawContentEntityMap = (rawContent, response) => (dispatch, getState) => {
  const state = getState();
  const linkedObjects = getEditorLinkedObjects(state);
  const entityMap = {};

  forEach(rawContent.entityMap, (value, key) => {
    let currObj = null;
    const loadedObject = getCurrentLoadObjects(response, value);

    linkedObjects.push(loadedObject);
    if (!isEmpty(linkedObjects) && !isEmpty(loadedObject)) {
      map(linkedObjects, obj => {
        if (isEqual(obj.author_permlink, loadedObject.author_permlink)) {
          currObj = loadedObject;
        }
      });
    } else {
      currObj = loadedObject;
    }

    entityMap[key] = {
      ...value,
      data: currObj ? { ...value.data, object: currObj } : { ...value.data },
    };
  });

  return entityMap;
};

export const getRestoreObjects = (rawContent, newObject, draftId) => (dispatch, getState) => new Promise(async(resolve, reject) => {
  const state = getState();
  const { prevEditorState } = getEditorExtended(state);
  const linkedCards = getEditorLinkedObjectsCards(state);

  const objectIds = getObjectIds(rawContent, newObject, draftId)
  const newLinkedObjectsCards = getNewLinkedObjectsCards(
    linkedCards,
    objectIds,
    Object.values(rawContent.entityMap),
    prevEditorState && Object.values(convertToRaw(prevEditorState.getCurrentContent()).entityMap),
  );

  dispatch(setUpdatedEditorData(newLinkedObjectsCards));
  let rawContentUpdated = rawContent;

  if (objectIds.length) {
    const response = await getObjectsByIds({
      authorPermlinks: objectIds,
      locale: this.props.locale,
      requiredFields: ['rating'],
    });
    const entityMap = getRawContentEntityMap(rawContent, response);

    rawContentUpdated = { ...rawContentUpdated, entityMap };
  }

  return resolve(rawContentUpdated);
});

