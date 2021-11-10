import React from 'react';
import { shallow } from 'enzyme';
import TransferTransaction from '../TransfersCards/TransferTransaction';

describe('(Component) TransferTransaction', () => {
  describe('with default prop values', () => {
    it('renders and matches snapshot', () => {
      const props = {
        to: 'hellosteem',
        memo: 'Test Transfer Transaction',
        amount: <span>{'0 HIVE'}</span>,
        timestamp: 0,
        isGuestPage: false,
        withdraw: '',
        getDetails: () => {},
        transactionType: 'transfer',
      };
      const wrapper = shallow(<TransferTransaction {...props} />);

      expect(wrapper).toMatchSnapshot();
    });
  });
});
