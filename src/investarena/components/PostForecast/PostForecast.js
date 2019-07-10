import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { timeForecastRemain, timeExpired } from '../../helpers/diffDateTime';
import './PostForecast.less';

const propTypes = {
  expiredAt: PropTypes.string,
  postForecast: PropTypes.string.isRequired,
  isExpired: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  quoteSettings: PropTypes.shape(),
  quote: PropTypes.shape(),
};
const defaultProps = {
  expiredAt: '',
  quoteSettings: null,
  quote: null,
};

class PostForecast extends Component {
  constructor(props) {
    super(props);
    this.state = { time: null };
  }
  componentDidMount() {
    this.timer = setInterval(this.handleUpdateTimeRemain, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  handleUpdateTimeRemain = () => {
    this.setState({ time: timeForecastRemain(this.props.postForecast) });
  };
  render() {
    return this.props.quote && this.props.quoteSettings ? (
      <div className="st-post-forecast-wrap">
        <div className="st-post-forecast-time-icon">
          <svg
            fill="#999"
            height="18"
            viewBox="0 0 24 24"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
          </svg>
        </div>
        <div className="st-post-forecast-time">
          <div className="st-post-forecast-time-title">
            {!this.props.isExpired
              ? this.props.intl.formatMessage({
                  id: 'postForecast.title',
                  defaultMessage: 'Validity period',
                })
              : this.props.intl.formatMessage({
                  id: 'postForecast.expired',
                  defaultMessage: 'Finish date',
                })}
          </div>
          <div>
            {this.props.isExpired
              ? timeExpired(this.props.expiredAt || this.props.postForecast, this.props.intl.locale)
              : this.state.time}
          </div>
        </div>
      </div>
    ) : null;
  }
}

PostForecast.propTypes = propTypes;
PostForecast.defaultProps = defaultProps;

export default injectIntl(PostForecast);
