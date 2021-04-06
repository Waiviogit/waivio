import {
  getDraftPosts,
  getIsPostEdited,
  getPendingDrafts,
  getIsEditorSaving,
  getIsEditorLoading,
  getIsImageUploading,
} from '../../store/reducers';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromEditor', () => {
  let state;
  let permlink;

  beforeEach(() => {
    permlink = 'permlink';
    state = {
      editor: {
        draftPosts: 'draftPosts',
        loading: 'loading',
        saving: 'saving',
        pendingDrafts: 'pendingDrafts',
        editedPosts: 'edited permlink',
        loadingImg: 'loadingImg',
      },
    };
  });

  it('Should return draftPosts', () => {
    expect(getDraftPosts(state)).toBe('draftPosts');
  });

  it('Should return loading', () => {
    expect(getIsEditorLoading(state)).toBe('loading');
  });

  it('Should return saving', () => {
    expect(getIsEditorSaving(state)).toBe('saving');
  });

  it('Should return pendingDrafts', () => {
    expect(getPendingDrafts(state)).toBe('pendingDrafts');
  });

  it('Should return loadingImg', () => {
    expect(getIsImageUploading(state)).toBe('loadingImg');
  });

  it('Should return true', () => {
    expect(getIsPostEdited(state, permlink)).toBe(true);
  });

  it('Should return false', () => {
    expect(getIsPostEdited(state)).toBe(false);
  });
});
