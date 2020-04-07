import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import SocialLink from '../SocialLink';

describe('<SocialLink />', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      profile: {
        id: 'id',
        icon: 'profile icon',
        name: 'profile name',
        color: 'red',
      },
      url: 'url',
    };
    wrapper = mount(<SocialLink {...props} />);
    act(() => {
      wrapper.update();
    });
  });

  afterEach(() => jest.clearAllMocks());

  it('renders without exploding', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('tag i should include profile.icon in className', () => {
    const iTag = wrapper.find('i');
    const result = iTag.props().className;
    expect(result).toBe(`iconfont text-icon icon-${props.profile.icon}`);
  });

  it('tag i should have color style rules as a prop color', () => {
    const iTag = wrapper.find('i');
    const result = iTag.props().style;
    const exp = {
      color: props.profile.color,
    };

    expect(result).toEqual(exp);
  });

  it('tag a should have href atr as a url prop', () => {
    const aTag = wrapper.find('a');
    const result = aTag.props().href;
    const exp = props.url;
    expect(result).toBe(exp);
  });

  it('tag a should have text as a name prop', () => {
    const aTag = wrapper.find('a');
    const result = aTag.text();
    const exp = props.profile.name;
    expect(result).toBe(exp);
  });
});
