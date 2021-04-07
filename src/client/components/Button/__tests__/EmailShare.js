import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';

import EmailShare from '../EmailShare';

describe('<EmailShare />', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      url: '',
      text: '',
    };

    wrapper = mount(<EmailShare {...props} />);
    act(() => {
      wrapper.update();
    });
  });

  it('Should include ShareButton in className in tag a ', () => {
    expect(wrapper.find('a').props().className).toBe('ShareButton');
  });

  it('Should include ShareButton__contents ShareButton__contents__email in className in tag div ', () => {
    expect(wrapper.find('div').props().className).toBe(
      'ShareButton__contents ShareButton__contents__email',
    );
  });

  it('Should include iconfont icon-mail_fill ShareButton__icon__icon in className in tag i ', () => {
    expect(wrapper.find('i').props().className).toBe('iconfont icon-mail_fill ShareButton__icon');
  });

  it('should render without exploding', () => {
    wrapper = shallow(<EmailShare {...props} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('Should have defaultProps', () => {
    const defaultProps = {
      url: '',
      text: '',
    };

    expect(EmailShare.defaultProps).toEqual(defaultProps);
  });

  it('Should have smth with the same text as url prop', () => {
    const url = wrapper.find('EmailShare');

    expect(url.text()).toBe('');
  });

  it('Should have smth with the same text as text prop', () => {
    const text = wrapper.find('EmailShare');

    expect(text.text()).toBe('');
  });

  it('Should not to be undefined component', () => {
    expect(wrapper).not.toBeUndefined();
  });
});
