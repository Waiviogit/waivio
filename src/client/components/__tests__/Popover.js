import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import Popover from '../Popover';

describe('<PopoverContainer />', () => {
  let props;
  let wrapper;
  let onClick;

  beforeEach(() => {
    onClick = jest.fn();

    props = {
      onVisibleChange: onClick,
      content: 'some text',
    };

    wrapper = mount(<Popover {...props} />);
    act(() => {
      wrapper.update();
    });
  });

  test('Should render without exploding', () => {
    wrapper = shallow(<Popover {...props} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });

  test('Should call onClick', () => {
    wrapper.find('.Popover__overlay').simulate('click');
    expect(onClick).toBeCalled();
  });

  test('Should call "onVisibleChange" on click action', () => {
    wrapper.find('.Popover__overlay').simulate('click');
    expect(wrapper.props().onVisibleChange).toBeCalled();
  });

  test('Should have custom content with the same text as content prop', () => {
    const content = wrapper.find('.Popover__overlay');
    expect(content.text()).toBe('some text');
  });
});
