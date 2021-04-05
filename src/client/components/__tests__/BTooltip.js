import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import BTooltip from '../BTooltip';

describe('<BTooltip />', () => {
  let props;

  beforeEach(() => {
    props = {
      title: 'title',
    };
  });

  afterEach(() => jest.clearAllMocks());
  it('renders without exploding', () => {
    const wrapper = shallow(<BTooltip {...props} />);

    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('Should render Tooltip', () => {
    const wrapper = mount(<BTooltip {...props} />);

    act(() => {
      wrapper.update();
    });
    expect(wrapper.find('Tooltip')).toBeDefined();
  });
});
