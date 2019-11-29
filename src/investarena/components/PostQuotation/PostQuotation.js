import {injectIntl} from 'react-intl';
import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import quoteData from '../../default/quoteData';
import {quoteFormat} from '../../platform/parsingPrice';
import quoteSettingsData from '../../default/quoteSettingsData';
import withTrade from '../HOC/withTrade';
import {currencyFormat} from '../../platform/numberFormat';
import './PostQuotation.less';

const propTypes = {
  quoteSettings: PropTypes.shape(),
  quote: PropTypes.shape(),
  intl: PropTypes.shape().isRequired,
  amount: PropTypes.string,
  caller: PropTypes.string,
  margin: PropTypes.string,
  toggleConfirmationModal: PropTypes.func.isRequired,
  handleClickLess: PropTypes.func.isRequired,
  handleClickMore: PropTypes.func.isRequired,
  handleClickOpenDeal: PropTypes.func.isRequired,
  handleBlurInput: PropTypes.func.isRequired,
  handleChangeInput: PropTypes.func.isRequired,
  handleKeyPressInput: PropTypes.func.isRequired,
};

const defaultProps = {
  quoteSettings: quoteSettingsData,
  quote: quoteData,
  caller: 'od-pc',
  amount: '',
  margin: '',
};

const PostQuotation = ({
                         quote,
                         quoteSettings,
                         margin,
                         amount,
                         toggleConfirmationModal,
                         handleClickOpenDeal,
                         handleClickLess,
                         handleClickMore,
                         handleBlurInput,
                         handleChangeInput,
                         handleKeyPressInput,
                         caller,
                         intl,
                       }) => {
  const wobj = quoteSettings.wobjData ? quoteSettings.wobjData : {};
  const dailyChange = `${quote.dailyChange.toFixed(2)}%`;
  const classOfDailyChange = quote.dailyChange > 0 ? 'st-quote-text-up' : 'st-quote-text-down';
  const classOfIndicator =
    quoteSettings.isSession || quote.isSession
      ? 'st-post-quotation-icon-point-green'
      : 'st-post-quotation-icon-point-red';
  const handleOpenDeal = (direction, caller) => {
    handleClickOpenDeal(direction, caller);
    if (toggleConfirmationModal) toggleConfirmationModal();
  };

  return (
    <div className="st-post-quotation-wrap">
      {quote && quoteSettings && quoteSettings.tickSize ? (
        <React.Fragment>
          <div className="st-post-quotation-block margins">
            <div className="st-post-quotation-header d-flex justify-content-between align-items-center">
              <div className="st-quote-name-container">
                <Link
                  to={`/object/${wobj.author_permlink}`}
                  className="st-post-quotation-quote"
                  title={quoteSettings.name}
                >
                  {quoteSettings.name}
                </Link>
              </div>
              <div
                title={intl.formatMessage({
                  id: 'tips.sessionStatus',
                  defaultMessage: 'Trading session status',
                })}
                className={classOfIndicator}
              />
            </div>
            <div className="st-post-quotation-container">
              <div
                title={intl.formatMessage({
                  id: 'tips.dailyChange',
                  defaultMessage: 'Daily change',
                })}
                className={`st-daily-change ${classOfDailyChange}`}
              >
                {dailyChange}
              </div>
            </div>
            <div className="d-flex justify-content-between st-margin-bottom-small">
              <span>
                {intl.formatMessage({id: 'postQuotation.margin', defaultMessage: 'Margin'})}
              </span>
              {currencyFormat(margin)}
            </div>
          </div>
          <div className="st-post-quotation-block amount">
            <div className="st-post-amount">
              <button className="st-post-more-deal" onClick={handleClickLess}>
                &ndash;
              </button>
              <input
                type="text"
                onBlur={handleBlurInput}
                onChange={handleChangeInput}
                onKeyPress={handleKeyPressInput}
                value={amount}
              />
              <button className="st-post-less-deal" onClick={handleClickMore}>
                +
              </button>
            </div>
            <div className="st-post-quotation-footer">
              <div
                role="presentation"
                className={`st-post-action-block st-margin-right-small st-quote-${
                  quote.state ? quote.state : 'not-update'
                  }`}
                onClick={handleOpenDeal.bind(this, 'Sell', caller)}
              >
                <span className="st-post-action-span">
                  {intl.formatMessage({id: 'postQuotation.button.sell', defaultMessage: 'Sell'})}
                </span>
                <div>{quoteFormat(quote.bidPrice, quoteSettings)}</div>
              </div>
              <div
                role="presentation"
                className={`st-post-action-block st-quote-${
                  quote.state ? quote.state : 'not-update'
                  }`}
                onClick={handleOpenDeal.bind(this, 'Buy', caller)}
              >
                <span className="st-post-action-span">
                  {intl.formatMessage({id: 'postQuotation.button.buy', defaultMessage: 'Buy'})}
                </span>
                <div>{quoteFormat(quote.askPrice, quoteSettings)}</div>
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <div className="no-data-access-wrap">
          {intl.formatMessage({
            id: 'no_access_to_quote',
            defaultMessage:
              'Your broker is not provide actual data for this instrument, or your account need special access to this instrument.',
          })}
        </div>
      )}
    </div>
  );
};

PostQuotation.propTypes = propTypes;
PostQuotation.defaultProps = defaultProps;

export default injectIntl(withTrade(PostQuotation));
