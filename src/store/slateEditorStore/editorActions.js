/* eslint-disable arrow-body-style */
import { batch } from 'react-redux';
import { message } from 'antd';
import assert from 'assert';
import Cookie from 'js-cookie';
import { push } from 'connected-react-router';
import { convertToRaw, EditorState, SelectionState } from 'draft-js';
import {
  forEach,
  get,
  has,
  includes,
  isEmpty,
  isEqual,
  kebabCase,
  map,
  orderBy,
  uniqBy,
  uniqWith,
  size,
  differenceBy,
  isNil,
} from 'lodash';
import { Transforms } from 'slate';
import { createAction } from 'redux-actions';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { REFERRAL_PERCENT } from '../../common/helpers/constants';
import {
  addDraftMetadata,
  deleteDraftMetadata,
  deleteDraftMetadataObject,
} from '../../common/helpers/metadata';
import { jsonParse } from '../../common/helpers/formatter';
import { rewardsValues } from '../../common/constants/rewards';
import { createPermlink, getBodyPatchIfSmaller } from '../../client/vendor/steemitHelpers';
import { saveSettings } from '../settingsStore/settingsActions';
import { notify } from '../../client/app/Notification/notificationActions';
import { clearBeneficiariesUsers } from '../searchStore/searchActions';
import { getCurrentHost, getTranslationByKey } from '../appStore/appSelectors';
import { getAuthenticatedUser, getAuthenticatedUserName } from '../authStore/authSelectors';
import { getHiveBeneficiaryAccount, getLocale } from '../settingsStore/settingsSelectors';
import {
  getCampaign,
  getMentionCampaign,
  getObjectInfo,
  getObjectsByIds,
  getObjPermlinkByCompanyId,
} from '../../waivioApi/ApiClient';
import {
  getCurrentLinkPermlink,
  getCurrentLoadObjects,
  getNewLinkedObjectsCards,
  getObjPercentsHideObject,
  getCurrentDraftContent,
  getFilteredLinkedObjects,
  updatedHideObjectsPaste,
  getLinkedObjects as getLinkedObjectsHelper,
  checkCursorInSearchSlate,
} from '../../common/helpers/editorHelper';
import {
  getCurrentDraft,
  getEditor,
  getEditorDraftId,
  getEditorExtended,
  getEditorLinkedObjects,
  getEditorLinkedObjectsCards,
  getEditorSlate,
  getIsEditorSaving,
  getTitleValue,
} from './editorSelectors';
import { getCurrentLocation, getQueryString } from '../reducers';
import { getAppendData, getObjectName, getObjectType } from '../../common/helpers/wObjectHelper';
import { createPostMetadata, getObjectLink } from '../../common/helpers/postHelpers';
import { createEditorState, Entity, fromMarkdown } from '../../client/components/EditorExtended';
import { setObjPercents } from '../../common/helpers/wObjInfluenceHelper';
import { extractLinks } from '../../common/helpers/parser';
import objectTypes from '../../client/object/const/objectTypes';
import { editorStateToMarkdownSlate } from '../../client/components/EditorExtended/util/editorStateToMarkdown';
import { insertObject } from '../../client/components/EditorExtended/util/SlateEditor/utils/common';
import { setGuestMana } from '../usersStore/usersActions';
import { createWaivioObject } from '../wObjectStore/wobjectsActions';
import { appendObject } from '../appendStore/appendActions';
import { objectFields } from '../../common/constants/listOfFields';
import { importData, prepareObjects } from '../../client/websites/MapObjectImport/importHelper';

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

export const SET_CLEAR_STATE = '@editor/SET_CLEAR_STATE';
export const LEAVE_EDITOR = '@editor/LEAVE_EDITOR';
export const SET_IS_SHOW_EDITOR_SEARCH = '@editor/SET_IS_SHOW_EDITOR_SEARCH';
export const SET_SEARCH_COORDINATES = '@editor/SET_CURSOR_COORDINATES';
export const SET_EDITOR_EXTENDED_STATE = '@editor/SET_EDITOR_EXTENDED_STATE';
export const SET_EDITOR_SEARCH_VALUE = '@editor/SET_EDITOR_SEARCH_VALUE';
export const CLEAR_EDITOR_SEARCH_OBJECTS = '@editor/CLEAR_EDITOR_SEARCH_OBJECTS';
export const SET_EDITOR = '@editor/SET_EDITOR';
export const SET_IMPORT_OBJECT = '@editor/SET_IMPORT_OBJECT';

export const imageUploading = () => dispatch => dispatch({ type: UPLOAD_IMG_START });
export const imageUploaded = () => dispatch => dispatch({ type: UPLOAD_IMG_FINISH });
export const setEditorState = payload => ({ type: SET_EDITOR_STATE, payload });
export const setClearState = () => ({ type: SET_CLEAR_STATE });
export const leaveEditor = () => ({ type: LEAVE_EDITOR });
export const setShowEditorSearch = payload => ({ type: SET_IS_SHOW_EDITOR_SEARCH, payload });
export const setCursorCoordinates = payload => ({ type: SET_SEARCH_COORDINATES, payload });
export const setEditorExtendedState = payload => ({ type: SET_EDITOR_EXTENDED_STATE, payload });
export const setEditorSearchValue = payload => ({ type: SET_EDITOR_SEARCH_VALUE, payload });
export const clearEditorSearchObjects = () => ({ type: CLEAR_EDITOR_SEARCH_OBJECTS });
export const setEditor = payload => ({ type: SET_EDITOR, payload });

const saveDraftRequest = (draft, intl) => dispatch =>
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
  });

export const saveDraft = (draftId, intl, data = {}) => (dispatch, getState) => {
  const state = getState();
  const saving = getIsEditorSaving(state);
  const { pathname } = getCurrentLocation(state);

  if (saving || (pathname !== '/editor' && pathname !== `/${data.author}`)) return;
  const draft = dispatch(buildPost(draftId, data));

  const postBody = draft.originalBody || draft.body;

  if (!postBody) return;

  dispatch(saveDraftRequest(draft, intl));
};
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

const editPostSetCurrentDraft = (draftId, intl, draft) => dispatch => {
  const draftBuild = dispatch(buildPost(draftId, draft, true));

  dispatch(saveDraftRequest(draftBuild, intl));
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

  dispatch(editPostSetCurrentDraft(id, intl, draft));

  return Promise.resolve();
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

export function createPost(postData, beneficiaries, isReview, campaign) {
  requiredFields.forEach(field => {
    assert(postData[field] != null, `Developer Error: Missing required field ${field}`);
  });

  return (dispatch, getState, { steemConnectAPI }) => {
    if (isReview && campaign) {
      // eslint-disable-next-line no-param-reassign
      postData.body += `\n***\nThis review was sponsored in part by [@${campaign.guideName}](/@${campaign.guideName})`;
    }
    const url = getCurrentHost(getState());
    const regex = /^(?:https?:\/\/)?(?:www\.)?([^/]+).*$/;
    const match = url?.match(regex);
    const host = match?.[1];

    const {
      parentAuthor,
      parentPermlink,
      author,
      title,
      body,
      reward,
      beneficiary,
      upvote,
      draftId,
      isUpdating,
      jsonMetadata,
    } = postData;

    const state = getState();
    const authUser = state.auth.user;
    const isGuest = state.auth.isGuestUser;
    const hiveBeneficiaryAccount = getHiveBeneficiaryAccount(state);
    const locale = getLocale(state);
    const follower = getAuthenticatedUserName(state);
    // const isWaivio = getIsWaivio(state);
    const newBody =
      isUpdating && !isGuest && !isReview
        ? getBodyPatchIfSmaller(postData.originalBody, body)
        : body;

    const getPermLink = isUpdating
      ? Promise.resolve(postData.permlink)
      : createPermlink(title, author, parentAuthor, parentPermlink, locale, follower);

    const account = hiveBeneficiaryAccount || 'waivio.hpower';
    const weight = 10000 - beneficiaries.reduce((acc, val) => acc + val.weight, 0);

    const guestBeneficiary = [{ account, weight }, ...beneficiaries];
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

    dispatch({
      type: CREATE_POST_START,
    });
    const reservationPermlink =
      get(campaign, 'reservation_permlink') || get(jsonMetadata, 'reservation_permlink');

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
          ...(reservationPermlink ? { reservation_permlink: reservationPermlink } : {}),
          ...(isReview && campaign ? { campaignId: campaign?._id } : {}),
          host,
          // originalJHost: location?.hostname,
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
        .then(async result => {
          if (draftId) {
            batch(() => {
              if (result.ok || result?.result?.id) dispatch(deleteDraft(draftId));
              dispatch(addEditedPost(permlink));
            });
          }
          if (isGuest) {
            const getMessage = getTranslationByKey('post_publication');
            const publicMessage = getMessage(state);

            if (upvote) {
              steemConnectAPI.vote(authUser.name, authUser.name, permlink, 10000);
            }

            setTimeout(() => {
              dispatch(push(`/@${author}`));
              if (result.ok) dispatch(notify(publicMessage, 'success'));
            }, 5000);
          } else {
            setTimeout(() => {
              const getMessage = getTranslationByKey('post_publication');
              const publicMessage = getMessage(state);

              dispatch(push(`/@${author}`));
              if (result?.ok || result?.result?.id) {
                message.success(publicMessage);
              }
            }, 3000);
          }
          if (typeof window !== 'undefined' && window?.gtag)
            window.gtag('event', 'publish_post', { debug_mode: false });

          if (result.status === 429) {
            if (isGuest) {
              const guestMana = await dispatch(setGuestMana(authUser.name));

              guestMana.payload < 10
                ? message.error('Guest mana is too low. Please wait for recovery.')
                : dispatch(notify(`To many comments from ${authUser.name} in queue`, 'error'));
            } else {
              dispatch(notify(`To many comments from ${authUser.name} in queue`, 'error'));
            }
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
            errorText = err.error_description;
          }
          dispatch(notify(errorText, 'error'));
        }),
    );
  };
}

export const SET_UPDATED_EDITOR_DATA = '@editor/SET_UPDATED_EDITOR_DATA';
export const SET_LINKED_OBJ = '@editor/SET_LINKED_OBJ';
export const SET_UPDATED_EDITOR_EXTENDED_DATA = '@editor/SET_UPDATED_EDITOR_EXTENDED_DATA';
export const setUpdatedEditorData = payload => ({ type: SET_UPDATED_EDITOR_DATA, payload });
export const setLinkedObj = payload => ({ type: SET_LINKED_OBJ, payload });
export const setUpdatedEditorExtendedData = payload => ({
  type: SET_UPDATED_EDITOR_EXTENDED_DATA,
  payload,
});

export const getCampaignInfo = ({ campaignId }, intl, campaignType, secondaryItem) => {
  return (dispatch, getState) => {
    const state = getState();
    const authUserName = getAuthenticatedUserName(state);
    const method = campaignType === 'mentions' ? getMentionCampaign : getCampaign;

    return method(authUserName, campaignId, secondaryItem)
      .then(campaignData => {
        const draftId = new URLSearchParams(getQueryString(state)).get('draft');
        const updatedEditorData = {
          campaign: campaignData,
        };

        dispatch(setUpdatedEditorData(updatedEditorData));
        dispatch(firstParseLinkedObjects(updatedEditorData.draftContent));
        dispatch(
          saveDraft(draftId, intl, {
            content: updatedEditorData.draftContent?.body,
            titleValue: updatedEditorData.draftContent?.title,
          }),
        );
      })
      .catch(error => {
        message.error(
          intl.formatMessage(
            {
              id: 'imageSetter_link_is_already_added',
              defaultMessage: `Failed to get campaign data: {error}`,
            },
            { error },
          ),
        );
      });
  };
};

export const buildPost = (draftId, data = {}, isEditPost) => (dispatch, getState) => {
  const state = getState();
  const host = getCurrentHost(state);
  const user = getAuthenticatedUser(state);
  const currDraft = getCurrentDraft(state, { draftId });
  const {
    body,
    originalBody,
    linkedObjects,
    topics,
    content,
    campaign,
    isUpdating,
    settings,
    titleValue,
    title,
    permlink,
    parentPermlink,
    jsonMetadata,
    objPercentage,
  } = { ...getEditor(state), isUpdating: currDraft?.isUpdating, ...data };

  const currentObject = get(linkedObjects, '[0]', {});
  const objName = currentObject.author_permlink;
  let updatedEditor = { isEditPost };

  if (currentObject.type === 'hashtag' || (currentObject.object_type === 'hashtag' && objName)) {
    updatedEditor = { ...updatedEditor, topics: uniqWith([...topics, objName], isEqual) };
  }
  dispatch(setUpdatedEditorData(updatedEditor));
  const campaignId = get(campaign, '_id', null) || get(jsonMetadata, 'campaignId', null);
  const reservationPermlink = get(jsonMetadata, 'reservation_permlink', null);
  const postData = {
    body: body || content || originalBody,
    lastUpdated: Date.now(),
    isUpdating,
    draftId,
    ...settings,
    ...(permlink || titleValue ? { permlink: permlink || kebabCase(titleValue) } : {}),
  };

  if (titleValue || title) {
    postData.title = titleValue || title;
    // postData.permlink = permlink || kebabCase(titleValue);
  }

  postData.parentAuthor = '';
  postData.parentPermlink = parentPermlink;
  postData.author = user.name || '';

  const oldMetadata = get(currDraft, 'jsonMetadata', {});

  const waivioData = {
    wobjects: (linkedObjects || [])
      .filter(obj => get(objPercentage, `[${obj._id}].percent`, 0) > 0)
      ?.map(obj => ({
        object_type: obj.object_type,
        name: getObjectName(obj),
        author_permlink: obj.author_permlink,
        defaultShowLink: obj.defaultShowLink,
        percent: get(objPercentage, [obj._id, 'percent']),
      })),
  };

  postData.jsonMetadata = createPostMetadata(
    content,
    topics,
    oldMetadata,
    waivioData,
    campaignId,
    host,
    reservationPermlink,
  );
  if (originalBody) {
    postData.originalBody = originalBody;
  }

  return postData;
};

export const handleObjectSelect = (object, withFocus, intl, match) => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const {
    content,
    titleValue,
    topics = [],
    linkedObjects,
    hideLinkedObjects,
    objPercentage,
    currentRawContent,
    draftId,
  } = getEditor(state);
  const editor = getEditorSlate(state);
  const objName = getObjectName(object);
  const objType = getObjectType(object);
  const objNameDisplay = objType === objectTypes.HASHTAG ? `#${objName}` : objName;
  const objPermlink = object.author_permlink;
  const separator = content?.slice(-1) === '\n' ? '' : '\n';
  const draftContent = {
    title: titleValue,
    body: `${content}${separator}[${objNameDisplay}](${getObjectLink(object, match)})&nbsp;\n`,
  };
  const updatedStore = { content: draftContent.body, titleValue: draftContent.title };

  const { rawContentUpdated } = await dispatch(getRestoreObjects(fromMarkdown(draftContent)));
  const parsedLinkedObjects = uniqBy(getLinkedObjectsHelper(rawContentUpdated), '_id');
  let newLinkedObject = parsedLinkedObjects.find(item => item._id === object._id);

  newLinkedObject = newLinkedObject || object;
  const updatedLinkedObjects = uniqBy(
    uniqBy([...linkedObjects, newLinkedObject], '_id'),
    'author_permlink',
  ).filter(item => has(item, '_id'));

  let updatedObjPercentage = setObjPercents(updatedLinkedObjects, objPercentage);
  const isHideObject = Array.isArray(hideLinkedObjects)
    ? hideLinkedObjects?.find(item => item?.author_permlink === newLinkedObject?.author_permlink)
    : false;

  if (isHideObject) {
    const filteredObjectCards = hideLinkedObjects?.filter(
      item => item.author_permlink !== newLinkedObject?.author_permlink,
    );

    updatedStore.hideLinkedObjects = filteredObjectCards;
    sessionStorage.setItem('hideLinkedObjects', JSON.stringify(filteredObjectCards));
    updatedObjPercentage = getObjPercentsHideObject(
      updatedLinkedObjects,
      isHideObject,
      updatedObjPercentage,
    );
  }
  updatedStore.linkedObjects = getFilteredLinkedObjects(
    updatedLinkedObjects,
    updatedStore.hideLinkedObjects,
  );
  updatedStore.objPercentage = updatedObjPercentage;
  const newData = {
    ...updatedStore,
    ...getCurrentDraftContent(updatedStore, rawContentUpdated, currentRawContent),
  };
  const updateTopics = uniqWith(
    object.type === 'hashtag' || (object.object_type === 'hashtag' && [...topics, objPermlink]),
    isEqual,
  );

  dispatch(
    setUpdatedEditorData({
      ...newData,
      draftContent,
      topics: size(updateTopics) ? updateTopics : topics,
    }),
  );

  const { beforeRange } = checkCursorInSearchSlate(editor);
  const url = getObjectLink(object, match);
  const textReplace = objType === objectTypes.HASHTAG ? `#${objName}` : objName;

  Transforms.select(editor, beforeRange);
  insertObject(editor, url, textReplace, withFocus);

  dispatch(
    saveDraft(draftId, intl, { content: draftContent.body, titleValue: draftContent.title }),
  );

  return Promise.resolve(draftContent);
};

export const getObjectIds = (rawContent, newObject, draftId) => (dispatch, getState) => {
  const isReview = includes(draftId, 'review');
  const state = getState();
  const linkedObjects = getEditorLinkedObjects(state);
  const isLinked = string => linkedObjects.some(item => item.defaultShowLink.includes(string));

  return (
    Object.values(rawContent.entityMap)
      // eslint-disable-next-line array-callback-return,consistent-return
      ?.map(entity => {
        if (entity.type === Entity.OBJECT) {
          return get(entity, 'data.object.id', '');
        }
        if (
          !isReview &&
          entity.type === Entity.LINK &&
          (isLinked(get(entity, 'data.url', '')) || newObject)
        ) {
          return getCurrentLinkPermlink(entity);
        }
      })
      .filter(item => !!item)
  );
};

export const getRawContentEntityMap = (rawContent, response) => (dispatch, getState) => {
  const state = getState();
  const linkedObjects = getEditorLinkedObjects(state);
  const entityMap = {};

  forEach(rawContent.entityMap, (value, key) => {
    let currObj = null;
    const loadedObject = getCurrentLoadObjects(response, value);

    if (loadedObject) {
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
    }
  });

  return entityMap;
};

export const getRestoreObjects = (rawContent, newObject, draftId) => async (dispatch, getState) => {
  const state = getState();
  const locale = getLocale(state);
  const { prevEditorState } = getEditorExtended(state);
  const linkedCards = getEditorLinkedObjectsCards(state);

  const objectIds = dispatch(getObjectIds(rawContent, newObject, draftId));

  const newLinkedObjectsCards = getNewLinkedObjectsCards(
    linkedCards,
    objectIds,
    Object.values(rawContent.entityMap),
    get(prevEditorState, 'getCurrentContent', false) &&
      Object.values(convertToRaw(prevEditorState.getCurrentContent()).entityMap),
  );

  let rawContentUpdated = rawContent;

  if (objectIds.length) {
    const response = await getObjectsByIds({
      locale,
      requiredFields: ['rating'],
      authorPermlinks: objectIds,
    });
    const entityMap = dispatch(getRawContentEntityMap(rawContent, response));

    rawContentUpdated = { ...rawContentUpdated, entityMap };
  }

  return { rawContentUpdated, newLinkedObjectsCards };
};

export const getRestoreObjectsSlate = (rawContent, newObject, draftId) => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const locale = getLocale(state);
  const { prevEditorState } = getEditorExtended(state);
  const linkedCards = getEditorLinkedObjectsCards(state);

  const objectIds = dispatch(getObjectIds(rawContent, newObject, draftId));

  const newLinkedObjectsCards = getNewLinkedObjectsCards(
    linkedCards,
    objectIds,
    Object.values(rawContent.entityMap),
    get(prevEditorState, 'getCurrentContent', false) &&
      Object.values(convertToRaw(prevEditorState.getCurrentContent()).entityMap),
  );

  let rawContentUpdated = rawContent;

  if (objectIds.length) {
    const response = await getObjectsByIds({
      locale,
      requiredFields: ['rating'],
      authorPermlinks: objectIds,
    });
    const entityMap = dispatch(getRawContentEntityMap(rawContent, response));

    rawContentUpdated = { ...rawContentUpdated, entityMap };
  }

  return { rawContentUpdated, newLinkedObjectsCards };
};

export const firstParseLinkedObjects = (draft, objName, cursorPosition) => async dispatch => {
  if (draft) {
    const entities = fromMarkdown({ body: draft.body });
    const { rawContentUpdated } = await dispatch(getRestoreObjects(entities));
    const draftLinkedObjects = uniqBy(getLinkedObjectsHelper(rawContentUpdated), '_id');
    const draftObjPercentage = setObjPercents(draftLinkedObjects);
    const draftContent = { title: draft.title, body: draft.body };

    const topics = draftLinkedObjects.reduce((acc, linkedObj) => {
      if (linkedObj.type === 'hashtag' || linkedObj.object_type === 'hashtag') {
        return [...acc, linkedObj.author_permlink];
      }

      return acc;
    }, []);

    dispatch(
      setUpdatedEditorData({
        linkedObjects: draftLinkedObjects,
        objPercentage: draftObjPercentage,
        draftContent: { title: draft.title, body: draft.body },
        titleValue: draft.title,
        content: draft.body,
        isUpdating: draft.isUpdating,
        topics,
      }),
    );

    let editorState = EditorState.moveFocusToEnd(createEditorState(fromMarkdown(draftContent)));

    const parsedEditorState = convertToRaw(editorState.getCurrentContent());

    if (objName && cursorPosition) {
      const cursorBlock = parsedEditorState.blocks.find(
        block => block.text.lastIndexOf(objName, cursorPosition) !== -1,
      );
      const newCursorPosition = cursorPosition - 2 + objName.length;
      const updateSelection = new SelectionState({
        anchorKey: cursorBlock.key,
        anchorOffset: newCursorPosition,
        focusKey: cursorBlock.key,
        focusOffset: newCursorPosition,
      });

      editorState = EditorState.acceptSelection(editorState, updateSelection);
      editorState = EditorState.forceSelection(editorState, updateSelection);
    }

    dispatch(
      setUpdatedEditorExtendedData({
        titleValue: draftContent.title,
        editorState,
      }),
    );
  }
};

export const handlePasteText = html => async (dispatch, getState) => {
  const links = extractLinks(html);
  const objectIds = links?.map(item => {
    const itemArray = item.split('/');

    return itemArray[itemArray.length - 1];
  });

  if (objectIds.length) {
    const state = getState();
    const locale = getLocale(state);
    const linkedObjects = getEditorLinkedObjects(state);
    const hideLinkedObjects = getEditorLinkedObjectsCards(state);
    const { wobjects } = await getObjectsByIds({
      locale,
      requiredFields: ['rating'],
      authorPermlinks: objectIds,
    });

    const newLinkedObjects = uniqBy([...linkedObjects, ...wobjects], '_id');
    const updatedHideLinkedObjects = size(hideLinkedObjects)
      ? updatedHideObjectsPaste(hideLinkedObjects, wobjects)
      : hideLinkedObjects;
    const objectsForPercentage = differenceBy(newLinkedObjects, updatedHideLinkedObjects, '_id');
    const objPercentage = setObjPercents(objectsForPercentage);

    dispatch(
      setUpdatedEditorData({
        objPercentage,
        linkedObjects: newLinkedObjects,
        hideLinkedObjects: updatedHideLinkedObjects,
      }),
    );
  }
};

export const selectObjectFromSearch = (selectedObject, editor, match) => (dispatch, getState) => {
  if (selectedObject) {
    const state = getState();
    const titleValue = getTitleValue(state);
    const draftId = getEditorDraftId(state);
    const { beforeRange } = checkCursorInSearchSlate(editor);
    const objectType = getObjectType(selectedObject);
    const objectName = getObjectName(selectedObject);
    const textReplace = objectType === objectTypes.HASHTAG ? `#${objectName}` : objectName;
    const url = getObjectLink(selectedObject, match);

    Transforms.select(editor, beforeRange);
    insertObject(editor, url, textReplace, true);

    const updatedStateBody = {
      body: editorStateToMarkdownSlate(editor.children),
      title: titleValue,
    };

    dispatch(setShowEditorSearch(false));
    dispatch(saveDraft(draftId, null, updatedStateBody));
    dispatch(firstParseLinkedObjects(updatedStateBody, textReplace));
  }
};

export const prepareAndImportObjects = (
  isRestaurant,
  isEditor,
  isComment,
  parentPost,
  setLoading,
  cancelModal,
  history,
  objects,
  checkedIds,
  restaurantTags,
  businessTags,
  listAssociations,
  locale,
  userName,
  objTypes,
  intl,
) => dispatch => {
  prepareObjects(
    objects,
    checkedIds,
    isRestaurant,
    restaurantTags,
    businessTags,
    listAssociations,
    userName,
  ).then(async processedObjects => {
    if (isEditor) {
      const type = isRestaurant(processedObjects[0]) ? 'restaurant' : 'business';
      const selectedType = objTypes[type];
      const objData = {
        ...processedObjects[0],
        type,
        id: processedObjects[0]?.name,
        parentAuthor: selectedType.author,
        parentPermlink: selectedType.permlink,
        isExtendingOpen: true,
        isPostingOpen: true,
      };
      const { companyIdType, companyId } = objData?.companyIds[0];
      const existWobjPermlink = (await getObjPermlinkByCompanyId(companyId, companyIdType))?.result;

      if (!isEmpty(existWobjPermlink) && !isNil(existWobjPermlink)) {
        const objsForEditor = await getObjectInfo([existWobjPermlink]);
        const importedObj = { ...objsForEditor?.wobjects[0], object_type: type };

        if (isComment) {
          dispatch(setImportObject({ [parentPost.id]: importedObj }));
        } else {
          dispatch(handleObjectSelect(importedObj, false, intl));
        }
        importData(
          processedObjects,
          isRestaurant,
          userName,
          locale,
          isEditor,
          isComment,
          setLoading,
          cancelModal,
          history,
        );
        cancelModal();
      } else {
        dispatch(createWaivioObject(objData)).then(res => {
          const { parentPermlink, parentAuthor } = res;
          const comanyIdBody = JSON.stringify(objData?.companyIds[0]);

          dispatch(
            appendObject(
              getAppendData(
                userName,
                {
                  id: parentPermlink,
                  author: parentAuthor,
                  creator: userName,
                  name: objData.name,
                  locale,
                  author_permlink: parentPermlink,
                },
                '',
                {
                  name: objectFields.companyId,
                  body: comanyIdBody,
                  locale,
                },
              ),
            ),
          ).then(async r => {
            setTimeout(async () => {
              if (r?.transactionId) {
                const importedObj = {
                  ...objData,
                  author_permlink: r.parentPermlink,
                  _id: r.parentPermlink,
                  object_type: type,
                };

                if (isComment) {
                  dispatch(setImportObject({ [parentPost.id]: importedObj }));
                } else {
                  dispatch(handleObjectSelect(importedObj, false, intl));
                }
                cancelModal();
                importData(
                  processedObjects,
                  isRestaurant,
                  userName,
                  locale,
                  isEditor,
                  isComment,
                  setLoading,
                  cancelModal,
                  history,
                );
              }
            }, 6000);
          });
        });
      }
    } else {
      importData(
        processedObjects,
        isRestaurant,
        userName,
        locale,
        isEditor,
        isComment,
        setLoading,
        cancelModal,
        history,
      );
    }
  });
};

export const setImportObject = obj => dispatch => {
  return dispatch({
    type: SET_IMPORT_OBJECT,
    payload: obj,
  });
};
