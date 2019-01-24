import { FormattedMessage, injectIntl } from 'react-intl';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Favorite from '../Favorite';
import quoteData from '../../default/quoteData';
import { quoteFormat } from '../../platform/parsingPrice';
import quoteSettingsData from '../../default/quoteSettingsData';
import withTrade from '../HOC/withTrade';
import { currencyFormat } from '../../platform/numberFormat';
import './PostQuotation.less';

const propTypes = {
    quoteSettings: PropTypes.object,
    quote: PropTypes.object,
    amount: PropTypes.string,
    margin: PropTypes.string,
    toggleConfirmationModal: PropTypes.func,
    handleClickLess: PropTypes.func.isRequired,
    handleClickMore: PropTypes.func.isRequired,
    handleClickOpenDeal: PropTypes.func.isRequired,
    handleBlurInput: PropTypes.func.isRequired,
    handleChangeInput: PropTypes.func.isRequired,
    handleKeyPressInput: PropTypes.func.isRequired
};

const defaultProps = {
  quoteSettings: quoteSettingsData,
  quote: quoteData,
  amount: '',
  margin: '',
  toggleConfirmationModal: ()=>{},
  handleClickLess: ()=>{},
  handleClickMore: ()=>{},
  handleClickOpenDeal: ()=>{},
  handleBlurInput: ()=>{},
  handleChangeInput: ()=>{},
  handleKeyPressInput: ()=>{},
};

const PostQuotation = (props) => {
    const quote = props.quote;
    const quoteSettings = props.quoteSettings;
    const dailyChange = `${quote.dailyChange.toFixed(2)}%`;
    const classOfDailyChange = quote.dailyChange > 0 ? 'st-quote-text-up' : 'st-quote-text-down';
    const classOfIndicator = (quoteSettings.isSession || quote.isSession) ? 'st-post-quotation-icon-point-green' : 'st-post-quotation-icon-point-red';
    const handleClickOpenDeal = (direction) => {
        props.handleClickOpenDeal(direction);
        if (props.toggleConfirmationModal) props.toggleConfirmationModal();
    };
    return (
        <div className="st-post-quotation-wrap">
            <div className="st-post-quotation-block margins">
                <header className="st-post-quotation-header d-flex justify-content-between align-items-center" >
                    <div className="d-flex">
                        <Favorite quoteSecurity = {quote.security}/>
                    </div>
                    <div className='st-quote-name-container'>
                      <Link
                        to={`/quote/${quote.security}`}
                        className="st-post-quotation-quote"
                        title={ quoteSettings.name }>
                        { quoteSettings.name }
                        </Link>
                      </div>
                    <div
                      title={props.intl.formatMessage({ id: 'tips.sessionStatus', defaultMessage: 'Trading session status' })}
                      className={classOfIndicator}
                    />
                </header>
                <div className="st-post-quotation-container">
                    <div title={props.intl.formatMessage({ id: 'tips.dailyChange', defaultMessage: 'Daily change' })} className={`st-daily-change ${classOfDailyChange}`}>
                        {dailyChange }
                    </div>
                </div>
                <div className="d-flex justify-content-between st-margin-bottom-small">
                    <span>
                        {props.intl.formatMessage({ id: 'postQuotation.margin', defaultMessage: 'Margin'})}
                    </span>
                    {currencyFormat(props.margin)}
                </div>
            </div>
            <div className="st-post-quotation-block amount">
                <div className="st-post-amount">
                    <button className="st-post-more-deal" onClick={props.handleClickLess}>&ndash;</button>
                    <input
                        type="text"
                        onBlur={props.handleBlurInput}
                        onChange={ props.handleChangeInput }
                        onKeyPress={props.handleKeyPressInput}
                        value = {props.amount}
                    />
                    <button className="st-post-less-deal" onClick={props.handleClickMore}>+</button>
                </div>
                <footer className="st-post-quotation-footer">
                    <div
                      className={ 'st-post-action-block st-margin-right-small' + ` st-quote-${quote.state ? quote.state : 'not-update'}`}
                      onClick={handleClickOpenDeal.bind(this, 'Sell')}
                    >
                        <span className="st-post-action-span">
                          <FormattedMessage id="postQuotation.button.sell" defaultMessage="Sell" />
                        </span>
                        <div>
                            { quoteFormat(quote.bidPrice, quoteSettings)}
                        </div>
                    </div>
                    <div className={ 'st-post-action-block' + ` st-quote-${quote.state ? quote.state : 'not-update'}`}
                         onClick={handleClickOpenDeal.bind(this, 'Buy')}
                    >
                        <span className="st-post-action-span">
                          <FormattedMessage id="postQuotation.button.buy" defaultMessage="Buy" />
                        </span>
                        <div>
                            {quoteFormat(quote.askPrice, quoteSettings)}
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

PostQuotation.propTypes = propTypes;
PostQuotation.defaultProps = defaultProps;

export default injectIntl(withTrade(PostQuotation));
