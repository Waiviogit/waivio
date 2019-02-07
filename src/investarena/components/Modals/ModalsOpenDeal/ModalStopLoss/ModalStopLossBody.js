import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { currencyFormat } from '../../../../platform/numberFormat';
import { quoteFormat } from '../../../../platform/parsingPrice';
import withEditDeal from '../../../HOC/withEditDeal';
import './ModalStopLoss.less';

const propTypes = {
  quoteSettings: PropTypes.shape(),
  ranges: PropTypes.shape(),
  openDeal: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  isAmountSL: PropTypes.bool.isRequired,
  chosenRangesSL: PropTypes.string.isRequired,
  toggleSL: PropTypes.func.isRequired,
  handleChangeInputSL: PropTypes.func.isRequired,
  handleClickSetSL: PropTypes.func.isRequired,
  handleClickClear: PropTypes.func.isRequired,
};

const ModalStopLossBody = ({
  quoteSettings,
  ranges,
  openDeal,
  intl,
  isAmountSL,
  chosenRangesSL,
  toggleSL,
  handleChangeInputSL,
  handleClickSetSL,
  handleClickClear,
}) => (
  <React.Fragment>
    <span className="modal-text">
      {intl.formatMessage({ id: 'deals.stopLossForDeal', defaultMessage: 'Stop loss for deal' })}
      <span>&ensp;{`${openDeal.dealSequenceNumber}`} </span>
    </span>
    <div className="st-margin-bottom-middle st-modal-sl">
      <div className="st-modal-sl-line">
        <div className="d-flex align-content-center st-modal-checkbox-wrap">
          <span className={isAmountSL ? 'st-modals-value' : 'st-modals-title'}>
            {intl.formatMessage({ id: 'deals.amount', defaultMessage: 'Amount' })}
          </span>
          <div className="st-margin-left-middle st-margin-right-middle">
            <label className="toggle">
              <input
                type="checkbox"
                className="st-hidden"
                checked={!isAmountSL}
                onChange={toggleSL}
              />
              <div data-on="✓" data-off="✓">
                Notification
              </div>
            </label>
          </div>
          <span className={isAmountSL ? 'st-modals-title' : 'st-modals-value'}>
            {intl.formatMessage({ id: 'deals.rate', defaultMessage: 'Rate' })}
          </span>
        </div>
      </div>
      <input
        type="text"
        className="st-sl st-modal-sl-input st-margin-top-small"
        placeholder={intl.formatMessage({
          id: 'deals.slIsNotSet',
          defaultMessage: 'SL is not set',
        })}
        onChange={handleChangeInputSL}
        maxLength={18}
      />
      {ranges && (
        <div className="st-modal-sl-line">
          {isAmountSL ? (
            <div className="st-modal-sl-borders-line">
              <p className="st-modals-value-amount">
                {`${currencyFormat(ranges.stopLoss[chosenRangesSL].min)} - ${currencyFormat(
                  ranges.stopLoss[chosenRangesSL].max,
                )}`}
              </p>
            </div>
          ) : (
            <div className="st-modal-sl-borders-line">
              <p>{quoteFormat(ranges.stopLoss[chosenRangesSL].min, quoteSettings)}&ensp;-&ensp;</p>
              <p>{quoteFormat(ranges.stopLoss[chosenRangesSL].max, quoteSettings)}</p>
            </div>
          )}
        </div>
      )}
    </div>
    <div className="d-flex">
      <button className="btn st-open-deal-button-red" onClick={handleClickClear}>
        {intl.formatMessage({ id: 'deals.clear', defaultMessage: 'Clear' })}
      </button>
      <button
        className="btn st-open-deal-button-blue st-margin-left-large"
        onClick={handleClickSetSL}
      >
        {intl.formatMessage({ id: 'deals.confirm', defaultMessage: 'Confirm' })}
      </button>
    </div>
  </React.Fragment>
);

ModalStopLossBody.propTypes = propTypes;

export default injectIntl(withEditDeal(ModalStopLossBody));
