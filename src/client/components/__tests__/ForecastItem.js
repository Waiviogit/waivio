import configureMockStore from 'redux-mock-store';
import React from 'react';
import thunk from 'redux-thunk';
import ForecastItem from '../ForecastItem/ForecastItem';
import { mountWithStore, shallowWithStore } from './shallowWrapper';

const mockStore = configureMockStore([thunk]);
const store = mockStore({});

describe('<ForecastItem />', () => {
  const propsWhithWobj = {
    dateTimeCreate: '2019-07-04T11:02:36.000Z',
    forecast: '2019-07-04T15:02:36.000Z',
    intl: { locale: 'en' },
    postPrice: 0.91708,
    quoteSecurity: 'AUDCAD',
    recommend: 'Sell',
    quote: {
      askPrice: '-',
      bidPrice: '-',
      dailyChange: 0,
      isSession: true,
      security: '-',
      state: 'not-update',
      timestamp: null,
    },
    quoteSettings: {
      ID: null,
      defaultQuantity: 0,
      isSession: false,
      leverage: null,
      market: 'Currency',
      maximumQuantity: null,
      minimumQuantity: null,
      name: '-',
      popular: null,
      priceRounding: null,
      quantityIncrement: null,
      tickSize: null,
      wobjData: {
        author_permlink: 'abc',
        avatarlink: null,
      },
    },
  };
  const propsWhithoutWobj = {
    dateTimeCreate: '2019-07-04T11:02:36.000Z',
    forecast: '2019-07-04T15:02:36.000Z',
    intl: { locale: 'en' },
    postPrice: 0.91708,
    quoteSecurity: 'AUDCAD',
    recommend: 'Sell',
    quote: {
      askPrice: '-',
      bidPrice: '-',
      dailyChange: 0,
      isSession: true,
      security: '-',
      state: 'not-update',
      timestamp: null,
    },
    quoteSettings: {
      ID: null,
      defaultQuantity: 0,
      isSession: false,
      leverage: null,
      market: 'Currency',
      maximumQuantity: null,
      minimumQuantity: null,
      name: '-',
      popular: null,
      priceRounding: null,
      quantityIncrement: null,
      tickSize: null,
    },
  };

  it('renders component without crashing', () => {
    const wrapper = shallowWithStore(<ForecastItem {...propsWhithWobj} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render component if proporties is exist in quoteSettings object', () => {
    const component = mountWithStore(<ForecastItem {...propsWhithWobj} />, store);
    const mainDiv = component.find('.st-forecast-wrap');
    expect(mainDiv).toHaveLength(1);
  });

  it('should render component if proporties is not exist in quoteSettings object', () => {
    const component = mountWithStore(<ForecastItem {...propsWhithoutWobj} />, store);
    const mainDiv = component.find('.st-forecast-wrap');
    expect(mainDiv).toHaveLength(0);
  });

  it('should call the handleBtnClick method', () => {
    const component = mountWithStore(<ForecastItem {...propsWhithWobj} />, store);
    const mainDiv = component.find('.st-forecast-wrap__icon-img');
    mainDiv.at(1).simulate('click');
    const notMainDiv = component.find('.enabled');
    console.log(component.html());
    expect(notMainDiv).toHaveLength(1);
  });
});
