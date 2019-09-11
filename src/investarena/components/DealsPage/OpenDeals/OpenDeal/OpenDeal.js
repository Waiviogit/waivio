import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { currencyFormat, numberFormat } from '../../../../platform/numberFormat';
import InstrumentAvatar from '../../../InstrumentAvatar/InstrumentAvatar';
import ModalClose from '../../../Modals/ModalsOpenDeal/ModalClose/index';
import ModalStopLoss from '../../../Modals/ModalsOpenDeal/ModalStopLoss/index';
import ModalTakeProfit from '../../../Modals/ModalsOpenDeal/ModalTakeProfit/index';
import { PlatformHelper } from '../../../../platform/platformHelper';
import quoteData from '../../../../default/quoteData';
import { quoteFormat } from '../../../../platform/parsingPrice';
import './OpenDeal.less';

const propTypes = {
  quote: PropTypes.shape(),
  quoteSettings: PropTypes.shape(),
  openDeal: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  viewMode: PropTypes.oneOf(['list', 'cards']),
};

const OpenDeal = ({ intl, quote, quoteSettings, openDeal, dealPnL, viewMode }) => {
  if (quoteSettings && !_.isEmpty(quoteSettings.wobjData && openDeal)) {
    const quoteDeal = quote || quoteData;
    const direction = openDeal.side === 'LONG' || openDeal.side === 'BUY' ? 'buy' : 'sell';
    const marketPrice =
      openDeal.side === 'LONG' || openDeal.side === 'BUY' ? quoteDeal.askPrice : quoteDeal.bidPrice;
    const directionCaption = (
      <div className={`st-type st-deal-direction-${direction}`}>{direction}</div>
    );
    const wobj = quoteSettings.wobjData ? quoteSettings.wobjData : {};
    const instrumentName = (
      <Link to={`/object/${wobj.author_permlink}`}>
        <div className="st-instruments-text" data-test="amount-opened-deal">
          <span>{quoteSettings.name}</span>
        </div>
      </Link>
    );
    const dealAmount = (
      <div
        className="st-open-deal-header-item-title"
        data-test="instrument-open"
        title={intl.formatMessage({ id: 'deals.amount', defaultMessage: 'Amount' })}
      >
        {numberFormat(openDeal.amount, PlatformHelper.countDecimals(openDeal.amount))}
      </div>
    );
    const prices = (
      <div className="st-price">
        <div className="d-flex align-items-center justify-content-between">
          <div className="st-open-deal-header-item-title">
            {intl.formatMessage({ id: 'deals.opening', defaultMessage: 'opening' })}
          </div>
          <div title={intl.formatMessage({ id: 'deals.opening', defaultMessage: 'opening' })}>
            {quoteFormat(openDeal.openPrice, quoteSettings)}
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div className="st-open-deal-header-item-title">
            {intl.formatMessage({ id: 'deals.market', defaultMessage: 'market' })}
          </div>
          <div title={intl.formatMessage({ id: 'deals.market', defaultMessage: 'market' })}>
            {quoteFormat(marketPrice, quoteSettings)}
          </div>
        </div>
      </div>
    );
    const pnlValue = (
      <span className={`st-pnl ${dealPnL < 0 ? 'st-deal-pl-red' : 'st-deal-pl-green'}`}>
        {currencyFormat(dealPnL)}
      </span>
    );
    const dealDates = (
      <div className="st-opened">
        <div className="d-flex align-items-center justify-content-between">
          <div className="st-open-deal-header-item-title">
            {intl.formatMessage({ id: 'deals.from', defaultMessage: 'from' })}
          </div>
          <div className="st-open-deal-header-item-title">
            {moment(openDeal.openTime).format('DD.MM, HH:mm')}
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div className="st-open-deal-header-item-title">
            {intl.formatMessage({ id: 'deals.till', defaultMessage: 'till' })}
          </div>
          <div className="st-open-deal-header-item-title">
            {moment(openDeal.goodTillDate).format('DD.MM, HH:mm')}
          </div>
        </div>
      </div>
    );
    const modalTP = (
      <ModalTakeProfit openDeal={openDeal} quote={quoteDeal} quoteSettings={quoteSettings} />
    );
    const modalSL = (
      <ModalStopLoss openDeal={openDeal} quote={quoteDeal} quoteSettings={quoteSettings} />
    );
    const modalCloseDeal = (
      <ModalClose
        openDealId={openDeal.dealId}
        openDealSequenceNumber={openDeal.dealSequenceNumber}
      />
    );
    switch (viewMode) {
      case 'cards':
        return (
          <div className="st-open-deal-wrapper st-card">
            <div className="st-card__header">
              <div className="st-instrument-avatar-wrap">
                <InstrumentAvatar
                  permlink={wobj.author_permlink}
                  market={quoteSettings.market}
                  avatarlink={wobj.avatarlink}
                />
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
                ID <span className="st-id-value">{openDeal.dealSequenceNumber}</span>
              </span>
              <span className="st-pnl-wrap">P&L {pnlValue}</span>
            </div>
            {dealDates}
            <div className="st-card__btn-wrap">
              {modalTP}
              {modalSL}
            </div>
            <div className="st-card__btn-wrap">{modalCloseDeal}</div>
          </div>
        );
      case 'list':
      default:
        return (
          <div className="st-open-deal-wrapper st-list-item">
            <div className="st-open-deal-header-wrap">
              <div className="st-open-deal-header">
                <div className="st-open-deal-header-line">
                  <div className="st-id">
                    {openDeal.dealSequenceNumber}
                    {directionCaption}
                  </div>
                  <InstrumentAvatar
                    avatarlink={wobj.avatarlink}
                    market={quoteSettings.market}
                    permlink={wobj.author_permlink}
                  />
                  <div>
                    {instrumentName}
                    {dealAmount}
                  </div>
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
  } else return null;
};

OpenDeal.propTypes = propTypes;

export default injectIntl(OpenDeal);
