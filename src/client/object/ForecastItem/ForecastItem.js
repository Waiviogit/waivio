import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import React from 'react';
import PostCurrentPrice from '../../../investarena/components/PostSellBuy/PostCurrentPrice';
import PostDifference from '../../../investarena/components/PostSellBuy/PostDifference';
import { quoteFormat } from '../../../investarena/platform/parsingPrice';
import { localeDate } from '../../../investarena/helpers/diffDateTime';
import './ForecastItem.less';
import './ForecastItem-nigthmode.less';
import quoteSettingsData from '../../../investarena/default/quoteSettingsData';
import quoteData from '../../../investarena/default/quoteData';

@injectIntl
class ForecastItem extends React.Component {
  static propTypes = {
    quoteSettings: PropTypes.shape(),
    quote: PropTypes.shape(),
    recommend: PropTypes.string.isRequired,
    postPrice: PropTypes.number.isRequired,
    forecast: PropTypes.string.isRequired,
    dateTimeCreate: PropTypes.string.isRequired,
    intl: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    quoteSettings: quoteSettingsData,
    quote: quoteData,
  };

  state = {
    visability: false,
  };

  onClickHandler = () => this.setState(prevState => ({ visability: !prevState.visability }));

  render() {
    const {
      quoteSettings,
      quote,
      recommend,
      postPrice,
      forecast,
      dateTimeCreate,
      intl,
    } = this.props;
    const { visability } = this.state;

    return quoteSettings && !isEmpty(quoteSettings.wobjData) ? (
      <div className="st-forecast-wrap">
        <div className={classNames('st-forecast-wrap__flipper', { enabled: visability })}>
          <div className="st-forecast-wrap__flipper-item">
            <div className="st-front-wrap">
              <div className="st-front-wrap__security">
                <div className="st-front-wrap__security-quote">
                  <Link
                    to={`/object/${quoteSettings.wobjData.author_permlink}`}
                    className="st-post-sell-buy-quote"
                  >
                    {quoteSettings.name}
                  </Link>
                </div>
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
              <div className="st-front-wrap__finish-value">
                <PostDifference
                  forecast={forecast}
                  isExpired={false}
                  postPrice={String(postPrice)}
                  recommend={recommend}
                  quote={quote}
                  quoteSettings={quoteSettings}
                />
              </div>
            </div>
            <div className="st-back-wrap">
              <div className="st-back-wrap__start">
                <span>
                  {intl.formatMessage({ id: 'forecast.create', defaultMessage: 'Created:' })}
                </span>
                <div className="st-back-wrap__start-date">
                  <div>
                    {moment(dateTimeCreate).format(localeDate('YYYY/MM/DD HH:mm', intl.locale))}
                  </div>
                </div>
              </div>
              <div className="st-back-wrap__finish">
                <span>
                  {intl.formatMessage({ id: 'forecast.expire', defaultMessage: 'Expires:' })}
                </span>
                <div className="st-back-wrap__finish-date">
                  <div>{moment(forecast).format(localeDate('YYYY/MM/DD HH:mm', intl.locale))}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="st-forecast-wrap__icon">
          <Icon type="right" onClick={this.onClickHandler} className="st-forecast-wrap__icon-img" />
        </div>
      </div>
    ) : null;
  }
}

export default ForecastItem;
