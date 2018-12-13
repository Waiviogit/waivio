import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { currencyFormat, numberFormat } from '../../../../../platform/numberFormat';
import InstrumentAvatar from '../../../../InstrumentAvatar/InstrumentAvatar';
import ModalClose from '../../../../Modals/ModalsOpenDeal/ModalClose';
import ModalStopLoss from '../../../../Modals/ModalsOpenDeal/ModalStopLoss';
import ModalTakeProfit from '../../../../Modals/ModalsOpenDeal/ModalTakeProfit';
import { PlatformHelper } from '../../../../../platform/platformHelper';
import quoteData from '../../../../../default/quoteData';
import { quoteFormat } from '../../../../../platform/parsingPrice';
import quoteSettingsData from '../../../../../default/quoteSettingsData';
import './OpenDeal.less';

const propTypes = {
    quote: PropTypes.object,
    quoteSettings: PropTypes.object,
    openDeal: PropTypes.object.isRequired,
    quoteSecurity: PropTypes.string.isRequired,
    platformName: PropTypes.string.isRequired,
    showNotification: PropTypes.func.isRequired,
    viewMode: PropTypes.oneOf(['list', 'cards'])
};

const OpenDeal = ({intl, quote, quoteSettings, openDeal, quoteSecurity, showNotification, dealPnL, viewMode, platformName}) => {
    const quoteDeal = quote || quoteData;
    const quoteSettingsDeal = quoteSettings || quoteSettingsData;
    const direction = openDeal.side === 'LONG' || openDeal.side === 'BUY' ? 'buy' : 'sell';
    const marketPrice = openDeal.side === 'LONG' || openDeal.side === 'BUY' ? quoteDeal.askPrice : quoteDeal.bidPrice;
    const directionCaption = <span className={`st-type st-deal-direction-${direction}`}>{direction}</span>;
    const instrumentName =
        <Link to={`/quote/${quoteSecurity}`}>
            <div className="st-instruments-text" data-test = "amount-opened-deal">
                <span>{quoteSettingsDeal.name}</span>
            </div>
        </Link>;
    const dealAmount =
        <span className="st-amount st-open-deal-header-item-title" data-test = "instrument-open">
            {numberFormat(openDeal.amount, PlatformHelper.countDecimals(openDeal.amount))}
        </span>;
    const prices =
        <div className="st-price">
            <div className="d-flex align-items-center justify-content-between">
                <div className="st-open-deal-header-item-title">{intl.formatMessage({id: 'deals.opening'})}</div>
                <div title={intl.formatMessage({id: 'deals.opening'})}>{quoteFormat(openDeal.openPrice, quoteSettingsDeal)}</div>
            </div>
            <div className="d-flex align-items-center justify-content-between">
                <div className="st-open-deal-header-item-title">{intl.formatMessage({id: 'deals.market'})}</div>
                <div title={intl.formatMessage({id: 'deals.market'})}>{quoteFormat(marketPrice, quoteSettingsDeal)}</div>
            </div>
        </div>;
    const pnlValue =
        <span className={`st-pnl ${dealPnL < 0 ? 'st-deal-pl-red' : 'st-deal-pl-green'}`}>
            {currencyFormat(dealPnL)}
        </span>;
    const dealDates =
        <div className="st-opened">
            <div className="d-flex align-items-center justify-content-between">
                <div className="st-open-deal-header-item-title">{intl.formatMessage({id: 'deals.from'})}</div>
                <div className="st-open-deal-header-item-title">{moment(openDeal.openTime).format('DD.MM, HH:mm')}</div>
            </div>
            <div className="d-flex align-items-center justify-content-between">
                <div className="st-open-deal-header-item-title">{intl.formatMessage({id: 'deals.till'})}</div>
                <div className="st-open-deal-header-item-title">{moment(openDeal.goodTillDate).format('DD.MM, HH:mm')}</div>
            </div>
        </div>;
    const modalTP = <ModalTakeProfit
        openDeal = {openDeal}
        quote = {quoteDeal}
        quoteSettings = {quoteSettingsDeal}
        showNotification = {showNotification}
    />;
    const modalSL = <ModalStopLoss
        openDeal = {openDeal}
        quote = {quoteDeal}
        quoteSettings = {quoteSettingsDeal}
        showNotification = {showNotification}
    />;
    const modalCloseDeal = <ModalClose
        openDealId={openDeal.dealId}
        openDealSequenceNumber={openDeal.dealSequenceNumber}
    />;
    switch (viewMode) {
    case 'cards':
        return (
            <div className="st-open-deal-wrapper st-card">
                <div className="st-card__header">
                    <div className="st-instrument-avatar-wrap">
                        <InstrumentAvatar quoteSecurity={quoteSecurity} market={quoteSettingsDeal.market}/>
                        {directionCaption}
                    </div>
                    <div className="st-instrument-name-wrap">
                        {instrumentName}
                        {dealAmount}
                    </div>
                    {prices}
                </div>
                <div className="st-card__pnlInfo">
                    <span className="st-id-wrap">
                        ID  <span className="st-id-value">{openDeal.dealSequenceNumber}</span>
                    </span>
                    <span className="st-pnl-wrap">P&L  {pnlValue}</span>
                </div>
                {dealDates}
                <div className="st-card__btn-wrap">
                    {modalTP}
                    {modalSL}
                </div>
                <div className="st-card__btn-wrap">
                    {modalCloseDeal}
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
                            <span className="st-id">{openDeal.dealSequenceNumber}</span>
                            <InstrumentAvatar quoteSecurity={quoteSecurity} market={quoteSettingsDeal.market}/>
                            {instrumentName}
                            {directionCaption}
                            {dealAmount}
                            {dealDates}
                            {modalTP}
                            {modalSL}
                            {prices}
                            {pnlValue}
                            {modalCloseDeal}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

OpenDeal.propTypes = propTypes;

export default injectIntl(OpenDeal);
