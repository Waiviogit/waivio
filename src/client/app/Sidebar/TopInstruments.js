import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import InstrumentCardView from '../../../investarena/components/InstrumentsPage/Instrument/CardView';
import { getQuotesState } from '../../../investarena/redux/selectors/quotesSelectors';
import { getQuotesSettingsState } from '../../../investarena/redux/selectors/quotesSettingsSelectors';
import { getAssetsChartsState } from '../../../investarena/redux/selectors/chartsSelectors';
import { marketNames } from '../../../investarena/constants/objectsInvestarena';
import './TopInsruments.less';
import { getPlatformNameState } from '../../../investarena/redux/selectors/platformSelectors';
import { toggleModal } from '../../../investarena/redux/actions/modalsActions';
import TopInstrumentsLoading from "./TopInstrumentsLoading";

const instrumentsToShow = {
  Index: ['DOWUSD', 'DAXEUR'],
  Crypto: ['Bitcoin', 'Etherium'],
  Currency: ['AUDCAD', 'EURUSD'],
  Commodity: ['XPTUSD', 'UKOUSD'],
  Stock: ['Gazprom', 'Adidas'],
};

const TopInstruments = ({ intl, quoteSettings, quotes, charts, toggleModalTC, platformName }) => {
  const sidebarItems = marketNames.map(market => {
    const instrumentsCount = Object.values(quoteSettings).filter(
      quote =>
        quote.wobjData &&
        (quote.market === market.name || market.names.some(name => name === quote.market)),
    ).length;

    const toggleModalInstrumentsChart = (quote, quoteSettingsTC) => {
      toggleModalTC('openDeals', { quote, quoteSettingsTC, platformName });
    };
    return instrumentsCount ? (
      <div className="SidebarContentBlock top-instruments" key={market.name}>
        <div className="SidebarContentBlock__title">
          <Link to={`/markets/${market.name.toLowerCase()}`}>
            {intl.formatMessage(market.intl).toUpperCase()}
          </Link>
          <div className="SidebarContentBlock__amount">{instrumentsCount}</div>
        </div>
        <div className="SidebarContentBlock__content">
          {instrumentsToShow[market.name].map(
            instrumentName =>
              quoteSettings[instrumentName] &&
              quoteSettings[instrumentName].wobjData && (
                <InstrumentCardView
                  key={instrumentName}
                  toggleModalTC={toggleModalInstrumentsChart}
                  intl={intl}
                  quoteSettings={quoteSettings[instrumentName]}
                  quote={quotes[instrumentName]}
                  chart={charts && charts[instrumentName] ? charts[instrumentName] : []}
                  showTradeBtn={false}
                  chartHeight={60}
                  chartWidth={160}
                />
              ),
          )}
        </div>
      </div>
    ) : null;
  });
  return sidebarItems.some(item => Boolean(item)) ? (
    <React.Fragment>{sidebarItems}</React.Fragment>
  ) : (
    <TopInstrumentsLoading />
  );
};

TopInstruments.propTypes = {
  intl: PropTypes.shape().isRequired,
  charts: PropTypes.shape(),
  quotes: PropTypes.shape().isRequired,
  quoteSettings: PropTypes.shape().isRequired,
  toggleModalTC: PropTypes.func.isRequired,
  platformName: PropTypes.string.isRequired,
};

TopInstruments.defaultProps = {
  charts: {},
};

export default connect(
  state => ({
    quotes: getQuotesState(state),
    quoteSettings: getQuotesSettingsState(state),
    charts: getAssetsChartsState(state),
    platformName: getPlatformNameState(state),
  }),
  dispatch => ({
    toggleModalTC: (type, modalInfo) => dispatch(toggleModal(type, modalInfo)),
  }),
)(injectIntl(TopInstruments));
