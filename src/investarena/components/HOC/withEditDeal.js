import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { changeOpenDealPlatform } from '../../redux/actions/dealsActions';
import { PlatformHelper } from '../../platform/platformHelper';

const propTypes = {
    quote: PropTypes.object,
    quoteSettings: PropTypes.object,
    openDeal: PropTypes.object.isRequired,
    // showNotification: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired
};

const withEditDeal = (Component) => {
    class WithEditDeal extends React.Component {
        constructor (props) {
            super(props);
            this.state = {
                isAmountSL: false,
                isAmountTP: false,
                chosenRangesSL: 'rate',
                chosenRangesTP: 'rate',
                ranges: null,
                pnl: 0
            };
        }
        componentDidMount () {
            this.inputSL = document.getElementsByClassName('st-sl')[0];
            this.inputTP = document.getElementsByClassName('st-tp')[0];
          // const a = typeof Component;
          //   this.inputSL = ReactDOM.findDOMNode(this).querySelector('st-sl');
          //   this.inputTP = ReactDOM.findDOMNode(this).querySelector('st-tp');
            const ranges = PlatformHelper.getRanges(this.props.quote, this.props.openDeal, this.props.quoteSettings);
            const pnl = this.getPnl(this.props.quote, this.props.openDeal, this.props.quoteSettings);
            let isAmountSL = false;
            let isAmountTP = false;
            let chosenRangesSL = 'rate';
            let chosenRangesTP = 'rate';
            if (this.inputSL) {
                if (this.props.openDeal.stopLossAmount) {
                    chosenRangesSL = 'amount';
                    isAmountSL = true;
                    this.inputSL.value = this.props.openDeal.stopLossAmount / -1000000;
                }
                if (this.props.openDeal.stopLossPrice) {
                    chosenRangesSL = 'rate';
                    isAmountSL = false;
                    this.inputSL.value = this.props.openDeal.stopLossPrice / 1000000;
                }
            }
            if (this.inputTP) {
                if (this.props.openDeal.takeProfitAmount) {
                    chosenRangesTP = 'amount';
                    isAmountTP = true;
                    this.inputTP.value = this.props.openDeal.takeProfitAmount / 1000000;
                }
                if (this.props.openDeal.takeProfitPrice) {
                    chosenRangesTP = 'rate';
                    isAmountTP = false;
                    this.inputTP.value = this.props.openDeal.takeProfitPrice / 1000000;
                }
            }
            this.setState({ranges, isAmountSL, chosenRangesSL, isAmountTP, chosenRangesTP, pnl});
        }
        componentWillReceiveProps (nextProps) {
            if (nextProps.quote && nextProps.openDeal) {
                const ranges = PlatformHelper.getRanges(nextProps.quote, nextProps.openDeal, nextProps.quoteSettings);
                const pnl = this.getPnl(nextProps.quote, nextProps.openDeal, nextProps.quoteSettings);
                this.setState({ranges, pnl});
            }
        }
        getPnl = (quote, openDeal, quoteSettings) => {
            let pnl = PlatformHelper.getPnl(quote, openDeal, quoteSettings);
            pnl = (pnl === null && pnl === undefined) ? '-' : parseFloat(pnl).toFixed(2);
            return pnl;
        };
        toggleSL = () => {
            let chosenRangesSL = 'rate';
            if (!this.state.isAmountSL) {
                chosenRangesSL = 'amount';
            }
            this.setState({ isAmountSL: !this.state.isAmountSL, chosenRangesSL });
        };
        toggleTP = () => {
            let chosenRangesTP = 'rate';
            if (!this.state.isAmountTP) {
                chosenRangesTP = 'amount';
            }
            this.setState({ isAmountTP: !this.state.isAmountTP, chosenRangesTP });
        };
        handleChangeInputSL = () => {
            if (PlatformHelper.validateChangeProfitLossText(this.inputSL, this.state.ranges.stopLoss[this.state.chosenRangesSL].min, this.state.ranges.stopLoss[this.state.chosenRangesSL].max)) {
                this.inputSL.classList.remove('st-input-danger');
            } else {
                this.inputSL.classList.add('st-input-danger');
            }
        };
        handleChangeInputTP = () => {
            if (PlatformHelper.validateChangeProfitLossText(this.inputTP, this.state.ranges.takeProfit[this.state.chosenRangesTP].min, this.state.ranges.takeProfit[this.state.chosenRangesTP].max)) {
                this.inputTP.classList.remove('st-input-danger');
            } else {
                this.inputTP.classList.add('st-input-danger');
            }
        };
        handleClickSetSL = () => {
            if (this.inputSL.value.length === 0) {
                if (this.props.openDeal.stopLossPrice || this.props.openDeal.stopLossAmount) {
                    changeOpenDealPlatform(this.props.openDeal.dealId, null, null, this.props.openDeal.takeProfitPrice, this.props.openDeal.takeProfitAmount);
                    this.props.toggle();
                } else {
                    this.inputSL.classList.add('st-input-danger');
                }
            } else if (PlatformHelper.validateChangeProfitLossText(this.inputSL, this.state.ranges.stopLoss[this.state.chosenRangesSL].min, this.state.ranges.stopLoss[this.state.chosenRangesSL].max)) {
                if (this.state.isAmountSL) {
                    const value = (this.inputSL.value * (-1000000)).toFixed(0);
                    changeOpenDealPlatform(this.props.openDeal.dealId, null, value, this.props.openDeal.takeProfitPrice, this.props.openDeal.takeProfitAmount);
                } else {
                    const value = (this.inputSL.value * (1000000)).toFixed(0);
                    changeOpenDealPlatform(this.props.openDeal.dealId, value, null, this.props.openDeal.takeProfitPrice, this.props.openDeal.takeProfitAmount);
                }
                this.props.toggle();
            } else {
                // this.props.showNotification('error', this.props.intl.formatMessage({ id: 'deals.stopLossWrongValue' }));
            }
        };
        handleClickSetTP = () => {
            if (this.inputTP.value.length === 0) {
                if (this.props.openDeal.takeProfitPrice || this.props.openDeal.takeProfitAmount) {
                    changeOpenDealPlatform(this.props.openDeal.dealId, this.props.openDeal.stopLossPrice, this.props.openDeal.stopLossAmount, null, null);
                    this.props.toggle();
                } else {
                    this.inputTP.classList.add('st-input-danger');
                }
            } else if (PlatformHelper.validateChangeProfitLossText(this.inputTP, this.state.ranges.takeProfit[this.state.chosenRangesTP].min, this.state.ranges.takeProfit[this.state.chosenRangesTP].max)) {
                const value = (this.inputTP.value * (1000000)).toFixed(0);
                if (this.state.isAmountTP) {
                    changeOpenDealPlatform(this.props.openDeal.dealId, this.props.openDeal.stopLossPrice, this.props.openDeal.stopLossAmount, null, value);
                } else {
                    changeOpenDealPlatform(this.props.openDeal.dealId, this.props.openDeal.stopLossPrice, this.props.openDeal.stopLossAmount, value, null);
                }
                this.props.toggle();
            } else {
                // this.props.showNotification('error', this.props.intl.formatMessage({ id: 'deals.stopLossWrongValue' }));
            }
        };
        handleClickSetSLTP = () => {
            const { openDeal } = this.props;
            let stopLossPrice = openDeal.stopLossPrice;
            let stopLossAmount = openDeal.stopLossAmount;
            let takeProfitPrice = openDeal.takeProfitPrice;
            let takeProfitAmount = openDeal.takeProfitAmount;
            let isValidSL = PlatformHelper.validateChangeProfitLossText(this.inputSL, this.state.ranges.stopLoss[this.state.chosenRangesSL].min, this.state.ranges.stopLoss[this.state.chosenRangesSL].max);
            let isValidTP = PlatformHelper.validateChangeProfitLossText(this.inputTP, this.state.ranges.takeProfit[this.state.chosenRangesTP].min, this.state.ranges.takeProfit[this.state.chosenRangesTP].max);
            if (this.state.isAmountTP) {
                if (this.inputTP.value.length === 0 && openDeal.takeProfitAmount) {
                    takeProfitAmount = null;
                } else if (this.inputTP.value.length === 0 && !openDeal.takeProfitAmount && !(openDeal.stopLossAmount || openDeal.stopLossPrice)) {
                    takeProfitAmount = null;
                    isValidTP = false;
                } else {
                    takeProfitAmount = (this.inputTP.value * 1000000).toFixed(0);
                }
                takeProfitPrice = null;
            } else {
                if (this.inputTP.value.length === 0 && openDeal.takeProfitPrice) {
                    takeProfitPrice = null;
                } else if (this.inputTP.value.length === 0 && !openDeal.takeProfitPrice && !(openDeal.stopLossAmount || openDeal.stopLossPrice)) {
                    takeProfitPrice = null;
                    isValidTP = false;
                } else {
                    takeProfitPrice = (this.inputTP.value * 1000000).toFixed(0);
                }
                takeProfitAmount = null;
            }
            if (this.state.isAmountSL) {
                if (this.inputSL.value.length === 0 && openDeal.stopLossAmount) {
                    stopLossAmount = null;
                } else if (this.inputSL.value.length === 0 && !openDeal.stopLossAmount && !(openDeal.takeProfitAmount || openDeal.takeProfitPrice)) {
                    stopLossAmount = null;
                    isValidSL = false;
                } else {
                    stopLossAmount = (this.inputSL.value * (-1000000)).toFixed(0);
                }
                stopLossPrice = null;
            } else {
                if (this.inputSL.value.length === 0 && openDeal.stopLossPrice) {
                    stopLossPrice = null;
                } else if (this.inputSL.value.length === 0 && !openDeal.stopLossPrice && !(openDeal.takeProfitAmount || openDeal.takeProfitPrice)) {
                    stopLossPrice = null;
                    isValidSL = false;
                } else {
                    stopLossPrice = (this.inputSL.value * 1000000).toFixed(0);
                }
                stopLossAmount = null;
            }
            if (isValidTP && isValidSL) {
                changeOpenDealPlatform(this.props.openDeal.dealId, stopLossPrice, stopLossAmount, takeProfitPrice, takeProfitAmount);
                this.props.toggle();
            } else {
                if (!isValidTP && isValidSL) {
                    this.inputTP.classList.add('st-input-danger');
                }
                if (!isValidSL && isValidTP) {
                    this.inputSL.classList.add('st-input-danger');
                }
                if (!isValidSL && !isValidTP) {
                    this.inputTP.classList.add('st-input-danger');
                    this.inputSL.classList.add('st-input-danger');
                }
            }
        };
        handleClickClear = () => {
            if (this.inputSL && !this.inputTP) {
                this.inputSL.value = '';
                this.inputSL.classList.remove('st-input-danger');
            }
            if (this.inputTP && !this.inputSL) {
                this.inputTP.value = '';
                this.inputTP.classList.remove('st-input-danger');
            }
            if (this.inputSL && this.inputTP) {
                this.inputSL.value = '';
                this.inputTP.value = '';
                this.inputSL.classList.remove('st-input-danger');
                this.inputTP.classList.remove('st-input-danger');
            }
        };
        render () {
            return <Component {...this.props}
                {...this.state}
                toggleSL = { this.toggleSL }
                toggleTP = { this.toggleTP }
                handleChangeInputSL = { this.handleChangeInputSL }
                handleChangeInputTP = { this.handleChangeInputTP }
                handleClickSetSL = { this.handleClickSetSL }
                handleClickSetTP = { this.handleClickSetTP }
                handleClickSetSLTP = { this.handleClickSetSLTP }
                handleClickClear = { this.handleClickClear }
            />;
        }
    }
    WithEditDeal.propTypes = propTypes;
    return injectIntl(WithEditDeal);
};

export default withEditDeal;
