import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { getViewMode, setViewMode } from '../../helpers/localStorageHelpers';
import { getAllSignals } from '../../redux/actions/signalsActions';
import { marketNames, typesWithChartId } from '../../constants/objectsInvestarena';
import Affix from '../../../client/components/Utils/Affix';
import LeftSidebar from '../../../client/app/Sidebar/LeftSidebar';
import SortSelector from '../../../client/components/SortSelector/SortSelector';
import './InstrumentsPage.less';

const propTypes = {
  history: PropTypes.shape().isRequired,
  charts: PropTypes.shape(),
  openDeals: PropTypes.shape(),
  match: PropTypes.shape().isRequired,
  screenSize: PropTypes.string.isRequired,
  quoteSettings: PropTypes.shape().isRequired,
  getChartsData: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};
const defaultProps = {
  charts: {},
  openDeals: {},
  favorites: [],
  screenSize: 'medium',
};

class InstrumentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signals: {},
      wobjs: [],
      viewMode: 'cards',
    };
  }

  componentDidMount() {
    this.props.getChartsData();
    if (this.props.screenSize === 'medium' || this.props.screenSize === 'large') {
      const viewMode = getViewMode('instruments');
      if (viewMode) this.toggleViewMode(viewMode);
    } else this.toggleViewMode('cards');

    getAllSignals().then(({ data, error }) => {
      if (!error && data) {
        this.setState({ signals: data });
      }
    });
  }

  toggleViewMode = viewMode => {
    if (viewMode !== this.state.viewMode) {
      this.setState({ viewMode });
      setViewMode('instruments', viewMode);
    }
  };

  handleMarketChange = marketType =>
    this.props.history.push(`/markets/${marketType.toLowerCase()}`);

  render() {
    const { intl, quoteSettings } = this.props;
    const paramMarket = this.props.match.params.marketType;
    // const marketType = typesWithChartId.some(market => market === paramMarket)
    //   ? paramMarket
    //   : 'crypto';
    const quoteSettingsSorted = {};
    Object.entries(quoteSettings).forEach(([key, value]) => {
      if (value.wobjData && value.priceRounding) {
        const marketName = value.market.toLowerCase();
        quoteSettingsSorted[marketName] = quoteSettingsSorted[marketName]
          ? [...quoteSettingsSorted[marketName], { ...value, keyName: key }]
          : [{ ...value, keyName: key }];
      }
    });

    const sortSelector =
      this.props.screenSize === 'medium' || this.props.screenSize === 'large' ? (
        <SortSelector
          caption={intl.formatMessage({
            id: 'view_as',
            defaultMessage: 'View as',
          })}
          sort={this.state.viewMode}
          onChange={this.toggleViewMode}
        >
          <SortSelector.Item key="list">
            {intl.formatMessage({ id: 'list', defaultMessage: 'List' })}
          </SortSelector.Item>
          <SortSelector.Item key="cards">
            {intl.formatMessage({ id: 'cards', defaultMessage: 'Cards' })}
          </SortSelector.Item>
        </SortSelector>
      ) : (
        <SortSelector
          caption={intl.formatMessage({
            id: 'market',
            defaultMessage: 'Market',
          })}
          sort={paramMarket}
          onChange={this.handleMarketChange}
        >
          {marketNames.map(item => (
            <SortSelector.Item key={item.name.toLowerCase()}>
              {intl.formatMessage(item.intl)}
            </SortSelector.Item>
          ))}
        </SortSelector>
      );
    return (
      <div className="st-instr-page">
        <div className="feed-layout container">
          <Affix className="leftContainer" stickPosition={116}>
            <div className="left">
              <LeftSidebar quoteSettingsSorted={quoteSettingsSorted} />
            </div>
          </Affix>
          <div className="center">
            <div role="presentation" className="st-instruments-toggle-view">
              {sortSelector}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

InstrumentsPage.propTypes = propTypes;
InstrumentsPage.defaultProps = defaultProps;

export default withRouter(injectIntl(InstrumentsPage));
