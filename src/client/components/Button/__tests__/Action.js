import React from 'react';
import { shallow, mount } from 'enzyme';
import Action from '../Action';

describe('<Action />', () => {
  it('renders without exploding', () => {
    const props = {
      loading: true,
      disabled: false,
      primary: true,
    };
    const wrapper = shallow(<Action {...props}>Example text</Action>);

    expect(wrapper).toMatchSnapshot();
  });

  it('should include Action--primary in className', () => {
    const props = {
      loading: true,
      disabled: false,
      primary: true,
    };
    const wrapper = shallow(<Action {...props}>Example text</Action>);

    expect(wrapper.props().className).toBe('Action Action--primary');
  });

  it('should include Action--big in className', () => {
    const props = {
      loading: true,
      disabled: false,
      big: true,
    };
    const wrapper = shallow(<Action {...props}>Example text</Action>);

    expect(wrapper.props().className).toBe('Action Action--big');
  });

  it('should render Icon', () => {
    const props = {
      loading: true,
      disabled: false,
      big: true,
    };
    const wrapper = mount(<Action {...props}>Example text</Action>);

    expect(wrapper.find('Icon')).not.toBeUndefined();
  });

  it('should have Text as a child', () => {
    const props = {
      loading: true,
      disabled: false,
      big: true,
    };
    const wrapper = mount(<Action {...props}>Example text</Action>);

    expect(wrapper.text()).toBe('Example text');
  });
});
