import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { get, isEmpty, isNull } from 'lodash';
import { Form, Input, Modal, Radio } from 'antd';
import { SBD, STEEM } from '../../common/constants/cryptos';
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
  getTransferTo,
  isGuestUser,
} from '../reducers';
import { getUserAccount, sendGuestTransfer } from '../../waivioApi/ApiClient';
import { BANK_ACCOUNT, GUEST_PREFIX } from '../../common/constants/waivio';
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
    authenticated: getIsAuthenticated(state),
    user: getAuthenticatedUser(state),
    cryptosPriceHistory: getCryptosPriceHistory(state),
    screenSize: getScreenSize(state),
    isGuest: isGuestUser(state),
  }),
  {
    closeTransfer,
    getCryptoPriceHistory,
    notify,
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
    screenSize: PropTypes.string,
    isGuest: PropTypes.bool,
    notify: PropTypes.func,
  };

  static defaultProps = {
    to: '',
    visible: false,
    amount: 0,
    memo: '',
    currency: 'STEEM',
    closeTransfer: () => {},
    screenSize: 'large',
    isGuest: false,
    notify: () => {},
  };

  // eslint-disable-next-line react/sort-comp
  static amountRegex = /^[0-9]*\.?[0-9]{0,3}$/;

  static minAccountLength = 3;
  static maxAccountLength = 16;
  static exchangeRegex = /^(bittrex|blocktrades|poloniex|changelly|openledge|shapeshiftio|deepcrypto8)$/;
  static CURRENCIES = {
    STEEM: 'STEEM',
    SBD: 'SBD',
  };

  state = {
    currency: Transfer.CURRENCIES.STEEM,
    oldAmount: undefined,
  };

  componentDidMount() {
    const { cryptosPriceHistory } = this.props;
    const currentSteemRate = get(cryptosPriceHistory, 'STEEM.priceDetails.currentUSDPrice', null);
    const currentSBDRate = get(cryptosPriceHistory, 'SBD.priceDetails.currentUSDPrice', null);

    if (isNull(currentSteemRate)) {
      this.props.getCryptoPriceHistory(STEEM.symbol);
    }

    if (isNull(currentSBDRate)) {
      this.props.getCryptoPriceHistory(SBD.symbol);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { form, to, amount, currency } = this.props;
    if (to !== nextProps.to || amount !== nextProps.amount || currency !== nextProps.currency) {
      form.setFieldsValue({
        to: nextProps.to,
        amount: nextProps.amount,
        currency: nextProps.currency === 'STEEM' ? STEEM.symbol : SBD.symbol,
      });
      this.setState({
        currency: STEEM.symbol,
      });
    }
  }

  getUSDValue() {
    const { cryptosPriceHistory, intl } = this.props;
    const { currency, oldAmount } = this.state;
    const currentSteemRate = get(cryptosPriceHistory, 'STEEM.priceDetails.currentUSDPrice', null);
    const currentSBDRate = get(cryptosPriceHistory, 'SBD.priceDetails.currentUSDPrice', null);
    const steemRateLoading = isNull(currentSteemRate) || isNull(currentSBDRate);
    const parsedAmount = parseFloat(oldAmount);
    const invalidAmount = parsedAmount <= 0 || isNaN(parsedAmount);
    let amount = 0;

    if (steemRateLoading || invalidAmount) return '';

    if (currency === STEEM.symbol) {
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
    const { form, isGuest, memo } = this.props;
    form.validateFields({ force: true }, (errors, values) => {
      if (!errors) {
        const transferQuery = {
          amount: `${parseFloat(values.amount).toFixed(3)} ${values.currency}`,
        };

        if (values.to.startsWith(GUEST_PREFIX)) {
          transferQuery.to = BANK_ACCOUNT;
          transferQuery.memo = memo
            ? { id: memo, to: values.to }
            : { id: 'user_to_guest_transfer', to: values.to };
          if (values.memo) transferQuery.memo.message = values.memo;
          transferQuery.memo = JSON.stringify(transferQuery.memo);
        } else {
          transferQuery.to = values.to;
          if (memo) {
            transferQuery.memo = { id: memo };
            if (values.memo) transferQuery.memo.message = values.memo;
            transferQuery.memo = JSON.stringify(transferQuery.memo);
          }
          if (values.memo) transferQuery.memo = values.memo;
        }

        if (isGuest) {
          sendGuestTransfer(transferQuery).then(res => {
            if (res.ok) {
              this.props.notify('Successful transaction', 'success');
            } else {
              this.props.notify('Transaction failed', 'error');
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

  handleAmountChange = event => {
    const { value } = event.target;
    const { oldAmount } = this.state;

    this.setState({
      oldAmount: Transfer.amountRegex.test(value) ? value : oldAmount,
    });
    this.props.form.setFieldsValue({
      amount: Transfer.amountRegex.test(value) ? value : oldAmount,
    });
    this.props.form.validateFields(['amount']);
  };

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
    const guestName = value.startsWith(GUEST_PREFIX);
    this.props.form.validateFields(['memo'], { force: true });

    if (!value) {
      callback();
      return;
    }

    if (value.length < Transfer.minAccountLength) {
      callback([
        new Error(
          intl.formatMessage(
            {
              id: 'username_too_short',
              defaultMessage: 'Username {username} is too short.',
            },
            {
              username: value,
            },
          ),
        ),
      ]);
      return;
    }
    if (
      (guestName && value.length > Transfer.maxGuestAccountLength) ||
      (!guestName && value.length > Transfer.maxAccountLength)
    ) {
      callback([
        new Error(
          intl.formatMessage(
            {
              id: 'username_too_long',
              defaultMessage: 'Username {username} is too long.',
            },
            {
              username: value,
            },
          ),
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
      this.state.currency === Transfer.CURRENCIES.STEEM ? user.balance : user.sbd_balance;

    if (authenticated && currentValue !== 0 && currentValue > parseFloat(selectedBalance)) {
      callback([
        new Error(
          intl.formatMessage({ id: 'amount_error_funds', defaultMessage: 'Insufficient funds.' }),
        ),
      ]);
    } else {
      callback();
    }
  };

  render() {
    const { intl, visible, authenticated, user, memo, screenSize, isGuest } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const isMobile = screenSize.includes('xsmall') || screenSize.includes('small');
    const to = getFieldValue('to');
    const guestName = to && to.startsWith(GUEST_PREFIX);

    const balance =
      this.state.currency === Transfer.CURRENCIES.STEEM ? user.balance : user.sbd_balance;
    const isChangesDisabled = !!memo;

    const currencyPrefix = getFieldDecorator('currency', {
      initialValue: this.state.currency,
    })(
      <Radio.Group
        disabled={isChangesDisabled}
        onChange={this.handleCurrencyChange}
        className="Transfer__amount__type"
      >
        <Radio.Button value={Transfer.CURRENCIES.STEEM} className="Transfer__amount__type-steem">
          {Transfer.CURRENCIES.STEEM}
        </Radio.Button>
        <Radio.Button
          value={Transfer.CURRENCIES.SBD}
          className="Transfer__amount__type-sbd"
          disabled={isGuest}
        >
          {Transfer.CURRENCIES.SBD}
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
              <Input
                disabled={isChangesDisabled}
                type="text"
                placeholder={intl.formatMessage({
                  id: 'to_placeholder',
                  defaultMessage: 'Payment recipient',
                })}
              />,
            )}
          </Form.Item>
          {(guestName || isGuest) && (
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
              {isMobile ? (
                <Input disabled className="Transfer__usd-value" placeholder={usdValue} />
              ) : (
                <Input
                  disabled
                  className="Transfer__usd-value"
                  addonAfter={currencyPrefix}
                  placeholder={usdValue}
                />
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
                      {balance}
                    </span>
                  ),
                }}
              />
            )}
          </Form.Item>
          <Form.Item label={<FormattedMessage id="memo" defaultMessage="Memo" />}>
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
        <FormattedMessage
          id="transfer_modal_info"
          defaultMessage="Click the button below to be redirected to SteemConnect to complete your transaction."
        />
      </Modal>
    );
  }
}
