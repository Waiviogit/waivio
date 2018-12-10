import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import quoteData from '../../../default/quoteData';
import { quoteFormat } from '../../../platform/parsingPrice';
import quoteSettingsData from '../../../default/quoteSettingsData';
import withTrade from '../../HOC/withTrade';
import './TradeButtonsAssets.less';

const propTypes = {
    quoteSettings: PropTypes.object,
    quote: PropTypes.object,
    className: PropTypes.string.isRequired,
    handleClickLess: PropTypes.func.isRequired,
    handleClickMore: PropTypes.func.isRequired,
    handleClickOpenDeal: PropTypes.func.isRequired,
    handleBlurInput: PropTypes.func.isRequired,
    handleChangeInput: PropTypes.func.isRequired,
    handleKeyPressInput: PropTypes.func.isRequired
};

const TradeButtonsAssets = (props) => {
    let divWrap;
    const quote = props.quote || quoteData;
    const quoteSettings = props.quoteSettings || quoteSettingsData;
    const tradeOn = () => {
        divWrap.classList.remove('st-trade-buttons-opacity-off');
        divWrap.className += ' st-trade-buttons-opacity-on';
    };
    const tradeOff = () => {
        divWrap.classList.remove('st-trade-buttons-opacity-on');
        divWrap.className += ' st-trade-buttons-opacity-off';
    };
    return (
        <div id='tradeBtn' className={props.className} onMouseEnter={tradeOn} onMouseLeave={tradeOff}>
            <div ref={(div) => { divWrap = div }} className="st-trade-buttons-wrap">
                <div className="st-trade-buttons-footer">
                    <div className={ `st-trade-buttons-action-block st-quote-${quote.state ? quote.state : 'not-update'}`} onClick={props.handleClickOpenDeal.bind(this, 'Sell')}>
                        <div title={props.intl.formatMessage({ id: 'postQuotation.button.sell' })}>
                            { quoteFormat(quote.bidPrice, quoteSettings)}
                        </div>
                    </div>
                    <div className="st-trade-buttons-container">
                        <div className="st-trade-buttons-amount">
                            <div className="st-trade-buttons-deal-wrap">
                                <div className="st-assets-inc-button st-trade-buttons-more-deal" onClick={props.handleClickLess}>&ndash;</div>
                                <input type="text"
                                    onBlur={props.handleBlurInput}
                                    onChange={props.handleChangeInput }
                                    onKeyPress={props.handleKeyPressInput}
                                    value={props.amount}/>
                                <div className="st-assets-inc-button st-trade-buttons-less-deal" onClick={props.handleClickMore}>+</div>
                            </div>
                        </div>
                    </div>
                    <div className={ `st-trade-buttons-action-block st-quote-${quote.state ? quote.state : 'not-update'}`}
                         onClick={props.handleClickOpenDeal.bind(this, 'Buy')}
                    >
                        <div title={props.intl.formatMessage({ id: 'postQuotation.button.buy' })}>
                            {quoteFormat(quote.askPrice, quoteSettings)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

TradeButtonsAssets.propTypes = propTypes;

export default injectIntl(withTrade(TradeButtonsAssets));
