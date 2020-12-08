import React from 'react';
import { act } from 'react-dom/test-utils';
import { IntlProvider } from 'react-intl';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import Debts from '../Debts';
import { mockDataDebts } from '../__mock__/mockData';

jest.mock('../../PaymentCard/PaymentCard', () => () => <div className="PaymentCard" />);

describe('Debts', () => {
  const mockStore = configureStore();
  let wrapper;

  beforeEach(() => {
    const props = {
      debtObjsData: {
        histories: [],
        payable: 0.21,
      },
      currentSteemPrice: 0.2,
      componentLocation: '/rewards/payables',
      activeFilters: [{}],
      setPayablesFilterValue: () => {},
    };

    wrapper = mount(
      <Provider store={mockStore()}>
        <IntlProvider locale="en">
          <Debts {...props} />
        </IntlProvider>
      </Provider>,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should change way', () => {
    const props = {
      debtObjsData: {
        histories: mockDataDebts.debtObjsData.histories,
        payable: 0.21,
      },
      currentSteemPrice: 0.2,
      componentLocation: '/rewards',
    };

    const component = mount(
      <Provider store={mockStore()}>
        <IntlProvider locale="en">
          <Debts {...props} />
        </IntlProvider>
      </Provider>,
    );
    const container = component.find('.PaymentCard');
    expect(container).toHaveLength(3);
  });

  it('should return empty string without payable', () => {
    const props = {
      debtObjsData: {},
      currentSteemPrice: 0.2,
      componentLocation: '/rewards',
    };

    const component = mount(
      <Provider store={mockStore()}>
        <IntlProvider locale="en">
          <Debts {...props} />
        </IntlProvider>
      </Provider>,
    );
    const container = component.find('.Debts');
    expect(container).toHaveLength(1);
  });

  it('should render Debts wrap', () => {
    act(() => {
      wrapper.update();
    });
    const container = wrapper.find('.Debts');
    expect(container).toHaveLength(1);
  });

  it('should render Debts__information-row wrap', () => {
    act(() => {
      wrapper.update();
    });
    const container = wrapper.find('.Debts__information-row');
    expect(container).toHaveLength(1);
  });

  it('should render Debts__information-row-total-title wrap', () => {
    act(() => {
      wrapper.update();
    });
    const container = wrapper.find('.Debts__information-row-total-title');
    expect(container).toHaveLength(1);
  });

  it('should render 3 cards', () => {
    wrapper = mount(
      <Provider store={mockStore()}>
        <IntlProvider locale="en">
          <Debts {...mockDataDebts} />
        </IntlProvider>
      </Provider>,
    );
    act(() => {
      wrapper.update();
    });
    const container = wrapper.find('.PaymentCard');
    expect(container).toHaveLength(3);
  });
});
