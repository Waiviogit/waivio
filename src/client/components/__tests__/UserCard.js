import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';

import { IntlProvider } from 'react-intl';
import UserCard from '../UserCard';

describe('<UserCard />', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      showFollow: true,
      user: '',
      alt: '',
    };

    wrapper = mount(
      <IntlProvider locale="en">
        <UserCard {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });
  });

  it('should render without exploding', () => {
    wrapper = shallow(
      <IntlProvider locale="en">
        <UserCard {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('Should include showFollow as in prop', () => {
    expect(wrapper.props().className).toBe('showFollow');
  });

  it('Should have defaultProps', () => {
    const defaultProps = {
      alt: '',
      user: {},
      showFollow: true,
      authUser: '',
    };

    wrapper = shallow(
      <IntlProvider locale="en">
        <UserCard {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });
    expect(wrapper.props().children.type.defaultProps).toEqual(defaultProps);
  });

  it('Should include UserCard in className', () => {
    wrapper = mount(
      <IntlProvider locale="en">
        <UserCard {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });
    expect(wrapper.find('div').props().className).toBe('UserCard');
  });
});
