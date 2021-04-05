import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import IconButton from '../IconButton';

describe('<IconButton />', () => {
  let props;
  let wrapper;
  let onClick;

  beforeEach(() => {
    onClick = jest.fn();
    props = {
      icon: 'comments',
      caption: 'caption',
      onClick,
      className: 'className',
      disabled: false,
    };

    wrapper = mount(<IconButton {...props} />);
    act(() => {
      wrapper.update();
    });
  });

  it('renders without exploding', () => {
    wrapper = shallow(<IconButton {...props} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('Should include className as in prop', () => {
    expect(wrapper.props().className).toBe('className');
  });

  it('Should call onClick', () => {
    wrapper.simulate('click');
    expect(onClick).toBeCalled();
  });

  it('Should have caption div with txt same as caption prop', () => {
    const caption = wrapper.find('.icon-button__text');

    expect(caption.text()).toBe('caption');
  });
});
