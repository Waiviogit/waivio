import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getQuotesSettingsState } from '../../../investarena/redux/selectors/quotesSettingsSelectors';
import { getAssetsChartsState } from '../../../investarena/redux/selectors/chartsSelectors';
import { marketNames } from '../../../investarena/constants/objectsInvestarena';
import './TopInsruments.less';
import {
  getIsConnectPlatformState,
  getPlatformNameState,
} from '../../../investarena/redux/selectors/platformSelectors';
import { toggleModal } from '../../../investarena/redux/actions/modalsActions';
import TopInstrumentsLoading from './TopInstrumentsLoading';
import { getFollowingObjectsList, getIsAuthenticated } from '../../reducers';
import TopInstrumentsItem from './TopInstrumentsItem';

const instrumentsDefault = {
  crypto: ['BXYBTC', 'BTCUSDC', 'DASHBTC'],
};

@injectIntl
@connect(
  state => ({
    quotesSettings: getQuotesSettingsState(state),
    charts: getAssetsChartsState(state),
    platformName: getPlatformNameState(state),
    followingObjects: getFollowingObjectsList(state),
    isAuthenticated: getIsAuthenticated(state),
    isPlatformConnected: getIsConnectPlatformState(state),
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
    isPlatformConnected: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    charts: {},
    followingObjects: { list: [] },
  };

  state = {
    instrumentsToShow: { crypto: [] },
    isLoading: true,
    instrumentsCount: 0,
  };

  componentDidMount() {
    this.prepareItems(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.prepareItems(nextProps);
  }

  prepareItems(props) {
    if (_.size(props.quotesSettings) > 0 && this.state.isLoading) {
      if (props.isAuthenticated) {
        if (!_.isEmpty(props.followingObjects)) {
          this.sortSidebarItems(props.quotesSettings);
        }
      }
      this.setState({ isLoading: false });
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
    const instrumentsToShow = { crypto: [] };
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
    const { quotesSettings, charts, intl, isAuthenticated, isPlatformConnected } = this.props;
    const { isLoading, instrumentsCount } = this.state;
    const instrumentsToShow = isAuthenticated ? this.state.instrumentsToShow : instrumentsDefault;
    return (
      <React.Fragment>
        {isPlatformConnected && (
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
                {marketNames.map(
                  market =>
                    !_.isEmpty(instrumentsToShow[market.name]) && (
                      <div className="SidebarContentBlock top-instruments" key={market.name}>
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
                                  chart={
                                    charts && charts[instrumentName] ? charts[instrumentName] : []
                                  }
                                  showTradeBtn={false}
                                  chartHeight={60}
                                  chartWidth={160}
                                />
                              ),
                          )}
                        </div>
                      </div>
                    ),
                )}
              </React.Fragment>
            ) : (
              <TopInstrumentsLoading />
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default TopInstruments;
