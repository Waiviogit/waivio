import { getPendingReblogs, getRebloggedList } from '../../../store/reblogStore/reblogSelectors';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromReblog', () => {
  const state = {
    reblog: {
      rebloggedList: 'rebloggedList',
      pendingReblogs: 'pendingReblogs',
    },
  };

  it('Should return rebloggedList', () => {
    expect(getRebloggedList(state)).toEqual('rebloggedList');
  });

  it('Should return pendingReblogs', () => {
    expect(getPendingReblogs(state)).toEqual('pendingReblogs');
  });
});
