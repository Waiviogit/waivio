import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import ReceiveTransaction from '../ReceiveTransaction';

describe('(Component) ReceiveTransaction', () => {
  describe('with default prop values', () => {
    it('renders and matches snapshot', () => {
      const mockStore = configureStore();
      const props = {
        from: 'hellosteem',
        memo: 'Test Memo',
        amount: <span>{'0 HIVE'}</span>,
        timestamp: '0',
        isGuestPage: false,
        details: {},
        type: 'transfer',
        username: '',
        isMobile: false,
        transactionType: '',
      };
      const wrapper = shallow(
        <Provider store={mockStore()}>
          <ReceiveTransaction {...props} />
        </Provider>,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });
});
