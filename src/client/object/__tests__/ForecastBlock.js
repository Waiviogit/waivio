import configureMockStore from 'redux-mock-store';
import React from 'react';
import thunk from 'redux-thunk';
import ForecastBlock from '../ForecastBlock/ForecastBlock';
import { shallowWithStore, mountWithStore } from './shallowWrapper';

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
});

describe('<ForecastBlock />', () => {
  it('renders component without crashing', () => {
    const props = {
      username: 'z1wo5',
      forecasts: Array(5),
      getActiveForecasts: () => {},
    };
    const wrapper = shallowWithStore(<ForecastBlock {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders component without crashing whith props', () => {
    const props = {
      username: 'z1wo5',
      forecasts: [
        {
          author: 'z1wo5',
          created_at: '2019-07-04T11:02:36.000Z',
          forecast: '2019-07-04T15:02:36.000Z',
          id: 'z1wo5/aud-cad',
          permlink: 'aud-cad',
          postPrice: 0.91708,
          recommend: 'Sell',
          security: 'AUDACAD',
        },
      ],
      object: {
        author: 'sor31',
        createdAt: '2019-04-12T14:07:31.854Z',
        creator: 'wiv01',
        default_name: 'bitcoin',
        fields: [
          {
            author: 'vmn31',
            body: 'bitcoin',
            creator: 'wiv01',
            locale: 'en-US',
            name: 'chartid',
            permlink: 'wiv01-ccsvwze9lsl',
            weight: 1,
            _id: '5cb09ba6b81150400aa6bb92',
          },
        ],
      },
      getActiveForecasts: () => {},
    };
    const component = mountWithStore(<ForecastBlock {...props} />, store);
    const mainDiv = component.find('.st-forecast-wrap');
    console.log(component.html());
    expect(mainDiv).toHaveLength(1);
  });

  it('should render component in five forecasts case', () => {
    const props = {
      username: 'z1wo5',
      forecasts: Array(5),
      getActiveForecasts: () => {},
      object: {
        author: 'sor31',
        createdAt: '2019-04-12T14:07:31.854Z',
        creator: 'wiv01',
        default_name: 'bitcoin',
        fields: [
          {
            author: 'vmn31',
            body: 'bitcoin',
            creator: 'wiv01',
            locale: 'en-US',
            name: 'chartid',
            permlink: 'wiv01-ccsvwze9lsl',
            weight: 1,
            _id: '5cb09ba6b81150400aa6bb92',
          },
        ],
      },
    };
    const component = mountWithStore(<ForecastBlock {...props} />, store);
    const mainDiv = component.find('.forecasts-block');
    expect(mainDiv).toHaveLength(1);
  });

  it('should render component in more then five forecasts case', () => {
    const props = {
      username: 'z1wo5',
      forecasts: Array(6),
      getActiveForecasts: () => {},
      object: {
        author: 'sor31',
        createdAt: '2019-04-12T14:07:31.854Z',
        creator: 'wiv01',
        default_name: 'bitcoin',
        fields: [
          {
            author: 'vmn31',
            body: 'bitcoin',
            creator: 'wiv01',
            locale: 'en-US',
            name: 'chartid',
            permlink: 'wiv01-ccsvwze9lsl',
            weight: 1,
            _id: '5cb09ba6b81150400aa6bb92',
          },
        ],
      },
    };
    const component = mountWithStore(<ForecastBlock {...props} />, store);
    const mainDiv = component.find('.forecasts-block');
    console.log(component.html());
    expect(mainDiv).toHaveLength(1);
  });

  it('should not render component if forecasts is empty', () => {
    const props = {
      username: 'z1wo5',
      forecasts: [],
      getActiveForecasts: () => {},
      object: {
        author: 'sor31',
        createdAt: '2019-04-12T14:07:31.854Z',
        creator: 'wiv01',
        default_name: 'bitcoin',
        fields: [
          {
            author: 'vmn31',
            body: 'bitcoin',
            creator: 'wiv01',
            locale: 'en-US',
            name: 'chartid',
            permlink: 'wiv01-ccsvwze9lsl',
            weight: 1,
            _id: '5cb09ba6b81150400aa6bb92',
          },
        ],
      },
    };
    const component = mountWithStore(<ForecastBlock {...props} />, store);
    const mainDiv = component.find('.forecasts-block');
    expect(mainDiv).toHaveLength(0);
  });
});
