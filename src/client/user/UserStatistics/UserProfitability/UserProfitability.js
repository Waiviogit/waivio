import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { getAccuracyChartLoaded } from '../../../reducers';
import SkeletonCustom from '../../../components/Skeleton/SkeletonCustom';
import './UserProfitability.less';

const UserProfitability = ({ statisticsData, isChart }) => (
  <div
    className={classNames('UserProfitability', {
      success: statisticsData.pips > 0,
      unsuccess: statisticsData.pips < 0,
    })}
  >
    {isChart ? (
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
        isLoading={!isChart}
        randomWidth
        rows={2}
        width={50}
      />
    )}
  </div>
);

UserProfitability.propTypes = {
  statisticsData: PropTypes.shape().isRequired,
  isChart: PropTypes.bool.isRequired,
};

export default connect(state => ({
  isChart: getAccuracyChartLoaded(state),
}))(UserProfitability);
