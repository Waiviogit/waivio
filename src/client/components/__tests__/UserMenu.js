import React from 'react';
import { shallow, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { act } from 'react-dom/test-utils';
import UserMenu from '../UserMenu';

describe('<UserMenu />', () => {
  let props;
  let wrapper;

  it(' should render without exploding', () => {
    props = {
      defaultKey: 'comments',
      followers: 42,
      following: 21,
    };
    wrapper = shallow(<UserMenu {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should not to be undefined component', () => {
    expect(wrapper).not.toBeUndefined();
  });

  it(' Should call  onclick ', () => {
    const onChange = jest.fn();
    props = {
      defaultKey: 'comments',
      followers: 42,
      following: 21,
      onChange,
    };
    wrapper = mount(
      <IntlProvider locale="en">
        <UserMenu {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });

    const comments = wrapper.find('[data-key="comments"]');
    comments.simulate('click');
    expect(onChange).toBeCalled();
  });

  it('should have comments data-key  ', () => {
    props = {
      defaultKey: 'comments',
      followers: 42,
      following: 21,
    };
    wrapper = mount(
      <IntlProvider locale="en">
        <UserMenu {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });

    const comments = wrapper.find('[data-key="comments"]');
    comments.simulate('click');
    expect(wrapper.find('UserMenu').state('current')).toBe('comments');
  });

  it('should have discussions data-key', () => {
    props = {
      defaultKey: 'discussions',
      followers: 42,
      following: 21,
    };
    wrapper = mount(
      <IntlProvider locale="en">
        <UserMenu {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });

    const discussions = wrapper.find('[data-key="discussions"]');
    discussions.simulate('click');
    expect(wrapper.find('UserMenu').state('current')).toBe('discussions');
  });

  it('should have followers data-key', () => {
    props = {
      defaultKey: 'followers',
      followers: 42,
      following: 21,
    };
    wrapper = mount(
      <IntlProvider locale="en">
        <UserMenu {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });

    const followers = wrapper.find('[data-key="followers"]');
    followers.simulate('click');
    expect(wrapper.find('UserMenu').state('current')).toBe('followers');
  });

  it('should have followed data-key', () => {
    props = {
      defaultKey: 'followed',
      followers: 42,
      following: 21,
    };
    wrapper = mount(
      <IntlProvider locale="en">
        <UserMenu {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });

    const followed = wrapper.find('[data-key="following"]');
    followed.simulate('click');
    expect(wrapper.find('UserMenu').state('current')).toBe('following');
  });

  it('should have expertise data-key', () => {
    props = {
      defaultKey: 'expertise',
      followers: 42,
      following: 21,
    };
    wrapper = mount(
      <IntlProvider locale="en">
        <UserMenu {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });

    const expertise = wrapper.find('[data-key="expertise"]');
    expertise.simulate('click');
    expect(wrapper.find('UserMenu').state('current')).toBe('expertise');
  });

  it('should have transfers data-key', () => {
    props = {
      defaultKey: 'transfers',
      followers: 42,
      following: 21,
    };
    wrapper = mount(
      <IntlProvider locale="en">
        <UserMenu {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });

    const transfers = wrapper.find('[data-key="transfers"]');
    transfers.simulate('click');
    expect(wrapper.find('UserMenu').state('current')).toBe('transfers');
  });

  it('should have activity data-key', () => {
    props = {
      defaultKey: 'activity',
      followers: 42,
      following: 21,
    };
    wrapper = mount(
      <IntlProvider locale="en">
        <UserMenu {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });

    const activity = wrapper.find('[data-key="activity"]');
    activity.simulate('click');
    expect(wrapper.find('UserMenu').state('current')).toBe('activity');
  });

  it('should have about data-key', () => {
    props = {
      defaultKey: 'about',
      followers: 42,
      following: 21,
    };
    wrapper = mount(
      <IntlProvider locale="en">
        <UserMenu {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });

    const about = wrapper.find('[data-key="about"]');
    about.simulate('click');
    expect(wrapper.find('UserMenu').state('current')).toBe('about');
  });
});
