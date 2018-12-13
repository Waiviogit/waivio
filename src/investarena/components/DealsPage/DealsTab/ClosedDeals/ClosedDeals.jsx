import { injectIntl } from 'react-intl';
import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
// import Select from 'react-select';
import ClosedDeal from './ClosedDeal';
import { currencyFormat } from '../../../../platform/numberFormat';
// import { optionsPeriod } from '../../../../constants/selectData';
import quoteSettingsData from '../../../../default/quoteSettingsData';
import { singleton } from '../../../../platform/singletonPlatform';
import './ClosedDeals.less';

const propTypes = {
    quotesSettings: PropTypes.object,
    closedDeals: PropTypes.object.isRequired,
    viewMode: PropTypes.oneOf(['list', 'cards'])
};

class ClosedDeals extends Component {
    constructor (props) {
        super(props);
        this.state = {selectedPeriod: 'LAST_7_DAYS', iconSearch: false};
    }
    updateSelectedPeriod = (newValue) => {
        this.setState({selectedPeriod: newValue});
        singleton.platform.getClosedDeals(newValue);
    };
    render () {
        let totalPnL = 0;
        let quoteSettings = null;
        const closedDeals = !_.isEmpty(this.props.closedDeals)
            ? _.map(this.props.closedDeals, (closedDeal) => {
                totalPnL += closedDeal.pnl;
                quoteSettings = this.props.quotesSettings[closedDeal.security] || quoteSettingsData;
                return (
                    <div key={closedDeal.dealId}>
                        <ClosedDeal
                            quoteSecurity={closedDeal.security}
                            quoteSettings = {quoteSettings}
                            closedDeal={closedDeal}
                            viewMode={this.props.viewMode}
                        />
                    </div>
                );
            })
            : <div className="sr-close-deals-not-present">
                {this.props.intl.formatMessage({ id: 'closeDeals.notPresent' })}
            </div>;
        const dealsListHeader =
            <div className="st-instr-column-wrap d-flex">
                <div className="st-id-title">ID:</div>
                <div className="st-instrument-avatar-closed-title"> </div>
                <div className="st-instruments-text-title">{this.props.intl.formatMessage({ id: 'assets.instrument' })}</div>
                <div className="st-type-title">{this.props.intl.formatMessage({ id: 'deals.type' })}</div>
                <div className="st-amount-title">{this.props.intl.formatMessage({ id: 'assets.amount' })}</div>
                <div className="st-opened-title">{this.props.intl.formatMessage({ id: 'deals.openTime' })}</div>
                <div className="st-opened-title">{this.props.intl.formatMessage({ id: 'deals.closeTime' })}</div>
                <div className="st-price-title">{this.props.intl.formatMessage({ id: 'deals.openPrice' })}</div>
                <div className="st-price-title">{this.props.intl.formatMessage({ id: 'deals.closePrice' })}</div>
                <div className="st-pnl-title">P&L:</div>
                <div className="st-commission-title">{this.props.intl.formatMessage({ id: 'deals.commission' })}</div>
            </div>;
        return (
            <div className="st-closed-deals-wrapper">
                <div className="st-closed-deals-select-wrap">
                    {/*<FormattedMessage id="createPost.selectLabel.default">*/}
                        {/*{msg => (*/}
                            {/*<Select*/}
                                {/*name="selected-period"*/}
                                {/*placeholder={msg}*/}
                                {/*options={optionsPeriod}*/}
                                {/*inputProps={{ maxLength: 9 }}*/}
                                {/*simpleValue*/}
                                {/*clearable={false}*/}
                                {/*searchable={false}*/}
                                {/*value={this.state.selectedPeriod}*/}
                                {/*onChange={this.updateSelectedPeriod}*/}
                            {/*/>*/}
                        {/*)}*/}
                    {/*</FormattedMessage>*/}
                    <span className="st-closed-deals-total-pnl-wrap">
                        <span className="st-margin-right-small">{this.props.intl.formatMessage({ id: 'deals.totalPnL' })}: </span>
                        <span className={totalPnL < 0 ? 'st-deal-pl-red' : 'st-deal-pl-green'}>{currencyFormat(totalPnL)}</span>
                    </span>
                </div>
                {this.props.viewMode === 'list' && dealsListHeader}
                <div className={classNames('st-closed-deals-block', {'list-view': this.props.viewMode === 'list', 'cards-view': this.props.viewMode === 'cards'})}>
                    <div className="st-content-quotes-closed">
                        {closedDeals}
                    </div>
                </div>
            </div>
        );
    }
}

ClosedDeals.defaultProps = { viewMode: 'list' };

ClosedDeals.propTypes = propTypes;

export default injectIntl(ClosedDeals);
