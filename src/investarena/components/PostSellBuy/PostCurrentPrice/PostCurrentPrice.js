import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { Tooltip } from 'antd';
import './PostCurrentPrice.less';
import { currentTime } from '../../../helpers/currentTime';
import quoteData from '../../../default/quoteData';
import { quoteFormat } from '../../../platform/parsingPrice';
import quoteSettingsData from '../../../default/quoteSettingsData';

const propTypes = {
  intl: PropTypes.shape().isRequired,
  quoteSettings: PropTypes.shape(),
  quote: PropTypes.shape(),
  finalQuote: PropTypes.shape(),
  isExpired: PropTypes.bool,
  forecast: PropTypes.string,
  recommend: PropTypes.string.isRequired,
};

class PostCurrentPrice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quotePost: {},
      price: 0,
    };
  }

  componentWillMount() {
    if (this.props.isExpired) {
      this.getExpiredData();
    } else {
      this.getCurrentData(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.isPostExpires()) {
      this.getCurrentData(nextProps);
    }
  }

  getExpiredData = () => {
    const quotePost =
      this.props.finalQuote && this.props.finalQuote.askPrice && this.props.finalQuote.bidPrice
        ? this.props.finalQuote
        : this.props.quote
        ? this.props.quote
        : quoteData;
    this.setState({ quotePost });
  };
  getCurrentData = props => {
    const quotePost = props.quote || quoteData;
    this.setState({ quotePost });
  };
  getCurrentPrice = () => {
    const quoteSettingsPost = this.props.quoteSettings || quoteSettingsData;
    return quoteFormat(
      this.props.recommend.toLowerCase() === 'buy'
        ? this.state.quotePost.askPrice
        : this.state.quotePost.bidPrice,
      quoteSettingsPost,
    );
  };
  isPostExpires = () => {
    return this.props.isExpired || currentTime.getTime() > moment(this.props.forecast).valueOf();
  };

  render() {
    return (
      <div className="st-post-current-price-wrap flex flex-column justify-between">
        {this.state.quotePost.state === 'up' && !this.isPostExpires() ? (
          <div className="st-post-current-price-triangle-up" />
        ) : (
          <div className="st-margin-arrow-top" />
        )}
        <Tooltip
          title={this.props.intl.formatMessage({
            id: this.isPostExpires() ? 'tips.currentPriceExpired' : 'tips.currentPrice',
          })}
        >
          <span className={'st-post-current-price-value'}>{this.getCurrentPrice()}</span>
        </Tooltip>
        {this.state.quotePost.state === 'down' && !this.isPostExpires() ? (
          <div className="st-post-current-price-triangle-down" />
        ) : (
          <div className="st-margin-arrow-bottom" />
        )}
      </div>
    );
  }
}

PostCurrentPrice.propTypes = propTypes;

export default injectIntl(PostCurrentPrice);
