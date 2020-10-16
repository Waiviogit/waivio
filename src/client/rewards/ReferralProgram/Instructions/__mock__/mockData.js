// eslint-disable-next-line import/prefer-default-export
export const mockData = {
  authUserName: 'vallon',
  getUserInBlackList: () => {},
  isBlackListUser: false,
  isAuthenticated: true,
  isGuest: false,
  confirmRules: () => {},
  rejectRules: () => {},
  userReferralInfo: () => {},
  referralStatus: 'rejected',
  isStartChangeRules: false,
  isStartGetReferralInfo: false,
};

export const mockDataView = {
  isBlackListUser: false,
  isAuthenticated: true,
  rejectRules: () => {},
  isStartChangeRules: false,
  isStartGetReferralInfo: false,
  handleAgreeRulesCheckbox: jest.fn(),
  handleOkButton: () => {},
  handleCancelButton: () => {},
  currentCopyText: '',
  authUserName: 'vallon',
  isModal: false,
  isGuest: false,
  currentStatus: false,
  setIsCopyButton: () => {},
};
