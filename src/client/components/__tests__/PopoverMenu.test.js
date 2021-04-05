import React from 'react';
import { shallow } from 'enzyme';
import PopoverMenu from '../PopoverMenu/PopoverMenu';

describe('(Component) PopoverMenu', () => {
  it('renders and matches snapshot', () => {
    const wrapper = shallow(<PopoverMenu />);

    expect(wrapper).toMatchSnapshot();
  });
});
