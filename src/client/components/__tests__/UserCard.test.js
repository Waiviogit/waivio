import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { IntlProvider } from 'react-intl';

import UserCard from '../UserCard';

describe('<UserCard />', () => {
  const mockStore = configureStore();
  let props;
  let wrapper;
  let store;

  beforeEach(() => {
    props = {
      user: {},
      unfollow: () => {},
      follow: () => {},
      showFollow: true,
      alt: <span />,
    };
    store = mockStore();

    wrapper = shallow(
      <Provider store={store}>
        <IntlProvider locale="en">
          <UserCard {...props} />
        </IntlProvider>
        ,
      </Provider>,
    );
  });

  it('should render without exploding', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
