import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mountWithIntl } from 'enzyme-react-intl';
import { act } from 'react-dom/test-utils';
import Debts from '../Debts';
import { mockDataDebts } from '../__mock__/mockData';

jest.mock('../../PaymentCard/PaymentCard', () => () => <div className="PaymentCard" />);

describe('Debts', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      debtObjsData: {
        histories: [],
        payable: 0.21,
      },
      currentSteemPrice: 0.2,
      componentLocation: '/rewards/payables',
    };

    wrapper = mountWithIntl(<Debts {...props} />);
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

    const component = mountWithIntl(<Debts {...props} />);
    const container = component.find('.PaymentCard');
    expect(container).toHaveLength(3);
  });

  it('should return empty string without payable', () => {
    const props = {
      debtObjsData: {},
      currentSteemPrice: 0.2,
      componentLocation: '/rewards',
    };

    const component = mountWithIntl(<Debts {...props} />);
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
    wrapper = mountWithIntl(<Debts {...mockDataDebts} />);
    act(() => {
      wrapper.update();
    });
    const container = wrapper.find('.PaymentCard');
    expect(container).toHaveLength(3);
  });
});
