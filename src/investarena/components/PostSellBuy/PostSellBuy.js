import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Favorite from '../Favorite';
import InstrumentAvatar from '../InstrumentAvatar/InstrumentAvatar';
import PostCurrentPrice from './PostCurrentPrice';
import PostDifference from './PostDifference';
import quoteData from '../../default/quoteData';
import { quoteFormat } from '../../platform/parsingPrice';
import quoteSettingsData from '../../default/quoteSettingsData';
import './PostSellBuy.less';

const propTypes = {
    quoteSettings: PropTypes.object,
    quote: PropTypes.object,
    profitability: PropTypes.number,
    finalQuote: PropTypes.object,
    forecast: PropTypes.string.isRequired,
    isExpired: PropTypes.bool.isRequired,
    postPrice: PropTypes.string.isRequired,
    recommend: PropTypes.string.isRequired,
    // isSignIn: PropTypes.bool.isRequired,
    // goQuotePage: PropTypes.func.isRequired
};

const PostSellBuy = ({intl, quote, quoteSettings, recommend, postPrice, goQuotePage, profitability, isExpired, forecast, finalQuote}) => {
    let profitabilityIcon;
    const quotePost = quote || quoteData;
    const quoteSettingsPost = quoteSettings || quoteSettingsData;
    const recommendPost = recommend.toLowerCase();
    if (isExpired && profitability !== undefined) {
        let data = {img: '/static/images/icons/ic_trending_flat_black_24px.svg', title: 'Neutral'};
        if (profitability < 0) {
            data = {img: '/static/images/icons/ic_trending_down_black_24px.svg', title: 'Negative'};
        } else if (profitability > 0) {
            data = {img: '/static/images/icons/ic_trending_up_black_24px.svg', title: 'Positive'};
        }
        profitabilityIcon =
            <div title={intl.formatMessage({ id: `profit.is${data.title}`})} className="st-profitability-icon">
                <img src={data.img}/>
            </div>;
    }
    return (
        <div className='st-post-sell-buy-wrap'>
            <div className='d-flex align-items-center'>
                <Favorite quoteSecurity = {quotePost.security}/>
                <InstrumentAvatar quoteSecurity={quotePost.security} market={quoteSettingsPost.market}/>
                <div className='st-margin-left-small'>
                    <a
                      // onClick={goQuotePage.bind(this, quotePost.security)}
                      className="st-post-sell-buy-quote">{quoteSettingsPost.name}
                    </a>
                </div>
                <div className={`st-post-sell-buy-block st-post-recommend-${recommendPost}`}>
                    <div title={intl.formatMessage({ id: 'tips.recommendationType' })} className={`st-post-sell-buy-icon-${recommendPost}`}>
                        <FormattedMessage id={`postQuotation.recommend.${recommendPost}`} />
                    </div>
                    <div title={intl.formatMessage({ id: 'tips.recommendationPrice' })}>
                        {quoteFormat(postPrice, quoteSettingsPost)}
                    </div>
                </div>
            </div>
            <div className="d-flex align-items-center">
                <div className=''>
                    <PostCurrentPrice quoteSettings = {quoteSettingsPost}
                        quote = {quotePost}
                        finalQuote = {finalQuote}
                        isExpired = {isExpired}
                        recommend = {recommendPost}
                        forecast = {forecast}/>
                </div>
                <div className='d-flex st-margin-left-large'>
                    <span className='st-post-sell-buy-profitability' title={intl.formatMessage({ id: 'tips.profitabilityTitle'})}>
                      <FormattedMessage id='postSellBuy.profitability' />
                    </span>
                    <PostDifference quoteSettings = {quoteSettingsPost}
                        isExpired = {isExpired}
                        profitability = {profitability}
                        quote = {quotePost}
                        forecast = {forecast}
                        postPrice = {postPrice}
                        recommend = {recommend} />
                </div>
                {profitabilityIcon}
            </div>
        </div>
    );
};

PostSellBuy.propTypes = propTypes;

export default injectIntl(PostSellBuy);
