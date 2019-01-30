import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import InstrumentCardView from '../../../investarena/components/InstrumentsPage/Instrument/CardView';
import { getQuotesState } from '../../../investarena/redux/selectors/quotesSelectors';
import { getQuotesSettingsState } from '../../../investarena/redux/selectors/quotesSettingsSelectors';
import { getAssetsChartsState } from '../../../investarena/redux/selectors/chartsSelectors';
import './TopInsruments.less';

const instrumentsToShow = {
  Index: ['DOWUSD', 'DAXEUR'],
  Crypto: ['Bitcoin', 'Zcash'],
  Currency: ['AUDCAD', 'AUDNZD'],
  Commodity: ['XPTUSD', 'UKOUSD'],
  Stock: ['BKNG', 'APPLE'],
};

const TopInstruments = ({ intl, quoteSettings, quotes, charts }) => {
  const instrumentGroups = [
    {
      market: 'Index',
      displayName: intl.formatMessage({ id: 'modalAssets.indices', defaultMessage: 'Indicies' }),
    },
    {
      market: 'Crypto',
      displayName: intl.formatMessage({ id: 'wia.cryptos', defaultMessage: 'Cryptos' }),
    },
    {
      market: 'Currency',
      displayName: intl.formatMessage({ id: 'wia.currencies', defaultMessage: 'Currencies' }),
    },
    {
      market: 'Commodity',
      displayName: intl.formatMessage({ id: 'wia.commodities', defaultMessage: 'Commodities' }),
    },
    {
      market: 'Stock',
      displayName: intl.formatMessage({ id: 'modalAssets.stocks', defaultMessage: 'Stocks' }),
    },
  ];

  return (
    <div>
      {instrumentGroups.map(group => (
        <div className='SidebarContentBlock top-instruments'>
          <Link to={`/markets/${group.market.toLowerCase()}`}>
            <h4 className='SidebarContentBlock__title'>{group.displayName.toUpperCase()}</h4>
          </Link>
          <div className='SidebarContentBlock__content'>
            {instrumentsToShow[group.market].map(
              instrumentName =>
                quoteSettings[instrumentName] &&
                quoteSettings[instrumentName].wobjData && (
                  <InstrumentCardView
                    intl={intl}
                    quoteSettings={quoteSettings[instrumentName]}
                    quote={quotes[instrumentName]}
                    chart={charts ? charts[instrumentName] : []}
                    showTradeBtn={false}
                    chartHeight={60}
                    chartWidth={160}
                  />
                ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

TopInstruments.propTypes = {
  intl: PropTypes.shape().isRequired,
  charts: PropTypes.shape().isRequired,
  quotes: PropTypes.shape().isRequired,
  quoteSettings: PropTypes.shape().isRequired,
};

export default connect(state => ({
  quotes: getQuotesState(state),
  quoteSettings: getQuotesSettingsState(state),
  charts: getAssetsChartsState(state),
}))(injectIntl(TopInstruments));
