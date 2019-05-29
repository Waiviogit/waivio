import React, { Fragment } from 'react';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Instrument from '../../InstrumentsPage/Instrument';
import '../InstrumentsPage.less';
import AssetsTabLoading from './AssetsTabLoading';

const propTypes = {
  charts: PropTypes.shape(),
  signals: PropTypes.shape(),
  deals: PropTypes.shape(),
  quoteSettingsFiltered: PropTypes.arrayOf(PropTypes.shape()),
  intl: PropTypes.shape().isRequired,
  viewMode: PropTypes.oneOf(['list', 'cards']),
};

const AssetsTab = ({ intl, quoteSettingsFiltered, charts, signals, deals, viewMode }) => {
  const selectedInstruments = quoteSettingsFiltered.map(qs => (
    <Instrument
      key={qs.keyName}
      signals={signals[qs.keyName]}
      deals={deals}
      quoteSettings={qs}
      chart={(charts && charts[qs.keyName]) || []}
      quoteSecurity={qs.keyName}
      viewMode={viewMode}
    />
  ));
  const listHeader = (
    <div className="st-instr-column-wrap d-flex">
      <div className="st-instruments-text-title">
        {intl.formatMessage({ id: 'assets.instrument', defaultMessage: 'Instrument' })}
      </div>
      <div className="st-daily-title">
        {intl.formatMessage({ id: 'assets.dailyChange', defaultMessage: 'Daily change' })}
      </div>
      <div className="st-buy-title">
        {intl.formatMessage({ id: 'assets.sell', defaultMessage: 'Sell' })}
      </div>
      <div className="st-amount-title">
        {intl.formatMessage({ id: 'assets.amount', defaultMessage: 'Amount' })}
      </div>
      <div className="st-sell-title">
        {intl.formatMessage({ id: 'assets.buy', defaultMessage: 'Buy' })}
      </div>
    </div>
  );
  return (
    <Fragment>
      {viewMode === 'list' && listHeader}
      {quoteSettingsFiltered.length > 0 ? (
        <div
          className={classNames('st-instruments-details', {
            'list-view': viewMode === 'list',
            'cards-view': viewMode === 'cards',
          })}
        >
          <div className="st-instruments-responsible-wrap">{selectedInstruments}</div>
        </div>
      ) : (
        <AssetsTabLoading />
      )}
    </Fragment>
  );
};

AssetsTab.defaultProps = {
  quoteSettingsFiltered: [],
  viewMode: 'cards',
  deals: {},
  signals: {},
  charts: {},
};

AssetsTab.propTypes = propTypes;

export default injectIntl(AssetsTab);
