import { injectIntl, FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import InstrumentAvatar from '../InstrumentAvatar/InstrumentAvatar';
import PostCurrentPrice from './PostCurrentPrice';
import PostDifference from './PostDifference';
import quoteData from '../../default/quoteData';
import { quoteFormat } from '../../platform/parsingPrice';
import quoteSettingsData from '../../default/quoteSettingsData';
import './PostSellBuy.less';
import { Tooltip } from 'antd';

const propTypes = {
  quoteSettings: PropTypes.shape(),
  quote: PropTypes.shape(),
  profitability: PropTypes.number,
  finalQuote: PropTypes.shape(),
  intl: PropTypes.shape().isRequired,
  forecast: PropTypes.string.isRequired,
  isExpired: PropTypes.bool.isRequired,
  postPrice: PropTypes.string.isRequired,
  recommend: PropTypes.string.isRequired,
  screenSize: PropTypes.string,
};
const defaultProps = {
  quoteSettings: quoteSettingsData,
  quote: quoteData,
  profitability: 0,
  finalQuote: {},
  screenSize: 'large',
};

const PostSellBuy = ({
  intl,
  quote,
  quoteSettings,
  recommend,
  postPrice,
  profitability,
  isExpired,
  forecast,
  finalQuote,
  screenSize,
}) => {
  let profitabilityIcon;
  const wobj = (quoteSettings && quoteSettings.wobjData) || {};
  const recommendPost = recommend.toLowerCase();
  if (isExpired && profitability !== undefined) {
    let data = { img: '/images/icons/ic_trending_flat.svg', title: 'Neutral' };
    if (profitability < 0) {
      data = { img: '/images/icons/ic_trending_down.svg', title: 'Negative' };
    } else if (profitability > 0) {
      data = { img: '/images/icons/ic_trending_up.svg', title: 'Positive' };
    }
    profitabilityIcon = (
      <div
        title={intl.formatMessage({ id: `profit.is${data.title}` })}
        className="st-profitability-icon"
      >
        <img alt="profitability" src={data.img} />
      </div>
    );
  }
  const isMobile = screenSize === 'xsmall' || screenSize === 'small';

  const priceDirection = () => (
    <div
      className={`st-post-sell-buy-block st-post-recommend-${recommendPost} ${
        isMobile ? 'm-0' : ''
      }`}
    >
      <Tooltip
        title={intl.formatMessage({
          id: 'tips.recommendationType',
          defaultMessage: 'Forecast type',
        })}
      >
        <div className={`st-post-sell-buy-icon-${recommendPost}`}>
          <FormattedMessage
            id={`postQuotation.recommend.${recommendPost}`}
            defaultMessage={recommendPost.toUpperCase()}
          />
        </div>
      </Tooltip>
      <Tooltip
        title={intl.formatMessage({
          id: 'tips.recommendationPrice',
          defaultMessage: 'Price at the beginning of the forecast',
        })}
      >
        {quoteFormat(postPrice, quoteSettings)}
      </Tooltip>
    </div>
  );

  const priceCurrent = () => (
    <PostCurrentPrice
      quoteSettings={quoteSettings}
      quote={quote}
      finalQuote={finalQuote}
      isExpired={isExpired}
      recommend={recommendPost}
      forecast={forecast}
    />
  );

  return (
    <React.Fragment>
      {!isEmpty(finalQuote) ||
      (quoteSettings && quoteSettings.defaultQuantity && wobj && wobj.author_permlink) ? (
        <React.Fragment>
          <div className="st-post-sell-buy-wrap">
            <div className="d-flex align-items-center">
              <InstrumentAvatar
                avatarlink={wobj.avatarlink}
                market={quoteSettings.market}
                permlink={wobj.author_permlink}
              />
              <div className="st-margin-left-small">
                {wobj.author_permlink ? (
                  <Link to={`/object/${wobj.author_permlink}`} className="st-post-sell-buy-quote">
                    {quoteSettings.name}
                  </Link>
                ) : (
                  finalQuote && <span className="fw7">{finalQuote.security}</span>
                )}
              </div>
              {!isMobile && priceDirection()}
            </div>
            <div className="d-flex align-items-center">
              {!isMobile && priceCurrent()}
              <div className="d-flex st-margin-left-large">
                <span
                  className="st-post-sell-buy-profitability"
                  title={intl.formatMessage({
                    id: 'tips.profitabilityTitle',
                    defaultMessage:
                      'The difference between the price at the time of publication of the post and the current price in pips',
                  })}
                >
                  <FormattedMessage id="postSellBuy.profitability" defaultMessage="Profitability" />
                </span>
                <PostDifference
                  quoteSettings={quoteSettings}
                  isExpired={isExpired}
                  profitability={profitability}
                  quote={quote}
                  forecast={forecast}
                  postPrice={postPrice}
                  recommend={recommend}
                />
              </div>
              {profitabilityIcon}
            </div>
          </div>
          {isMobile && (
            <div className="st-post-sell-buy-wrap">
              {priceDirection()}
              {priceCurrent()}
            </div>
          )}
        </React.Fragment>
      ) : (
        <div />
      )}
    </React.Fragment>
  );
};

PostSellBuy.propTypes = propTypes;
PostSellBuy.defaultProps = defaultProps;

export default injectIntl(PostSellBuy);
