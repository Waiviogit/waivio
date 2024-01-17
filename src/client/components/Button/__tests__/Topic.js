import React from 'react';
import { shallow, mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Topic from '../Topic';

describe('<Topic />', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      name: 'exampletopic',
      favorite: true,
      closable: true,
    };

    wrapper = mount(
      <Router>
        <Topic {...props} />
      </Router>,
    );

    act(() => {
      wrapper.update();
    });
  });

  it('renders without exploding', () => {
    wrapper = shallow(<Topic {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should renred i tag', () => {
    expect(wrapper.find('i')).not.toBeUndefined();
  });

  it('renders include Topic--closing in className', () => {
    wrapper.find('i').simulate('mouseover');
    expect(wrapper.find('Link').props().className).toBe('Topic Topic--favorite Topic--closing');
  });

  it('renders include Topic--favorite in className', () => {
    expect(wrapper.find('Link').props().className).toBe('Topic Topic--favorite');
  });
});
