import { injectIntl } from 'react-intl';
import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import ClosedDeal from './ClosedDeal/index';
import { currencyFormat } from '../../../platform/numberFormat';
import { optionsPeriod } from '../../../constants/selectData';
import { singleton } from '../../../platform/singletonPlatform';
import './ClosedDeals.less';
import OpenDealLoading from "../OpenDeals/OpenDeal/OpenDealLoading";

const Option = Select.Option;

const propTypes = {
  quotesSettings: PropTypes.shape().isRequired,
  closedDeals: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  viewMode: PropTypes.oneOf(['list', 'cards']),
};

class ClosedDeals extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedPeriod: 'LAST_7_DAYS', iconSearch: false };
  }
  updateSelectedPeriod = newValue => {
    this.setState({ selectedPeriod: newValue });
    singleton.platform.getClosedDeals(newValue);
  };
  render() {
    const {closedDeals, quotesSettings, viewMode, intl} = this.props;
    let totalPnL = 0;
    let quoteSettings = null;
    let closedDealsLayout = <OpenDealLoading type={viewMode}/>;
    if(!_.isEmpty(quotesSettings)) closedDealsLayout = !_.isEmpty(closedDeals) ? (
      _.map(closedDeals, closedDeal => {
        totalPnL += closedDeal.pnl;
        quoteSettings = quotesSettings[closedDeal.security];
        return (
          <ClosedDeal
            key={closedDeal.dealId}
            quoteSecurity={closedDeal.security}
            quoteSettings={quoteSettings}
            closedDeal={closedDeal}
            viewMode={viewMode}
          />
        );
      })
    ) : (
      <div className="sr-close-deals-not-present">
        {intl.formatMessage({
          id: 'closeDeals.notPresent',
          defaultMessage: 'You do not have closed deals for this period',
        })}
      </div>
    );
    const dealsListHeader = (
      <div className="st-instr-column-wrap d-flex">
        <div className="st-id-title">ID:</div>
        <div className="st-instrument-avatar-closed-title" />
        <div className="st-instruments-text-title">
          {intl.formatMessage({ id: 'assets.instrument' })}
        </div>
        <div className="st-opened-title">
          {intl.formatMessage({ id: 'deals.openTime', defaultMessage: 'Opening time' })}
        </div>
        <div className="st-opened-title">
          {intl.formatMessage({ id: 'deals.closeTime', defaultMessage: 'Closing time' })}
        </div>
        <div className="st-price-title">
          {intl.formatMessage({
            id: 'deals.openPrice',
            defaultMessage: 'Opening price',
          })}
        </div>
        <div className="st-price-title">
          {intl.formatMessage({
            id: 'deals.closePrice',
            defaultMessage: 'Closing price',
          })}
        </div>
        <div className="st-pnl-title">P&L:</div>
        <div className="st-commission-title">
          {intl.formatMessage({ id: 'deals.commission', defaultMessage: 'Commission' })}
        </div>
      </div>
    );
    return (
      <div className="st-closed-deals-wrapper">
        <div className="st-closed-deals-select-wrap">
          <Select
            defaultValue={optionsPeriod[0].value}
            style={{ width: 120 }}
            onChange={this.updateSelectedPeriod}
          >
            {_.map(optionsPeriod, option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          <span className="st-closed-deals-total-pnl-wrap">
            <span className="st-margin-right-small">
              {intl.formatMessage({ id: 'deals.totalPnL', defaultMessage: 'Total P&L' })}
              :{' '}
            </span>
            <span className={totalPnL < 0 ? 'st-deal-pl-red' : 'st-deal-pl-green'}>
              {currencyFormat(totalPnL)}
            </span>
          </span>
        </div>
        {viewMode === 'list' && dealsListHeader}
        <div
          className={classNames('st-closed-deals-block', {
            'list-view': viewMode === 'list',
            'cards-view': viewMode === 'cards',
          })}
        >
          <div className="st-content-quotes-closed">{closedDealsLayout}</div>
        </div>
      </div>
    );
  }
}

ClosedDeals.defaultProps = { viewMode: 'list' };

ClosedDeals.propTypes = propTypes;

export default injectIntl(ClosedDeals);
