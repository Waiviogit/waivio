import React, { useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Tooltip, CartesianGrid, XAxis, YAxis, Area, AreaChart, Label } from 'recharts';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import moment from 'moment/moment';
import { round } from 'lodash';

import { getTokensEngineChart } from '../../../waivioApi/ApiClient';

import './WaivPriceChart.less';

const periods = ['1d', '7d', '1m', '3m', '6m', '1y', '2y', 'all'];

const WaivPriceChart = () => {
  const [type, setType] = React.useState('1m');
  const [dataArr, setData] = React.useState([]);

  useEffect(() => {
    getTokensEngineChart('WAIV', type).then(res => {
      setData(
        res.reverse().map(r => {
          let format = 'll';

          if (type === periods[1]) {
            format = 'ddd';
          }

          const name = moment
            .utc(r.dateString)
            // .locale(locale)
            .format(format);

          return {
            name,
            Price: round(r.rates.USD, 8),
            title: moment
              .utc(r.dateString)
              // .locale(locale)
              .format('DD/MM'),
          };
        }),
      );
    });
  }, [type]);

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
      <AreaChart
        width={900}
        height={400}
        data={dataArr}
        margin={{ top: 5, right: 30, left: 0, bottom: 30 }}
        padding={{ top: 10, left: 0, right: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="title" hide={type === periods[0] || type === periods[1]} />
        <YAxis>
          <Label value={'USD'} position={'bottom'} style={{ fontWeight: 'bold' }} />
        </YAxis>
        <Tooltip separator={': '} />
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
