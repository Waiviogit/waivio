import React from 'react';
import { shallow } from 'enzyme';
import UserWalletSummary from '../UserWalletSummary';

describe('(Component) UserWalletSummary', () => {
  describe('with default prop values', () => {
    it('renders and matches snapshot', () => {
      const props = {
        user: {
          balance: '100',
          vesting_shares: '0',
          savings_balance: '100 HIVE',
          savings_sbd_balance: '1000 HIVE',
        },
        estAccountValue: '100.00 HIVE',
        totalVestingShares: '100 HIVE',
        totalVestingFundSteem: '100 HIVE',
        loading: false,
        loadingGlobalProperties: false,
      };
      const wrapper = shallow(<UserWalletSummary {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
