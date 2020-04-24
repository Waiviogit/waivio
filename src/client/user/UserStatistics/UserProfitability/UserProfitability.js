import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { getAccuracyChartLoaded } from '../../../reducers';
import SkeletonCustom from '../../../components/Skeleton/SkeletonCustom';
import { noDataPlaceholder } from '../UserAccuracyContainer/UserAccuracyContainer';
import './UserProfitability.less';

const UserProfitability = ({ statisticsData, isChart }) => {
  const noData = statisticsData.successful_pips === 0 && statisticsData.failed_pips === 0;
  return noData ? (
    <div className="no-data-wrapper">{noDataPlaceholder}</div>
  ) : (
    <div
      className={classNames('UserProfitability', {
        success: statisticsData.pips > 0,
        unsuccess: statisticsData.pips < 0,
      })}
    >
      {isChart ? (
        <React.Fragment>
          <div className="UserProfitability">
            <div className="UserProfitability__value">{`${statisticsData.pips}`}</div>
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
};
UserProfitability.propTypes = {
  statisticsData: PropTypes.shape().isRequired,
  isChart: PropTypes.bool.isRequired,
};

export default connect(state => ({
  isChart: getAccuracyChartLoaded(state),
}))(UserProfitability);
