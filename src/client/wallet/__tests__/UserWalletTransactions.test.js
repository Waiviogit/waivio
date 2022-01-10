import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import UserWalletTransactions from '../UserWalletTransactions/UserWalletTransactions';

describe('(Component) UserWalletTransactions', () => {
  it('renders and matches snapshot', () => {
    const mockStore = configureStore();
    const props = {
      transactions: [
        {
          timestamp: '0',
          op: [
            'transfer_to_vesting',
            {
              amount: '100 HIVE',
            },
          ],
        },
        {
          timestamp: '0',
          op: [
            'transfer',
            {
              from: 'hellosteem1',
              memo: 'transfer memo',
              amount: '100 HIVE',
            },
          ],
        },
      ],
      currentUsername: 'hellosteem',
      totalVestingShares: '0',
      totalVestingFundSteem: '0',
      loadingMoreUsersAccountHistory: false,
      userHasMoreActions: false,
      getMoreUserAccountHistory: () => {},
    };
    const wrapper = shallow(
      <Provider store={mockStore()}>
        <IntlProvider locale="en">
          <UserWalletTransactions {...props} />
        </IntlProvider>
        ,
      </Provider>,
    );

    expect(wrapper).toMatchSnapshot();
  });
});
