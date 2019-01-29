import React from 'react';
import PropTypes from 'prop-types';
import InstrumentAvatar from "../../InstrumentAvatar/InstrumentAvatar";
import Favorite from "../../Favorite";
import TradeButtonsAssets from "../TradeButtonsAssets";
import ModalTC from '../../Modals/ModalTC/ModalTC';

const InstrumentCard = props => {
  const {quoteSettings, quote} = props;
  return (
    <React.Fragment>
      <div className="st-card__header">
        <InstrumentAvatar
          permlink={quoteSettings.wobjData.author_permlink}
          market={quoteSettings.market}
          avatarlink={quoteSettings.wobjData.avatarlink}
        />
        {instrumentName}
        <Favorite quoteSecurity={quote.security}/>
      </div>
      <div className="st-card__content">
        <div className="st-card__daily-change-signal-info">
          {dailyChangeValue}
          {signal}
        </div>
        <div role='presentation' className="st-card__chart" onClick={this.toggleModalInstrumentsChart}>
          {getChart(276, 60)}
        </div>
        {this.state.isModalInstrumentsChart &&
          <ModalTC
            quoteName={quote.security}
            market={quoteSettings.market}
            isOpen={this.state.isModalInstrumentsChart}
            toggle={this.toggleModalInstrumentsChart}
          />
        }
        <TradeButtonsAssets
          className="st-assets-buttons st-trade-buttons-asset-page-wrap"
          quoteSecurity={quote.security}/>
      </div>
    </React.Fragment>
  );
};

InstrumentCard.propTypes = {

};

export default InstrumentCard;
