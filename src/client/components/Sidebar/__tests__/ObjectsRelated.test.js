import React from 'react';
import { mountWithIntl } from 'enzyme-react-intl';
import { act } from 'react-dom/test-utils';
// import setupMockStates from 'jest-react-hooks-mock';

// import finaly from './eventually';
import ObjectsRelated from '../ObjectsRelated/ObjectsRelated';

jest.mock('../../../../waivioApi/ApiClient');
jest.mock('../ObjectCard', () => () => <div className="ObjectCard" />);

describe('ObjectsRelated component', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      wobject: {
        author_permlink: 'iwh-sushi-mura',
      },
    };

    act(() => {
      wrapper = mountWithIntl(<ObjectsRelated {...props} />);
    });
  });

  afterEach(() => jest.clearAllMocks());

  it('should have proper props', () => {
    act(() => {
      wrapper.update();
    });
    expect(wrapper.prop('wobject')).toEqual({ author_permlink: 'iwh-sushi-mura' });
  });

  it('Should render placeholder first', () => {
    expect(wrapper.find('#RightSidebarLoading').length).toEqual(1);
  });

  it('should render a block with related objects', () => {
    act(() => {
      wrapper.update();
    });
    const component = wrapper.find('.SidebarContentBlock');
    expect(component).toHaveLength(1);
  });

  it('Should render proper number of ObjectCard components', () => {
    act(() => {
      wrapper.update();
    });
    const objectCard = wrapper.find('.ObjectCard');
    expect(objectCard).toHaveLength(3);
  });

  it('should render Show more a Explore buttons', async () => {
    act(() => {
      wrapper.update();
    });
    const buttons = wrapper.find('.ObjectsRelated__more');
    expect(buttons).toHaveLength(1);
  });

  it('should render modal when Show more button is clicked', async () => {
    act(() => {
      wrapper.update();
      wrapper
        .find('#show_more')
        .props()
        .onClick();
    });

    act(() => {
      wrapper.update();
    });
    const modal = wrapper.find('#ObjectRelated__Modal').first();
    expect(modal.prop('visible')).toBe(true);
  });

  it('should render proper number of cards in modal', async () => {
    act(() => {
      wrapper.update();
      wrapper
        .find('#show_more')
        .props()
        .onClick();
    });

    act(() => {
      wrapper.update();
    });
    const modal = wrapper.find('#ObjectRelated__Modal').first();
    expect(modal.prop('children')[0]).toHaveLength(3);
  });

  it('should change showModal to true when Show more button is clicked', async () => {
    // const promise = setupMockStates(['objectsWithMaxFields', 'showModal', 'skipValue']);
    act(() => {
      wrapper.update();
      wrapper
        .find('#show_more')
        .props()
        .onClick();
    });

    act(() => {
      wrapper.update();
    });
  });
});

// describe('Test', () => {
//   it('run it', async () => {
//     const promise = setupMockStates(['objectsWithMaxFields', 'showModal', 'skipValue']);
//
//     shallow(<ObjectsRelated wobject={{ author_permlink: 'iwh-sushi-mura' }} />);
//
//     const [states, [a, b, c]] = await promise;
//
//     b(true);
//
//     expect(states.showModal).toEqual(true);
//   });
// });
