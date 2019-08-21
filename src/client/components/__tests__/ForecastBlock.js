import configureMockStore from 'redux-mock-store';
import React from 'react';
import thunk from 'redux-thunk';
import ForecastBlock from '../ForecastBlock/ForecastBlock';
import { mountWithStore, shallowWithStore } from './shallowWrapper';

const mockStore = configureMockStore([thunk]);
const store = mockStore({
  quotes: {
    security: 'AUDCAD',
    bidPrice: '155.570',
    askPrice: '161.830',
    dailyChange: 3.7687,
    timestamp: 1562583219562,
    isSession: true,
    state: 'down',
  },
  quotesSettings: {
    ID: 1,
    market: 'Currency',
    name: 'AUD/CAD',
    priceRounding: 100000,
    leverage: 200,
    defaultQuantity: 500000000000,
    maximumQuantity: 40000000000000,
    minimumQuantity: 100000000000,
    quantityIncrement: 100000000000,
    tickSize: 100,
    popular: false,
    baseCurrency: 'AUD',
    termCurrency: 'CAD',
    keyName: 'AUDCAD',
  },
  object: {
    wobject: {
      _id: '5cb0b5b3f03c2c421e5095fd',
      albums_count: 0,
      app: 'waiviodev/1.0.0',
      author: 'w7ngc',
      author_permlink: 'iav-audcad',
      createdAt: '2019-04-12T15:58:43.788Z',
      creator: 'wiv01',
      default_name: 'audcad',
      fields: [
        {
          weight: 1,
          locale: 'en-US',
          _id: '5cb0b5b6f03c2c421e50988e',
          creator: 'wiv01',
          author: 'x6oc5',
          permlink: 'wiv01-inaz24rigue',
          name: 'chartid',
          body: 'audcad',
        },
      ],
    },
  },
});

describe('<ForecastBlock />', () => {
  const forecast = [
    {
      author: 'z1wo5',
      created_at: '2019-07-04T11:02:36.000Z',
      forecast: '2019-07-04T15:02:36.000Z',
      id: 'z1wo5/aud-cad',
      permlink: 'aud-cad',
      postPrice: 0.91708,
      recommend: 'Sell',
      security: 'AUDCAD',
    },
  ];

  it('should render component without crashing', () => {
    const props = {
      username: 'z1wo5',
      forecastsByObject: Array(5),
      forecastsByUser: Array(5),
    };
    const wrapper = shallowWithStore(<ForecastBlock {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render component by object with props in rightObjectSidebar if it's chart object", () => {
    const props = {
      username: 'z1wo5',
      quoteSecurity: 'AUDCAD',
      forecasts: forecast,
      renderPlace: 'rightObjectSidebar',
    };
    const component = mountWithStore(<ForecastBlock {...props} />, store);
    const mainDiv = component.find('.st-forecast-wrap');
    expect(mainDiv).toHaveLength(1);
  });

  it("should not render component by object in rightObjectSidebar if it's chart object", () => {
    const props = {
      username: 'z1wo5',
      quoteSecurity: 'AUDCAD',
      renderPlace: 'rightObjectSidebar',
    };
    const component = mountWithStore(<ForecastBlock {...props} />, store);
    const mainDiv = component.find('.st-forecast-wrap');
    expect(mainDiv).toHaveLength(0);
  });

  it("should not render component by object without render place if it's chart object", () => {
    const props = {
      username: 'z1wo5',
      quoteSecurity: 'AUDCAD',
    };
    const component = mountWithStore(<ForecastBlock {...props} />, store);
    const mainDiv = component.find('.st-forecast-wrap');
    expect(mainDiv).toHaveLength(0);
  });

  it("should not render component by object without render place with props if it's chart object", () => {
    const props = {
      username: 'z1wo5',
      quoteSecurity: 'AUDCAD',
      forecasts: forecast,
    };
    const component = mountWithStore(<ForecastBlock {...props} />, store);
    const mainDiv = component.find('.st-forecast-wrap');
    expect(mainDiv).toHaveLength(0);
  });

  it("should not render component by object in rightObjectSidebar if it's not chart object", () => {
    const props = {
      username: 'z1wo5',
      quoteSecurity: '',
      renderPlace: 'rightObjectSidebar',
    };
    const component = mountWithStore(<ForecastBlock {...props} />, store);
    const mainDiv = component.find('.st-forecast-wrap');
    expect(mainDiv).toHaveLength(0);
  });

  it("should not render component by object without render place if it's not chart object", () => {
    const props = {
      username: 'z1wo5',
      quoteSecurity: '',
    };
    const component = mountWithStore(<ForecastBlock {...props} />, store);
    const mainDiv = component.find('.st-forecast-wrap');
    expect(mainDiv).toHaveLength(0);
  });

  it('should render component by user without quoteSecurity with username in rightSidebar with props', () => {
    const props = {
      username: 'z1wo5',
      forecasts: forecast,
      renderPlace: 'rightSidebar',
    };
    const component = mountWithStore(<ForecastBlock {...props} />, store);
    const mainDiv = component.find('.st-forecast-wrap');
    expect(mainDiv).toHaveLength(1);
  });

  it('should not render component by user without quoteSecurity with username in rightSidebar without props', () => {
    const props = {
      username: 'z1wo5',
      forecasts: [],
      renderPlace: 'rightSidebar',
    };
    const component = mountWithStore(<ForecastBlock {...props} />, store);
    const mainDiv = component.find('.st-forecast-wrap');
    expect(mainDiv).toHaveLength(0);
  });

  it('should not render component by user without quoteSecurity with username without rander place with props', () => {
    const props = {
      username: 'z1wo5',
      forecasts: forecast,
    };
    const component = mountWithStore(<ForecastBlock {...props} />, store);
    const mainDiv = component.find('.st-forecast-wrap');
    expect(mainDiv).toHaveLength(0);
  });

  it('should not render component by user without username in rightSidebar', () => {
    const props = {
      username: '',
      renderPlace: 'rightSidebar',
    };
    const component = mountWithStore(<ForecastBlock {...props} />, store);
    const mainDiv = component.find('.st-forecast-wrap');
    expect(mainDiv).toHaveLength(0);
  });

  it('should not render component without name and without place render', () => {
    const props = {
      username: '',
      forecasts: [],
    };
    const component = mountWithStore(<ForecastBlock {...props} />, store);
    const mainDiv = component.find('.st-forecast-wrap');
    expect(mainDiv).toHaveLength(0);
  });

  it('should not render component by user with quoteSecurity with username in rightSidebar', () => {
    const props = {
      username: 'z1wo5',
      quoteSecurity: 'AUDCAD',
      renderPlace: 'rightSidebar',
    };
    const component = mountWithStore(<ForecastBlock {...props} />, store);
    const mainDiv = component.find('.st-forecast-wrap');
    expect(mainDiv).toHaveLength(0);
  });

  it('should not render component by user with quoteSecurity without username in rightSidebar', () => {
    const props = {
      username: 'z1wo5',
      quoteSecurity: 'AUDCAD',
      renderPlace: 'rightSidebar',
    };
    const component = mountWithStore(<ForecastBlock {...props} />, store);
    const mainDiv = component.find('.st-forecast-wrap');
    expect(mainDiv).toHaveLength(0);
  });

  it('should not render component by user with quoteSecurity without username without render place', () => {
    const props = {
      username: 'z1wo5',
      quoteSecurity: 'AUDCAD',
    };
    const component = mountWithStore(<ForecastBlock {...props} />, store);
    const mainDiv = component.find('.st-forecast-wrap');
    expect(mainDiv).toHaveLength(0);
  });
});
