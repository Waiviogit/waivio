import React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import TransferTransaction from '../TransferTransaction';

describe('(Component) TransferTransaction', () => {
  describe('with default prop values', () => {
    it('renders and matches snapshot', () => {
      const props = {
        to: 'hellosteem',
        memo: 'Test Transfer Transaction',
        amount: <span>{'0 HIVE'}</span>,
        timestamp: '0',
      };
      const wrapper = shallow(
        <Router>
          <TransferTransaction {...props} />
        </Router>,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
