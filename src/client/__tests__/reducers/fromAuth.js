import {
  isGuestUser,
  getIsLoaded,
  getIsReloading,
  getIsAuthFetching,
  getIsAuthenticated,
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getAuthenticatedUserAvatar,
  getAuthenticatedUserMetaData,
} from '../../store/reducers';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromAuth', () => {
  let state;

  beforeEach(() => {
    state = {
      auth: {
        isAuthenticated: 'isAuthenticated',
        isFetching: 'isFetching',
        loaded: 'loaded',
        isReloading: 'isReloading',
        user: {
          name: 'name',
          posting_json_metadata: JSON.stringify({
            'profile.profile_image': 'profile_image',
          }),
        },
        userMetaData: 'userMetaData',
        isGuestUser: 'isGuestUser',
      },
    };
  });

  it('Should return isAuthenticated', () => {
    expect(getIsAuthenticated(state)).toBe('isAuthenticated');
  });

  it('Should return isFetching', () => {
    expect(getIsAuthFetching(state)).toBe('isFetching');
  });

  it('Should return loaded', () => {
    expect(getIsLoaded(state)).toBe('loaded');
  });

  it('Should return isReloading', () => {
    expect(getIsReloading(state)).toBe('isReloading');
  });

  it('Should return user obj', () => {
    expect(getAuthenticatedUser(state)).toEqual(state.auth.user);
  });

  it('Should return name', () => {
    expect(getAuthenticatedUserName(state)).toBe('name');
  });

  it('Should return userMetaData', () => {
    expect(getAuthenticatedUserMetaData(state)).toBe('userMetaData');
  });

  it('Should return profile_image', () => {
    expect(getAuthenticatedUserAvatar(state)).toBe('profile_image');
  });

  it('Should return isGuestUser', () => {
    expect(isGuestUser(state)).toBe('isGuestUser');
  });
});
