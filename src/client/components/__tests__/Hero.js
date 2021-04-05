import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import Hero from '../Hero';

describe('<Hero />', () => {
  it('renders without exploding', () => {
    const wrapper = mount(<Hero />);

    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });
});
