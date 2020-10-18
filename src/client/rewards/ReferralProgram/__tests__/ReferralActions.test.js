// import configureMockStore from 'redux-mock-store';
// import thunk from 'redux-thunk';
// import * as actions from '../ReferralActions';
//
// const middlewares = [thunk];
// const mockStore = configureMockStore(middlewares);
// const store = mockStore();
//
// describe('ReferralActions', () => {
//   beforeEach(() => {
//     store.clearActions();
//   })
//
//   it('should create an action to getUserReferralInfo', () => {
//     const username = 'vallon';
//     const expactedAction = {
//       type: actions.GET_USER_REFERRAL_INFO.ACTION,
//       payload: {
//         referralStatus: 'activate',
//         referralList: [],
//       }
//     }
//     store.dispatch(actions.getUserReferralInfo(username));
//     expect(store.getActions()).toEqual([expactedAction]);
//   })
// })
