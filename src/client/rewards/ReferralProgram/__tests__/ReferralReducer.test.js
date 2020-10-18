import ReferralReducer from '../ReferralReducer';
import * as actions from '../ReferralActions';
import * as mock from '../__mock__/mockData';

describe('ReferralReducer', () => {
  let state;

  it('should return initial stale', () => {
    state = mock.mockDataInitialState;
    expect(ReferralReducer(undefined, {})).toEqual(state);
  });

  it('should handle GET_USER_REFERRAL_INFO.START', () => {
    state = mock.MOCK_GET_USER_REFERRAL_INFO_START;
    expect(
      ReferralReducer(undefined, {
        type: actions.GET_USER_REFERRAL_INFO.START,
      }),
    ).toEqual(state);
  });

  it('should handle GET_USER_REFERRAL_INFO.SUCCESS', () => {
    state = mock.MOCK_GET_USER_REFERRAL_INFO_SUCCESS;
    expect(
      ReferralReducer(undefined, {
        type: actions.GET_USER_REFERRAL_INFO.SUCCESS,
        payload: {
          referralStatus: 'activate',
          referral: [],
        },
      }),
    ).toEqual(state);
  });

  it('should handle GET_USER_REFERRAL_INFO.ERROR', () => {
    state = mock.MOCK_GET_USER_REFERRAL_INFO_ERROR;
    expect(
      ReferralReducer(undefined, {
        type: actions.GET_USER_REFERRAL_INFO.ERROR,
      }),
    ).toEqual(state);
  });

  it('should handle GET_USER_REFERRAL_DETAILS.START', () => {
    state = mock.MOCK_GET_USER_REFERRAL_DETAILS_START;
    expect(
      ReferralReducer(undefined, {
        type: actions.GET_USER_REFERRAL_DETAILS.START,
      }),
    ).toEqual(state);
  });

  it('should handle GET_USER_REFERRAL_DETAILS.SUCCESS', () => {
    state = mock.MOCK_GET_USER_REFERRAL_DETAILS_SUCCESS;
    expect(
      ReferralReducer(undefined, {
        type: actions.GET_USER_REFERRAL_DETAILS.SUCCESS,
        payload: {
          campaignServerPercent: 50,
          indexAbsolutePercent: 60,
          indexServerPercent: 30,
          referralDuration: 90,
          referralServerPercent: 20,
          suspendedTimer: 30,
          isStartLoadingReferralDetails: false,
        },
      }),
    ).toEqual(state);
  });

  it('should handle GET_IS_USER_IN_BLACKLIST.SUCCESS', () => {
    state = mock.mockDataInitialState;
    expect(
      ReferralReducer(undefined, {
        type: actions.GET_IS_USER_IN_BLACKLIST.SUCCESS,
        payload: {
          isBlacklisted: false,
        },
      }),
    ).toEqual(state);
  });

  it('should handle REFERRAL_GET_ADDITION_FIELDS.START', () => {
    state = mock.MOCK_REFERRAL_GET_ADDITION_FIELDS_START;
    expect(
      ReferralReducer(undefined, {
        type: actions.REFERRAL_GET_ADDITION_FIELDS.START,
      }),
    ).toEqual(state);
  });

  it('should handle REFERRAL_GET_ADDITION_FIELDS.SUCCESS', () => {
    state = mock.MOCK_REFERRAL_GET_ADDITION_FIELDS_SUCCESS;
    expect(
      ReferralReducer(undefined, {
        type: actions.REFERRAL_GET_ADDITION_FIELDS.SUCCESS,
        payload: {
          referralStatus: 'activate',
          referralList: [],
        },
      }),
    ).toEqual(state);
  });

  it('should handle GET_USER_STATUS_CARDS.START', () => {
    state = mock.MOCK_GET_USER_STATUS_CARDS_START;
    expect(
      ReferralReducer(undefined, {
        type: actions.GET_USER_STATUS_CARDS.START,
      }),
    ).toEqual(state);
  });

  it('should handle GET_USER_STATUS_CARDS.SUCCESS', () => {
    state = mock.MOCK_GET_USER_STATUS_CARDS_SUCCESS;
    expect(
      ReferralReducer(undefined, {
        type: actions.GET_USER_STATUS_CARDS.SUCCESS,
        payload: {
          hasMore: false,
          userCards: [
            {
              alias: '',
              name: 'waivio_dsad-asas',
              started: '2020-10-10T13:20:12.267Z',
              ended: '2021-01-08T13:20:12.267Z',
              daysLeft: -284,
            },
            {
              alias: '',
              name: 'waivio_vallon-kings',
              started: '2020-10-09T12:55:22.618Z',
              ended: '2021-01-07T12:55:22.619Z',
              daysLeft: -285,
            },
            {
              alias: '',
              name: 'waivio_sergei-sergei',
              started: '2020-10-09T12:50:06.394Z',
              ended: '2021-01-07T12:50:06.394Z',
              daysLeft: -285,
            },
          ],
        },
      }),
    ).toEqual(state);
  });

  it('should handle GET_MORE_USER_STATUS_CARDS.START', () => {
    state = mock.MOCK_GET_MORE_USER_STATUS_CARDS_START;
    expect(
      ReferralReducer(undefined, {
        type: actions.GET_MORE_USER_STATUS_CARDS.START,
      }),
    ).toEqual(state);
  });

  it('should handle GET_MORE_USER_STATUS_CARDS.SUCCESS', () => {
    state = mock.MOCK_GET_USER_STATUS_CARDS_SUCCESS;
    expect(
      ReferralReducer(undefined, {
        type: actions.GET_MORE_USER_STATUS_CARDS.SUCCESS,
        payload: {
          hasMore: false,
          userCards: [
            {
              alias: '',
              name: 'waivio_dsad-asas',
              started: '2020-10-10T13:20:12.267Z',
              ended: '2021-01-08T13:20:12.267Z',
              daysLeft: -284,
            },
            {
              alias: '',
              name: 'waivio_vallon-kings',
              started: '2020-10-09T12:55:22.618Z',
              ended: '2021-01-07T12:55:22.619Z',
              daysLeft: -285,
            },
            {
              alias: '',
              name: 'waivio_sergei-sergei',
              started: '2020-10-09T12:50:06.394Z',
              ended: '2021-01-07T12:50:06.394Z',
              daysLeft: -285,
            },
          ],
        },
      }),
    ).toEqual(state);
  });

  it('should handle GET_MORE_USER_STATUS_CARDS.ERROR', () => {
    state = mock.MOCK_GET_MORE_USER_STATUS_CARDS_ERROR;
    expect(
      ReferralReducer(undefined, {
        type: actions.GET_MORE_USER_STATUS_CARDS.ERROR,
      }),
    ).toEqual(state);
  });

  it('should handle GET_ERROR_MORE_USER_STATUS_CARDS.ERROR', () => {
    state = mock.MOCK_GET_MORE_USER_STATUS_CARDS_ERROR;
    expect(
      ReferralReducer(undefined, {
        type: actions.GET_ERROR_MORE_USER_STATUS_CARDS,
      }),
    ).toEqual(state);
  });

  it('should handle REFERRAL_CONFIRM_RULES.START', () => {
    state = mock.MOCK_REFERRAL_CONFIRM_RULES_START;
    expect(
      ReferralReducer(undefined, {
        type: actions.REFERRAL_CONFIRM_RULES.START,
      }),
    ).toEqual(state);
  });

  it('should handle REFERRAL_CONFIRM_RULES.SUCCESS', () => {
    state = mock.MOCK_REFERRAL_CONFIRM_RULES_SUCCESS;
    expect(
      ReferralReducer(undefined, {
        type: actions.REFERRAL_CONFIRM_RULES.SUCCESS,
      }),
    ).toEqual(state);
  });

  it('should handle REFERRAL_REJECT_RULES.START', () => {
    state = mock.MOCK_REFERRAL_REJECT_RULES_START;
    expect(
      ReferralReducer(undefined, {
        type: actions.REFERRAL_REJECT_RULES.START,
      }),
    ).toEqual(state);
  });

  it('should handle REFERRAL_REJECT_RULES.SUCCESS', () => {
    state = mock.MOCK_REFERRAL_REJECT_RULES_SUCCESS;
    expect(
      ReferralReducer(undefined, {
        type: actions.REFERRAL_REJECT_RULES.SUCCESS,
      }),
    ).toEqual(state);
  });

  it('should handle GET_STATUS_SPONSORED_REWARDS.SUCCESS', () => {
    state = mock.mockDataInitialState;
    expect(
      ReferralReducer(undefined, {
        type: actions.GET_STATUS_SPONSORED_REWARDS.SUCCESS,
        payload: {
          histories: [],
        },
      }),
    ).toEqual(state);
  });
});
