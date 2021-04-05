import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import ActionLink from '../../Button/ActionLink';

describe('<ActionLink />', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      primary: false,
      children: 'some text',
      className: 'some classname text',
      small: false,
    };

    wrapper = mount(<ActionLink {...props} />);
    act(() => {
      wrapper.update();
    });
  });

  it('should render without exploding', () => {
    wrapper = shallow(<ActionLink {...props} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('Should include className as in prop', () => {
    expect(wrapper.props().className).toBe('some classname text');
  });

  it('Should not to be undefined component', () => {
    expect(wrapper).not.toBeUndefined();
  });

  it('Should have smth with the same text as children prop', () => {
    const children = wrapper.find('.Action');

    expect(children.text()).toBe('some text');
  });

  it('Should include ant-btn-lg in className', () => {
    props = {
      primary: false,
      children: 'children',
      small: false,
    };

    wrapper = mount(<ActionLink {...props} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper.find('a').props().className).toBe('Action ant-btn-lg');
  });

  it('Should include Action--primary in className', () => {
    props = {
      primary: true,
      children: 'children',
      small: true,
    };
    wrapper = mount(<ActionLink {...props} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper.find('a').props().className).toBe('Action Action--primary');
  });

  it('Should include ant-btn-lg and Action--primary in className', () => {
    props = {
      primary: true,
      children: 'children',
      small: false,
    };
    wrapper = mount(<ActionLink {...props} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper.find('a').props().className).toBe('Action ant-btn-lg Action--primary');
  });

  it('Should have defaultProps', () => {
    const defaultProps = {
      className: '',
      children: null,
      primary: false,
      small: false,
    };

    expect(ActionLink.defaultProps).toEqual(defaultProps);
  });
});
