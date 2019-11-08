import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './UserProfitability.less';
import SkeletonCustom from '../../../components/Skeleton/SkeletonCustom';

const UserProfitability = ({ statisticsData, isLoadedChart }) => (
  <div
    className={classNames('UserProfitability', {
      success: statisticsData.pips > 0,
      unsuccess: statisticsData.pips < 0,
    })}
  >
    {isLoadedChart ? (
      <React.Fragment>
        <div className="UserProfitability tooltip">
          <div className="UserProfitability__value">{`${statisticsData.pips}`}</div>
          <div className="UserProfitability tooltiptext">
            <span className="UserProfitability success">{statisticsData.successful_count}</span>/
            <span className="UserProfitability unsuccess">{statisticsData.failed_count}</span>
          </div>
        </div>
        <div className="UserProfitability__profit">pips</div>
      </React.Fragment>
    ) : (
      <SkeletonCustom
        className="UserProfitability__loader"
        isLoading={!isLoadedChart}
        randomWidth
        rows={2}
        width={50}
      />
    )}
  </div>
);

UserProfitability.propTypes = {
  statisticsData: PropTypes.shape().isRequired,
  isLoadedChart: PropTypes.bool.isRequired,
};

export default UserProfitability;
