import React, { useEffect } from 'react';
import { round } from 'lodash';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Legend, Pie, PieChart } from 'recharts';

import { getWaivMetric } from '../../../waivioApi/ApiClient';
import WaivPriceChart from './WaivPriceChart';
import USDDisplay from '../Utils/USDDisplay';

import './StatisticPage.less';

const StatisticPage = () => {
  const [metrics, setMetrics] = React.useState([]);

  const data01 = [
    {
      name: `Liquid WAIV (${round(
        ((metrics?.tokensInCirculation - metrics?.tokensStaked) * 100) /
          metrics?.tokensInCirculation,
        2,
      )}%)`,
      value: round(metrics?.tokensInCirculation - metrics?.tokensStaked, 8),
      fill: '#f87007',
    },
    {
      name: `WAIV power (${round(
        (metrics?.tokensStaked * 100) / metrics?.tokensInCirculation,
        2,
      )}%)`,
      value: round(+metrics?.tokensStaked, 8),
      fill: '#e24a5a',
    },
  ];
  const data02 = [
    {
      name: `Development fund (${metrics?.inflationDistribution?.developmentFund})`,
      value: parseFloat(metrics?.inflationDistribution?.developmentFund),
      fill: '#e24a5a',
    },
    {
      name: `Liquidity providers (${metrics?.inflationDistribution?.liquidityProviders})`,
      value: parseFloat(metrics?.inflationDistribution?.liquidityProviders),
      fill: '#f87007',
    },
    {
      name: `Rewards pool (${metrics?.inflationDistribution?.rewardsPool})`,
      value: parseFloat(metrics?.inflationDistribution?.rewardsPool),
      fill: '#095382',
    },
  ];
  const data03 = [
    {
      name: `Authors (${metrics?.rewardsPool?.authors})`,
      value: parseFloat(metrics?.rewardsPool?.authors),
      fill: '#f87007',
    },
    {
      name: `Curators (${metrics?.rewardsPool?.curators})`,
      value: parseFloat(metrics?.rewardsPool?.curators),
      fill: '#095382',
    },
  ];

  useEffect(() => {
    getWaivMetric().then(res => {
      setMetrics(res);
    });
  }, []);

  return (
    <div className={'StatisticPage'}>
      <div className={'StatisticPage__section'}>
        <h2>WAIV token at a glance</h2>
        <div>
          <WaivPriceChart />
        </div>
        <h3>WAIV tokens in circulation</h3>
        <p>{metrics?.tokensInCirculation}</p>
        <h3>Total market capitalization</h3>
        <USDDisplay value={metrics?.totalMarketCapitalizationUSD} currencyDisplay={'symbol'} />
        <h3>Annual inflation</h3>
        <p>{metrics?.annualInflation}</p>
        <h3>WAIV staking</h3>
        <PieChart width={730} height={250}>
          <Legend align="right" verticalAlign="middle" layout="vertical" height={36} />
          <Pie
            data={data01}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          />
        </PieChart>{' '}
      </div>
      <div className={'StatisticPage__section'}>
        <h2>WAIV tokenomics</h2>
        <h3>Inflation distribution</h3>
        <PieChart width={730} height={250}>
          <Legend align="right" verticalAlign="middle" layout="vertical" height={36} />
          <Pie
            data={data02}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          />
        </PieChart>{' '}
        <h3>Rewards pool</h3>
        <PieChart width={730} height={300}>
          <Legend align="right" verticalAlign="middle" layout="vertical" height={36} />
          <Pie
            data={data03}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          />
        </PieChart>{' '}
        <h3>Development fund</h3>
        <p>Available: {round(metrics?.availableInMonthUSD, 2)} USD/month</p>
        <p>Distributed: {metrics?.distributedInMonthUSD} USD/month</p>
      </div>
    </div>
  );
};

export default StatisticPage;
