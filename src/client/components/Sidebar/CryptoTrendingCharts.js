import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getCryptoPriceHistory, setIsMobile } from '../../../store/appStore/appActions';
import CryptoChart from './CryptoChart';
import { getCryptoDetails } from '../../helpers/cryptosHelper';
import { getCryptosPriceHistory } from '../../../store/appStore/appSelectors';

import './SidebarContentBlock.less';
import './CryptoTrendingCharts.less';

@connect(
  state => ({
    cryptosPriceHistory: getCryptosPriceHistory(state),
  }),
  {
    getCryptoPriceHistory,
    setIsMobile,
  },
)
class CryptoTrendingCharts extends React.Component {
  static propTypes = {
    cryptos: PropTypes.arrayOf(PropTypes.string),
    cryptosPriceHistory: PropTypes.shape().isRequired,
    getCryptoPriceHistory: PropTypes.func.isRequired,
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
    if (this.cryptoSymbols) this.props.getCryptoPriceHistory(this.cryptoSymbols);
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
        this.setState({
          refreshCharts: false,
        });
      },
    );
  }

  hasAPIError() {
    const { cryptosPriceHistory, cryptos } = this.props;
    const apiErrors = [];

    if (_.isEmpty(cryptosPriceHistory)) return false;

    _.each(cryptos, crypto => {
      const cryptoDetails = getCryptoDetails(crypto);
      const cryptoSymbol = _.get(cryptoDetails, 'coinGeckoId', null);
      const cryptoAPIDetails = _.get(cryptosPriceHistory, cryptoSymbol, null);
      const hasAPIError =
        !(_.isUndefined(cryptoAPIDetails) || _.isNull(cryptoAPIDetails)) &&
        (cryptoAPIDetails.usdAPIError || _.isEmpty(cryptoAPIDetails.usdPriceHistory));

      if (hasAPIError) {
        apiErrors.push(cryptoDetails);
      }
    });

    return cryptos.length === apiErrors.length;
  }

  renderCryptoCharts() {
    const { cryptos, cryptosPriceHistory } = this.props;

    if (_.isEmpty(cryptos)) {
      return null;
    }

    return _.map(cryptos, crypto => [
      <CryptoChart key={crypto} crypto={crypto} />,
      !_.isEmpty(_.get(cryptosPriceHistory, `${crypto}.usdPriceHistory`, [])) && (
        <div key={`${crypto}-divider`} className="SidebarContentBlock__divider" />
      ),
    ]);
  }

  render() {
    if (this.hasAPIError()) return <div />;

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
        {this.renderCryptoCharts()}
      </div>
    );
  }
}

export default CryptoTrendingCharts;
