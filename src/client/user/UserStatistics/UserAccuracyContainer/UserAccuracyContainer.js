import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import UserAccuracyChart from '../UserAccuracyChart/UserAccuracyChart';
import UserProfitability from '../UserProfitability/UserProfitability';
import './UserAccuracyContainer.less';

const UserAccuracyContainer = ({ intl, contentType, accuracy, isLoadedChart, setLoadedChart }) => (
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
      <div className="UserAccuracyContainer__period-item">
        {contentType === 'forecast' ? (
          <UserAccuracyChart statisticsData={accuracy.d1} setLoadedChart={setLoadedChart} />
        ) : (
          <UserProfitability statisticsData={accuracy.d1} isLoadedChart={isLoadedChart} />
        )}
        <div className="UserAccuracyContainer__period-item-value">
          {intl.formatMessage({
            id: 'user_statistics_per_day',
            defaultMessage: 'Per day',
          })}
        </div>
      </div>
      <div className="UserAccuracyContainer__period-item border">
        {contentType === 'forecast' ? (
          <UserAccuracyChart statisticsData={accuracy.d7} setLoadedChart={setLoadedChart} />
        ) : (
          <UserProfitability statisticsData={accuracy.d7} isLoadedChart={isLoadedChart} />
        )}
        <div className="UserAccuracyContainer__period-item-value">
          {intl.formatMessage({
            id: 'user_statistics_per_week',
            defaultMessage: 'Per week',
          })}
        </div>
      </div>
      <div className="UserAccuracyContainer__period-item border">
        {contentType === 'forecast' ? (
          <UserAccuracyChart statisticsData={accuracy.m1} setLoadedChart={setLoadedChart} />
        ) : (
          <UserProfitability statisticsData={accuracy.m1} isLoadedChart={isLoadedChart} />
        )}
        <div className="UserAccuracyContainer__period-item-value">
          {intl.formatMessage({
            id: 'user_statistics_per_month',
            defaultMessage: 'Per month',
          })}
        </div>
      </div>
      <div className="UserAccuracyContainer__period-item border">
        {contentType === 'forecast' ? (
          <UserAccuracyChart statisticsData={accuracy.m12} setLoadedChart={setLoadedChart} />
        ) : (
          <UserProfitability statisticsData={accuracy.m12} isLoadedChart={isLoadedChart} />
        )}
        <div className="UserAccuracyContainer__period-item-value">
          {intl.formatMessage({
            id: 'user_statistics_per_year',
            defaultMessage: 'Per year',
          })}
        </div>
      </div>
    </div>
  </div>
);

UserAccuracyContainer.propTypes = {
  intl: PropTypes.shape().isRequired,
  contentType: PropTypes.string.isRequired,
  accuracy: PropTypes.shape().isRequired,
  isLoadedChart: PropTypes.bool,
  setLoadedChart: PropTypes.func,
};

UserAccuracyContainer.defaultProps = {
  isLoadedChart: false,
  setLoadedChart: PropTypes.bool,
};

export default injectIntl(UserAccuracyContainer);
