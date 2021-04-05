import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import HorizontalBarChart from '../HorizontalBarChart';

describe('<HorizontalBarChart />', () => {
  const props = {
    current: 1,
    total: 4,
  };

  it('renders without exploding', () => {
    const wrapper = shallow(<HorizontalBarChart {...props} />);

    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('Should have barChartElements as total prop', () => {
    const wrapper = mount(<HorizontalBarChart {...props} />);

    act(() => {
      wrapper.update();
    });
    const barChartElements = wrapper.find('.HorizontalBarChart__bar');

    expect(barChartElements.length).toBe(4);
    expect(barChartElements).toHaveLength(4);
  });

  it('Should include selected in className in barChartElement if <= current prop', () => {
    const wrapper = mount(<HorizontalBarChart {...props} />);

    act(() => {
      wrapper.update();
    });
    const barChartElements = wrapper.find('.HorizontalBarChart__bar');

    expect(barChartElements.at(0).props().className).toBe(
      'HorizontalBarChart__bar HorizontalBarChart__bar__selected',
    );

    expect(barChartElements.at(1).props().className).toBe('HorizontalBarChart__bar');
  });
});
