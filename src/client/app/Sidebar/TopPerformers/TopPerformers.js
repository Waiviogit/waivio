import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Select } from 'antd';
import cn from 'classnames';
import { debounce, isEmpty, size } from 'lodash';
import Avatar from '../../../components/Avatar';
import TopInstrumentsLoading from '../TopInstrumentsLoading';
import {
  setInstrumentToCompare,
  getPerformersStatsMore,
} from '../../../../investarena/redux/actions/topPerformersActions';
import {
  getPerformersStatistic,
  getInstrumentToCompare,
  getPerformersStatisticLoaded,
  getPerformersStatisticLoading,
} from '../../../reducers';
import api from '../../../../investarena/configApi/apiResources';
import { DEFAULT_OBJECT_AVATAR_URL } from '../../../../common/constants/waivio';
import './TopPerformers.less';
import { toFixNumberLength } from '../../../../investarena/helpers/calculationsHelper';

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

const formatPerfomance = performanceValue => {
  const plusSign = performanceValue > 0 ? '+' : '';
  return `${plusSign}${toFixNumberLength(performanceValue, 3)}%`;
};

@connect(
  state => ({
    isLoaded: getPerformersStatisticLoaded(state),
    isLoading: getPerformersStatisticLoading(state),
    performersStat: getPerformersStatistic(state),
    compareWith: getInstrumentToCompare(state),
  }),
  {
    getPerformersStatsMore,
    setInstrumentToCompare,
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
    }),
    getPerformersStatsMore: PropTypes.func,
    setInstrumentToCompare: PropTypes.func,
  };
  static defaultProps = {
    isLoaded: false,
    isLoading: false,
    performersStat: [],
    compareWith: null,
    getPerformersStatsMore: () => {},
    setInstrumentToCompare: () => {},
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

  constructor(props) {
    super(props);

    this.state = {
      itemsToCompare: [],
    };
    this.debouncedSearch = debounce(this.searchInstrumentsApiCall, 400);
  }

  handleSelect = selected => {
    const selectedInstrument = this.state.itemsToCompare.find(i => i.id === selected);
    if (selectedInstrument) {
      this.props.setInstrumentToCompare(selectedInstrument);
      this.setState({ itemsToCompare: [] });
    }
  };

  handleSearch = inputString => {
    if (inputString) {
      this.debouncedSearch(inputString);
    } else {
      this.setState({ itemsToCompare: [] });
    }
  };

  searchInstrumentsApiCall = searchString =>
    api.performers
      .searchInstrumentsStat(searchString)
      .then(result => this.setState({ itemsToCompare: result }));

  loadMorePerformers = e => {
    const period = e.currentTarget.id;
    this.props.getPerformersStatsMore(period, 5, this.props.performersStat[period].length);
  };

  render() {
    const { itemsToCompare } = this.state;
    const { intl, performersStat, isLoaded, isLoading, compareWith } = this.props;
    return isLoaded && !isLoading ? (
      <div className="top-performers">
        <div className="top-performers__header">
          <div className="top-performers__title">Top performers</div>
          {!isEmpty(compareWith) && itemsToCompare && (
            <React.Fragment>
              <div id="top-performers__compare-input-wrap">
                vs.{' '}
                <Select
                  className="top-performers__compare-input"
                  dropdownClassName="top-performers__compare-input-dropdown"
                  getPopupContainer={() =>
                    document.getElementById('top-performers__compare-input-wrap')
                  }
                  size="default"
                  notFoundContent={null}
                  showSearch
                  value={compareWith.name}
                  onSearch={this.handleSearch}
                  onSelect={this.handleSelect}
                >
                  {itemsToCompare.map(item => (
                    <Select.Option key={item.id}>{item.name}</Select.Option>
                  ))}
                </Select>
              </div>
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
            </React.Fragment>
          )}
        </div>

        {size(performersStat) > 0 ?
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
                          success:
                            performer.id !== compareWith.id && performer[key] > compareWith[key],
                          danger:
                            performer.id !== compareWith.id && performer[key] < compareWith[key],
                        })}
                      >
                        {formatPerfomance(performer[key])}
                      </div>
                    </div>
                    <div className="performer__divider" />
                  </div>
                ))}
                <h4
                  id={key}
                  className="top-performers__more"
                  onClick={this.loadMorePerformers}
                  role="presentation"
                >
                  <FormattedMessage id="show_more" defaultMessage="Show more" />
                </h4>
              </div>
            </div>
          ) : null,
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
