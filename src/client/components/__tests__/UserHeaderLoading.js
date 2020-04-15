import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import UserHeaderLoading from '../UserHeaderLoading';

describe('UserHeaderLoading component', () => {
  let wrapper;
  let UserHeaderLoadingAvatar;
  let AntCardLoadingBlock;

  beforeEach(() => {
    wrapper = mount(<UserHeaderLoading />);

    act(() => {
      wrapper.update();
    });

    UserHeaderLoadingAvatar = wrapper.find('.UserHeaderLoading__avatar');
    AntCardLoadingBlock = wrapper.find('.ant-card-loading-block');
  });

  test('Should not to be undefined', () => {
    expect(wrapper).not.toBeUndefined();
  });

  test('should render without exploding', () => {
    wrapper = shallow(<UserHeaderLoading />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });

  test('Should not to be undefined components', () => {
    expect(UserHeaderLoadingAvatar).not.toBeUndefined();
    expect(AntCardLoadingBlock).not.toBeUndefined();
  });
});
