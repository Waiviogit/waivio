import { getCurrentLocation, getQueryString } from '../../../store/reducers';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromAppend', () => {
  const state = {
    router: {
      location: {
        search: 'search',
      },
    },
  };

  it('Should return location', () => {
    expect(getCurrentLocation(state)).toEqual(state.router.location);
  });

  it('Should return search', () => {
    expect(getQueryString(state)).toBe('search');
  });
});
