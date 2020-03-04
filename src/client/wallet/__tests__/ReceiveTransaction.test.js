import React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import ReceiveTransaction from '../ReceiveTransaction';

describe('(Component) ReceiveTransaction', () => {
  describe('with default prop values', () => {
    it('renders and matches snapshot', () => {
      const props = {
        from: 'hellosteem',
        memo: 'Test Memo',
        amount: <span>{'0 STEEM'}</span>,
        timestamp: '0',
      };
      const wrapper = shallow(
        <Router>
          <ReceiveTransaction {...props} />
        </Router>,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
