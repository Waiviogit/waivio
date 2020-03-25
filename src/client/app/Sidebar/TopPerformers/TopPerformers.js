import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import cn from 'classnames';
import { size, omitBy, isNil } from 'lodash';
import Avatar from '../../../components/Avatar';
import TopInstrumentsLoading from '../TopInstrumentsLoading';
import { getPerformersStatsMore } from '../../../../investarena/redux/actions/topPerformersActions';
import {
  getPerformersStatistic,
  getPerformersStatisticLoaded,
  getPerformersStatisticLoading,
} from '../../../reducers';
import { DEFAULT_OBJECT_AVATAR_URL } from '../../../../common/constants/waivio';
import { toFixNumberLength } from '../../../../investarena/helpers/calculationsHelper';
import './TopPerformers.less';

const getPerformerLinks = performer => {
  switch (performer.type) {
    case 'user':
      return (
        <div className="performer__links">
          <Link to={`/@${performer.name}`} className="performer__avatar">
            <Avatar username={performer.name} size={34} />
          </Link>
          <Link to={`/@${performer.name}`} title={performer.name} className="performer__name">
            <span className="username">{performer.name}</span>
          </Link>
        </div>
      );
    case 'instrument':
      return (
        <div className="performer__links">
          <Link to={`/object/${performer.id}`} className="performer__avatar">
            <div
              className="ObjectAvatar"
              style={{ backgroundImage: `url(${performer.avatar || DEFAULT_OBJECT_AVATAR_URL})` }}
              title={performer.name}
            />
          </Link>
          <Link to={`/object/${performer.id}`} title={performer.name} className="performer__name">
            <span className="username">{performer.name}</span>
          </Link>
        </div>
      );
    default:
      return null;
  }
};

const formatPerformance = performanceValue => {
  if (isNil(performanceValue)) {
    return '—';
  }
  const plusSign = performanceValue > 0 ? '+' : '';
  return `${plusSign}${toFixNumberLength(performanceValue, 3)}%`;
};

@connect(
  state => ({
    isLoaded: getPerformersStatisticLoaded(state),
    isLoading: getPerformersStatisticLoading(state),
    performersStat: getPerformersStatistic(state),
  }),
  {
    getPerformersStatsMore,
  },
)
@injectIntl
class TopPerformers extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    isLoaded: PropTypes.bool,
    isLoading: PropTypes.bool,
    performersStat: PropTypes.shape({
      d1: PropTypes.arrayOf(PropTypes.shape()),
      d7: PropTypes.arrayOf(PropTypes.shape()),
      m1: PropTypes.arrayOf(PropTypes.shape()),
      m3: PropTypes.arrayOf(PropTypes.shape()),
      m6: PropTypes.arrayOf(PropTypes.shape()),
      m12: PropTypes.arrayOf(PropTypes.shape()),
      m24: PropTypes.arrayOf(PropTypes.shape()),
    }),
    getPerformersStatsMore: PropTypes.func,
  };
  static defaultProps = {
    isLoaded: false,
    isLoading: false,
    performersStat: [],
    compareWith: null,
    getPerformersStatsMore: () => {},
  };
  static periods = {
    // d1: 'Daily',
    d7: 'Week',
    m1: 'Month',
    // m3: 'Three Months',
    m6: 'Six Months',
    m12: 'Year',
    // m24: 'Two Years',
  };

  loadMorePerformers = e => {
    const period = e.currentTarget.id;
    this.props.getPerformersStatsMore(period, 5, this.props.performersStat[period].length);
  };

  render() {
    const { intl, performersStat, isLoaded, isLoading } = this.props;
    return isLoaded && !isLoading ? (
      <div className="top-performers">
        {size(performersStat) > 0 ? (
          Object.keys(TopPerformers.periods).map(key =>
            performersStat[key] ? (
              <div className="SidebarContentBlock top-performers" key={key}>
                <div className="SidebarContentBlock__title">
                  {intl
                    .formatMessage({
                      id: `longTermData_${key}`,
                      defaultMessage: TopPerformers.periods[key],
                    })
                    .toUpperCase()}
                </div>
                <div className="SidebarContentBlock__content">
                  {performersStat[key].map(performer => (
                    <div className="performer" key={performer.name}>
                      <div className="performer__top">
                        {getPerformerLinks(performer)}
                        <div
                          className={cn('performer__stat-info', {
                            success: performer[key] > 0,
                            danger: performer[key] < 0,
                          })}
                        >
                          {formatPerformance(performer[key])}
                        </div>
                      </div>
                      <div className="performer__divider" />
                    </div>
                  ))}
                  <div
                    id={key}
                    className="top-performers__more"
                    onClick={this.loadMorePerformers}
                    role="presentation"
                  >
                    {intl.formatMessage({ id: 'show_more', defaultMessage: 'Show more' })}
                  </div>
                </div>
              </div>
            ) : null,
          )
        ) : (
          <div className="top-performers__more">NO DATA</div>
        )}
      </div>
    ) : (
      <TopInstrumentsLoading />
    );
  }
}

export default TopPerformers;
