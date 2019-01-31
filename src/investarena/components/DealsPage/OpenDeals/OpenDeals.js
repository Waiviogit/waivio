import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
// import { currencyFormat } from '../../../platform/numberFormat';
// import ModalCloseAll from '../../Modals/ModalsOpenDeal/ModalCloseAll/ModalCloseAll';
import OpenDeal from './OpenDeal/index';
import { PlatformHelper } from '../../../platform/platformHelper';
import './OpenDeals.less';

const propTypes = {
    openDeals: PropTypes.object.isRequired,
    quotes: PropTypes.object.isRequired,
    quoteSettings: PropTypes.object.isRequired,
    viewMode: PropTypes.oneOf(['list', 'cards'])
};

const OpenDeals = ({openDeals, intl, quotes, viewMode, quoteSettings }) => {
    let sumPnl = 0;
    let positiveDeals = {};
    // let positiveDealsPnl = 0;
    let negativeDeals = {};
    // let negativeDealsPnl = 0;
    const getPnl = (openDeal) => {
        let pnl = (quoteSettings && quoteSettings[openDeal.security]) ? PlatformHelper.getPnl(quotes[openDeal.security], openDeal, quoteSettings[openDeal.security]) : 0;
        if (isNaN(pnl) || pnl === undefined) {
            return '-';
        } 
            if (pnl.toFixed(2) > 0) {
                positiveDeals = {...positiveDeals, [openDeal.dealId]: openDeal};
                // positiveDealsPnl += pnl;
            } else {
                negativeDeals = {...negativeDeals, [openDeal.dealId]: openDeal};
                // negativeDealsPnl += pnl;
            }
            sumPnl += pnl;
            pnl = parseFloat(pnl).toFixed(2);
        
        return pnl;
    };
    const dealsListHeader =
        <div className="st-instr-column-wrap d-flex">
            <div className="st-id-title">ID:</div>
            <div className="st-instrument-avatar-title" />
            <div className="st-instruments-text-title">{intl.formatMessage({ id: 'assets.instrument', defaultMessage: 'Instrument' })}</div>
            <div className="st-opened-title">{intl.formatMessage({ id: 'deals.opened', defaultMessage: 'Deal is opened' })}</div>
            <div className="st-tp-title">{intl.formatMessage({ id: 'modalTakeProfit.header.title', defaultMessage: 'Take profit' })}</div>
            <div className="st-sl-title">{intl.formatMessage({ id: 'deals.stopLoss', defaultMessage: 'Stop loss' })}</div>
            <div className="st-price-title">{intl.formatMessage({ id: 'deals.price', defaultMessage: 'Price' })}</div>
            <div className="st-pnl-title">P&L:</div>
        </div>;
    return (
        <div className="st-open-deals-wrap-deals">
            <div className="st-open-deals-content">
                {viewMode === 'list' && dealsListHeader}
                <div className={classNames('st-content-quotes', {'list-view': viewMode === 'list', 'cards-view': viewMode === 'cards'})}>
                    <div className="st-deals-responsible-wrap">
                        {!_.isEmpty(openDeals)
                            ? _.map(openDeals, (openDeal) =>
                                    <OpenDeal
                                        key={openDeal.dealId}
                                        quoteSecurity = {openDeal.security}
                                        openDeal = {openDeal}
                                        dealPnL={getPnl(openDeal)}
                                        viewMode={viewMode}/>
                            )
                            : <div className="sr-open-deals-not-present">
                                {intl.formatMessage({ id: 'openDeals.notPresent', defaultMessage: 'You do not have open deals' })}
                            </div>
                        }</div>
                </div>
                {/* <div className="d-flex justify-content-end"> */}
                    {/* <div className="st-close-deals-row d-flex justify-content-between"> */}
                        {/* {openDeals && <ModalCloseAll */}
                            {/* openDeals={openDeals} */}
                            {/* sumPnl={currencyFormat(parseFloat(sumPnl).toFixed(2))} */}
                            {/* buttonClass='st-close-all' */}
                            {/* allMarker='CloseAll' */}
                        {/* />} */}
                        {/* {positiveDeals && <ModalCloseAll openDeals={positiveDeals} */}
                            {/* title={intl.formatMessage({ id: 'deals.positive', defaultMessage: 'deals with positive P&L' })} */}
                            {/* sumPnl={currencyFormat(parseFloat(positiveDealsPnl).toFixed(2))} */}
                            {/* buttonClass='st-close-positive' */}
                            {/* allMarker='CloseAllProfitable' */}
                        {/* />} */}
                        {/* {negativeDeals && <ModalCloseAll openDeals={negativeDeals} */}
                            {/* title={intl.formatMessage({ id: 'deals.negative', defaultMessage: 'deals with negative P&L' })} */}
                            {/* sumPnl={currencyFormat(parseFloat(negativeDealsPnl).toFixed(2))} */}
                            {/* buttonClass='st-close-negative' */}
                            {/* allMarker='CloseAllLosing' */}
                        {/* />} */}
                    {/* </div> */}
                {/* </div> */}
            </div>
        </div>
    );
};

OpenDeals.propTypes = propTypes;

export default injectIntl(OpenDeals);
