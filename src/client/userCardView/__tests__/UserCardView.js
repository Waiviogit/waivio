import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';

import { IntlProvider } from 'react-intl';
import UserCardView from '../UserCardView';

describe('<UserCardView />', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      user: '',
    };

    wrapper = mount(
      <IntlProvider locale="en">
        <UserCardView {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });
  });

  it('should render without exploding', () => {
    wrapper = shallow(
      <IntlProvider locale="en">
        <UserCardView {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('Should include UserCardView in className', () => {
    wrapper = mount(
      <IntlProvider locale="en">
        <UserCardView {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });
    expect(wrapper.find('div').props().className).toBe('UserCardView');
  });
});
