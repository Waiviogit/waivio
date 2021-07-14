import {
  getBookmarks,
  getPendingBookmarks,
} from '../../../store/bookmarksStore/bookmarksSelectors';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromBookmarks', () => {
  const state = {
    bookmarks: {
      list: 'list',
      pendingBookmarks: 'pendingBookmarks',
    },
  };

  it('Should return list', () => {
    expect(getBookmarks(state)).toEqual('list');
  });

  it('Should return pendingBookmarks', () => {
    expect(getPendingBookmarks(state)).toEqual('pendingBookmarks');
  });
});
