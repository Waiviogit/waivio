import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../walletActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('walletActions', () => {
  it('should create an action to open a transfer', () => {
    const userName = 'sekhmet';
    const expectedAction = {
      type: actions.OPEN_TRANSFER,
      payload: {
        userName: 'sekhmet',
        amount: 0,
        currency: 'STEEM',
        memo: '',
      },
    };
    const store = mockStore({});
    store.dispatch(actions.openTransfer(userName));
    expect(store.getActions()).toEqual([expectedAction]);
  });

  it('should create an action to close a transfer', () => {
    const expectedAction = {
      type: actions.CLOSE_TRANSFER,
    };

    expect(actions.closeTransfer()).toEqual(expectedAction);
  });

  it('should create an action to open a power up modal', () => {
    const expectedAction = {
      type: actions.OPEN_POWER_UP_OR_DOWN,
      payload: false,
    };

    expect(actions.openPowerUpOrDown(false)).toEqual(expectedAction);
  });

  it('should create an action to open a power down modal', () => {
    const expectedAction = {
      type: actions.OPEN_POWER_UP_OR_DOWN,
      payload: true,
    };

    expect(actions.openPowerUpOrDown(true)).toEqual(expectedAction);
  });

  it('should create an action to close a transfer', () => {
    const expectedAction = {
      type: actions.CLOSE_POWER_UP_OR_DOWN,
    };

    expect(actions.closePowerUpOrDown()).toEqual(expectedAction);
  });
});
