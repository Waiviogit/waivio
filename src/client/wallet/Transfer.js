import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { get, isNull, isEmpty, debounce, map, isNaN } from 'lodash';
import { AutoComplete, Form, Input, Modal, Radio } from 'antd';
import { HBD, HIVE } from '../../common/constants/cryptos';
import SteemConnect from '../steemConnectAPI';
import { getCryptoPriceHistory } from '../app/appActions';
import { closeTransfer } from './walletActions';
import { notify } from '../app/Notification/notificationActions';
import {
  getAuthenticatedUser,
  getCryptosPriceHistory,
  getIsAuthenticated,
  getIsTransferVisible,
  getScreenSize,
  getTransferAmount,
  getTransferCurrency,
  getTransferMemo,
  getTransferApp,
  getTransferTo,
  isGuestUser,
  getAutoCompleteSearchResults,
  getSearchUsersResults,
  getTotalVestingShares,
  getTotalVestingFundSteem,
  estimateValue,
} from '../reducers';
import { sendGuestTransfer, getUserAccount } from '../../waivioApi/ApiClient';
import {
  searchAutoComplete,
  searchObjectsAutoCompete,
  searchUsersAutoCompete,
  searchObjectTypesAutoCompete,
  resetSearchAutoCompete,
} from '../search/searchActions';
import { BANK_ACCOUNT } from '../../common/constants/waivio';
import { guestUserRegex } from '../helpers/regexHelpers';
import Avatar from '../components/Avatar';
import USDDisplay from '../components/Utils/USDDisplay';
import { REWARD } from '../../common/constants/rewards';
import './Transfer.less';

const InputGroup = Input.Group;

@injectIntl
@connect(
  state => ({
    visible: getIsTransferVisible(state),
    to: getTransferTo(state),
    amount: getTransferAmount(state),
    currency: getTransferCurrency(state),
    memo: getTransferMemo(state),
    app: getTransferApp(state),
    authenticated: getIsAuthenticated(state),
    user: getAuthenticatedUser(state),
    cryptosPriceHistory: getCryptosPriceHistory(state),
    screenSize: getScreenSize(state),
    isGuest: isGuestUser(state),
    autoCompleteSearchResults: getAutoCompleteSearchResults(state),
    searchByUser: getSearchUsersResults(state),
    totalVestingShares: getTotalVestingShares(state),
    totalVestingFundSteem: getTotalVestingFundSteem(state),
    getEstimateValue: estimateValue(state),
  }),
  {
    closeTransfer,
    getCryptoPriceHistory,
    notify,
    searchAutoComplete,
    searchObjectsAutoCompete,
    searchUsersAutoCompete,
    searchObjectTypesAutoCompete,
    resetSearchAutoCompete,
  },
)
@Form.create()
export default class Transfer extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    visible: PropTypes.bool,
    to: PropTypes.string,
    authenticated: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    cryptosPriceHistory: PropTypes.shape().isRequired,
    getCryptoPriceHistory: PropTypes.func.isRequired,
    closeTransfer: PropTypes.func,
    amount: PropTypes.number,
    currency: PropTypes.string,
    memo: PropTypes.string,
    app: PropTypes.string,
    screenSize: PropTypes.string,
    isGuest: PropTypes.bool,
    notify: PropTypes.func,
    searchAutoComplete: PropTypes.func.isRequired,
    resetSearchAutoCompete: PropTypes.func.isRequired,
    autoCompleteSearchResults: PropTypes.oneOfType([
      PropTypes.shape(),
      PropTypes.arrayOf(PropTypes.shape()),
    ]),
    getEstimateValue: PropTypes.number,
  };

  static defaultProps = {
    to: '',
    visible: false,
    amount: 0,
    memo: '',
    app: '',
    currency: 'HIVE',
    closeTransfer: () => {},
    screenSize: 'large',
    isGuest: false,
    notify: () => {},
    autoCompleteSearchResults: {},
    searchByUser: [],
    getEstimateValue: 0,
  };

  static amountRegex = /^[0-9]*\.?[0-9]{0,3}$/;

  static minAccountLength = 3;
  static maxAccountLength = 16;
  static maxGuestAccountLength = 23;
  static exchangeRegex = /^(bittrex|blocktrades|poloniex|changelly|openledge|shapeshiftio|deepcrypto8)$/;
  static CURRENCIES = {
    HIVE: 'HIVE',
    HBD: 'HBD',
  };

  static markers = {
    USER: 'user',
    SELECT_BAR: 'searchSelectBar',
  };

  constructor(props) {
    super(props);
    this.handleAutoCompleteSearch = this.handleAutoCompleteSearch.bind(this);
    this.handleOnChangeForAutoComplete = this.handleOnChangeForAutoComplete.bind(this);
    this.hideAutoCompleteDropdown = this.hideAutoCompleteDropdown.bind(this);
  }

  state = {
    currency: Transfer.CURRENCIES.HIVE,
    oldAmount: undefined,
    searchBarValue: '',
    dropdownOpen: false,
    currentEstimate: null,
    isSelected: false,
    isClosedFind: false,
  };

  componentDidMount() {
    const { cryptosPriceHistory, getCryptoPriceHistory: getCryptoPriceHistoryAction } = this.props;
    const currentHiveRate = get(cryptosPriceHistory, 'HIVE.priceDetails.currentUSDPrice', null);
    const currentHBDRate = get(cryptosPriceHistory, 'HBD.priceDetails.currentUSDPrice', null);
    if (isNull(currentHiveRate) || isNull(currentHBDRate))
      getCryptoPriceHistoryAction([HIVE.coinGeckoId, HBD.coinGeckoId]);
  }

  componentWillReceiveProps(nextProps) {
    const { form, to, amount, currency, visible, getEstimateValue } = this.props;

    if (to !== nextProps.to || amount !== nextProps.amount || currency !== nextProps.currency) {
      form.setFieldsValue({
        to: nextProps.to,
        amount: nextProps.amount,
        currency: nextProps.currency === 'HIVE' ? HIVE.symbol : HBD.symbol,
      });
      this.setState({
        currency: HIVE.symbol,
      });
    }

    if (!visible) {
      this.setState({
        searchBarValue: '',
        dropdownOpen: false,
        isSelected: false,
        currentEstimate: null,
        isClosedFind: false,
      });
    }

    if (visible && getEstimateValue) {
      this.setState({ currentEstimate: getEstimateValue });
    }
  }

  debouncedSearch = debounce(value => this.props.searchAutoComplete(value, 3, 15), 800);

  getUSDValue() {
    const { cryptosPriceHistory, intl } = this.props;
    const { currency, oldAmount } = this.state;
    const currentSteemRate = get(cryptosPriceHistory, 'HIVE.priceDetails.currentUSDPrice', null);
    const currentSBDRate = get(cryptosPriceHistory, 'HBD.priceDetails.currentUSDPrice', null);
    const steemRateLoading = isNull(currentSteemRate) || isNull(currentSBDRate);
    const parsedAmount = parseFloat(oldAmount);
    const invalidAmount = parsedAmount <= 0 || isNaN(parsedAmount);
    let amount = 0;

    if (steemRateLoading || invalidAmount) return '';

    if (currency === HIVE.symbol) {
      amount = parsedAmount * parseFloat(currentSteemRate);
    } else {
      amount = parsedAmount * parseFloat(currentSBDRate);
    }

    return `$${intl.formatNumber(amount, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  handleBalanceClick = event => {
    const { oldAmount } = this.state;
    const value = parseFloat(event.currentTarget.innerText);
    this.setState({
      oldAmount: Transfer.amountRegex.test(value) ? value : oldAmount,
    });
    this.props.form.setFieldsValue({
      amount: value,
    });
  };

  handleCurrencyChange = event => {
    const { form } = this.props;
    this.setState({ currency: event.target.value }, () =>
      form.validateFields(['amount'], { force: true }),
    );
  };

  handleContinueClick = () => {
    const { form, isGuest, memo, app } = this.props;
    form.validateFields({ force: true }, (errors, values) => {
      if (!errors) {
        const transferQuery = {
          amount: `${parseFloat(values.amount).toFixed(3)} ${values.currency}`,
        };

        if (guestUserRegex.test(values.to)) {
          transferQuery.to = BANK_ACCOUNT;
          transferQuery.memo = memo
            ? { id: memo, to: values.to }
            : { id: REWARD.guestTransfer, to: values.to };
          if (app) {
            transferQuery.memo.app = app;
          }
          if (values.memo) transferQuery.memo.message = values.memo;
          transferQuery.memo = JSON.stringify(transferQuery.memo);
        } else {
          transferQuery.to = values.to;
          if (memo) {
            transferQuery.memo = { id: memo };
            if (app) {
              transferQuery.memo.app = app;
            }
            if (values.memo) transferQuery.memo.message = values.memo;
            transferQuery.memo = JSON.stringify(transferQuery.memo);
          }
          if (values.memo) transferQuery.memo = values.memo;
        }

        if (isGuest) {
          sendGuestTransfer(transferQuery).then(res => {
            if (res.result) {
              this.props.notify(
                this.props.intl.formatMessage({
                  id: 'transaction_message_for_user',
                  defaultMessage: 'Your transaction is on the way!',
                }),
                'success',
              );
            } else {
              this.props.notify('Transaction failed', 'error');
              this.props.notify(
                this.props.intl.formatMessage({
                  id: 'transaction_error_message_for_user',
                  defaultMessage: 'Transaction failed',
                }),
                'error',
              );
            }
          });
        } else {
          const win = window.open(SteemConnect.sign('transfer', transferQuery), '_blank');
          win.focus();
        }

        this.props.closeTransfer();
      }
    });
  };

  handleCancelClick = () => this.props.closeTransfer();

  validateMemo = (rule, value, callback) => {
    const { intl } = this.props;
    const recipientIsExchange = Transfer.exchangeRegex.test(this.props.form.getFieldValue('to'));

    if (recipientIsExchange && (!value || value === '')) {
      return callback([
        new Error(
          intl.formatMessage({
            id: 'memo_exchange_error',
            defaultMessage: 'Memo is required when sending to an exchange.',
          }),
        ),
      ]);
    } else if (value && value.trim()[0] === '#') {
      return callback([
        new Error(
          intl.formatMessage({
            id: 'memo_encryption_error',
            defaultMessage: 'Encrypted memos are not supported.',
          }),
        ),
      ]);
    }

    return callback();
  };

  validateUsername = (rule, value, callback) => {
    const { intl } = this.props;
    this.props.form.validateFields(['memo'], { force: true });

    if (!value) {
      callback();
      return;
    }

    if (this.props.isGuest && guestUserRegex.test(value)) {
      callback([
        new Error(
          intl.formatMessage({
            id: 'guest_guest_transfers_prohibited',
            defaultMessage: 'Money transfers between guest users are prohibited!',
          }),
        ),
      ]);
      return;
    }

    getUserAccount(value, false).then(result => {
      if (!isEmpty(result)) {
        callback();
      } else {
        callback([
          new Error(
            intl.formatMessage(
              {
                id: 'to_error_not_found_username',
                defaultMessage: "Couldn't find user with name {username}.",
              },
              {
                username: value,
              },
            ),
          ),
        ]);
      }
    });
  };

  validateBalance = (rule, value, callback) => {
    const { intl, authenticated, user } = this.props;
    const currentValue = parseFloat(value);

    if (value && currentValue <= 0) {
      callback([
        new Error(
          intl.formatMessage({
            id: 'amount_error_zero',
            defaultMessage: 'Amount has to be higher than 0.',
          }),
        ),
      ]);

      return;
    }

    const selectedBalance =
      this.state.currency === Transfer.CURRENCIES.HIVE ? user.balance : user.sbd_balance;
    const currentSelectedBalance = this.props.isGuest ? user.balance : selectedBalance;

    if (authenticated && currentValue !== 0 && currentValue > parseFloat(currentSelectedBalance)) {
      callback([
        new Error(
          intl.formatMessage({ id: 'amount_error_funds', defaultMessage: 'Insufficient funds.' }),
        ),
      ]);
    } else {
      callback();
    }
  };

  handleAutoCompleteSearch(value) {
    this.debouncedSearch(value);
    this.setState({ dropdownOpen: true });
  }

  showSelectedUser = () => {
    const { to } = this.props;
    const { searchBarValue } = this.state;
    const userName = isEmpty(searchBarValue) ? to : searchBarValue;
    return (
      <div className="Transfer__search-content-wrap-current">
        <div className="Transfer__search-content-wrap-current-user">
          <Avatar username={userName} size={40} />
          <div className="Transfer__search-content">{userName}</div>
        </div>
        <span
          role="presentation"
          onClick={() =>
            this.setState({
              isSelected: false,
              searchBarValue: '',
              isClosedFind: true,
            })
          }
          className="iconfont icon-delete Transfer__delete-icon"
        />
      </div>
    );
  };

  hideAutoCompleteDropdown() {
    this.setState(
      { searchBarActive: false, dropdownOpen: false, isSelected: true },
      this.props.resetSearchAutoCompete,
    );
  }

  handleOnChangeForAutoComplete(value) {
    this.setState({
      searchBarValue: value,
      isClosedFind: false,
    });
  }

  handleAmountChange = event => {
    const { value } = event.target;
    const { oldAmount } = this.state;
    const { cryptosPriceHistory } = this.props;

    const estimatedValue =
      get(cryptosPriceHistory, `${HIVE.coinGeckoId}.usdPriceHistory.usd`, null) * value;

    this.setState({
      oldAmount: Transfer.amountRegex.test(value) ? value : oldAmount,
      currentEstimate: estimatedValue,
    });

    this.props.form.setFieldsValue({
      amount: Transfer.amountRegex.test(value) ? value : oldAmount,
    });
    this.props.form.validateFields(['amount']);
  };

  completeDropdown = () => {
    const { autoCompleteSearchResults } = this.props;
    const foundUsers = autoCompleteSearchResults.users;
    const { Option } = AutoComplete;
    return map(foundUsers, option => (
      <Option
        marker={Transfer.markers.USER}
        key={option.account}
        value={option.account}
        className="Transfer__search-autocomplete"
      >
        <div className="Transfer__search-content-wrap">
          <Avatar username={option.account} size={40} />
          <div className="Transfer__search-content">{option.account}</div>
        </div>
      </Option>
    ));
  };

  render() {
    const { intl, visible, authenticated, user, memo, screenSize, isGuest } = this.props;
    const { isSelected, searchBarValue, isClosedFind } = this.state;
    const { getFieldDecorator, getFieldValue, resetFields } = this.props.form;
    const isMobile = screenSize.includes('xsmall') || screenSize.includes('small');

    const to = !searchBarValue && isClosedFind ? resetFields('to') : getFieldValue('to');
    const guestName = to && guestUserRegex.test(to);

    const balance =
      this.state.currency === Transfer.CURRENCIES.HIVE ? user.balance : user.sbd_balance;
    const currentBalance = isGuest ? `${user.balance} HIVE` : balance;
    const isChangesDisabled = !!memo;

    const currencyPrefix = getFieldDecorator('currency', {
      initialValue: this.state.currency,
    })(
      <Radio.Group
        disabled={isChangesDisabled}
        onChange={this.handleCurrencyChange}
        className="Transfer__amount__type"
      >
        <Radio.Button value={Transfer.CURRENCIES.HIVE} className="Transfer__amount__type-steem">
          {Transfer.CURRENCIES.HIVE}
        </Radio.Button>
        <Radio.Button
          value={Transfer.CURRENCIES.HBD}
          className="Transfer__amount__type-sbd"
          disabled={isGuest}
        >
          {Transfer.CURRENCIES.HBD}
        </Radio.Button>
      </Radio.Group>,
    );

    const usdValue = this.getUSDValue();

    return (
      <Modal
        visible={visible}
        title={intl.formatMessage({ id: 'transfer_modal_title', defaultMessage: 'Transfer funds' })}
        okText={intl.formatMessage({ id: 'continue', defaultMessage: 'Continue' })}
        cancelText={intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
        onOk={this.handleContinueClick}
        onCancel={this.handleCancelClick}
      >
        <Form className="Transfer" hideRequiredMark>
          <Form.Item label={<FormattedMessage id="to" defaultMessage="To" />}>
            {getFieldDecorator('to', {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'to_error_empty',
                    defaultMessage: 'Recipient is required.',
                  }),
                },
                { validator: this.validateUsername },
              ],
            })(
              isSelected || !isEmpty(this.props.to) ? (
                this.showSelectedUser()
              ) : (
                <AutoComplete
                  dropdownClassName="Transfer__search-dropdown-container"
                  onSearch={this.handleAutoCompleteSearch}
                  onSelect={this.hideAutoCompleteDropdown}
                  onChange={this.handleOnChangeForAutoComplete}
                  optionLabelProp="value"
                  dropdownStyle={{ color: 'red' }}
                  open={this.state.dropdownOpen && visible}
                  dataSource={this.completeDropdown()}
                  placeholder={intl.formatMessage({
                    id: 'find_user',
                    defaultMessage: 'Find user',
                  })}
                />
              ),
            )}
          </Form.Item>
          {guestName && (
            <FormattedMessage
              id="transferThroughBank"
              defaultMessage="Your funds transaction will be processed through WaivioBank service. WaiveBank doesn't take any fees."
            />
          )}
          <Form.Item label={<FormattedMessage id="amount" defaultMessage="Amount" />}>
            <InputGroup className="Transfer__amount">
              {getFieldDecorator('amount', {
                trigger: '',
                rules: [
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'amount_error_empty',
                      defaultMessage: 'Amount is required.',
                    }),
                  },
                  {
                    pattern: Transfer.amountRegex,
                    message: intl.formatMessage({
                      id: 'amount_error_format',
                      defaultMessage:
                        'Incorrect format. Use comma or dot as decimal separator. Use at most 3 decimal places.',
                    }),
                  },
                  { validator: this.validateBalance },
                ],
              })(
                <Input
                  disabled={isChangesDisabled}
                  className="Transfer__amount__input"
                  onChange={this.handleAmountChange}
                  placeholder={intl.formatMessage({
                    id: 'amount_placeholder',
                    defaultMessage: 'How much do you want to send',
                  })}
                />,
              )}
              {!isMobile && (
                <span className="Transfer__usd-value" placeholder={usdValue}>
                  {currencyPrefix}
                </span>
              )}
            </InputGroup>
            <Form.Item>{isMobile && currencyPrefix}</Form.Item>
            {authenticated && (
              <FormattedMessage
                id="balance_amount"
                defaultMessage="Your balance: {amount}"
                values={{
                  amount: (
                    <span
                      role="presentation"
                      onClick={isChangesDisabled ? () => {} : this.handleBalanceClick}
                      className="balance"
                    >
                      {currentBalance}
                    </span>
                  ),
                }}
              />
            )}
            <div>
              <FormattedMessage
                id="estimated_value"
                defaultMessage="Estimated transaction value: {estimate} USD"
                values={{
                  estimate: (
                    <span role="presentation" className="estimate">
                      <USDDisplay value={this.state.currentEstimate} />
                    </span>
                  ),
                }}
              />
            </div>
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="memo_optional" defaultMessage="Memo (optional)" />}
          >
            {getFieldDecorator('memo', {
              rules: [{ validator: this.validateMemo }],
            })(
              <Input.TextArea
                disabled={isChangesDisabled}
                autoSize={{ minRows: 2, maxRows: 6 }}
                placeholder={intl.formatMessage({
                  id: 'memo_placeholder',
                  defaultMessage: 'Additional message to include in this payment (optional)',
                })}
              />,
            )}
          </Form.Item>
        </Form>
        {!isGuest ? (
          <FormattedMessage
            id="transfer_modal_info"
            defaultMessage="Click the button below to be redirected to HiveSigner to complete your transaction."
          />
        ) : null}
      </Modal>
    );
  }
}
