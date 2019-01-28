import React, { Fragment } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import Instrument from '../../InstrumentsPage/Instrument';
import '../InstrumentsPage.less';

const propTypes = {
    charts: PropTypes.shape(),
    signals: PropTypes.shape(),
    deals: PropTypes.shape(),
    quotes: PropTypes.shape().isRequired,
    quoteSettings: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    favorites: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    viewMode: PropTypes.oneOf(['list', 'cards'])
};

const AssetsTab = ({intl, quotes, quoteSettings, title, charts, signals, favorites, deals, viewMode}) => {
    const sortedQuotes = _.sortBy(quotes, 'security');
    const matchTitle = (quote) => title === 'CryptoCurrency'
            ? quoteSettings[quote.security].market === title || quoteSettings[quote.security].market === 'Crypto'
            : quoteSettings[quote.security].market === title || (title === 'Favorites' && favorites.includes(quote.security));
    const selectedInstruments = _.map(sortedQuotes, (quote) =>
        (quoteSettings[quote.security] && quoteSettings[quote.security].wobjData && matchTitle(quote) && charts) &&
        <div key={quote.security} className={classNames({'st-list-item': viewMode === 'list', 'st-card': viewMode === 'cards'})}>
            <Instrument
                signals={signals[quote.security]}
                deals={deals}
                quoteSettings={quoteSettings[quote.security]}
                quote={quote}
                chart={charts ? charts[quote.security] : []}
                quoteSecurity={quote.security}
                viewMode={viewMode}/>
        </div>
    );
    const listHeader =
        <div className="st-instr-column-wrap d-flex">
            <div className="st-instruments-text-title">{intl.formatMessage({ id: 'assets.instrument', defaultMessage: 'Instrument' })}</div>
            <div className="st-daily-title">{intl.formatMessage({ id: 'assets.dailyChange', defaultMessage: 'Daily change' })}</div>
            <div className="st-buy-title">{intl.formatMessage({ id: 'assets.sell', defaultMessage: 'Sell' })}</div>
            <div className="st-amount-title">{intl.formatMessage({ id: 'assets.amount', defaultMessage: 'Amount' })}</div>
            <div className="st-sell-title">{intl.formatMessage({ id: 'assets.buy', defaultMessage: 'Buy' })}</div>
            <img
              alt="signal"
              title={intl.formatMessage({ id: 'assetWidgets.tabSignals', defaultMessage: 'Signals' })}
              className="st-signals-title"
              src="/images/icons/icon-signal.svg"
            />
        </div>;
    return (
        <Fragment>
            {viewMode === 'list' && listHeader}
            <div className={classNames('st-instruments-details', {'list-view': viewMode === 'list', 'cards-view': viewMode === 'cards'})}>
                {sortedQuotes && quoteSettings && !_.isEmpty(sortedQuotes) && !_.isEmpty(quoteSettings) && _.some(sortedQuotes, quote => quoteSettings[quote.security] && matchTitle(quote))
                    ? <div className="st-instruments-responsible-wrap">{selectedInstruments}</div>
                    : <div className="d-flex justify-content-center align-items-center h-100 w-100">{intl.formatMessage({ id: 'assets.quotesNoPresent' })}</div>}
            </div>
        </Fragment>
    );
};

AssetsTab.defaultProps = { viewMode: 'list' };

AssetsTab.propTypes = propTypes;

export default injectIntl(AssetsTab);
