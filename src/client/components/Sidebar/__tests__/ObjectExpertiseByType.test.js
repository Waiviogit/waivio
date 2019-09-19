import React from 'react';
import { mountWithIntl } from 'enzyme-react-intl';
import { act } from 'react-dom/test-utils';
import ObjectExpertiseByType from '../ObjectExpertiseByType/ObjectExpertiseByType';

jest.mock('../../../../waivioApi/ApiClient');
jest.mock('../../UserCard', () => () => <div className="UserCard" />);

describe('ObjectExpertiseByType component', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      typeName: 'test',
    };

    wrapper = mountWithIntl(<ObjectExpertiseByType {...props} />);
  });

  afterEach(() => jest.clearAllMocks());

  it('should have proper props', () => {
    act(() => {
      wrapper.update();
    });
    expect(wrapper.prop('typeName')).toEqual('test');
  });

  it('Should render placeholder first', () => {
    expect(wrapper.find('#RightSidebarLoading').length).toEqual(1);
  });

  it('should render a block with experts', () => {
    act(() => {
      wrapper.update();
    });
    const component = wrapper.find('.SidebarContentBlock');
    expect(component).toHaveLength(1);
  });

  it('Should render proper number of UserCard components', () => {
    act(() => {
      wrapper.update();
    });
    const objectCard = wrapper.find('.UserCard');
    expect(objectCard).toHaveLength(5);
  });

  it('should render Show more and Explore buttons', async () => {
    act(() => {
      wrapper.update();
    });
    const buttons = wrapper.find('.ObjectExpertiseByType__more');
    expect(buttons).toHaveLength(1);
  });

  it('should render modal when Show more button is clicked', async () => {
    act(() => {
      wrapper.update();
      wrapper
        .find('#show_more_div')
        .props()
        .onClick();
    });

    act(() => {
      wrapper.update();
    });
    const modal = wrapper.find('#ObjectExpertiseByType__Modal').childAt(0);
    expect(modal.prop('visible')).toBe(true);
  });

  it('should render proper number of cards in modal', async () => {
    act(() => {
      wrapper.update();
      wrapper
        .find('#show_more_div')
        .props()
        .onClick();
    });

    act(() => {
      wrapper.update();
    });

    await wrapper
      .find('#ObjectExpertiseByType__Modal')
      .props()
      .onWheel();

    act(() => {
      wrapper.update();
    });

    const userCards = wrapper.find('#ObjectExpertiseByType__Modal').find('.UserCard');
    expect(userCards).toHaveLength(8);
  });
});
