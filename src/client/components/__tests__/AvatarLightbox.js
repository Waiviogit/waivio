import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AvatarLightbox from '../AvatarLightbox';

describe('<AvatarLightbox />', () => {
  const mockStore = configureStore();
  let props;
  let store;
  let wrapper;

  beforeEach(() => {
    props = {
      username: 'username',
      size: 50,
      isActive: false,
    };

    store = mockStore({
      auth: {
        user: {
          name: 'username',
        },
      },
    });

    wrapper = mount(
      <Provider store={store}>
        <AvatarLightbox {...props} />
      </Provider>,
    );
    act(() => {
      wrapper.update();
    });
  });

  it('renders without exploding', () => {
    store = mockStore();
    wrapper = shallow(
      <Provider store={store}>
        <AvatarLightbox {...props} />
      </Provider>,
    );
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('Should have defaultProps', () => {
    const defaultProps = {
      username: undefined,
      size: 100,
      isActive: false,
    };

    store = mockStore();
    wrapper = shallow(
      <Provider store={store}>
        <AvatarLightbox {...props} />
      </Provider>,
    );
    act(() => {
      wrapper.update();
    });
    expect(wrapper.props().children.type.defaultProps).toEqual(defaultProps);
  });

  it('Should render Avatar component with same username and size props', () => {
    const AvatarPros = {
      username: 'username',
      size: 50,
    };
    expect(wrapper.find('Avatar').props()).toEqual(AvatarPros);
  });

  it('Should render div UserHeader__container--active with isActive = true prop', () => {
    props = {
      username: 'username',
      size: 50,
      isActive: true,
    };

    wrapper = mount(
      <Provider store={store}>
        <AvatarLightbox {...props} />
      </Provider>,
    );
    act(() => {
      wrapper.update();
    });
    expect(wrapper.find('.UserHeader__container--active')).toHaveLength(1);
    expect(wrapper.find('.UserHeader__container--active')).not.toBeUndefined();
  });
});
