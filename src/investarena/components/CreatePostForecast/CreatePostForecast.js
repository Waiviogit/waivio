import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Collapse, DatePicker, Select, Input } from 'antd';
import { optionsAction, optionsForecast } from '../../constants/selectData';
import {
  getQuoteOptions,
  getQuotePrice,
  isStopLossTakeProfitValid,
  getForecastState,
  validateForm,
} from './helpers';
import {
  forecastDateTimeFormat,
  maxForecastDay,
  minForecastMinutes,
} from '../../constants/constantsForecast';
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
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    quotesSettings: PropTypes.shape(),
    quotes: PropTypes.shape(),
    isPosted: PropTypes.bool,
    isUpdating: PropTypes.bool,
    forecastValues: PropTypes.shape(),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    quotesSettings: {},
    quotes: {},
    isPosted: false,
    isUpdating: false,
    forecastValues: {},
    onChange: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      ...getForecastState(props.forecastValues),
      isValid: true,
    };
  }

  // componentDidUpdate(prevProps) {
  //   if (!_.isEqual(prevProps.forecastValues, this.props.forecastValues)) {
  //     this.updateForecastValues(this.props.forecastValues);
  //   }
  // }
  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.forecastValues, this.props.forecastValues)) {
      this.setState(getForecastState(nextProps.forecastValues));
    }
  }

  getForecastObject = forecast => {
    const { quotesSettings } = this.props;
    const {
      selectQuote,
      selectRecommend,
      selectForecast,
      dateTimeValue,
      quotePrice,
      stopLossValue,
      takeProfitValue,
      isValid,
    } = forecast;
    const price = parseFloat(quotePrice);
    const forecastObject = {
      quoteSecurity: selectQuote,
      market: selectQuote ? quotesSettings[selectQuote].market : '',
      recommend: selectRecommend,
      postPrice: !isNaN(price) ? price : null,
      selectForecast,
      expiredAt: dateTimeValue ? dateTimeValue.format(forecastDateTimeFormat) : null,
      isValid,
    };
    if (takeProfitValue) forecastObject.tpPrice = takeProfitValue;
    if (stopLossValue) forecastObject.slPrice = stopLossValue;
    return forecastObject;
  };

  getForecastState = forecast => {
    const dateTimeValue = forecast.expiredAt ? moment(forecast.expiredAt).local() : null;
    const selectForecast =
      !forecast.selectForecast && Boolean(dateTimeValue)
        ? 'Custom'
        : forecast.selectForecast || null;
    return {
      dateTimeValue,
      quotePrice: forecast.postPrice,
      selectQuote: forecast.quoteSecurity,
      selectRecommend: forecast.recommend,
      selectForecast,
      takeProfitValue: forecast.tpPrice || '',
      stopLossValue: forecast.slPrice || '',
      isValid: validateForm(forecast.quoteSecurity, forecast.recommend, selectForecast),
    };
  };

  validateForm = (quote, recommend, forecast) =>
    !!(quote && recommend && forecast) || !(quote || recommend || forecast);

  updateValueQuote = selectQuote => {
    const { selectRecommend, selectForecast } = this.state;
    const quotePrice = this.state.selectRecommend
      ? getQuotePrice(selectQuote, this.state.selectRecommend, this.props.quotes)
      : null;
    this.props.onChange(
      this.getForecastObject({
        ...this.state,
        quotePrice,
        selectQuote,
        takeProfitValue: '',
        stopLossValue: '',
        takeProfitValueIncorrect: false,
        stopLossValueIncorrect: false,
        isValid: validateForm(selectQuote, selectRecommend, selectForecast),
      }),
    );
  };

  updateValueRecommend = selectRecommend => {
    const { selectQuote, selectForecast } = this.state;
    const quotePrice = this.state.selectQuote
      ? getQuotePrice(this.state.selectQuote, selectRecommend, this.props.quotes)
      : null;
    this.props.onChange(
      this.getForecastObject({
        ...this.state,
        quotePrice,
        selectRecommend,
        takeProfitValue: '',
        stopLossValue: '',
        takeProfitValueIncorrect: false,
        stopLossValueIncorrect: false,
        isValid: validateForm(selectQuote, selectRecommend, selectForecast),
      }),
    );
  };

  handleChangeTakeProfitStopLostInputs = (event, input) => {
    const value = event.target.value;
    if (!isNaN(value)) {
      const { selectQuote, selectRecommend } = this.state;
      this.setState(
        {
          [`${input}Incorrect`]: isStopLossTakeProfitValid(
            value,
            input,
            selectRecommend,
            getQuotePrice(selectQuote, selectRecommend, this.props.quotes),
          ),
        },
        this.props.onChange(
          this.getForecastObject({
            ...this.state,
            [input]: value,
          }),
        ),
      );
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
      this.setState(
        prevState => {
          if (prevState[input] === '') {
            return {
              [`${input}Incorrect`]: false,
            };
          }
          return prevState;
        },
        this.props.onChange(
          this.getForecastObject({
            ...this.state,
            [input]: initialValue,
          }),
        ),
      );
    }
  };

  handleChangeDatetime = dateTimeValue => {
    const { selectQuote, selectRecommend } = this.state;
    this.setState({ dateTimeValue });
    this.props.onChange(
      this.getForecastObject({
        ...this.state,
        dateTimeValue: moment.utc(dateTimeValue),
        isValid: validateForm(selectQuote, selectRecommend, 'Custom'),
      }),
    );
  };

  updateValueForecast = selectForecast => {
    const { selectQuote, selectRecommend } = this.state;
    if (selectForecast === 'Custom') {
      this.props.onChange(
        this.getForecastObject({
          ...this.state,
          selectForecast,
          dateTimeValue: moment.utc().add(minForecastMinutes, 'minute'),
          isValid: validateForm(selectQuote, selectRecommend, selectForecast),
        }),
      );
    } else {
      this.props.onChange(
        this.getForecastObject({
          ...this.state,
          selectForecast,
          isValid: validateForm(selectQuote, selectRecommend, selectForecast),
        }),
      );
    }
  };

  resetForm = () => this.props.onChange({ isValid: true });

  render() {
    const {
      selectQuote,
      selectRecommend,
      selectForecast,
      stopLossValue,
      takeProfitValue,
      dateTimeValue,
      isValid,
    } = this.state;
    const { intl, isPosted, quotes, quotesSettings, isUpdating } = this.props;
    const optionsQuote = getQuoteOptions(quotesSettings, quotes);
    return (
      <div className="st-create-post-optional">
        <Collapse defaultActiveKey={['1']} bordered>
          <Collapse.Panel
            key="1"
            header={
              <div className="st-create-post-optional-title">
                <FormattedMessage
                  id="createPost.titleForecast"
                  defaultMessage="Your forecast (optional)"
                />
              </div>
            }
          >
            <div className="st-create-post-show-options">
              <div className="st-margin-top-middle">
                <div className="st-create-post-dropdowns">
                  <div className="st-create-post-dropdowns-row">
                    <div className="st-create-post-select-wrap" data-test="select-instrument">
                      <p className="m-0">
                        <FormattedMessage
                          id="createPost.selectTitle.instrument"
                          defaultMessage="Instrument"
                        />
                      </p>
                      <Select
                        name="selected-quote"
                        placeholder={intl.formatMessage({
                          id: 'createPost.selectLabel.default',
                          defaultMessage: 'Select',
                        })}
                        className={classNames('st-create-post-select__quote', {
                          'st-create-post-danger': isPosted && !isValid && !selectQuote,
                        })}
                        disabled={isUpdating}
                        onChange={this.updateValueQuote}
                        value={selectQuote}
                        showSearch
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
                        <FormattedMessage
                          id="createPost.selectTitle.recommend"
                          defaultMessage="I recommend"
                        />
                      </p>
                      <Select
                        name="selected-action"
                        placeholder={intl.formatMessage({
                          id: 'createPost.selectLabel.default',
                          defaultMessage: 'Select',
                        })}
                        className={classNames('st-create-post-select__action', {
                          'st-create-post-danger': isPosted && !isValid && !selectRecommend,
                        })}
                        disabled={isUpdating}
                        value={selectRecommend}
                        onChange={this.updateValueRecommend}
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
                        <FormattedMessage
                          id="createPost.selectTitle.price"
                          defaultMessage="Price"
                        />
                      </p>
                      <Input
                        className="st-create-post-quotation"
                        type="text"
                        value={this.state.quotePrice}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="st-create-post-dropdowns-row">
                    <div className="st-create-post-select-wrap">
                      <p className="m-0">
                        <FormattedMessage
                          id="modalTakeProfit.header.title"
                          defaultMessage="Take profit"
                        />
                      </p>
                      <Input
                        type="text"
                        className={`st-create-post-quotation${
                          this.state.takeProfitValueIncorrect ? ' st-create-post-danger' : ''
                        }`}
                        value={takeProfitValue}
                        disabled={!selectRecommend || !selectQuote || isUpdating}
                        onChange={e =>
                          this.handleChangeTakeProfitStopLostInputs(e, 'takeProfitValue')
                        }
                        onFocus={() => this.handleFocusTakeProfitStopLostInputs('takeProfitValue')}
                      />
                    </div>
                    <div className="st-create-post-select-wrap">
                      <p className="m-0">
                        <FormattedMessage
                          id="modalStopLoss.header.title"
                          defaultMessage="Stop loss"
                        />
                      </p>
                      <Input
                        type="text"
                        className={`st-create-post-quotation${
                          this.state.stopLossValueIncorrect ? ' st-create-post-danger' : ''
                        }`}
                        value={stopLossValue}
                        disabled={!selectRecommend || !selectQuote || isUpdating}
                        onChange={e =>
                          this.handleChangeTakeProfitStopLostInputs(e, 'stopLossValue')
                        }
                        onFocus={() => this.handleFocusTakeProfitStopLostInputs('stopLossValue')}
                      />
                    </div>
                    <div className="st-create-post-select-wrap" data-test="select-forecast">
                      <p className="m-0">
                        <FormattedMessage
                          id="createPost.selectTitle.forecast"
                          defaultMessage="Forecast time"
                        />
                      </p>
                      {isUpdating || this.state.selectForecast === 'Custom' ? (
                        <DatePicker
                          disabled={isUpdating}
                          allowClear={false}
                          showTime={{ format: 'HH:mm', minuteStep: 5 }}
                          style={{ width: '100%' }}
                          locale={intl.formatMessage({ id: 'locale', defaultMessage: 'en' })}
                          value={dateTimeValue}
                          onChange={this.handleChangeDatetime}
                          format="YYYY-MM-DD HH:mm"
                          disabledDate={date =>
                            date < moment().local() ||
                            date >
                              moment()
                                .local()
                                .add(maxForecastDay, 'days')
                          }
                        />
                      ) : (
                        <Select
                          name="selected-forecast"
                          placeholder={intl.formatMessage({
                            id: 'createPost.selectLabel.default',
                            defaultMessage: 'Select',
                          })}
                          className={classNames('st-create-post-select__forecast', {
                            'st-create-post-danger': isPosted && !isValid && !selectForecast,
                          })}
                          value={selectForecast}
                          onChange={this.updateValueForecast}
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
                  <div
                    className="st-create-post-dropdowns-row clear"
                    role="presentation"
                    onClick={this.resetForm}
                  >
                    {intl.formatMessage({ id: 'deals.clear', defaultMessage: 'Clear' })}
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
