import {
  getObject,
  getObjectAuthor,
  getObjectFetchingState,
  getObjectFields,
  getObjectTagCategory,
  getRatingFields,
} from '../../store/wObjectStore/wObjectSelectors';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromObject', () => {
  const state = {
    object: {
      wobject: {
        fields: [{ name: 'rating' }, { name: 'no-rating' }],
        tagCategory: 'tagCategory',
        rating: [{ name: 'rating' }],
      },
      isFetching: 'isFetching',
      author: 'author',
    },
  };

  it('Should return getObject', () => {
    expect(getObject(state)).toEqual(state.object.wobject);
  });

  it('Should return isFetching', () => {
    expect(getObjectFetchingState(state)).toEqual('isFetching');
  });

  it('Should return author', () => {
    expect(getObjectAuthor(state)).toEqual('author');
  });

  it('Should return wobject fields', () => {
    expect(getObjectFields(state)).toEqual(state.object.wobject.fields);
  });

  it('Should return rating fields', () => {
    const ratingField = [{ name: 'rating' }];

    expect(getRatingFields(state)).toEqual(ratingField);
  });

  it('Should return tagCategories', () => {
    expect(getObjectTagCategory(state)).toEqual('tagCategory');
  });
});
