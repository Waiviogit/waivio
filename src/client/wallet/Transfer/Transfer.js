import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { get, isNull, isEmpty, isNaN, includes } from 'lodash';
import { Form, Input, Modal, Radio } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { HBD, HIVE } from '../../../common/constants/cryptos';
import { getCryptoPriceHistory } from '../../app/appActions';
import { closeTransfer, sendPendingTransfer } from '../walletActions';
import { notify } from '../../app/Notification/notificationActions';
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
  getSearchUsersResults,
  getTotalVestingShares,
  getTotalVestingFundSteem,
  getHiveBeneficiaryAccount,
  isOpenLinkModal,
} from '../../reducers';
import { sendGuestTransfer } from '../../../waivioApi/ApiClient';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
import { BANK_ACCOUNT } from '../../../common/constants/waivio';
import { guestUserRegex } from '../../helpers/regexHelpers';
import Avatar from '../../components/Avatar';
import USDDisplay from '../../components/Utils/USDDisplay';
import { REWARD } from '../../../common/constants/rewards';
import LinkHiveAccountModal from '../../settings/LinkHiveAccountModal';
import { saveSettings, openLinkHiveAccountModal } from '../../settings/settingsActions';
import { createQuery } from '../../helpers/apiHelpers';

import './Transfer.less';

const InputGroup = Input.Group;

@withRouter
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
    searchByUser: getSearchUsersResults(state),
    totalVestingShares: getTotalVestingShares(state),
    totalVestingFundSteem: getTotalVestingFundSteem(state),
    hiveBeneficiaryAccount: getHiveBeneficiaryAccount(state),
    showModal: isOpenLinkModal(state),
  }),
  {
    closeTransfer,
    getCryptoPriceHistory,
    notify,
    saveSettings,
    openLinkHiveAccountModal,
    sendPendingTransfer,
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
    hiveBeneficiaryAccount: PropTypes.string,
    saveSettings: PropTypes.func.isRequired,
    openLinkHiveAccountModal: PropTypes.func.isRequired,
    showModal: PropTypes.bool.isRequired,
    sendPendingTransfer: PropTypes.func.isRequired,
    getPayables: PropTypes.func,
    match: PropTypes.shape().isRequired,
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
    searchByUser: [],
    hiveBeneficiaryAccount: '',
    getPayables: () => {},
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

  state = {
    currency: Transfer.CURRENCIES.HIVE,
    oldAmount: undefined,
    searchBarValue: '',
    searchName: '',
    dropdownOpen: false,
    currentEstimate: null,
    isSelected: false,
    isClosedFind: false,
    hiveBeneficiaryAccount: this.props.hiveBeneficiaryAccount,
    inputValue: null,
  };

  componentDidMount() {
    const {
      cryptosPriceHistory,
      getCryptoPriceHistory: getCryptoPriceHistoryAction,
      to,
      amount,
    } = this.props;
    const currentHiveRate = get(cryptosPriceHistory, 'HIVE.priceDetails.currentUSDPrice', null);
    const currentHBDRate = get(cryptosPriceHistory, 'HBD.priceDetails.currentUSDPrice', null);
    if (isNull(currentHiveRate) || isNull(currentHBDRate))
      getCryptoPriceHistoryAction([HIVE.coinGeckoId, HBD.coinGeckoId]);
    this.props.form.setFieldsValue({
      to,
      amount,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { form, to, amount, currency } = this.props;
    if (!this.props.visible) {
      this.setState({
        searchBarValue: '',
        dropdownOpen: false,
        currentEstimate: null,
        isSelected: false,
        isClosedFind: false,
      });
    }
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
  }

  handleOkModal = () =>
    this.props
      .saveSettings({
        hiveBeneficiaryAccount: this.state.hiveBeneficiaryAccount,
      })
      .then(() => {
        this.props.notify(
          this.props.intl.formatMessage({ id: 'saved', defaultMessage: 'Saved' }),
          'success',
        );
        this.props.openLinkHiveAccountModal(false);
        this.setState({ hiveBeneficiaryAccount: '' });
      });

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

  handleSwitchCurrency = () => {
    const { cryptosPriceHistory } = this.props;
    this.setState({
      currentEstimate: this.estimatedValue(cryptosPriceHistory, this.state.inputValue),
    });
  };

  handleBalanceClick = event => {
    const { cryptosPriceHistory } = this.props;
    const { oldAmount } = this.state;
    const value = parseFloat(event.currentTarget.innerText);
    this.props.form.setFieldsValue({
      amount: value,
    });
    this.setState({
      searchBarValue: value,
      currentEstimate: this.estimatedValue(cryptosPriceHistory, value),
      oldAmount: Transfer.amountRegex.test(value) ? value : oldAmount,
    });
  };

  handleCurrencyChange = event => {
    const { form } = this.props;
    this.setState({ currency: event.target.value }, () =>
      form.validateFields(['amount'], { force: true }, this.handleSwitchCurrency()),
    );
  };

  handleContinueClick = () => {
    const {
      form,
      isGuest,
      memo,
      app,
      sendPendingTransfer: sendPendingTransferAction,
      amount,
      to,
      user,
      match,
      getPayables,
    } = this.props;
    const matchPath = get(match, ['params', '0']);
    const params = ['payables', 'receivables'];
    const sponsor = user.name;
    const transactionId = uuidv4();
    const userName = to;
    const overpaymentRefund = includes(memo, 'overpayment_refund');

    form.validateFields({ force: true }, (errors, values) => {
      if (!errors) {
        const transferQuery = {
          amount: `${parseFloat(values.amount).toFixed(3)} ${values.currency}`,
          memo: {},
        };
        if (guestUserRegex.test(values.to)) {
          transferQuery.to = BANK_ACCOUNT;
          transferQuery.memo = { id: memo || REWARD.guestTransfer, to: values.to };
        } else {
          transferQuery.to = values.to;
          if (values.memo) transferQuery.memo = values.memo;
        }

        if (memo) {
          transferQuery.memo = { ...transferQuery.memo, id: memo };
          if (values.memo) transferQuery.memo.message = values.memo;
        }

        if (app) transferQuery.memo = { ...transferQuery.memo, app };
        if (values.to && transferQuery.memo.id === REWARD.guestTransfer)
          transferQuery.memo = {
            ...transferQuery.memo,
            to: values.to,
          };
        if (app && overpaymentRefund && isGuest) transferQuery.app = app;
        transferQuery.memo = JSON.stringify(transferQuery.memo);
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
          const win = window.open(
            `https://hivesigner.com/sign/transfer?${createQuery(transferQuery)}`,
            '_blank',
          );
          win.focus();
        }

        if (includes(params, matchPath)) {
          sendPendingTransferAction({ sponsor, userName, amount, transactionId, memo });
          setTimeout(() => getPayables(), 1000);
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
    callback();
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
      this.state.currency === Transfer.CURRENCIES.HIVE ? user.balance : user.hbd_balance;
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

  showSelectedUser = () => {
    const { user, to, hiveBeneficiaryAccount, isGuest, form, amount, match } = this.props;
    const { searchName } = this.state;
    const userName = isEmpty(searchName) ? to : searchName;
    const isCurrentUser = user.name === match.params.name;
    const guestWithBeneficiary = isGuest && hiveBeneficiaryAccount;
    const account = guestWithBeneficiary ? hiveBeneficiaryAccount : userName;
    if (guestWithBeneficiary && !form.getFieldValue('to')) {
      this.props.form.setFieldsValue({
        to: hiveBeneficiaryAccount,
      });
    }

    return (
      <div className="Transfer__search-content-wrap-current">
        <div className="Transfer__search-content-wrap-current-user">
          <Avatar username={account} size={40} />
          <div className="Transfer__search-content">{account}</div>
        </div>
        {!guestWithBeneficiary && !amount && isCurrentUser && (
          <span
            role="presentation"
            onClick={() =>
              this.setState({
                isSelected: false,
                searchName: '',
                isClosedFind: true,
              })
            }
            className="iconfont icon-delete Transfer__delete-icon"
          />
        )}
      </div>
    );
  };

  handleUserSelect = selected => {
    this.setState({ isSelected: true, isClosedFind: false, searchName: selected.account });
    if (selected && this.props.isGuest && !this.props.hiveBeneficiaryAccount)
      this.setState({ hiveBeneficiaryAccount: selected.account });
  };

  handleUnselectUser = () => {
    this.setState({
      searchName: '',
      hiveBeneficiaryAccount: '',
    });
  };

  estimatedValue = (cryptosPriceHistory, amount) =>
    get(
      cryptosPriceHistory,
      this.state.currency === 'HIVE'
        ? `${HIVE.coinGeckoId}.usdPriceHistory.usd`
        : `${HBD.coinGeckoId}.usdPriceHistory.usd`,
      null,
    ) * amount;

  handleAmountChange = event => {
    const { value } = event.target;
    const { oldAmount } = this.state;
    const { cryptosPriceHistory } = this.props;
    this.setState({
      inputValue: value,
      oldAmount: Transfer.amountRegex.test(value) ? value : oldAmount,
      currentEstimate: this.estimatedValue(cryptosPriceHistory, value),
    });

    this.props.form.setFieldsValue({
      amount: Transfer.amountRegex.test(value) ? value : oldAmount,
    });
    this.props.form.validateFields(['amount']);
  };

  render() {
    const {
      intl,
      visible,
      authenticated,
      user,
      memo,
      screenSize,
      isGuest,
      amount,
      cryptosPriceHistory,
      hiveBeneficiaryAccount,
      showModal,
    } = this.props;
    const { isSelected, searchBarValue, isClosedFind } = this.state;
    const { getFieldDecorator, getFieldValue, resetFields } = this.props.form;
    const isMobile = screenSize.includes('xsmall') || screenSize.includes('small');
    const to = !searchBarValue && isClosedFind ? resetFields('to') : getFieldValue('to');
    const guestName = to && guestUserRegex.test(to);
    const balance =
      this.state.currency === Transfer.CURRENCIES.HIVE ? user.balance : user.hbd_balance;
    const currentBalance = isGuest ? `${user.balance} HIVE` : balance;
    const isChangesDisabled = !!memo;
    const currencyPrefix = getFieldDecorator('currency', {
      initialValue: this.state.currency,
    })(
      <Radio.Group onChange={this.handleCurrencyChange} className="Transfer__amount__type">
        <Radio.Button
          disabled={isChangesDisabled && this.state.currency !== Transfer.CURRENCIES.HIVE}
          value={Transfer.CURRENCIES.HIVE}
          className="Transfer__amount__type-steem"
        >
          {Transfer.CURRENCIES.HIVE}
        </Radio.Button>
        <Radio.Button
          value={Transfer.CURRENCIES.HBD}
          className="Transfer__amount__type-sbd"
          disabled={
            !isGuest ? isChangesDisabled && this.state.currency !== Transfer.CURRENCIES.HBD : true
          }
        >
          {Transfer.CURRENCIES.HBD}
        </Radio.Button>
      </Radio.Group>,
    );

    const usdValue = this.getUSDValue();

    return (isGuest && hiveBeneficiaryAccount) || !isGuest ? (
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
              isSelected || !isEmpty(this.props.to) || (isGuest && hiveBeneficiaryAccount) ? (
                this.showSelectedUser()
              ) : (
                <SearchUsersAutocomplete
                  allowClear={false}
                  handleSelect={this.handleUserSelect}
                  placeholder={intl.formatMessage({
                    id: 'find_users_placeholder',
                    defaultMessage: 'Find user',
                  })}
                  style={{ width: '100%' }}
                  autoFocus={false}
                />
              ),
            )}
          </Form.Item>
          {guestName && (
            <FormattedMessage
              id="transferThroughBank"
              defaultMessage="Your funds transaction will be processed through WaivioBank service. WaivioBank doesn't take any fees."
            />
          )}
          <Form.Item
            className="Transfer__amount-wrap"
            label={<FormattedMessage id="amount" defaultMessage="Amount" />}
          >
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
          </Form.Item>
          <Form.Item>{isMobile && currencyPrefix}</Form.Item>
          <Form.Item>
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
          </Form.Item>
          <Form.Item>
            <div>
              <FormattedMessage
                id="estimated_value"
                defaultMessage="Estimated transaction value: {estimate} USD"
                values={{
                  estimate: (
                    <span role="presentation" className="estimate">
                      <USDDisplay
                        value={
                          amount
                            ? this.estimatedValue(cryptosPriceHistory, amount)
                            : this.state.currentEstimate
                        }
                      />
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
        {!isGuest && (
          <FormattedMessage
            id="transfer_modal_info"
            defaultMessage="Click the button below to be redirected to HiveSigner to complete your transaction."
          />
        )}
      </Modal>
    ) : (
      <LinkHiveAccountModal
        handleOk={this.handleOkModal}
        handleSelect={this.handleUserSelect}
        handleClose={() => {
          this.props.openLinkHiveAccountModal(false);
          this.props.closeTransfer();
        }}
        showModal={showModal}
        hiveBeneficiaryAccount={this.state.hiveBeneficiaryAccount}
        handleUnselectUser={this.handleUnselectUser}
      />
    );
  }
}
