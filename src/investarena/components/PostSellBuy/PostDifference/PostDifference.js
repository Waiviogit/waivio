import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { currentTime } from '../../../helpers/currentTime';
import quoteData from '../../../default/quoteData';
import quoteSettingsData from '../../../default/quoteSettingsData';
import './PostDifference.less';

const propTypes = {
  quoteSettings: PropTypes.object,
  quote: PropTypes.object,
  profitability: PropTypes.number,
  forecast: PropTypes.string.isRequired,
  isExpired: PropTypes.bool.isRequired,
  postPrice: PropTypes.string.isRequired,
  recommend: PropTypes.string.isRequired,
};

class PostDifference extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProfitRed: false,
      isProfitGray: false,
      profitability: '-',
      isExpired: this.props.isExpired,
    };
  }
  componentDidMount() {
    this.estimateProfitability(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (!this.state.isExpired) {
      if (!nextProps.isExpired && currentTime.getTime() < moment(this.props.forecast).valueOf()) {
        this.estimateProfitability(nextProps);
      } else {
        this.setState({ isExpired: true });
      }
    } else if (nextProps.profitability !== this.state.profitability) {
      this.setState({
        profitability: nextProps.profitability !== undefined ? nextProps.profitability : '-',
        isProfitRed: nextProps.profitability < 0,
        isProfitGray: nextProps.profitability === '-' || nextProps.profitability === 0,
      });
    }
  }
  profit = (quoteSettings, quote) => {
    if (quote.askPrice !== '-' && quote.bidPrice !== '-') {
      if (this.props.recommend.toLowerCase() === 'buy') {
        return Math.trunc(
          (quote.askPrice * 1000000 - this.props.postPrice * 1000000) / quoteSettings.tickSize,
        );
      }
      return Math.trunc(
        (this.props.postPrice * 1000000 - quote.bidPrice * 1000000) / quoteSettings.tickSize,
      );
    }
    return '-';
  };
  estimateProfitability = props => {
    let profitability = props.profitability !== undefined ? props.profitability : '-';
    if (!this.state.isExpired) {
      const quote = props.quote || quoteData;
      const quoteSettings = props.quoteSettings || quoteSettingsData;
      profitability = this.profit(quoteSettings, quote);
    }
    this.setState({
      profitability,
      isProfitRed: profitability < 0,
      isProfitGray: profitability === '-' || profitability === 0,
    });
  };
  render() {
    return (
      <div
        className={
          this.state.isProfitGray
            ? 'st-post-profit-gray'
            : this.state.isProfitRed
            ? 'st-post-profit-red'
            : 'st-post-profit-green'
        }
      >
        <span className="st-post-profit-text">{`${this.state.profitability} pips`}</span>
      </div>
    );
  }
}

PostDifference.propTypes = propTypes;

export default PostDifference;
