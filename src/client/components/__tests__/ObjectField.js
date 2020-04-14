import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import ObjectField from '../ObjectField';

describe('<ObjectField />', () => {
  it('renders without exploding', () => {
    const wrapper = shallow(<ObjectField name={'name'} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('Should have text as name prop', () => {
    const wrapper = shallow(<ObjectField name={'name'} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper.text()).toBe('name');
  });
});
