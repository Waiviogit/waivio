import React from 'react';
import { mount, shallow } from 'enzyme';
import SkeletonCustom from '../Skeleton/SkeletonCustom';

describe('<SkeletonCustom />', () => {
  let props;
  let wrapper;
  let div;

  beforeEach(() => {
    props = {
      isLoading: true,
      rows: 9,
      width: 100,
      randomWidth: false,
      className: 'className',
    };
    wrapper = shallow(<SkeletonCustom {...props} />);
    div = wrapper.find('div');
  });

  afterEach(() => jest.clearAllMocks());

  it('Should not be undefined', () => {
    expect(wrapper).not.toBeUndefined();
  });

  it('Should have class as "className" ', () => {
    expect(div.props().className).toBe('className');
  });

  it('Should not be undefined <Skeleton/>', () => {
    const skeleton = div.find('div');

    expect(skeleton).not.toBeUndefined();
  });

  it('Should not be undefined if randomWidth: true', () => {
    props.randomWidth = true;
    wrapper = mount(<SkeletonCustom {...props} />);
    expect(wrapper).not.toBeUndefined();
  });
});
