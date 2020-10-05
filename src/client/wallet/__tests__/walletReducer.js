import reducer from '../walletReducer';
import * as actions from '../walletActions';

const reducerInitialState = {
  transferVisible: false,
  transferTo: '',
  totalVestingShares: '',
  totalVestingFundSteem: '',
  powerUpOrDownVisible: false,
  powerDown: false,
  usersTransactions: {},
  usersAccountHistory: {},
  usersEstAccountsValues: {},
  usersAccountHistoryLoading: true,
  loadingEstAccountValue: true,
  loadingGlobalProperties: true,
  loadingMoreUsersAccountHistory: false,
  accountHistoryFilter: [],
  currentDisplayedActions: [],
  currentFilteredActions: [],
  hasMore: false,
  hasMoreGuestActions: false,
  hasMoreTable: false,
  isErrorLoading: false,
  isErrorLoadingTableTransactions: false,
  isOpenWalletTable: false,
  loadingMoreTableTransactions: false,
  loadingMoreTransactions: false,
  operationNum: -1,
  operationNumTable: -1,
  tableTransactionsHistory: {},
  tableTransactionsHistoryLoading: false,
  transactionsHistory: {},
  transactionsHistoryLoading: false,
  withdrawOpen: false,
};

describe('walletReducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      ...reducerInitialState,
      transferVisible: false,
      transferTo: '',
    });
  });

  it('should handle OPEN_TRANSFER', () => {
    expect(
      reducer(undefined, {
        type: actions.OPEN_TRANSFER,
        payload: {
          userName: 'sekhmet',
          amount: 0.1,
          currency: 'HIVE',
          memo: 'user_reward',
        },
      }),
    ).toEqual({
      ...reducerInitialState,
      transferVisible: true,
      transferTo: 'sekhmet',
      amount: 0.1,
      currency: 'HIVE',
      memo: 'user_reward',
    });

    expect(
      reducer(
        {
          transferVisible: true,
          transferTo: 'fabien',
        },
        {
          type: actions.OPEN_TRANSFER,
          payload: {
            userName: 'fabien',
            amount: 0.1,
            currency: 'HIVE',
            memo: 'user_reward',
          },
        },
      ),
    ).toEqual({
      transferVisible: true,
      transferTo: 'fabien',
      amount: 0.1,
      currency: 'HIVE',
      memo: 'user_reward',
    });
  });

  it('should handle CLOSE_TRANSFER', () => {
    expect(
      reducer(undefined, {
        type: actions.CLOSE_TRANSFER,
      }),
    ).toEqual({
      ...reducerInitialState,
      amount: null,
      transferVisible: false,
      transferTo: '',
    });

    expect(
      reducer(
        {
          transferVisible: true,
          transferTo: 'fabien',
          amount: null,
        },
        {
          type: actions.CLOSE_TRANSFER,
        },
      ),
    ).toEqual({
      transferVisible: false,
      transferTo: 'fabien',
      amount: null,
    });
  });

  it('should open power up modal', () => {
    const initial = reducerInitialState;

    const expected = {
      ...initial,
      powerUpOrDownVisible: true,
      powerDown: false,
    };

    const actual = reducer(initial, actions.openPowerUpOrDown());

    expect(actual).toEqual(expected);
  });

  it('should open power down modal', () => {
    const initial = reducerInitialState;

    const expected = {
      ...initial,
      powerUpOrDownVisible: true,
      powerDown: true,
    };

    const actual = reducer(initial, actions.openPowerUpOrDown(true));

    expect(actual).toEqual(expected);
  });

  it('should close power up or down modal', () => {
    const expected = {
      ...reducerInitialState,
      powerUpOrDownVisible: false,
    };

    const actual = reducer(reducerInitialState, actions.closePowerUpOrDown());

    expect(actual).toEqual(expected);
  });

  it('should return previous state if actions is not recognized', () => {
    const states = [
      {
        transferVisible: true,
        transferTo: 'fabien',
        ...reducerInitialState,
      },
      {
        transferVisible: false,
        transferTo: '',
        ...reducerInitialState,
      },
    ];

    expect(
      reducer(states[0], {
        type: 'NOT_EXISTING',
      }),
    ).toEqual(states[0]);

    expect(
      reducer(states[1], {
        type: 'ANOTHER_NOT_EXISTING',
      }),
    ).toEqual(states[1]);
  });
});
