import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Modal } from 'antd';
import { getQuotesSettingsState } from '../../../investarena/redux/selectors/quotesSettingsSelectors';
import { getAssetsChartsState } from '../../../investarena/redux/selectors/chartsSelectors';
import { marketNames } from '../../../investarena/constants/objectsInvestarena';
import {
  getIsConnectPlatformState,
  getPlatformNameState,
} from '../../../investarena/redux/selectors/platformSelectors';
import { toggleModal } from '../../../investarena/redux/actions/modalsActions';
import TopInstrumentsLoading from './TopInstrumentsLoading';
import { getFollowingObjectsList, getIsAuthenticated } from '../../reducers';
import TopInstrumentsItem from './TopInstrumentsItem';
import './TopInsruments.less';

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
    isMobile: PropTypes.bool,
  };

  static defaultProps = {
    charts: {},
    followingObjects: { list: [] },
    isMobile: false,
  };

  state = {
    instrumentsToShow: { crypto: [] },
    isLoading: true,
    instrumentsCount: 0,
    isModalOpen: false,
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

  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  getInstruments = instruments => {
    const { quotesSettings, charts, intl, isMobile } = this.props;
    return (
      <div
        className={classNames('SidebarContentBlock top-instruments', {
          mobileBlock: isMobile,
        })}
      >
        <div
          className={classNames('SidebarContentBlock__content', {
            mobileContent: isMobile,
          })}
        >
          {instruments.map(
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
    );
  };

  render() {
    const { intl, isAuthenticated, isPlatformConnected, isMobile } = this.props;
    const { isLoading, instrumentsCount, isModalOpen } = this.state;
    const instrumentsToShow = isAuthenticated ? this.state.instrumentsToShow : instrumentsDefault;
    const cryptoMarket = marketNames[0];
    const instruments = isMobile
      ? instrumentsToShow[cryptoMarket.name].slice(0, 3)
      : instrumentsToShow[cryptoMarket.name];
    const instrumentsTitle = intl.formatMessage({
      id: 'wia.followingInstruments',
      defaultMessage: 'Following instruments',
    });
    return (
      <React.Fragment>
        {isPlatformConnected && (
          <React.Fragment>
            {!isLoading ? (
              <React.Fragment>
                {isAuthenticated && (
                  <div
                    className={classNames(
                      'SidebarContentBlock SidebarContentBlock__title ttu justify-between',
                      {
                        mobileTitle: isMobile,
                      },
                    )}
                  >
                    {instrumentsTitle}
                    <div className="SidebarContentBlock__amount">{instrumentsCount}</div>
                  </div>
                )}
                {!_.isEmpty(instrumentsToShow[cryptoMarket.name]) &&
                  this.getInstruments(instruments, cryptoMarket)}
                {isMobile && instrumentsToShow[cryptoMarket.name].length > 3 && (
                  <div
                    className="HomeBar__show-more"
                    onClick={this.toggleModal}
                    role="presentation"
                  >
                    {intl.formatMessage({
                      id: 'show_more',
                      defaultMessage: 'Show more',
                    })}
                  </div>
                )}
                <Modal
                  className="HomeBar__modal"
                  destroyOnClose
                  title={instrumentsTitle}
                  visible={isModalOpen}
                  footer={null}
                  onCancel={this.toggleModal}
                >
                  {this.getInstruments(instrumentsToShow[cryptoMarket.name])}
                </Modal>
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
