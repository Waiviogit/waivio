import React, { useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Tooltip, XAxis, YAxis, Area, AreaChart, CartesianGrid } from 'recharts';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import moment from 'moment/moment';
import { isEmpty, round } from 'lodash';
import { truncateNumber } from '../../../common/helpers/parser';

import { getTokensEngineChart } from '../../../waivioApi/ApiClient';
import { isMobile } from '../../../common/helpers/apiHelpers';
import Loading from '../Icon/Loading';
import CryptoRateInUsd from '../Sidebar/CrypoCharts/CryptoRateInCurrency';
import USDDisplay from '../Utils/USDDisplay';

import './WaivPriceChart.less';

const periods = ['1d', '7d', '1m', '3m', '6m', '1y', '2y', 'all'];
const yearsPeriods = ['1y', '2y', 'all'];

const WaivPriceChart = () => {
  const querySelectorSearchParams = new URLSearchParams(location?.search);
  const isWidget = querySelectorSearchParams.get('display');
  const [type, setType] = React.useState('1m');
  const [lowUSD, setLowUSD] = React.useState(0);
  const [highUSD, setHighUSD] = React.useState(0);
  const [dataArr, setData] = React.useState([]);
  const [currPrice, setCurrPrice] = React.useState(0);
  const [currencyPriceChange, setCurrencyPriceChange] = React.useState(0);
  const isMobl = isMobile();
  const isYearPeriod = yearsPeriods.includes(type);

  const getChartsWidth = () => {
    let width = 800;

    if (isMobl) width = 400;
    if (isWidget && !isMobl) width = 500;

    return width;
  };

  useEffect(() => {
    setData([]);

    getTokensEngineChart('WAIV', type).then(res => {
      setCurrencyPriceChange(res.change.USD);
      setLowUSD(res.lowUSD);
      setHighUSD(res.highUSD);
      setCurrPrice(res?.result?.[0].rates.USD);
      setData(
        res.result.reverse().map(r => ({
          Price: round(r.rates.USD, 8),
          dateString: r.dateString,
        })),
      );
    });
  }, [type]);

  const CustomTickFormatter = (tick, index, ticks, itemIndex = 0, formatType) => {
    const currentYear = tick.split('-')[itemIndex];
    const prevYear = index > 0 ? ticks[index - 1].split('-')[itemIndex] : currentYear;
    const tickValue = currentYear === prevYear ? '' : currentYear;

    if (['1d', '7d'].includes(formatType) && tickValue) {
      return moment.utc(tick).format('ddd');
    }

    if (formatType === '1y' && tickValue) {
      return moment.utc(tick).format('MMM');
    }

    return tickValue;
  };

  const tickFormatterXAxis = (value, index) => {
    if (type === '7d' || type === '1d') {
      return CustomTickFormatter(
        value,
        index,
        dataArr.map(item => item.dateString),
        2,
        type,
      );
    }

    if (type === '1y') {
      return CustomTickFormatter(
        value,
        index,
        dataArr.map(item => item.dateString),
        1,
        type,
      );
    }

    if (isYearPeriod) {
      return CustomTickFormatter(
        value,
        index,
        dataArr.map(item => item.dateString),
      );
    }

    const name = moment
      .utc(value)
      // .locale(locale)
      .format('DD/MM');

    return name;
  };

  return (
    <div className={'WaivPriceChart'}>
      <div className={'WaivPriceChart__container'}>
        <CryptoRateInUsd
          currentUSDPrice={truncateNumber(currPrice, 3)}
          priceDifference={currencyPriceChange}
          minimumFractionDigits={3}
          // currency={'USD'}
          currencyDisplay={'symbol'}
          valueClassName={'CryptoTrendingCharts__btc-price'}
        />
      </div>
      <div className={'WaivPriceChart__lowHight'}>
        <span>
          Low: <USDDisplay value={lowUSD} precision={3} currencyDisplay={'symbol'} />
        </span>
        <span>
          High: <USDDisplay value={highUSD} precision={3} currencyDisplay={'symbol'} />
        </span>
      </div>
      <b
        style={{
          display: 'inline-block',
          padding: '0px 20px',
        }}
      >
        USD
      </b>
      {isEmpty(dataArr) ? (
        <div
          style={{
            height: isMobl ? 250 : 400,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: getChartsWidth(),
          }}
        >
          <Loading />
        </div>
      ) : (
        <AreaChart
          width={getChartsWidth()}
          height={isMobl ? 250 : 400}
          data={dataArr}
          margin={{ top: 5, right: 30, left: 0, bottom: 10 }}
          padding={{ top: 10, left: 0, right: 0 }}
        >
          {!yearsPeriods && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis
            tickLine={!isYearPeriod && type !== '7d' && type !== '1d'}
            interval={isYearPeriod || type === '7d' || type === '1d' ? 0 : 'preserveEnd'}
            tickFormatter={tickFormatterXAxis}
            dataKey="dateString"
          />
          <YAxis />
          <Tooltip
            separator={': '}
            labelFormatter={i =>
              moment
                .utc(i)
                // .locale(locale)
                .format('LL')
            }
          />
          <Area
            type="monotone"
            dataKey="Price"
            stroke="#f87007"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      )}
      <div className={'WaivPriceChart__container WaivPriceChart__container--marginBottom'}>
        {periods.map(p => (
          <span
            className={classNames('WaivPriceChart__period', {
              'WaivPriceChart__period--active': type === p,
            })}
            key={p}
            onClick={() => setType(p)}
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
};

WaivPriceChart.propTypes = {};

export default injectIntl(WaivPriceChart);
