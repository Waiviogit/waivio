import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPerformersStatistic } from '../../../../reducers';
import { getPerformersStatsMore } from '../../../../../investarena/redux/actions/topPerformersActions';
import cn from 'classnames';
import {
  formatPerformance,
  getPerformerLinks,
} from '../../../../app/Sidebar/TopPerformers/TopPerformers';

const HomeBar = ({ performersStat }) => {
  const getStatisticsByPeriod = period => {
    return performersStat[period].map(performer => (
      <div className="performer" key={performer.name}>
        <div className="performer__top">
          {getPerformerLinks(performer)}
          <div
            className={cn('performer__stat-info', {
              success: performer[period] > 0,
              danger: performer[period] < 0,
            })}
          >
            {formatPerformance(performer[period])}
          </div>
        </div>
        <div className="performer__divider" />
      </div>
    ));
  };
  return (
    <div className="HomeBar">
      <FormattedMessage id="postSellBuy.profitability" defaultMessage="Profitability" />
      <div className="HomeBar__content">
        <FormattedMessage id="longTermData_d7" defaultMessage="Week" />
        {getStatisticsByPeriod('d7')}
        <FormattedMessage id="longTermData_m1" defaultMessage="Month" />
        <FormattedMessage id="longTermData_m6" defaultMessage="6 Month" />
      </div>
    </div>
  );
};

HomeBar.propTypes = {
  performersStat: PropTypes.shape({
    d1: PropTypes.arrayOf(PropTypes.shape()),
    d7: PropTypes.arrayOf(PropTypes.shape()),
    m1: PropTypes.arrayOf(PropTypes.shape()),
    m3: PropTypes.arrayOf(PropTypes.shape()),
    m6: PropTypes.arrayOf(PropTypes.shape()),
    m12: PropTypes.arrayOf(PropTypes.shape()),
    m24: PropTypes.arrayOf(PropTypes.shape()),
  }),
  getPerformersMore: PropTypes.func,
};
HomeBar.defaultProps = {
  performersStat: [],
  getPerformersMore: () => {},
};

const mapStateToProps = state => ({
  performersStat: getPerformersStatistic(state),
});

function mapDispatchToProps(dispatch) {
  return {
    getPerformersMore: () => dispatch(getPerformersStatsMore()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeBar);
