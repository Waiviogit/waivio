import ReferralReducer from '../ReferralReducer';
// eslint-disable-next-line no-duplicate-imports
import * as selector from '../ReferralReducer';
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
      ReferralReducer(state, {
        type: actions.GET_USER_REFERRAL_INFO.START,
      }),
    ).toEqual(state);
  });

  it('should handle GET_USER_REFERRAL_INFO.SUCCESS', () => {
    state = mock.MOCK_GET_USER_REFERRAL_INFO_SUCCESS;
    expect(
      ReferralReducer(state, {
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
      ReferralReducer(state, {
        type: actions.GET_USER_REFERRAL_INFO.ERROR,
      }),
    ).toEqual(state);
  });

  it('should handle GET_USER_REFERRAL_DETAILS.START', () => {
    state = mock.MOCK_GET_USER_REFERRAL_DETAILS_START;
    expect(
      ReferralReducer(state, {
        type: actions.GET_USER_REFERRAL_DETAILS.START,
      }),
    ).toEqual(state);
  });

  it('should handle GET_USER_REFERRAL_DETAILS.SUCCESS', () => {
    state = mock.MOCK_GET_USER_REFERRAL_DETAILS_SUCCESS;
    expect(
      ReferralReducer(state, {
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
      ReferralReducer(state, {
        type: actions.REFERRAL_GET_ADDITION_FIELDS.START,
      }),
    ).toEqual(state);
  });

  it('should handle REFERRAL_GET_ADDITION_FIELDS.SUCCESS', () => {
    state = mock.MOCK_REFERRAL_GET_ADDITION_FIELDS_SUCCESS;
    expect(
      ReferralReducer(state, {
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
      ReferralReducer(state, {
        type: actions.GET_USER_STATUS_CARDS.START,
      }),
    ).toEqual(state);
  });

  it('should handle GET_USER_STATUS_CARDS.SUCCESS', () => {
    state = mock.MOCK_GET_USER_STATUS_CARDS_SUCCESS;
    expect(
      ReferralReducer(state, {
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
      ReferralReducer(state, {
        type: actions.GET_MORE_USER_STATUS_CARDS.START,
      }),
    ).toEqual(state);
  });

  it('should handle GET_MORE_USER_STATUS_CARDS.SUCCESS', () => {
    state = mock.MOCK_GET_USER_STATUS_CARDS_SUCCESS;
    expect(
      ReferralReducer(state, {
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
      ReferralReducer(state, {
        type: actions.GET_MORE_USER_STATUS_CARDS.ERROR,
      }),
    ).toEqual(state);
  });

  it('should handle GET_ERROR_MORE_USER_STATUS_CARDS.ERROR', () => {
    state = mock.MOCK_GET_MORE_USER_STATUS_CARDS_ERROR;
    expect(
      ReferralReducer(state, {
        type: actions.GET_ERROR_MORE_USER_STATUS_CARDS,
      }),
    ).toEqual(state);
  });

  it('should handle REFERRAL_CONFIRM_RULES.START', () => {
    state = mock.MOCK_REFERRAL_CONFIRM_RULES_START;
    expect(
      ReferralReducer(state, {
        type: actions.REFERRAL_CONFIRM_RULES.START,
      }),
    ).toEqual(state);
  });

  it('should handle REFERRAL_CONFIRM_RULES.SUCCESS', () => {
    state = mock.MOCK_REFERRAL_CONFIRM_RULES_SUCCESS;
    expect(
      ReferralReducer(state, {
        type: actions.REFERRAL_CONFIRM_RULES.SUCCESS,
      }),
    ).toEqual(state);
  });

  it('should handle REFERRAL_REJECT_RULES.START', () => {
    state = mock.MOCK_REFERRAL_REJECT_RULES_START;
    expect(
      ReferralReducer(state, {
        type: actions.REFERRAL_REJECT_RULES.START,
      }),
    ).toEqual(state);
  });

  it('should handle REFERRAL_REJECT_RULES.SUCCESS', () => {
    state = mock.MOCK_REFERRAL_REJECT_RULES_SUCCESS;
    expect(
      ReferralReducer(state, {
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

  it('should return selector getCampaignServerPercent()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getCampaignServerPercent(state)).toEqual(state.campaignServerPercent);
  });

  it('should return selector getCampaignServerPercent()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getIndexAbsolutePercent(state)).toEqual(state.indexAbsolutePercent);
  });

  it('should return selector getIndexServerPercent()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getIndexServerPercent(state)).toEqual(state.indexServerPercent);
  });

  it('should return selector getReferralDuration()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getReferralDuration(state)).toEqual(state.referralDuration);
  });

  it('should return selector getReferralServerPercent()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getReferralServerPercent(state)).toEqual(state.referralServerPercent);
  });

  it('should return selector getSuspendedTimer()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getSuspendedTimer(state)).toEqual(state.suspendedTimer);
  });

  it('should return selector getIsStartLoadingReferralDetails()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getIsStartLoadingReferralDetails(state)).toEqual(
      state.isStartLoadingReferralDetails,
    );
  });

  it('should return selector getIsUserInWaivioBlackList()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getIsUserInWaivioBlackList(state)).toEqual(state.isUserInWaivioBlackList);
  });

  it('should return selector getReferralStatus()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getReferralStatus(state)).toEqual(state.referralStatus);
  });

  it('should return selector getReferralList()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getReferralList(state)).toEqual(state.referral);
  });

  it('should return selector getIsChangedRuleSelection()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getIsChangedRuleSelection(state)).toEqual(state.isChangedRuleSelection);
  });

  it('should return selector getIsUsersCards()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getIsUsersCards(state)).toEqual(state.isGetUsersCards);
  });

  it('should return selector getIsHasMoreCards()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getIsHasMoreCards(state)).toEqual(state.hasMoreCards);
  });

  it('should return selector getCurrentUserCards()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getCurrentUserCards(state)).toEqual(state.userCards);
  });

  it('should return selector getIsErrorLoadingUserCards()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getIsErrorLoadingUserCards(state)).toEqual(state.isErrorLoadingMore);
  });

  it('should return selector getIsLoadingMoreUserCards()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getIsLoadingMoreUserCards(state)).toEqual(state.isLoadingMoreUserCards);
  });

  it('should return selector getIsStartChangeRules()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getIsStartChangeRules(state)).toEqual(state.isStartChangeRules);
  });

  it('should return selector getIsStartGetReferralInfo()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getIsStartGetReferralInfo(state)).toEqual(state.isStartGetReferralInfo);
  });

  it('should return selector getStatusSponsoredHistory()', () => {
    state = mock.mockDataInitialState;
    expect(selector.getStatusSponsoredHistory(state)).toEqual(state.statusSponsoredHistory);
  });
});
