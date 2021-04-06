import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Avatar, { getAvatarURL } from '../Avatar';

describe('<Avatar />', () => {
  const mockStore = configureStore();

  let props;
  let store;

  it('renders without exploding', () => {
    props = {
      username: 'Custom Name',
      size: 50,
    };
    store = mockStore();
    const wrapper = shallow(
      <Provider store={store}>
        <Avatar {...props} />
      </Provider>,
    );

    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('Should have title as username prop', () => {
    props = {
      username: 'Custom Name',
      size: 50,
    };
    store = mockStore({
      auth: {
        user: {
          name: 'username',
        },
      },
    });
    const wrapper = mount(
      <Provider store={store}>
        <Avatar {...props} />
      </Provider>,
    );

    act(() => {
      wrapper.update();
    });
    expect(wrapper.find('.Avatar').props().title).toBe('Custom Name');
  });

  it('Should have style field as size prop without username', () => {
    props = {
      username: '',
      size: 50,
    };

    store = mockStore({
      auth: {
        user: {
          name: 'username',
        },
      },
    });

    const style = {
      minWidth: `${props.size}px`,
      width: `${props.size}px`,
      height: `${props.size}px`,
    };

    const wrapper = mount(
      <Provider store={store}>
        <Avatar {...props} />
      </Provider>,
    );

    act(() => {
      wrapper.update();
    });
    expect(wrapper.find('.Avatar').props().style).toEqual(style);
  });

  it('Should have style field as size prop with username', () => {
    props = {
      username: 'Custom Name',
      size: 50,
    };

    store = mockStore({
      auth: {
        user: {
          name: 'username',
        },
      },
    });

    const url = getAvatarURL(props.username, props.size, {});
    const style = {
      minWidth: `${props.size}px`,
      width: `${props.size}px`,
      height: `${props.size}px`,
      backgroundImage: `url(${url})`,
    };

    const wrapper = mount(
      <Provider store={store}>
        <Avatar {...props} />
      </Provider>,
    );

    act(() => {
      wrapper.update();
    });
    expect(wrapper.find('.Avatar').props().style).toEqual(style);
  });
});

describe('getAvatarURL', () => {
  let size;
  let username;
  let authenticatedUser;

  it('should return waivio link', () => {
    const lastAccountUpdate = '';

    username = 'waivio_unsername';
    size = 50;
    authenticatedUser = {};
    expect(getAvatarURL(username, size, authenticatedUser)).toBe(
      `https://waivio.nyc3.digitaloceanspaces.com/avatar/${username}?${lastAccountUpdate}`,
    );
  });

  it('should return images.hive.blog link with lastAccountUpdate', () => {
    const lastAccountUpdate = `${Date.now()}`.slice(0, 10);

    username = 'unsername';
    size = 50;
    authenticatedUser = {
      name: 'unsername',
    };
    expect(getAvatarURL(username, size, authenticatedUser)).toBe(
      `https://images.hive.blog/u/${username}/avatar/large?${lastAccountUpdate}`,
    );
  });

  it('should return images.hive.blog link without lastAccountUpdate', () => {
    username = 'unsername';
    size = 70;
    authenticatedUser = {};
    expect(getAvatarURL(username, size, authenticatedUser)).toBe(
      `https://images.hive.blog/u/${username}/avatar`,
    );
  });

  it('should return images.hive.blog link without lastAccountUpdate and small', () => {
    username = 'unsername';
    size = 50;
    authenticatedUser = {};
    expect(getAvatarURL(username, size, authenticatedUser)).toBe(
      `https://images.hive.blog/u/${username}/avatar/small`,
    );
  });
});
