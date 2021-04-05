import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import TwitterShare from '../TwitterShare';

describe('<TwitterShare />', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      url: 'url',
      text: 'text',
      hashtags: ['hashtags'],
    };

    wrapper = mount(<TwitterShare {...props} />);
    act(() => {
      wrapper.update();
    });
  });

  it('Should include ShareButton in className in tag a ', () => {
    expect(wrapper.find('a').props().className).toBe('ShareButton');
  });

  it('Should include ShareButton__contents ShareButton__contents__twitter in className in tag div ', () => {
    expect(wrapper.find('div').props().className).toBe(
      'ShareButton__contents ShareButton__contents__twitter',
    );
  });

  it('Should include iconfont icon-twitter ShareButton__icon in className in tag i ', () => {
    expect(wrapper.find('i').props().className).toBe('iconfont icon-twitter ShareButton__icon');
  });

  it('should render without exploding', () => {
    wrapper = shallow(<TwitterShare {...props} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('Should have defaultProps', () => {
    const defaultProps = {
      url: '',
      text: '',
      hashtags: [],
    };

    expect(TwitterShare.defaultProps).toEqual(defaultProps);
  });

  it('Should have smth with the same text as url prop', () => {
    const url = wrapper.find('TwitterShare');

    expect(url.text()).toBe('');
  });

  it('Should have smth with the same text as text prop', () => {
    const text = wrapper.find('TwitterShare');

    expect(text.text()).toBe('');
  });

  it('Should not to be undefined component', () => {
    expect(wrapper).not.toBeUndefined();
  });
});
