// import ReferralReducer from "../ReferralReducer";
// import * as actions from '../ReferralActions';
// import {
//   mockDataInitialState,
//   MOCK_GET_USER_REFERRAL_INFO_START,
//   MOCK_GET_USER_REFERRAL_INFO_SUCCESS, MOCK_GET_USER_REFERRAL_DETAILS_START, MOCK_GET_USER_REFERRAL_DETAILS_SUCCESS
// } from "../__mock__/mockData";
// import {GET_IS_USER_IN_BLACKLIST, GET_USER_REFERRAL_DETAILS, GET_USER_REFERRAL_INFO} from "../ReferralActions";
//
// describe('ReferralReducer', () => {
//   let state;
//
//   it('should return initial stale', () => {
//     state = mockDataInitialState;
//     expect(ReferralReducer(undefined, {})).toEqual(state);
//   })
//
//   it('should handle GET_USER_REFERRAL_INFO.START', () => {
//     state = MOCK_GET_USER_REFERRAL_INFO_START;
//     expect(ReferralReducer(undefined, {
//       type: actions.GET_USER_REFERRAL_INFO.START
//     })).toEqual(state);
//   })
//
//   it('should handle GET_USER_REFERRAL_INFO.SUCCESS', () => {
//     state = MOCK_GET_USER_REFERRAL_INFO_SUCCESS;
//     expect(ReferralReducer(undefined, {
//       type: actions.GET_USER_REFERRAL_INFO.SUCCESS,
//       payload: {
//         referralStatus: 'activate',
//         referral: [],
//       }
//     })).toEqual(state);
//   })
//
//   it('should handle GET_USER_REFERRAL_DETAILS.START', () => {
//     state = MOCK_GET_USER_REFERRAL_DETAILS_START;
//     expect(ReferralReducer(undefined, {
//       type: GET_USER_REFERRAL_DETAILS.START,
//     })).toEqual(state);
//   })
//
//   it('should handle GET_USER_REFERRAL_DETAILS.SUCCESS', () => {
//     state = MOCK_GET_USER_REFERRAL_DETAILS_SUCCESS;
//     expect(ReferralReducer(undefined, {
//       type: actions.GET_USER_REFERRAL_DETAILS.SUCCESS,
//       payload: {
//         campaignServerPercent: 50,
//         indexAbsolutePercent: 60,
//         indexServerPercent: 30,
//         referralDuration: 90,
//         referralServerPercent: 20,
//         suspendedTimer: 30,
//         isStartLoadingReferralDetails: false,
//       }
//     })).toEqual(state);
//   })
//
//   it('should handle GET_IS_USER_IN_BLACKLIST.SUCCESS', () => {
//     state = mockDataInitialState;
//     expect(ReferralReducer(undefined, {
//       type: actions.GET_IS_USER_IN_BLACKLIST.SUCCESS,
//       payload: {
//         isUserInWaivioBlackList: false,
//       }
//     })).isEqual(state);
//   })
//
// })
