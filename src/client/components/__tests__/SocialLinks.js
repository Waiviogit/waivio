import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import SocialLinks from '../SocialLinks';

describe('<SocialLinks />', () => {
  it('renders without exploding', () => {
    const wrapper = mount(<SocialLinks profile={{}} />);

    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });
});
