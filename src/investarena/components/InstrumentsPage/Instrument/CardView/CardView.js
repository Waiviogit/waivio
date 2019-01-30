import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import InstrumentAvatar from '../../../InstrumentAvatar/InstrumentAvatar';
import Favorite from '../../../Favorite';
import TradeButtonsAssets from '../../TradeButtonsAssets';
import ModalTC from '../../../Modals/ModalTC/ModalTC';
import InstrumentsChart from '../InstrumentChart';
import Signals from '../Signals';
import './CardView.less';

class InstrumentCard extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    quoteSettings: PropTypes.shape(),
    quote: PropTypes.shape(),
    chart: PropTypes.arrayOf(PropTypes.shape()),
    signals: PropTypes.arrayOf(PropTypes.shape()),
    showTradeBtn: PropTypes.bool,
  };

  static defaultProps = {
    quoteSettings: {},
    quote: {},
    chart: [],
    signals: [],
    showTradeBtn: true,
  };

  state = {
    isModalChart: false,
  };
  toggleModal = () => this.setState({isModalChart: !this.state.isModalChart});

  render() {
    const {intl, quoteSettings, quote, chart, signals, showTradeBtn } = this.props;
    return (
      <div key={quote.security} className='st-card'>
        <div className="st-card__header">
          <InstrumentAvatar
            permlink={quoteSettings.wobjData.author_permlink}
            market={quoteSettings.market}
            avatarlink={quoteSettings.wobjData.avatarlink}
          />
          <Link to={`/object/@${quoteSettings.wobjData.author_permlink}`}>
            <div className="st-instrument-info-wrap">
              <div className="st-instrument-name" title={quoteSettings.name}>{quoteSettings.name} </div>
            </div>
          </Link>
          <Favorite quoteSecurity={quote.security}/>
        </div>
        <div className="st-card__content">
          <div className="st-card__daily-change-signal-info">
            <div title={intl.formatMessage({id: 'tips.dailyChange', defaultMessage: 'Daily change'})}
                 className={`st-daily-change ${quote.dailyChange > 0 ? 'st-quote-text-up' : 'st-quote-text-down'}`}>
              {`${quote.dailyChange.toFixed(2)}%`}
            </div>
            <Signals signals={signals} />
          </div>
          <InstrumentsChart
            chart={chart}
            height={65}
            width={221}
            noDataMsg={intl.formatMessage({id: 'charts.noData', defaultMessage: 'No data'})}
            onClick={this.toggleModal}
          />
          {this.state.isModalChart &&
            <ModalTC
              quoteName={quote.security}
              market={quoteSettings.market}
              isOpen={this.state.isModalChart}
              toggle={this.toggleModal}
            />
          }
          {showTradeBtn && <TradeButtonsAssets
            className="st-assets-buttons st-trade-buttons-asset-page-wrap"
            quoteSecurity={quote.security}/>}
        </div>
      </div>
    );
  }
}

export default injectIntl(InstrumentCard);
