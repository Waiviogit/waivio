import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import { PlatformHelper } from '../../../platform/platformHelper';
import './OpenDeals.less';
import OpenDealLoading from '../ClosedDeals/ClosedDeal/ClosedDeal';
import OpenDeal from './OpenDeal';

const propTypes = {
  openDeals: PropTypes.shape().isRequired,
  quotes: PropTypes.shape().isRequired,
  quotesSettings: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  viewMode: PropTypes.oneOf(['list', 'cards']).isRequired,
};

const OpenDeals = ({ openDeals, intl, quotes, viewMode, quotesSettings }) => {
  const getPnl = openDeal => {
    const pnl =
      quotesSettings && quotesSettings[openDeal.security]
        ? PlatformHelper.getPnl(
            quotes[openDeal.security],
            openDeal,
            quotesSettings[openDeal.security],
          )
        : 0;
    if (isNaN(pnl) || pnl === undefined) {
      return '-';
    }

    return parseFloat(pnl).toFixed(2);
  };
  const dealsListHeader = (
    <div className="st-instr-column-wrap d-flex">
      <div className="st-id-title">ID:</div>
      <div className="st-instrument-avatar-title" />
      <div className="st-instruments-text-title">
        {intl.formatMessage({ id: 'assets.instrument', defaultMessage: 'Instrument' })}
      </div>
      <div className="st-opened-title">
        {intl.formatMessage({ id: 'deals.opened', defaultMessage: 'Deal is opened' })}
      </div>
      <div className="st-tp-title">
        {intl.formatMessage({ id: 'modalTakeProfit.header.title', defaultMessage: 'Take profit' })}
      </div>
      <div className="st-sl-title">
        {intl.formatMessage({ id: 'deals.stopLoss', defaultMessage: 'Stop loss' })}
      </div>
      <div className="st-price-title">
        {intl.formatMessage({ id: 'deals.price', defaultMessage: 'Price' })}
      </div>
      <div className="st-pnl-title">P&L:</div>
    </div>
  );
  return (
    <div className="st-open-deals-wrap-deals">
      <div className="st-open-deals-content">
        {viewMode === 'list' && dealsListHeader}
        <div
          className={classNames('st-content-quotes', {
            'list-view': viewMode === 'list',
            'cards-view': viewMode === 'cards',
          })}
        >
          {quotesSettings ? (
            <div className="st-deals-responsible-wrap">
              {!_.isEmpty(openDeals) ? (
                _.map(openDeals, openDeal => (
                  <OpenDeal
                    key={openDeal.dealId}
                    quoteSecurity={openDeal.security}
                    openDeal={openDeal}
                    dealPnL={getPnl(openDeal)}
                    viewMode={viewMode}
                  />
                ))
              ) : (
                <div className="sr-open-deals-not-present">
                  {intl.formatMessage({
                    id: 'openDeals.notPresent',
                    defaultMessage: 'You do not have open deals',
                  })}
                </div>
              )}
            </div>
          ) : (
            <OpenDealLoading type={viewMode} />
          )}
        </div>
      </div>
    </div>
  );
};

OpenDeals.propTypes = propTypes;

export default injectIntl(OpenDeals);
