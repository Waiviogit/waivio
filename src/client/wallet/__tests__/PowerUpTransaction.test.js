import React from 'react';
import { shallow } from 'enzyme';
import PowerUpTransactionFrom from '../PowerUpTransactionFrom';

describe('(Component) PowerUpTransactionFrom', () => {
  describe('with default prop values', () => {
    it('renders and matches snapshot', () => {
      const props = {
        timestamp: '0',
        amount: <span>{'0 HIVE'}</span>,
        to: 'hellosteem',
        from: 'hellosteem',
        transactionType: 'transfer_to_vesting',
      };
      const wrapper = shallow(<PowerUpTransactionFrom {...props} />);

      expect(wrapper).toMatchSnapshot();
    });
  });
});
