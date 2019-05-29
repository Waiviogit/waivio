import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { Select } from 'antd';
import { isEmpty } from 'lodash';
import Avatar from '../../../components/Avatar';
import {
  getPerformersStatistic,
  getInstrumentToCompare,
  getPerformersStatisticLoaded,
  getPerformersStatisticLoading,
} from '../../../reducers';
import { DEFAULT_OBJECT_AVATAR_URL } from '../../../../common/constants/waivio';
import './TopPerformers.less';

@connect(state => ({
  isLoaded: getPerformersStatisticLoaded(state),
  isLoading: getPerformersStatisticLoading(state),
  performersStat: getPerformersStatistic(state),
  compareWith: getInstrumentToCompare(state),
}))
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
    compareWith: PropTypes.shape({
      avatar: PropTypes.string,
      d1: PropTypes.number,
      d7: PropTypes.number,
      m1: PropTypes.number,
      m3: PropTypes.number,
      m6: PropTypes.number,
      m12: PropTypes.number,
      m24: PropTypes.number,
      name: PropTypes.string,
      id: PropTypes.string,
      type: PropTypes.string,
    })
  };
  static defaultProps = {
    isLoaded: false,
    isLoading: false,
    performersStat: [],
    compareWith: null,
  };
  static periods = {
    // d1: "Daily",
    d7: 'Week',
    // m1: 'Month',
    m3: 'Three Months',
    // m6: 'Six Months',
    m12: 'Year',
    // m24: 'Two Years',
  };

  getPerformerLinks = performer => {
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

  render() {
    const { intl, performersStat, isLoading, compareWith } = this.props;
    const itemsToCompare = [];

    return !isLoading ? (
      <div className="top-performers">
        <div className="top-performers__header">
          <div className="top-performers__title">Top performers</div>
          {!isEmpty(compareWith) && (<div>
            vs. <Select
                // prefixCls="wia"
                className="top-performers__compare-input"
                size="default"
                notFoundContent={null}
                showSearch
                value={compareWith.name}
                // optionLabelProp={}
                // transitionName={}
                // choiceTransitionName={}
                // id={}
            >
              {itemsToCompare}
            </Select>
          </div>)}
          <div className="top-performers__info">
            <div className="tooltip tooltip-better">
              <span className="color-text">
                {intl.formatMessage({ id: 'green', defaultMessage: 'Green' })}
              </span>
              <span className="text">
                {intl.formatMessage({ id: 'better', defaultMessage: 'better' })}
              </span>
            </div>
            <div className="tooltip tooltip-worse">
              <span className="color-text">
                {intl.formatMessage({ id: 'red', defaultMessage: 'Red' })}
              </span>
              <span className="text">
                {intl.formatMessage({ id: 'worse', defaultMessage: 'worse' })}
              </span>
            </div>
          </div>
        </div>
        {Object.keys(TopPerformers.periods).map(key =>
          performersStat[key] ? (
            <div className="SidebarContentBlock" key={key}>
              <div className="SidebarContentBlock__title">
                {intl
                  .formatMessage({
                    id: `longTermData_${key}`,
                    defaultMessage: TopPerformers.periods[key],
                  })
                  .toUpperCase()}
              </div>
              <div className="SidebarContentBlock__content top-performers">
                {performersStat[key].map(performer => (
                  <div className="performer" key={performer.name}>
                    <div className="performer__top">
                      {/* <div className="performer__links"> */}
                      {this.getPerformerLinks(performer)}
                      {/* <Link to={`/@${performer.name}`} className="performer__avatar"> */}
                      {/* <Avatar username={performer.name} size={34} /> */}
                      {/* </Link> */}
                      {/* <Link */}
                      {/* to={`/@${performer.name}`} */}
                      {/* title={performer.name} */}
                      {/* className="performer__name" */}
                      {/* > */}
                      {/* <span className="username">{performer.name}</span> */}
                      {/* </Link> */}
                      {/* </div> */}
                      <div className="performer__stat-info">{performer[key]}</div>
                    </div>
                    <div className="performer__divider" />
                  </div>
                ))}
              </div>
            </div>
          ) : null,
        )}
      </div>
    ) : (
      <div>Loading</div>
    );
  }
}

TopPerformers.propTypes = {};

export default TopPerformers;
