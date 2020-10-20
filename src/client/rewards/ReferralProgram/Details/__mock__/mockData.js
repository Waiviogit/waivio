// eslint-disable-next-line import/prefer-default-export
export const mockData = {
  username: 'vallon',
  firstPercent: '50%',
  secondPercent: '40%',
  campaignPercent: '50%',
  indexPercent: '30%',
  referralsPercent: '20%',
  referralDuration: 90,
  additionData: {
    offersReward: 5,
    offersPercent: 5,
    feesValue: '$0.25',
  },
  suspendedTimer: 30,
};

export const mockDataDetails = {
  isAuthenticated: true,
  getReferralDetails: jest.fn(),
  campaignServerPercent: 50,
  indexAbsolutePercent: 60,
  indexServerPercent: 30,
  referralDuration: 90,
  referralServerPercent: 20,
  suspendedTimer: 30,
  username: 'vallon',
};
