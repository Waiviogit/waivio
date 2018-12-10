import React, { Fragment } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import Instrument from '../../InstrumentsPage/Instrument';
import '../InstrumentsPage.less';

const propTypes = {
    charts: PropTypes.object,
    signals: PropTypes.object,
    deals: PropTypes.object,
    quotes: PropTypes.object.isRequired,
    quoteSettings: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    favorites: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    viewMode: PropTypes.oneOf(['list', 'cards'])
};

const AssetsTab = ({intl, quotes, quoteSettings, title, trends, charts, signals, favorites, deals, viewMode}) => {
    quotes = _.sortBy(quotes, 'security');
    const matchTitle = (quote) => title === 'CryptoCurrency'
            ? quoteSettings[quote.security].market === title || quoteSettings[quote.security].market === 'Crypto'
            : quoteSettings[quote.security].market === title || (title === 'Favorites' && favorites.includes(quote.security));
    const selectedInstruments = _.map(quotes, (quote) =>
        (quoteSettings[quote.security] && matchTitle(quote)) &&
        <div key={quote.security} className={classNames({'st-list-item': viewMode === 'list', 'st-card': viewMode === 'cards'})}>
            <Instrument
                signals={signals[quote.security]}
                deals={deals}
                quoteSettings={quoteSettings[quote.security]}
                quote={quote}
                chart={charts ? charts[quote.security] : []}
                trendBuy={(trends && trends[quote.security]) ? trends[quote.security].long_part * 100 : 50}
                quoteSecurity={quote.security}
                viewMode={viewMode}/>
        </div>
    );
    const listHeader =
        <div className="st-instr-column-wrap d-flex">
            <div className="st-instruments-text-title">{intl.formatMessage({ id: 'assets.instrument' })}</div>
            <div className="st-daily-title">{intl.formatMessage({ id: 'assets.dailyChange' })}</div>
            <div className="st-buy-title">{intl.formatMessage({ id: 'assets.sell' })}</div>
            <div className="st-amount-title">{intl.formatMessage({ id: 'assets.amount' })}</div>
            <div className="st-sell-title">{intl.formatMessage({ id: 'assets.buy' })}</div>
            <img title={intl.formatMessage({ id: 'assetWidgets.tabSignals' })} className="st-signals-title" src="/images/icons/icon-signal.svg"/>
        </div>;
    return (
        <Fragment>
            {viewMode === 'list' && listHeader}
            <div className={classNames('st-instruments-details', {'list-view': viewMode === 'list', 'cards-view': viewMode === 'cards'})}>
                {quotes && quoteSettings && !_.isEmpty(quotes) && !_.isEmpty(quoteSettings) && _.some(quotes, quote => quoteSettings[quote.security] && matchTitle(quote))
                    ? <div className="st-instruments-responsible-wrap">{selectedInstruments}</div>
                    : <div className="d-flex justify-content-center align-items-center h-100">{intl.formatMessage({ id: 'assets.quotesNoPresent' })}</div>}
            </div>
        </Fragment>
    );
};

AssetsTab.defaultProps = { viewMode: 'list' };

AssetsTab.propTypes = propTypes;

export default injectIntl(AssetsTab);
