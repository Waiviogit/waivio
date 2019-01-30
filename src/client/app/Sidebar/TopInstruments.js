import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Collapse } from 'antd';
import InstrumentCardView from '../../../investarena/components/InstrumentsPage/Instrument/CardView';
import { getQuotesState } from '../../../investarena/redux/selectors/quotesSelectors';
import { getQuotesSettingsState } from '../../../investarena/redux/selectors/quotesSettingsSelectors';
import { getAssetsChartsState } from '../../../investarena/redux/selectors/chartsSelectors';

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
      <Collapse bordered={false} defaultActiveKey={instrumentGroups.map(group => group.market)}>
        {instrumentGroups.map(group => (
          <Collapse.Panel
            header={group.displayName.toUpperCase()}
            key={group.market}
            showArrow={false}
            disabled
          >
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
                  />
                ),
            )}
          </Collapse.Panel>
        ))}
      </Collapse>
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
