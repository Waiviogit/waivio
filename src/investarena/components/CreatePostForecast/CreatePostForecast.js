import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Collapse, DatePicker, Select, Input } from 'antd';
import { optionsAction, optionsForecast } from '../../constants/selectData';
import { currentTime } from '../../helpers/currentTime';
import { getQuoteOptions, getQuotePrice, isStopLossTakeProfitValid } from './helpers';
import { ceil10, floor10 } from '../../helpers/calculationsHelper';
import { getQuotesSettingsState } from '../../../investarena/redux/selectors/quotesSettingsSelectors';
import { getQuotesState } from '../../../investarena/redux/selectors/quotesSelectors';
import './CreatePostForecast.less';

@injectIntl
@connect(state => ({
  quotesSettings: getQuotesSettingsState(state),
  quotes: getQuotesState(state),
}))
class CreatePostForecast extends Component {
  static minForecastMinutes = 15;
  static maxForecastDay = 140;

  static propTypes = {
    intl: PropTypes.shape().isRequired,
    // isForecastOptionsVisible: PropTypes.bool,
    // toggleForecastBlock: PropTypes.func,
    quotesSettings: PropTypes.shape(),
    quotes: PropTypes.shape(),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    // isForecastOptionsVisible: true,
    quotesSettings: {},
    quotes: {},
    onChange: () => {},
    // toggleForecastBlock: () => {},
  };

  state = {
    dateTimeValue: null,
    quotePrice: null,
    selectQuote: null,
    selectRecommend: null,
    selectForecastTime: null,
    takeProfitValue: '',
    stopLossValue: '',
    takeProfitValueIncorrect: false,
    stopLossValueIncorrect: false,
  };

  getForecastObject = () => {
    const {
      selectQuote,
      selectRecommend,
      selectForecastTime,
      quotePrice,
      stopLossValue,
      takeProfitValue,
    } = this.state;
    return {
      quote: selectQuote,
      market: "",
      recommend: selectRecommend,
      price: parseFloat(quotePrice),
      forecast_take_profit: parseFloat(takeProfitValue),
      forecast_stop_loss: parseFloat(stopLossValue),
      forecast: selectForecastTime,
    };
  };

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
    }, this.props.onChange(this.getForecastObject()));
    // this.checkSelectDropDown(newValue, this.state.selectRecommend, this.state.selectForecastTime);
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

    // this.checkSelectDropDown(this.state.selectQuote, newValue, this.state.selectForecastTime);
  };

  handleChangeDatetime = value => this.setState({ dateTimeValue: value });

  handleChangeTakeProfitStopLostInputs = (event, input) => {
    const value = event.target.value;
    if (!isNaN(value)) {
      const { selectQuote, selectRecommend } = this.state;
      this.setState({
        [input]: value,
        [`${input}Incorrect`]: isStopLossTakeProfitValid(
          value,
          input,
          selectRecommend,
          getQuotePrice(selectQuote, selectRecommend, this.props.quotes),
        ),
      });
    }
  };

  handleFocusTakeProfitStopLostInputs = input => {
    if (this.state[input]) return;
    const { selectQuote, selectRecommend } = this.state;
    let initialValue = getQuotePrice(selectQuote, selectRecommend, this.props.quotes);

    switch (selectRecommend) {
      case 'Buy':
        initialValue =
          input === 'takeProfitValue' ? ceil10(initialValue, -1) : floor10(initialValue, -1);
        break;
      case 'Sell':
        initialValue =
          input === 'takeProfitValue' ? floor10(initialValue, -1) : ceil10(initialValue, -1);
        break;
      default:
        break;
    }
    if (!isNaN(initialValue) && initialValue > 0) {
      const forecastValue = '1555200';
      this.setState(prevState => {
        if (prevState[input] === '') {
          return {
            [input]: initialValue,
            [`${input}Incorrect`]: false,
            selectForecastTime: forecastValue,
          };
        }
        return prevState;
      });
      // this.checkSelectDropDown(this.state.selectQuote, this.state.selectRecommend, forecastValue);
    }
  };

  updateValueForecast = newValue => {
    if (newValue === 'Custom') {
      this.setState({
        selectForecastTime: newValue,
        dateTimeValue: moment(currentTime.getTime()).add(this.minForecastMinutes, 'minute'),
      });
    } else {
      this.setState({ selectForecastTime: newValue });
    }
    // this.checkSelectDropDown(this.state.selectQuote, this.state.selectRecommend, newValue);
  };

  render() {
    const { selectQuote, selectRecommend, stopLossValue, takeProfitValue } = this.state;
    const { intl, quotes, quotesSettings } = this.props;
    const optionsQuote = getQuoteOptions(quotesSettings, quotes);
    return (
      <div className="st-create-post-optional">
        <Collapse bordered>
          <Collapse.Panel
            header={
              <div className="st-create-post-optional-title">
                <FormattedMessage id="createPost.titleForecast" />
              </div>
            }
          >
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
                        className={classNames("st-create-post-select__quote", {"st-create-post-danger": !(selectQuote)})}
                        // ref={(node) => this.selectQuoteRef = node}
                        // value={this.state.selectQuote}
                        onChange={this.updateValueQuote}
                        allowClear
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
                        onChange={this.updateValueRecommend}
                        allowClear
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
                      <Input
                        type="text"
                        className={`st-create-post-quotation${
                          this.state.takeProfitValueIncorrect ? ' st-create-post-danger' : ''
                        }`}
                        value={takeProfitValue}
                        disabled={!selectRecommend || !selectQuote}
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
                      <Input
                        type="text"
                        className={`st-create-post-quotation${
                          this.state.stopLossValueIncorrect ? ' st-create-post-danger' : ''
                        }`}
                        value={stopLossValue}
                        disabled={!selectRecommend || !selectQuote}
                        onChange={e =>
                          this.handleChangeTakeProfitStopLostInputs(e, 'stopLossValue')
                        }
                        onFocus={() => this.handleFocusTakeProfitStopLostInputs('stopLossValue')}
                      />
                    </div>
                    <div className="st-create-post-select-wrap" data-test="select-forecast">
                      <p className="m-0">
                        <FormattedMessage id="createPost.selectTitle.forecast" />
                      </p>
                      {this.state.selectForecastTime === 'Custom' ? (
                        <DatePicker
                          showTime
                          style={{ width: '100%' }}
                          locale={intl.formatMessage({ id: 'locale', defaultMessage: 'en' })}
                          // value={this.state.dateTimeValue}
                          onOk={this.handleChangeDatetime}
                          format="YYYY-MM-DD HH:mm"
                          isValidDate={current =>
                            current > moment(currentTime.getTime()).subtract(1, 'days') &&
                            current < moment(currentTime.getTime()).add(this.maxForecastDay, 'days')
                          }
                        />
                      ) : (
                        <Select
                          name="selected-forecast"
                          placeholder={intl.formatMessage({ id: 'createPost.selectLabel.default' })}
                          className="st-create-post-select__forecast"
                          // ref={(node) => this.selectForecastRef = node}
                          // simpleValue
                          // options={optionsForecast}
                          // value={this.state.selectForecastTime}
                          onChange={this.updateValueForecast}
                          // searchable={false}
                        >
                          {optionsForecast.map(option => (
                            <Select.Option key={option.value} value={option.value}>
                              {option.label}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  }
}

export default CreatePostForecast;
