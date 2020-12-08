import React from 'react';
import { shallow } from 'enzyme';
import PopoverMenuItem from '../PopoverMenu/PopoverMenuItem';

describe('(Component) PopoverMenuItem', () => {
  it('renders and matches snapshot', () => {
    const wrapper = shallow(<PopoverMenuItem />);
    expect(wrapper).toMatchSnapshot();
  });
});
