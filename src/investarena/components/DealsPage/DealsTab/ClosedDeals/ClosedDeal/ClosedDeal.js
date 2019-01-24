import React, { Fragment } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { currencyFormat, numberFormat } from '../../../../../platform/numberFormat';
import InstrumentAvatar from '../../../../InstrumentAvatar/InstrumentAvatar';
import { PlatformHelper } from '../../../../../platform/platformHelper';
import { quoteFormat } from '../../../../../platform/parsingPrice';
import quoteSettingsData from '../../../../../default/quoteSettingsData';
import './ClosedDeal.less';

const propTypes = {
    quoteSettings: PropTypes.object,
    closedDeal: PropTypes.object.isRequired,
    quoteSecurity: PropTypes.string.isRequired,
    viewMode: PropTypes.oneOf(['list', 'cards'])
};

const ClosedDeal = ({quoteSettings, closedDeal, quoteSecurity, intl, viewMode}) => {
    const closedQuoteSettings = quoteSettings || quoteSettingsData;
    const direction = closedDeal.side === 'LONG' || closedDeal.side === 'BUY' ? 'buy' : 'sell';
    const directionCaption = <div className={`st-type st-deal-direction-${direction}`}>{direction}</div>;
    const instrumentName =
        <Link to={`/quote/${quoteSecurity}`}>
            <div className='st-instruments-text' data-test = "amount-opened-deal">
                <div>{closedQuoteSettings.name}</div>
            </div>
        </Link>;
    const dealAmount =
        <div className="st-amount" data-test = "instrument-open">
            {numberFormat(closedDeal.amount, PlatformHelper.countDecimals(closedDeal.amount))}
        </div>;
    const prices =
        <Fragment>
            <div title={intl.formatMessage({ id: 'deals.openPrice', defaultMessage: 'Opening price' })} className="st-price">{quoteFormat(closedDeal.openPrice, closedQuoteSettings)}</div>
            <div title={intl.formatMessage({ id: 'deals.closePrice', defaultMessage: 'Closing price' })} className="st-price">{quoteFormat(closedDeal.closePrice, closedQuoteSettings)}</div>
        </Fragment>;
    const pnlValue =
        <span className={`st-pnl ${closedDeal.pnl < 0 ? 'st-deal-pl-red' : 'st-deal-pl-green'}`}>
            {currencyFormat(closedDeal.pnl)}
        </span>;
    switch (viewMode) {
    case 'cards':
        return (
            <div className="st-open-deal-wrapper st-card">
                <div className="st-card__header">
                    <div className="st-instrument-avatar-wrap">
                        <InstrumentAvatar quoteSecurity={quoteSecurity} market={closedQuoteSettings.market}/>
                        {directionCaption}
                    </div>
                    <div className="st-instrument-name-wrap">
                        {instrumentName}
                        {dealAmount}
                    </div>
                    <div className="st-price">
                        {prices}
                    </div>
                </div>
                <div className="st-card__pnlInfo">
                    <span className="st-id-wrap">
                        ID  <span className="st-id-value">{closedDeal.dealSequenceNumber}</span>
                    </span>
                    <span className="st-pnl-wrap">P&L  {pnlValue}</span>
                </div>
                <div className="st-card__commission">
                    <span className="title">{intl.formatMessage({ id: 'deals.commission', defaultMessage: 'Commission' })}</span>
                    <span className="value">{currencyFormat(closedDeal.rolloverCommission / 1000000)}</span>
                </div>
                <div className="st-opened">
                    <div title={intl.formatMessage({id: 'deals.openTime', defaultMessage: 'Opening time'})}>{moment(closedDeal.openTime).format('DD.MM, HH:mm')}</div>
                    <div title={intl.formatMessage({id: 'deals.closeTime', defaultMessage: 'Closing time'})}>{moment(closedDeal.goodTillDate).format('DD.MM, HH:mm')}</div>
                </div>
            </div>
        );
    case 'list':
    default:
        return (
            <div className="st-open-deal-wrapper st-list-item">
                <div className="st-open-deal-header-wrap">
                    <div className="st-open-deal-header">
                        <div className="st-open-deal-header-line">
                            <div className="st-id">{closedDeal.dealSequenceNumber}</div>
                            <InstrumentAvatar quoteSecurity={quoteSecurity} market={closedQuoteSettings.market}/>
                            {instrumentName}
                            {directionCaption}
                            {dealAmount}
                            <div className="st-opened">{moment(closedDeal.openTime).format('DD.MM, HH:mm')}</div>
                            <div className="st-opened">{moment(closedDeal.goodTillDate).format('DD.MM, HH:mm')}</div>                            {prices}
                            {pnlValue}
                            <div className="st-commission">
                                {currencyFormat(closedDeal.rolloverCommission / 1000000)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

ClosedDeal.defaultProps = {
    viewMode: 'list'
};

ClosedDeal.propTypes = propTypes;

export default injectIntl(ClosedDeal);
