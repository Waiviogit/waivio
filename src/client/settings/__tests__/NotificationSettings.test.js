import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import NotificationSettings from '../NotificationSettings';

describe('(Component) NotificationSettings', () => {
  it('renders and matches snapshot', () => {
    const mockStore = configureStore();
    const props = {
      settingsNotifications: {},
      updateUserMetadata: () => {},
    };
    const wrapper = shallow(
      <Provider store={mockStore()}>
        <IntlProvider locale="en">
          <NotificationSettings {...props} />
        </IntlProvider>
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
