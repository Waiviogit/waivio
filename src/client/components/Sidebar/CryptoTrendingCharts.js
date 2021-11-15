import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getCryptoPriceHistory, setIsMobile } from '../../../store/appStore/appActions';
import CryptoChart from './CryptoChart';
import { getCryptoDetails } from '../../helpers/cryptosHelper';
import { WAIV, cryptoRatesForChart } from '../../../common/constants/cryptos';
import { getTokenRates } from '../../../store/walletStore/walletActions';

import './SidebarContentBlock.less';
import './CryptoTrendingCharts.less';

@connect(null, {
  getCryptoPriceHistory,
  setIsMobile,
  getTokenRates,
})
class CryptoTrendingCharts extends React.Component {
  static propTypes = {
    cryptos: PropTypes.arrayOf(PropTypes.string),
    getCryptoPriceHistory: PropTypes.func.isRequired,
    getTokenRates: PropTypes.func.isRequired,
    setIsMobile: PropTypes.func.isRequired,
  };

  static defaultProps = {
    cryptos: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      refreshCharts: false,
    };

    this.handleOnClickRefresh = this.handleOnClickRefresh.bind(this);
  }

  componentDidMount() {
    this.props.setIsMobile();
  }

  cryptoSymbols =
    this.props.cryptos.length &&
    this.props.cryptos.map(crypto => getCryptoDetails(crypto).coinGeckoId);

  handleOnClickRefresh() {
    this.setState(
      {
        refreshCharts: true,
      },
      () => {
        this.props.getCryptoPriceHistory(this.cryptoSymbols, true);
        this.props.getTokenRates(WAIV.symbol);
        this.setState({
          refreshCharts: false,
        });
      },
    );
  }

  render() {
    return (
      <div className="SidebarContentBlock CryptoTrendingCharts">
        <h4 className="SidebarContentBlock__title">
          <i className="iconfont icon-chart SidebarContentBlock__icon" />
          <FormattedMessage id="market" defaultMessage="Market" />
          <i
            role="presentation"
            onClick={this.handleOnClickRefresh}
            className="iconfont icon-refresh CryptoTrendingCharts__icon-refresh"
          />
        </h4>
        {this.props.cryptos.map(chart => (
          <CryptoChart key={chart} crypto={chart} currency={cryptoRatesForChart[chart]} />
        ))}
      </div>
    );
  }
}

export default CryptoTrendingCharts;
