import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Collapse, Select, Input } from 'antd';
import { optionsAction, optionsForecast } from '../../constants/selectData';
import { getQuoteOptions, getQuotePrice } from './helpers';
import { getQuotesSettingsState } from '../../../investarena/redux/selectors/quotesSettingsSelectors';
import { getQuotesState } from '../../../investarena/redux/selectors/quotesSelectors';

@injectIntl
@connect(state => ({
  quotesSettings: getQuotesSettingsState(state),
  quotes: getQuotesState(state),
}))
class CreatePostForecast extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    isForecastOptionsVisible: PropTypes.bool,
    toggleForecastBlock: PropTypes.func,
    quotesSettings: PropTypes.shape(),
    quotes: PropTypes.shape(),
  };

  static defaultProps = {
    isForecastOptionsVisible: true,
    quotesSettings: {},
    quotes: {},
    toggleForecastBlock: () => {},
  };

  state = {
    quotePrice: null,
    selectQuote: null,
    selectRecommend: 'selectRecommend',
    takeProfitValue: 'takeProfitValue',
    selectForecast: 'selectForecast',
    stopLossValue: 'stopLossValue',
    takeProfitValueIncorrect: false,
    stopLossValueIncorrect: false,
  };

  getQuotePrice = () => 'quotePrice';

  updateValueQuote = selectQuote => {
    const quotePrice = this.state.selectRecommend
      ? getQuotePrice(selectQuote, this.state.selectRecommend, this.props.quotes)
      : null;
    this.setState({
      quotePrice,
      selectQuote,
      takeProfitValue: '',
      stopLossValue: '',
      takeProfitValueIncorrect: false,
      stopLossValueIncorrect: false,
    });
    // this.checkSelectDropDown(newValue, this.state.selectRecommend, this.state.selectForecast);
    console.log('quotePrice: ', quotePrice);
  };
  updateValueRecommend = recommendValue => {
    const quotePrice = this.state.selectQuote
      ? getQuotePrice(this.state.selectQuote, recommendValue, this.props.quotes)
      : null;
    this.setState({
      quotePrice,
      selectRecommend: recommendValue,
      takeProfitValue: '',
      stopLossValue: '',
      takeProfitValueIncorrect: false,
      stopLossValueIncorrect: false,
    });
    console.log('selectRecommend: ', recommendValue);

    // this.checkSelectDropDown(this.state.selectQuote, newValue, this.state.selectForecast);
  };
  handleChangeTakeProfitStopLostInputs = (e, value) =>
    console.log('handleChangeTakeProfitStopLostInputs > ', e, value);

  handleFocusTakeProfitStopLostInputs = value =>
    console.log('handleFocusTakeProfitStopLostInputs > ', value);

  updateValueForecast = value => console.log('updateValueForecast > ', value);

  render() {
    const {
      intl,
      isForecastOptionsVisible,
      toggleForecastBlock,
      quotes,
      quotesSettings,
    } = this.props;
    const optionsQuote = getQuoteOptions(quotesSettings, quotes);
    return (
      <div className="st-create-post-optional">
        <div
          className="st-create-post-optional-title"
          onClick={toggleForecastBlock}
          role="presentation"
        >
          <FormattedMessage id="createPost.titleForecast" />
          <img
            src="/static/images/icons/ic_keyboard_arrow_up_black_24px.svg"
            className={`arrow-up-icon${!isForecastOptionsVisible ? ' flipped-vertically' : ''}`}
            alt=""
          />
        </div>
        <Collapse isOpen={isForecastOptionsVisible}>
          <div className="st-create-post-show-options">
            <div className="st-margin-top-middle">
              <div className="st-create-post-dropdowns">
                <div className="st-create-post-dropdowns-row">
                  <div className="st-create-post-select-wrap" data-test="select-instrument">
                    <p className="m-0">
                      <FormattedMessage id="createPost.selectTitle.instrument" />
                    </p>
                    <Select
                      name="selected-quote"
                      placeholder={intl.formatMessage({ id: 'createPost.selectLabel.default' })}
                      className="st-create-post-select__quote"
                      // ref={(node) => this.selectQuoteRef = node}
                      // value={this.state.selectQuote}
                      onSelect={this.updateValueQuote}
                    >
                      {optionsQuote.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  <div className="st-create-post-select-wrap" data-test="select-recommend">
                    <p className="m-0">
                      <FormattedMessage id="createPost.selectTitle.recommend" />
                    </p>
                    <Select
                      name="selected-action"
                      placeholder={intl.formatMessage({ id: 'createPost.selectLabel.default' })}
                      className="st-create-post-select__action"
                      // ref={(node) => this.selectRecommendRef = node}
                      onSelect={this.updateValueRecommend}
                    >
                      {optionsAction.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  <div className="st-create-post-select-wrap">
                    <p className="m-0">
                      <FormattedMessage id="createPost.selectTitle.price" />
                    </p>
                    <Input
                      className="st-create-post-quotation"
                      type="text"
                      value={this.state.quotePrice}
                      // ref={input => this.inputPrice = input}
                      disabled
                    />
                  </div>
                </div>
                <div className="st-create-post-dropdowns-row">
                  <div className="st-create-post-select-wrap">
                    <p className="m-0">
                      <FormattedMessage id="modalTakeProfit.header.title" />
                    </p>
                    <input
                      type="text"
                      className={`st-create-post-quotation${
                        this.state.takeProfitValueIncorrect ? ' st-create-post-danger' : ''
                      }`}
                      value={this.state.takeProfitValue}
                      disabled={!this.state.selectRecommend || !this.state.selectQuote}
                      onChange={e =>
                        this.handleChangeTakeProfitStopLostInputs(e, 'takeProfitValue')
                      }
                      onFocus={() => this.handleFocusTakeProfitStopLostInputs('takeProfitValue')}
                    />
                  </div>
                  <div className="st-create-post-select-wrap">
                    <p className="m-0">
                      <FormattedMessage id="modalStopLoss.header.title" />
                    </p>
                    <input
                      type="text"
                      className={`st-create-post-quotation${
                        this.state.stopLossValueIncorrect ? ' st-create-post-danger' : ''
                      }`}
                      value={this.state.stopLossValue}
                      disabled={!this.state.selectRecommend || !this.state.selectQuote}
                      onChange={e => this.handleChangeTakeProfitStopLostInputs(e, 'stopLossValue')}
                      onFocus={() => this.handleFocusTakeProfitStopLostInputs('stopLossValue')}
                    />
                  </div>
                  <div className="st-create-post-select-wrap" data-test="select-forecast">
                    <p className="m-0">
                      <FormattedMessage id="createPost.selectTitle.forecast" />
                    </p>
                    {this.state.selectForecast === 'Custom' && (
                      // ? <DatePicker
                      //   locale={intl.formatMessage({id: 'locale'})}
                      //   value={this.state.dateTimeValue}
                      //   onChange={this.handleChangeDatetime}
                      //   input
                      //   inputProps={{maxLength: 16, readOnly: true}}
                      //   dateFormat='YYYY-MM-DD'
                      //   timeFormat='HH:mm'
                      //   isValidDate={(current) => current > moment(currentTime.getTime()).subtract(1, 'days') && current < moment(currentTime.getTime()).add(maxForecastDay, 'days')}/>
                      // :
                      <Select
                        name="selected-forecast"
                        placeholder={intl.formatMessage({ id: 'createPost.selectLabel.default' })}
                        className="st-create-post-select__forecast"
                        // ref={(node) => this.selectForecastRef = node}
                        simpleValue
                        options={optionsForecast}
                        value={this.state.selectForecast}
                        onChange={this.updateValueForecast}
                        searchable={false}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
}

export default CreatePostForecast;
