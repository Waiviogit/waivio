import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import UserMenu from '../UserMenu';

describe('<UserMenu />', () => {
  it('renders without exploding', () => {
    const props = {
      defaultKey: 'comments',
      followers: 42,
      following: 21,
    };
    const wrapper = shallow(<UserMenu {...props} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });
});
