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
});
