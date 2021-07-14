import { getIsAppendLoading } from '../../../store/appendStore/appendSelectors';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromAppend', () => {
  const state = {
    append: {
      loading: 'loading',
    },
  };

  it('Should return loading', () => {
    expect(getIsAppendLoading(state)).toBe('loading');
  });
});
