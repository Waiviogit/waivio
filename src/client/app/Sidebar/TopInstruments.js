import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getQuotesSettingsState } from '../../../investarena/redux/selectors/quotesSettingsSelectors';
import { getAssetsChartsState } from '../../../investarena/redux/selectors/chartsSelectors';
import { marketNames } from '../../../investarena/constants/objectsInvestarena';
import './TopInsruments.less';
import { getPlatformNameState } from '../../../investarena/redux/selectors/platformSelectors';
import { toggleModal } from '../../../investarena/redux/actions/modalsActions';
import TopInstrumentsLoading from './TopInstrumentsLoading';
import { getFollowingObjectsList, getIsAuthenticated } from '../../reducers';
import TopInstrumentsItem from './TopInstrumentsItem';

const instrumentsDefault = {
  Index: ['DOWUSD', 'DAXEUR'],
  Crypto: ['Bitcoin', 'Etherium'],
  Currency: ['AUDCAD', 'EURUSD'],
  Commodity: ['XPTUSD', 'UKOUSD'],
  Stock: ['Gazprom', 'Adidas'],
};

@injectIntl
@connect(
  state => ({
    quotesSettings: getQuotesSettingsState(state),
    charts: getAssetsChartsState(state),
    platformName: getPlatformNameState(state),
    followingObjects: getFollowingObjectsList(state),
    isAuthenticated: getIsAuthenticated(state),
  }),
  {
    toggleModalTC: toggleModal,
  },
)
class TopInstruments extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    charts: PropTypes.shape(),
    quotesSettings: PropTypes.shape().isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    toggleModalTC: PropTypes.func.isRequired,
    platformName: PropTypes.string.isRequired,
    followingObjects: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    charts: {},
    followingObjects: { list: [] },
  };

  state = {
    instrumentsToShow: { Crypto: [], Currency: [], Commodity: [], Stock: [], Index: [] },
    isLoading: true,
    instrumentsCount: 0,
  };
  componentDidMount() {
    if (_.size(this.props.quotesSettings) > 0 && this.state.isLoading) {
      if (this.props.isAuthenticated) {
        if (!_.isEmpty(this.props.followingObjects)) {
          this.sortSidebarItems(this.props.quotesSettings);
        }
      } else {
        this.setState({ isLoading: false });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (_.size(nextProps.quotesSettings) > 0 && this.state.isLoading) {
      if (this.props.isAuthenticated) {
        if (!_.isEmpty(nextProps.followingObjects)) {
          this.sortSidebarItems(nextProps.quotesSettings);
        }
      } else {
        this.setState({ isLoading: false });
      }
    }
  }

  toggleModalInstrumentsChart = (quote, quoteSettingsTC) => {
    this.props.toggleModalTC('openDeals', {
      quote,
      quoteSettingsTC,
      platformName: this.props.platformName,
    });
  };

  sortSidebarItems(quotesSettings) {
    const { followingObjects } = this.props;
    const instrumentsToShow = { Crypto: [], Currency: [], Commodity: [], Stock: [], Index: [] };
    let instrumentsCount = 0;
    _.forEach(quotesSettings, quoteSettings => {
      if (
        quoteSettings.wobjData &&
        followingObjects &&
        followingObjects.some(id => id === quoteSettings.wobjData.author_permlink)
      ) {
        if (instrumentsToShow[quoteSettings.market]) {
          instrumentsToShow[quoteSettings.market].push(quoteSettings.keyName);
          instrumentsCount += 1;
        }
      }
    });

    this.setState({ instrumentsToShow, isLoading: false, instrumentsCount });
  }

  render() {
    const { quotesSettings, charts, intl, isAuthenticated } = this.props;
    const { isLoading, instrumentsCount } = this.state;
    const instrumentsToShow = isAuthenticated ? this.state.instrumentsToShow : instrumentsDefault;
    return (
      <React.Fragment>
        {!isLoading ? (
          <React.Fragment>
            {isAuthenticated && (
              <div className="SidebarContentBlock SidebarContentBlock__title">
                {intl
                  .formatMessage({
                    id: 'wia.followingInstruments',
                    defaultMessage: 'Following instruments',
                  })
                  .toUpperCase()}
                <div className="SidebarContentBlock__amount">{instrumentsCount}</div>
              </div>
            )}
            {marketNames.map(market => {
              return (
                !_.isEmpty(instrumentsToShow[market.name]) && (
                  <div className="SidebarContentBlock top-instruments" key={market.name}>
                    <div className="SidebarContentBlock__title">
                      <Link to={`/markets/${market.name.toLowerCase()}`}>
                        {intl.formatMessage(market.intl).toUpperCase()}
                      </Link>
                      {/* {isAuthenticated && <div className="SidebarContentBlock__amount">{instrumentsToShow[market.name].length}</div>} */}
                    </div>
                    <div className="SidebarContentBlock__content">
                      {instrumentsToShow[market.name].map(
                        instrumentName =>
                          quotesSettings[instrumentName] &&
                          quotesSettings[instrumentName].wobjData && (
                            <TopInstrumentsItem
                              key={instrumentName}
                              toggleModalTC={this.toggleModalInstrumentsChart}
                              intl={intl}
                              quoteSettings={quotesSettings[instrumentName]}
                              quoteSecurity={instrumentName}
                              chart={charts && charts[instrumentName] ? charts[instrumentName] : []}
                              showTradeBtn={false}
                              chartHeight={60}
                              chartWidth={160}
                            />
                          ),
                      )}
                    </div>
                  </div>
                )
              );
            })}
          </React.Fragment>
        ) : (
          <TopInstrumentsLoading />
        )}
      </React.Fragment>
    );
  }
}

export default TopInstruments;
