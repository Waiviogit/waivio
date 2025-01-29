import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { getDraftsListAsync, deleteDraftFromList, saveDraft } from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../authStore/authSelectors';
import { buildPost } from '../slateEditorStore/editorActions';
import { getDraftPostsSelector } from './draftsSelectors';

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
    payload: deleteDraftFromList({ author, ids }),
    meta: { ids },
  });
};

export const SAVE_DRAFT = createAsyncActionType('@draftsStore/SAVE_DRAFT');

export const safeDraftAction = (draftId, intl, data) => (dispatch, getState) => {
  const state = getState();
  const draft = dispatch(buildPost(draftId, data));
  const draftList = getDraftPostsSelector(state);

  if (!draft.body) return Promise.reject();

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

export const setCurrentDraft = draft => ({ type: SET_CURRENT_DRAFT, payload: draft });
