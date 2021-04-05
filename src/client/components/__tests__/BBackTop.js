import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import BBackTop from '../BBackTop';

describe('<BBackTop />', () => {
  it('renders without exploding', () => {
    const props = {
      className: 'comments',
      isModal: false,
    };
    const wrapper = shallow(<BBackTop {...props} />);

    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });
});
