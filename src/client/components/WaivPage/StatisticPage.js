import React, { useEffect } from 'react';
import { round } from 'lodash';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LabelList, Legend, Pie, PieChart } from 'recharts';
import { FormattedNumber } from 'react-intl';

import { getWaivMetric } from '../../../waivioApi/ApiClient';
import WaivPriceChart from './WaivPriceChart';
import USDDisplay from '../Utils/USDDisplay';
import { isMobile } from '../../../common/helpers/apiHelpers';

import './StatisticPage.less';

const mainColor = '#ff7449';
const secondColor = '#f0b645';
const thirdColor = '#f48b0a';
const locale = 'en-US';

const StatisticPage = () => {
  const isMobl = isMobile();
  const [metrics, setMetrics] = React.useState([]);
  const data01 = [
    {
      name: `Liquid WAIV (${round(
        ((metrics?.tokensInCirculation - metrics?.tokensStaked) * 100) /
          metrics?.tokensInCirculation,
        2,
      )}%)`,
      value: round(metrics?.tokensInCirculation - metrics?.tokensStaked, 2),
      label: (metrics?.tokensInCirculation - metrics?.tokensStaked).toLocaleString(locale),
      fill: secondColor,
    },
    {
      name: `WAIV power (${round(
        (metrics?.tokensStaked * 100) / metrics?.tokensInCirculation,
        2,
      )}%)`,
      value: round(+metrics?.tokensStaked, 2),
      label: Number(metrics?.tokensStaked).toLocaleString(locale),
      fill: mainColor,
    },
  ];
  const data02 = [
    {
      name: `Development fund (${metrics?.inflationDistribution?.developmentFund})`,
      value: parseFloat(metrics?.inflationDistribution?.developmentFund),
      fill: secondColor,
    },
    {
      name: `Liquidity providers (${metrics?.inflationDistribution?.liquidityProviders})`,
      value: parseFloat(metrics?.inflationDistribution?.liquidityProviders),
      fill: thirdColor,
    },
    {
      name: `Rewards pool (${metrics?.inflationDistribution?.rewardsPool})`,
      value: parseFloat(metrics?.inflationDistribution?.rewardsPool),
      fill: mainColor,
    },
  ];
  const data03 = [
    {
      name: `Authors (${metrics?.rewardsPool?.authors})`,
      value: parseFloat(metrics?.rewardsPool?.authors),
      fill: secondColor,
    },
    {
      name: `Curators (${metrics?.rewardsPool?.curators})`,
      value: parseFloat(metrics?.rewardsPool?.curators),
      fill: mainColor,
    },
  ];

  useEffect(() => {
    getWaivMetric().then(res => {
      setMetrics(res);
    });
  }, []);

  const legendProps = !isMobl
    ? { align: 'right', verticalAlign: 'middle' }
    : { align: 'center', verticalAlign: 'bottom' };

  return (
    <div className={'StatisticPage'}>
      <div className={'StatisticPage__section'}>
        <h2>WAIV token at a glance</h2>
        <div>
          <WaivPriceChart />
        </div>
        <h3>WAIV tokens in circulation</h3>
        <p>
          <FormattedNumber
            value={metrics?.tokensInCirculation}
            locale={locale}
            minimumFractionDigits={0}
            maximumFractionDigits={0}
          />
        </p>
        <h3>Total market capitalization</h3>
        <USDDisplay
          percision={0}
          value={round(metrics?.totalMarketCapitalizationUSD)}
          currencyDisplay={'symbol'}
        />
        <h3>Annual inflation</h3>
        <p>{metrics?.annualInflation}</p>
        <h3>WAIV staking</h3>
        <PieChart width={500} height={250}>
          <Legend {...legendProps} layout="vertical" height={36} />
          <Pie data={data01} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            <LabelList position={'inside'} dataKey={'label'} />
          </Pie>
        </PieChart>{' '}
      </div>
      <div className={'StatisticPage__section'}>
        <h2>WAIV tokenomics</h2>
        <h3>Inflation distribution</h3>
        <PieChart width={500} height={isMobl ? 300 : 250}>
          <Legend {...legendProps} layout="vertical" height={66} />
          <Pie data={data02} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            <LabelList formatter={value => `${value}%`} position={'inside'} />
          </Pie>
        </PieChart>{' '}
        <h3>Rewards pool</h3>
        <PieChart width={500} height={250}>
          <Legend {...legendProps} layout="vertical" height={36} />
          <Pie data={data03} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            <LabelList formatter={value => `${value}%`} position={'inside'} />
          </Pie>
        </PieChart>{' '}
        {/* <h3>Development fund</h3> */}
        {/* <p>Available: {round(metrics?.availableInMonthUSD, 2)} USD/month</p> */}
        {/* <p> */}
        {/*  Distributed:{' '} */}
        {/*  <FormattedNumber */}
        {/*    value={metrics?.distributedInMonthUSD} */}
        {/*    locale={locale} */}
        {/*    minimumFractionDigits={2} */}
        {/*    maximumFractionDigits={2} */}
        {/*  />{' '} */}
        {/*  USD/month */}
        {/* </p> */}
      </div>
    </div>
  );
};

export default StatisticPage;
