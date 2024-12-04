import React, { useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Tooltip, CartesianGrid, XAxis, YAxis, Area, AreaChart, Label } from 'recharts';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import moment from 'moment/moment';
import { round } from 'lodash';

import { getTokensEngineChart } from '../../../waivioApi/ApiClient';

import './WaivPriceChart.less';

const period = ['1d', '7d', '1m', '3m', '6m', '1y', '2y', 'all'];

const WaivPriceChart = () => {
  const [type, setType] = React.useState('1m');
  const [dataArr, setData] = React.useState([]);

  useEffect(() => {
    getTokensEngineChart('WAIV', type).then(res => {
      setData(
        res.reverse().map(r => {
          let format = 'll';

          if (type === period[1]) {
            format = 'ddd';
          }

          const name = moment
            .utc(r.dateString)
            // .locale(locale)
            .format(format);

          return {
            name,
            rate: round(r.rates.USD, 8),
            amt: r.rates.USD,
          };
        }),
      );
    });
  }, [type]);

  return (
    <div className={'WaivPriceChart'}>
      <div className={'WaivPriceChart__container'}>
        {period.map(p => (
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
      <h3 style={{ textAlign: 'center' }}>Price</h3>
      <AreaChart
        width={900}
        height={250}
        data={dataArr}
        margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" hide>
          <Label value="Price" offset={0} position="insideBottom" />
        </XAxis>
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="rate"
          stroke="#f87007"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </div>
  );
};

export default injectIntl(WaivPriceChart);
