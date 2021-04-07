import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';

import FacebookShare from '../FacebookShare';

describe('<FacebookShare />', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      url: '',
    };

    wrapper = mount(<FacebookShare {...props} />);
    act(() => {
      wrapper.update();
    });
  });

  it('Should include ShareButton in className in tag a ', () => {
    expect(wrapper.find('a').props().className).toBe('ShareButton');
  });

  it('Should include ShareButton__contents ShareButton__contents__facebook in className in tag div ', () => {
    expect(wrapper.find('div').props().className).toBe(
      'ShareButton__contents ShareButton__contents__facebook',
    );
  });

  it('Should include iconfont icon-facebook ShareButton__icon in className in tag i ', () => {
    expect(wrapper.find('i').props().className).toBe('iconfont icon-facebook ShareButton__icon');
  });

  it('should render without exploding', () => {
    wrapper = shallow(<FacebookShare {...props} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('Should have defaultProps', () => {
    const defaultProps = {
      url: '',
    };

    expect(FacebookShare.defaultProps).toEqual(defaultProps);
  });

  it('Should have smth with the same text as url prop', () => {
    const url = wrapper.find('FacebookShare');

    expect(url.text()).toBe('');
  });

  it('Should not to be undefined component', () => {
    expect(wrapper).not.toBeUndefined();
  });
});
