import { get, kebabCase } from 'lodash';
import { createPostMetadata } from '../../common/helpers/postHelpers';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { getObjectName } from '../../common/helpers/wObjectHelper';
import {
  getDraftsListAsync,
  deleteDraftFromList,
  saveDraft,
  getObjectsByIds,
} from '../../waivioApi/ApiClient';
import { getCurrentHost } from '../appStore/appSelectors';
import { getAuthenticatedUserName, getAuthenticatedUser } from '../authStore/authSelectors';
import { setUpdatedEditorData, setLinkedObjs } from '../slateEditorStore/editorActions';
import { getEditor } from '../slateEditorStore/editorSelectors';
import {
  getDraftPostsSelector,
  getCurrDraftSelector,
  getLinkedObjects,
  getObjectPercentageSelector,
} from './draftsSelectors';

export const GET_DRAFTS_LIST = createAsyncActionType('@draftsStore/GET_DRAFTS_LIST');

export const getDraftsList = () => (dispatch, getState) => {
  const state = getState();
  const author = getAuthenticatedUserName(state);

  return dispatch({
    type: GET_DRAFTS_LIST.ACTION,
    payload: getDraftsListAsync({ author }),
  });
};

export const DELETE_DRAFT = createAsyncActionType('@draftsStore/DELETE_DRAFT');

export const deleteDraft = ids => (dispatch, getState) => {
  const state = getState();
  const author = getAuthenticatedUserName(state);

  return dispatch({
    type: DELETE_DRAFT.ACTION,
    payload: deleteDraftFromList({ author, ids: ids.map(id => (!id ? 'null' : id)) }),
    meta: { ids },
  });
};

export const SAVE_DRAFT = createAsyncActionType('@draftsStore/SAVE_DRAFT');

export const safeDraftAction = (draftId, data, { deleteCamp, isEdit } = {}) => (
  dispatch,
  getState,
) => {
  const state = getState();

  if (!data.content && !deleteCamp && !isEdit) return Promise.reject('tut');

  const draft = dispatch(buildDraft(draftId, data, isEdit, deleteCamp));
  const draftList = getDraftPostsSelector(state);

  return dispatch({
    type: SAVE_DRAFT.ACTION,
    payload: saveDraft(draft).then(res => {
      const index = draftList.findIndex(d => d.draftId === draftId);
      let drafts;

      if (index !== -1) {
        drafts = draftList.reduce((acc, curr) => {
          acc.push(curr.draftId === draftId ? { ...curr, ...res } : curr);

          return acc;
        }, []);
      } else {
        drafts = [...draftList, res];
      }

      return drafts;
    }),
  });
};

export const SET_CURRENT_DRAFT = '@draftsStore/SET_CURRENT_DRAFT';

export const setCurrentDraft = draft => dispatch => {
  if (draft?.jsonMetadata?.linkedObjects) {
    getObjectsByIds({
      authorPermlinks: draft?.jsonMetadata?.linkedObjects.map(obj => obj.author_permlink),
    }).then(({ wobjects }) => {
      dispatch(setLinkedObjs(wobjects));
    });
  }

  return dispatch({ type: SET_CURRENT_DRAFT, payload: draft });
};

export const buildDraft = (draftId, data = {}, isEditPost, deleteCamp) => (dispatch, getState) => {
  const state = getState();
  const host = getCurrentHost(state);
  const user = getAuthenticatedUser(state);
  const currDraft = getCurrDraftSelector(state);
  const linkedObject = isEditPost ? data?.jsonMetadata?.linkedObjects : getLinkedObjects(state);
  const objPercentage = getObjectPercentageSelector(state);

  const {
    body,
    originalBody,
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
  } = { ...getEditor(state), isUpdating: currDraft?.isUpdating, ...data };
  const updatedEditor = { isEditPost };

  dispatch(setUpdatedEditorData(updatedEditor));
  const campaignId = deleteCamp ? null : get(campaign, '_id', null);
  const campaignType = get(campaign, 'type', undefined);
  let secondaryItem = get(campaign, 'secondaryObject', undefined);

  if (campaign) {
    secondaryItem = campaign?.secondaryObject?.author_permlink
      ? get(campaign, ['secondaryObject', 'author_permlink'], undefined)
      : `@${get(campaign, ['secondaryObject', 'name'], undefined)}`;
  }

  const reservationPermlink = get(jsonMetadata, 'reservation_permlink', null);
  const postData = {
    body: content || body || originalBody,
    lastUpdated: Date.now(),
    isUpdating,
    draftId,
    campaignType,
    secondaryItem,
    ...settings,
    ...(permlink || titleValue ? { permlink: permlink || kebabCase(titleValue) } : {}),
    parentAuthor: '',
    parentPermlink,
    author: user.name || '',
  };

  if (titleValue || title) {
    postData.title = titleValue || title;
  }

  const oldMetadata = get(currDraft, 'jsonMetadata', {});

  postData.jsonMetadata = createPostMetadata(
    content,
    topics,
    oldMetadata,
    linkedObject.map(obj => ({
      object_type: obj.object_type,
      name: getObjectName(obj),
      author_permlink: obj.author_permlink,
      defaultShowLink: obj.defaultShowLink,
      avatar: obj.avatar,
      description: obj.description,
      percent: objPercentage[obj.author_permlink]?.percent || obj.percent || 0,
    })),
    campaignId,
    host,
    reservationPermlink,
  );

  if (originalBody) {
    postData.originalBody = originalBody;
  }

  return postData;
};

export const RESET_LINKED_OBJECTS = '@draftsStore/RESET_LINKED_OBJECTS';

export const resetLinkedObjects = () => ({ type: RESET_LINKED_OBJECTS });

export const DELETE_CAMPAIGN_ID = '@draftsStore/DELETE_CAMPAIGN_ID';

export const deleteCampaignIdFromDraft = () => (dispatch, getState) => {
  const state = getState();
  const draft = getCurrDraftSelector(state);

  dispatch(safeDraftAction(draft.draftId, {}, { deleteCamp: true }));
};

export const SET_OBJECT_PERCENT = '@draftsStore/SET_OBJECT_PERCENT';

export const setObjPercent = (payload, draftId) => (dispatch, getState) => {
  const currDraft = getEditor(getState());

  dispatch({ type: SET_OBJECT_PERCENT, payload });
  dispatch(safeDraftAction(draftId, { title: currDraft.title, content: currDraft.content }));
};

export const TOGGLE_LINKED_OBJ = '@draftsStore/TOGGLE_LINKED_OBJ';

export const toggleLinkedObj = (payload, draftId) => (dispatch, getState) => {
  const state = getState();
  const currDraft = getEditor(state);

  dispatch({ type: TOGGLE_LINKED_OBJ, payload });
  dispatch(safeDraftAction(draftId, { title: currDraft.title, content: currDraft.content }));
};
