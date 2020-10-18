// eslint-disable-next-line import/prefer-default-export
// import { GET_USER_REFERRAL_INFO } from '../ReferralActions';

export const mockDataInitialState = {
  isStartLoadingReferralDetails: false,
  campaignServerPercent: null,
  indexAbsolutePercent: null,
  indexServerPercent: null,
  referralDuration: null,
  referralServerPercent: null,
  suspendedTimer: null,
  isUserInWaivioBlackList: false,
  isStartGetReferralInfo: false,
  isStartChangeRules: false,
  referralStatus: '',
  referral: [],
  isChangedRuleSelection: false,
  isGetUsersCards: false,
  hasMoreCards: false,
  userCards: [],
  isLoadingMoreUserCards: false,
  isErrorLoadingMore: false,
  statusSponsoredHistory: [],
};

export const MOCK_GET_USER_REFERRAL_INFO_START = {
  isStartGetReferralInfo: true,
};

export const MOCK_GET_USER_REFERRAL_INFO_ERROR = {
  isStartGetReferralInfo: false,
};

export const MOCK_REFERRAL_GET_ADDITION_FIELDS_START = {
  isChangedRuleSelection: true,
};

export const MOCK_GET_USER_REFERRAL_INFO_SUCCESS = {
  referralStatus: 'activate',
  referral: [],
  isStartGetReferralInfo: false,
};

export const MOCK_GET_USER_REFERRAL_DETAILS_START = {
  isStartLoadingReferralDetails: true,
};

export const MOCK_GET_USER_REFERRAL_DETAILS_SUCCESS = {
  isStartLoadingReferralDetails: false,
  campaignServerPercent: 50,
  indexAbsolutePercent: 60,
  indexServerPercent: 30,
  referralDuration: 90,
  referralServerPercent: 20,
  suspendedTimer: 30,
};

export const MOCK_REFERRAL_GET_ADDITION_FIELDS_SUCCESS = {
  referralStatus: 'activate',
  referral: [],
  isChangedRuleSelection: false,
};

export const MOCK_GET_USER_STATUS_CARDS_START = {
  isGetUsersCards: true,
};

export const MOCK_GET_USER_STATUS_CARDS_SUCCESS = {
  hasMoreCards: false,
  campaignServerPercent: null,
  isGetUsersCards: false,
  isErrorLoadingMore: false,
  isLoadingMoreUserCards: false,
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
};

export const MOCK_GET_MORE_USER_STATUS_CARDS_START = {
  isLoadingMoreUserCards: true,
  isErrorLoadingMore: false,
};

export const MOCK_GET_MORE_USER_STATUS_CARDS_ERROR = {
  isErrorLoadingMore: true,
};

export const MOCK_REFERRAL_CONFIRM_RULES_START = {
  isStartChangeRules: true,
};

export const MOCK_REFERRAL_CONFIRM_RULES_SUCCESS = {
  isStartChangeRules: false,
};

export const MOCK_REFERRAL_REJECT_RULES_START = {
  isStartChangeRules: true,
};

export const MOCK_REFERRAL_REJECT_RULES_SUCCESS = {
  isStartChangeRules: false,
};

export const sponsor = {
  details: {
    beneficiaries: [{ account: 'waivio', weight: 300 }],
    commissionWeight: null,
    hiveCurrency: 0.238689,
    main_object: {
      author_permlink: 'vvr-floret',
      defaultShowLink: '/object/vvr-floret',
      default_name: 'Floret',
      name: 'Floret',
      object_type: 'restaurant',
    },
    payableInDollars: 0.0009308871,
    reservation_permlink: 'reserve-hypzi77o2nh',
    review_object: {
      author_permlink: 'tbf-clear-tea',
      defaultShowLink: '/object/tbf-clear-tea',
      default_name: 'Clear tea',
      name: 'Clear tea',
      object_type: 'drink',
    },
    review_permlink: '4cmiet-review-floret-clear-tea',
  },
};

export const sponsorWithoutBeneficiaries = {
  details: {},
};

export const handleLoadMoreData = {
  username: 'vallon',
  currentUserCards: [
    {
      alias: 'Waivio Service',
      guideName: 'sor31',
      lastCreatedAt: '2020-08-31T07:40:03.623Z',
      payable: 0.008,
      payed: false,
    },
    {
      alias: 'Waivio Service',
      guideName: 'asd09',
      lastCreatedAt: '2020-10-13T15:07:13.471Z',
      payable: 0.006,
      payed: false,
    },
    {
      alias: '',
      guideName: 'vallon',
      lastCreatedAt: '2020-06-22T07:39:21.654Z',
      payable: 0.004,
      payed: false,
    },
    {
      alias: 'Waivio Service',
      guideName: 'sor32',
      lastCreatedAt: '2020-08-31T07:40:03.623Z',
      payable: 0.008,
      payed: false,
    },
    {
      alias: 'Waivio Service',
      guideName: 'asd093',
      lastCreatedAt: '2020-10-13T15:07:13.471Z',
      payable: 0.006,
      payed: false,
    },
    {
      alias: '',
      guideName: 'vallon',
      lastCreatedAt: '2020-06-22T07:39:21.654Z',
      payable: 0.004,
      payed: false,
    },
    {
      alias: 'Waivio Service',
      guideName: 'sor31',
      lastCreatedAt: '2020-08-31T07:40:03.623Z',
      payable: 0.008,
      payed: false,
    },
    {
      alias: 'Waivio Service',
      guideName: 'asd09',
      lastCreatedAt: '2020-10-13T15:07:13.471Z',
      payable: 0.006,
      payed: false,
    },
    {
      alias: '',
      guideName: 'vallon',
      lastCreatedAt: '2020-06-22T07:39:21.654Z',
      payable: 0.004,
      payed: false,
    },
    {
      alias: 'Waivio Service',
      guideName: 'sor32as',
      lastCreatedAt: '2020-08-31T07:40:03.623Z',
      payable: 0.008,
      payed: false,
    },
    {
      alias: 'Waivio Service',
      guideName: 'asd09s3',
      lastCreatedAt: '2020-10-13T15:07:13.471Z',
      payable: 0.006,
      payed: false,
    },
    {
      alias: '',
      guideName: 'vallon',
      lastCreatedAt: '2020-06-22T07:39:21.654Z',
      payable: 0.004,
      payed: false,
    },
  ],
  isLoadingMoreUserCards: false,
  getMoreUserCards: jest.fn(),
  sort: 'recency',
};
