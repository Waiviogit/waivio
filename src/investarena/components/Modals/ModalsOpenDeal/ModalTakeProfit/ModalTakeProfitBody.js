import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { currencyFormat } from '../../../../platform/numberFormat';
import { quoteFormat } from '../../../../platform/parsingPrice';
import withEditDeal from '../../../HOC/withEditDeal';
import './ModalTakeProfit.less';

const propTypes = {
  quoteSettings: PropTypes.object,
  ranges: PropTypes.object,
  openDeal: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  isAmountTP: PropTypes.bool.isRequired,
  chosenRangesTP: PropTypes.string.isRequired,
  toggleTP: PropTypes.func.isRequired,
  handleChangeInputTP: PropTypes.func.isRequired,
  handleClickSetTP: PropTypes.func.isRequired,
  handleClickClear: PropTypes.func.isRequired,
};

const ModalTakeProfitBody = ({
  quoteSettings,
  ranges,
  openDeal,
  intl,
  isAmountTP,
  chosenRangesTP,
  toggleTP,
  handleChangeInputTP,
  handleClickSetTP,
  handleClickClear,
}) => {
  return (
    <React.Fragment>
      <span className="modal-text">
        {intl.formatMessage({
          id: 'deals.takeProfitForDeal',
          defaultMessage: 'Take profit for deal',
        })}
        <span>&ensp;{`${openDeal.dealSequenceNumber}`} </span>
      </span>
      <div className="st-margin-bottom-middle st-modal-tp">
        <span className="st-modal-tp-line">
          <div className="d-flex st-modal-checkbox-wrap">
            <span className={isAmountTP ? 'st-modals-value' : 'st-modals-title'}>
              {intl.formatMessage({ id: 'deals.amount', defaultMessage: 'Amount' })}
            </span>
            <div className="st-margin-left-middle st-margin-right-middle">
              <label className="toggle">
                <input
                  type="checkbox"
                  className="st-hidden"
                  checked={!isAmountTP}
                  onChange={toggleTP}
                />
                <div data-on="✓" data-off="✓">
                  Notification
                </div>
              </label>
            </div>
            <span className={isAmountTP ? 'st-modals-title' : 'st-modals-value'}>
              {intl.formatMessage({ id: 'deals.rate', defaultMessage: 'Rate' })}
            </span>
          </div>
        </span>
        <input
          id="st-tp"
          type="text"
          className="st-tp st-modal-tp-input st-margin-top-small"
          placeholder={intl.formatMessage({
            id: 'deals.tpIsNotSet',
            defaultMessage: 'TP is not set',
          })}
          onChange={handleChangeInputTP}
          maxLength={18}
        />
        {ranges && (
          <div className="st-modal-tp-line">
            {isAmountTP ? (
              <div className="st-modal-tp-borders-line">
                <p className="st-modals-value-amount">
                  {`${currencyFormat(ranges.takeProfit[chosenRangesTP].min)} - ${currencyFormat(
                    ranges.takeProfit[chosenRangesTP].max,
                  )}`}
                </p>
              </div>
            ) : (
              <div className="st-modal-tp-borders-line">
                <p>
                  {quoteFormat(ranges.takeProfit[chosenRangesTP].min, quoteSettings)}&ensp;-&ensp;
                </p>
                <p>{quoteFormat(ranges.takeProfit[chosenRangesTP].max, quoteSettings)}</p>
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
          onClick={handleClickSetTP}
        >
          {intl.formatMessage({ id: 'deals.confirm', defaultMessage: 'Confirm' })}
        </button>
      </div>
    </React.Fragment>
  );
};

ModalTakeProfitBody.propTypes = propTypes;

export default injectIntl(withEditDeal(ModalTakeProfitBody));
