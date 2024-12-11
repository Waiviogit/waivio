import React, { useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Tooltip, XAxis, YAxis, Area, AreaChart } from 'recharts';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import moment from 'moment/moment';
import { round } from 'lodash';

import { getTokensEngineChart } from '../../../waivioApi/ApiClient';
import { isMobile } from '../../../common/helpers/apiHelpers';

import './WaivPriceChart.less';

const periods = ['1d', '7d', '1m', '3m', '6m', '1y', '2y', 'all'];

const WaivPriceChart = () => {
  const querySelectorSearchParams = new URLSearchParams(location?.search);
  const isWidget = querySelectorSearchParams.get('display');
  const [type, setType] = React.useState('1m');
  const [dataArr, setData] = React.useState([]);
  const isMobl = isMobile();

  const getChartsWidth = () => {
    let width = 800;

    if (isMobl) width = 400;
    if (isWidget && !isMobl) width = 500;

    return width;
  };

  useEffect(() => {
    getTokensEngineChart('WAIV', type).then(res => {
      setData(
        res.reverse().map(r => ({
          Price: round(r.rates.USD, 8),
          dateString: r.dateString,
        })),
      );
    });
  }, [type]);

  const CustomTickFormatter = (tick, index, ticks) => {
    const currentYear = tick.split('-')[0];
    const prevYear = index > 0 ? ticks[index - 1].split('-')[0] : currentYear;

    return currentYear === prevYear ? '' : currentYear; // Show year only if it changes
  };

  return (
    <div className={'WaivPriceChart'}>
      <div className={'WaivPriceChart__container'}>
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
      <b
        style={{
          display: 'inline-block',
          padding: '0px 20px',
        }}
      >
        USD
      </b>
      <AreaChart
        width={getChartsWidth()}
        height={isMobl ? 250 : 400}
        data={dataArr}
        margin={{ top: 5, right: 30, left: 0, bottom: 30 }}
        padding={{ top: 10, left: 0, right: 0 }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis
          interval={[periods[5], periods[6], periods[7]].includes(type) ? 0 : 'preserveStartEnd'}
          tickFormatter={(value, index) => {
            if ([periods[5], periods[6], periods[7]].includes(type)) {
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
          }}
          dataKey="dateString"
          hide={type === periods[0] || type === periods[1]}
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
    </div>
  );
};

export default injectIntl(WaivPriceChart);
