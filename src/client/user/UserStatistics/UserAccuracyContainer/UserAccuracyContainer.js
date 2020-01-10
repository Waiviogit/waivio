import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import UserAccuracyChart from '../UserAccuracyChart/UserAccuracyChart';
import UserProfitability from '../UserProfitability/UserProfitability';
import './UserAccuracyContainer.less';

const renderStatistic = (contentType, statsData) =>
  contentType === 'forecast' ? (
    <UserAccuracyChart statisticsData={statsData} />
  ) : (
    <UserProfitability statisticsData={statsData} />
  );

const getTooltipContent = (contentType, data) => {
  const prop = contentType === 'forecast' ? 'count' : 'pips';
  return (
    <div>
      <span style={{ color: '#54d2a0', padding: '0 4px' }}>{data[`successful_${prop}`]}</span>/
      <span style={{ color: '#d9534f', padding: '0 4px' }}>{data[`failed_${prop}`]}</span>
    </div>
  );
};

const UserAccuracyContainer = ({ intl, contentType, accuracy }) => (
  <div className="UserAccuracyContainer">
    <div className="UserAccuracyContainer__title">
      {contentType === 'forecast'
        ? intl.formatMessage({
            id: 'user_statistics_forecast_accuracy',
            defaultMessage: 'Forecast accuracy',
          })
        : intl.formatMessage({
            id: 'user_statistics_profitability_per_post',
            defaultMessage: 'Profitability per post',
          })}
    </div>
    <div className="UserAccuracyContainer__period">
      <Tooltip title={getTooltipContent(contentType, accuracy.d1)}>
        <div className="UserAccuracyContainer__period-item">
          {renderStatistic(contentType, accuracy.d1)}
          <div className="UserAccuracyContainer__period-item-value">
            {intl.formatMessage({
              id: 'user_statistics_per_day',
              defaultMessage: 'Per day',
            })}
          </div>
        </div>
      </Tooltip>
      <Tooltip title={getTooltipContent(contentType, accuracy.d7)}>
        <div className="UserAccuracyContainer__period-item border">
          {renderStatistic(contentType, accuracy.d7)}
          <div className="UserAccuracyContainer__period-item-value">
            {intl.formatMessage({
              id: 'user_statistics_per_week',
              defaultMessage: 'Per week',
            })}
          </div>
        </div>
      </Tooltip>
      <Tooltip title={getTooltipContent(contentType, accuracy.m1)}>
        <div className="UserAccuracyContainer__period-item border">
          {renderStatistic(contentType, accuracy.m1)}
          <div className="UserAccuracyContainer__period-item-value">
            {intl.formatMessage({
              id: 'user_statistics_per_month',
              defaultMessage: 'Per month',
            })}
          </div>
        </div>
      </Tooltip>
      <Tooltip title={getTooltipContent(contentType, accuracy.m12)}>
        <div className="UserAccuracyContainer__period-item border">
          {renderStatistic(contentType, accuracy.m12)}
          <div className="UserAccuracyContainer__period-item-value">
            {intl.formatMessage({
              id: 'user_statistics_per_year',
              defaultMessage: 'Per year',
            })}
          </div>
        </div>
      </Tooltip>
    </div>
  </div>
);

UserAccuracyContainer.propTypes = {
  intl: PropTypes.shape().isRequired,
  contentType: PropTypes.string.isRequired,
  accuracy: PropTypes.shape().isRequired,
};

export default injectIntl(UserAccuracyContainer);
