import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import React from 'react';
import PostCurrentPrice from '../../../investarena/components/PostSellBuy/PostCurrentPrice';
// import PostDifference from '../../../investarena/components/PostSellBuy/PostDifference';
import { quoteFormat } from '../../../investarena/platform/parsingPrice';
import { localeDate } from '../../../investarena/helpers/diffDateTime';
import './ForecastItem.less';

@injectIntl
class ForecastItem extends React.Component {
  static propTypes = {
    /* from decorators */
    intl: PropTypes.shape().isRequired,
    /* from connect */
    quoteSettings: PropTypes.shape(),
    quote: PropTypes.shape(),
    /* passed props */
    recommend: PropTypes.string.isRequired,
    postPrice: PropTypes.number.isRequired,
    forecast: PropTypes.string.isRequired,
    dateTimeCreate: PropTypes.string.isRequired,
    permlink: PropTypes.string.isRequired,
  };

  static defaultProps = {
    quoteSettings: {},
    quote: {},
  };

  state = {
    visability: false,
  };

  verticalFlip = () => this.setState(prevState => ({ visability: !prevState.visability }));

  render() {
    const {
      quoteSettings,
      quote,
      recommend,
      postPrice,
      forecast,
      dateTimeCreate,
      permlink,
      intl,
    } = this.props;
    const { visability } = this.state;
    const parseDate = time => {
      const date = moment(time).format(localeDate('YYYY/MM/DD', intl.locale));
      const times = moment(time).format(localeDate('HH:mm', intl.locale));

      return (
        <div className="st-front-wrap__flex-wrapper">
          <span>{date}</span>
          <span>{times}</span>
        </div>
      );
    };

    return quoteSettings && !isEmpty(quoteSettings.wobjData) ? (
      <div className="st-forecast-wrap">
        <div className={classNames('st-forecast-wrap__flipper', { enabled: visability })}>
          <div className="st-forecast-wrap__flipper-item">
            <Link to={`/@${permlink}`} className="st-forecast-wrap__flipper-item-link">
              <div className="st-front-wrap">
                <div className="st-front-wrap__security">
                  <div className="st-front-wrap__security-quote">{quoteSettings.name}</div>
                  <div
                    className={`st-front-wrap__security-block st-front-wrap__security-${recommend.toLowerCase()}`}
                  >
                    <div
                      title={intl.formatMessage({
                        id: 'tips.recommendationType',
                        defaultMessage: 'Forecast type',
                      })}
                      className={`st-front-wrap__security-block-icon-${recommend.toLowerCase()}`}
                    >
                      <FormattedMessage
                        id={`postQuotation.recommend.${recommend}`}
                        defaultMessage={recommend.toUpperCase()}
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
                <div className="st-front-wrap__price">
                  <PostCurrentPrice
                    quoteSettings={quoteSettings}
                    quote={quote}
                    recommend={recommend}
                  />
                </div>
                {/* <div className="st-front-wrap__finish-value"> */}
                {/* {quote.security && quoteSettings.ID && ( */}
                {/* <PostDifference */}
                {/* forecast={forecast} */}
                {/* isExpired={false} */}
                {/* postPrice={String(postPrice)} */}
                {/* recommend={recommend} */}
                {/* quote={quote} */}
                {/* quoteSettings={quoteSettings} */}
                {/* /> */}
                {/* )} */}
                {/* </div> */}
              </div>
            </Link>
            <div className="st-back-wrap">
              <div className="st-back-wrap__start">
                <span>
                  {intl.formatMessage({ id: 'forecast.create', defaultMessage: 'Created:' })}
                </span>
                <div className="st-back-wrap__start-date">{parseDate(dateTimeCreate)}</div>
              </div>
              <div className="st-back-wrap__finish">
                <span>
                  {intl.formatMessage({ id: 'forecast.expire', defaultMessage: 'Expires:' })}
                </span>
                <div className="st-back-wrap__finish-date">{parseDate(forecast)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="st-forecast-wrap__icon">
          <Icon type="right" onClick={this.verticalFlip} className="st-forecast-wrap__icon-img" />
        </div>
      </div>
    ) : null;
  }
}

export default ForecastItem;
