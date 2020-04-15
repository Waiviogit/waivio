import React from 'react';
import { act } from 'react-dom/test-utils';

import { shallow, mount } from 'enzyme';
import Confirmation from '../Confirmation';

describe('<Confirmation />', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      onConfirm: () => {},
      onCancel: () => {},
    };

    wrapper = mount(<Confirmation {...props} />);
    act(() => {
      wrapper.update();
    });
  });

  it('Should include Confirmation in className in tag div ', () => {
    expect(wrapper.find('div').props().className).toBe('Confirmation');
  });

  it('should render without exploding', () => {
    wrapper = shallow(<Confirmation {...props} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('Should not to be undefined component', () => {
    expect(wrapper).not.toBeUndefined();
  });
});
