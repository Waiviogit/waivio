import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import UserExpertise from '../UserExpertise';

describe('(Component) UserExpertise', () => {
  it('renders and matches snapshot', () => {
    const mockStore = configureStore();
    const props = {
      match: {},
      locale: 'en-US',
      user: {},
    };
    const wrapper = shallow(
      <Provider store={mockStore()}>
        <UserExpertise {...props} />
      </Provider>,
    );

    expect(wrapper).toMatchSnapshot();
  });
});
