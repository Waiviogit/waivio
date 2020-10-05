import React from 'react';
import { shallow } from 'enzyme';
import DEFAULTS from '../../object/const/defaultValues';
import ObjectAvatar from '../ObjectAvatar';
import { getProxyImageURL } from '../../helpers/image';

describe('<ObjectAvatar />', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      item: {
        parent: { avatar: 'parent_avatar' },
        avatar: 'avatar',
      },
      size: 42,
    };

    wrapper = shallow(<ObjectAvatar {...props} />);
  });

  afterEach(() => jest.clearAllMocks());

  it('renders without exploding', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should be item avatar', () => {
    expect(wrapper.props().style.backgroundImage).toBe(
      `url(${getProxyImageURL(props.item.avatar, 'preview')})`,
    );
    expect(wrapper.props().style.width).toBe(`${props.size}px`);
    expect(wrapper.props().style.height).toBe(`${props.size}px`);
  });

  it('have to get parent avatar, if don`t have item avatar', () => {
    const currProps = {
      avatar: '',
      item: {
        parent: {
          avatar: 'parentAvatar',
        },
      },
    };
    wrapper = shallow(<ObjectAvatar {...currProps} />);

    expect(wrapper.props().style.backgroundImage).toBe(
      `url(${getProxyImageURL(currProps.item.parent.avatar, 'preview')})`,
    );
  });

  it('should have default url with prefix _medium', () => {
    const currProps = {
      item: {},
      size: 42,
    };
    wrapper = shallow(<ObjectAvatar {...currProps} />);

    expect(wrapper.props().style.backgroundImage).toBe(`url(${DEFAULTS.AVATAR}_medium)`);
  });

  it('should have default url with prefix _small', () => {
    const currProps = {
      item: {},
      size: 39,
    };
    wrapper = shallow(<ObjectAvatar {...currProps} />);

    expect(wrapper.props().style.backgroundImage).toBe(`url(${DEFAULTS.AVATAR}_small)`);
  });

  it('should have style rules as prop size', () => {
    props.item = {};
    const style = {
      minWidth: `${props.size}px`,
      width: `${props.size}px`,
      height: `${props.size}px`,
      backgroundImage: `url(${DEFAULTS.AVATAR}_medium)`,
    };
    wrapper = shallow(<ObjectAvatar {...props} />);

    expect(wrapper.props().style).toEqual(style);
  });
});
