import { getFavoriteCategories } from '../../../store/favoritesStore/favoritesSelectors';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromFavorites', () => {
  it('Should return categories', () => {
    const state = {
      favorites: {
        categories: 'categories',
      },
    };

    expect(getFavoriteCategories(state)).toEqual('categories');
  });
});
