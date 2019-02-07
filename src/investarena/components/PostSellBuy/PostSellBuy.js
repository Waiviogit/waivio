import { injectIntl, FormattedMessage } from 'react-intl';
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
};
const defaultProps = {
  quoteSettings: quoteSettingsData,
  quote: quoteData,
  profitability: 0,
  finalQuote: {},
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
}) => {
  let profitabilityIcon;
  const wobj = quoteSettings.wobjData ? quoteSettings.wobjData : {};
  const recommendPost = recommend.toLowerCase();
  if (isExpired && profitability !== undefined) {
    let data = { img: '/static/images/icons/ic_trending_flat_black_24px.svg', title: 'Neutral' };
    if (profitability < 0) {
      data = { img: '/static/images/icons/ic_trending_down_black_24px.svg', title: 'Negative' };
    } else if (profitability > 0) {
      data = { img: '/static/images/icons/ic_trending_up_black_24px.svg', title: 'Positive' };
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
  return (
    <div className="st-post-sell-buy-wrap">
      <div className="d-flex align-items-center">
        <InstrumentAvatar
          avatarlink={wobj.avatarlink}
          market={quoteSettings.market}
          permlink={wobj.author_permlink}
        />
        <div className="st-margin-left-small">
          <Link to={`/object/@${wobj.author_permlink}`} className="st-post-sell-buy-quote">
            {quoteSettings.name}
          </Link>
        </div>
        <div className={`st-post-sell-buy-block st-post-recommend-${recommendPost}`}>
          <div
            title={intl.formatMessage({
              id: 'tips.recommendationType',
              defaultMessage: 'Forecast type',
            })}
            className={`st-post-sell-buy-icon-${recommendPost}`}
          >
            <FormattedMessage
              id={`postQuotation.recommend.${recommendPost}`}
              defaultMessage={recommendPost.toUpperCase()}
            />
          </div>
          <div
            title={intl.formatMessage({
              id: 'tips.recommendationPrice',
              defaultMessage: 'Price at the beginning of the forecast',
            })}
          >
            {quoteFormat(postPrice, quoteSettings)}
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <PostCurrentPrice
          quoteSettings={quoteSettings}
          quote={quote}
          finalQuote={finalQuote}
          isExpired={isExpired}
          recommend={recommendPost}
          forecast={forecast}
        />
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
  );
};

PostSellBuy.propTypes = propTypes;
PostSellBuy.defaultProps = defaultProps;

export default injectIntl(PostSellBuy);
