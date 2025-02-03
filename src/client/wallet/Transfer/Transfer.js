import Cookie from 'js-cookie';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { get, isNull, isEmpty, includes, isString, uniqWith } from 'lodash';
import { Form, Input, Modal, Select } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { getCryptoPriceHistory } from '../../../store/appStore/appActions';
import {
  closeTransfer,
  getUserTokensBalanceList,
  sendPendingTransfer,
} from '../../../store/walletStore/walletActions';
import { notify } from '../../app/Notification/notificationActions';
import { sendGuestTransfer } from '../../../waivioApi/ApiClient';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
import { BANK_ACCOUNT } from '../../../common/constants/waivio';
import { guestUserRegex } from '../../../common/helpers/regexHelpers';
import Avatar from '../../components/Avatar';
import USDDisplay from '../../components/Utils/USDDisplay';
import { guestTransferId } from '../../../common/constants/rewards';
import LinkHiveAccountModal from '../../settings/LinkHiveAccountModal';
import {
  saveSettings,
  openLinkHiveAccountModal,
} from '../../../store/settingsStore/settingsActions';
import { createQuery } from '../../../common/helpers/apiHelpers';
import { getScreenSize } from '../../../store/appStore/appSelectors';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getIsAuthenticated,
  isGuestUser,
} from '../../../store/authStore/authSelectors';
import {
  getCurrentWalletType,
  getIsTransferVisible,
  getIsVipTickets,
  getIsToSavings,
  getIsFromSavings,
  getTokensBalanceListForTransfer,
  getTotalVestingFundSteem,
  getTotalVestingShares,
  getTransferAmount,
  getTransferApp,
  getTransferCurrency,
  getTransferIsTip,
  getTransferMemo,
  getTransferTo,
  getUserCurrencyBalance,
} from '../../../store/walletStore/walletSelectors';
import {
  getHiveBeneficiaryAccount,
  isOpenLinkModal,
} from '../../../store/settingsStore/settingsSelectors';
import { getSearchUsersResults } from '../../../store/searchStore/searchSelectors';
import { fixedNumber } from '../../../common/helpers/parser';
import { sendGuestTransferWAIV } from '../../../waivioApi/walletApi';
import { getRatesList } from '../../../store/ratesStore/ratesSelector';
import { getUser } from '../../../store/usersStore/usersSelectors';
import api from '../../steemConnectAPI';

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
    isTip: getTransferIsTip(state),
    authenticated: getIsAuthenticated(state),
    user: {
      ...getAuthenticatedUser(state),
      ...getUser(state, getAuthenticatedUserName(state)),
    },
    screenSize: getScreenSize(state),
    isGuest: isGuestUser(state),
    searchByUser: getSearchUsersResults(state),
    totalVestingShares: getTotalVestingShares(state),
    totalVestingFundSteem: getTotalVestingFundSteem(state),
    hiveBeneficiaryAccount: getHiveBeneficiaryAccount(state),
    isVipTickets: getIsVipTickets(state),
    isToSavings: getIsToSavings(state),
    isFromSavings: getIsFromSavings(state),
    showModal: isOpenLinkModal(state),
    tokensList: getTokensBalanceListForTransfer(state),
    walletType: getCurrentWalletType(state),
    WAIVinfo: getUserCurrencyBalance(state, 'WAIV'),
    rates: getRatesList(state),
  }),
  {
    closeTransfer,
    getCryptoPriceHistory,
    notify,
    saveSettings,
    openLinkHiveAccountModal,
    sendPendingTransfer,
    getUserTokensBalanceList,
  },
)
@Form.create()
export default class Transfer extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    visible: PropTypes.bool,
    manageWebsites: PropTypes.bool,
    to: PropTypes.string,
    rates: PropTypes.number,
    authenticated: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    tokensList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    WAIVinfo: PropTypes.shape({
      balance: PropTypes.string,
    }).isRequired,
    getCryptoPriceHistory: PropTypes.func.isRequired,
    getUserTokensBalanceList: PropTypes.func.isRequired,
    closeTransfer: PropTypes.func,
    amount: PropTypes.number,
    currency: PropTypes.string,
    memo: PropTypes.string,
    app: PropTypes.string,
    isGuest: PropTypes.bool,
    isToSavings: PropTypes.bool,
    isFromSavings: PropTypes.bool,
    notify: PropTypes.func,
    hiveBeneficiaryAccount: PropTypes.string,
    saveSettings: PropTypes.func.isRequired,
    openLinkHiveAccountModal: PropTypes.func.isRequired,
    sendPendingTransfer: PropTypes.func.isRequired,
    getPayables: PropTypes.func,
    match: PropTypes.shape().isRequired,
    isTip: PropTypes.bool.isRequired,
    walletType: PropTypes.string.isRequired,
    isVipTickets: PropTypes.bool,
    sendTo: PropTypes.string,
    title: PropTypes.string,
    permlink: PropTypes.string,
  };

  static defaultProps = {
    to: '',
    visible: false,
    isVipTickets: false,
    amount: 0,
    memo: '',
    app: '',
    currency: '',
    closeTransfer: () => {},
    screenSize: 'large',
    isGuest: false,
    notify: () => {},
    searchByUser: [],
    hiveBeneficiaryAccount: '',
    getPayables: () => {},
    isTip: false,
    sendTo: '',
    title: '',
    permlink: '',
    waiting: false,
  };

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
    this.state = {
      currency: this.props.currency,
      balance: parseFloat(this.props.user.balance),
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
  }

  componentDidMount() {
    const {
      getCryptoPriceHistory: getCryptoPriceHistoryAction,
      to,
      amount,
      sendTo,
      permlink,
      title,
      rates,
    } = this.props;
    const currentHiveRate = rates.HIVE;
    const currentHBDRate = rates.HBD;

    if (isNull(currentHiveRate) || isNull(currentHBDRate)) getCryptoPriceHistoryAction();
    this.props.form.setFieldsValue({
      to,
      amount,
    });

    this.props.form.setFieldsValue({
      memo: sendTo ? `${title} - https://www.waivio.com/@${sendTo}/${permlink}` : null,
    });
    this.props.getUserTokensBalanceList(this.props.user.name);
  }

  componentWillReceiveProps(nextProps) {
    const { form, to, amount, currency, user } = this.props;

    if (!this.props.visible) {
      this.setState({
        searchBarValue: '',
        dropdownOpen: false,
        currentEstimate: null,
        isSelected: false,
        isClosedFind: false,
        balance: parseFloat(user.balance),
      });
    }

    if (to !== nextProps.to || amount !== nextProps.amount || currency !== nextProps.currency) {
      form.setFieldsValue({
        to: nextProps.to,
        amount: nextProps.amount,
      });

      this.setState({ currency: nextProps.currency });
    }
  }

  getFraction = currency => {
    const currToken = this.props.tokensList.find(token => token.symbol === currency);

    // if (currToken?.balance < 0.001) return 3;

    return currToken?.precision ?? 3;
  };

  getTokensBalanceList = () => {
    const hiveEngineList = this.props.tokensList.reduce((acc, curr) => {
      acc[curr.symbol] = curr.balance;

      return acc;
    }, {});

    return {
      HIVE: parseFloat(this.props.user.balance),
      ...(this.props.isGuest
        ? { WAIV: this.props.user?.waivBalance || 0 }
        : { HBD: parseFloat(this.props.user.hbd_balance) }),
      ...hiveEngineList,
    };
  };

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

  handleSwitchCurrency = () => {
    this.setState({
      currentEstimate: this.estimatedValue(this.state.inputValue),
    });
  };

  handleBalanceClick = event => {
    const value = event.currentTarget.innerText.split(' ')[1];

    this.props.form.setFieldsValue({ amount: value });
    this.setState({
      searchBarValue: value,
      currentEstimate: this.estimatedValue(value),
    });
  };

  handleClickMax = () => {
    const currAmount = this.getTokensBalanceList()[this.state.currency];
    const currentBalance = this.props.isFromSavings
      ? parseFloat(this.props.user.savings_balance)
      : currAmount;

    this.props.form.setFieldsValue({ amount: currentBalance });
    this.setState({
      searchBarValue: currentBalance,
      currentEstimate: this.estimatedValue(currentBalance),
    });
  };

  handleCurrencyChange = event => {
    const { form } = this.props;

    this.setState({ currency: event }, () =>
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
      isTip,
      isToSavings,
      isFromSavings,
    } = this.props;
    const matchPath = get(match, ['params', '0']);
    const params = ['payables', 'receivables'];
    const sponsor = user.name;
    const transactionId = uuidv4();
    const userName = to;
    const overpaymentRefund = includes(memo, 'overpayment_refund');
    const hiveAuth = Cookie.get('auth');

    form.validateFields({ force: true }, (errors, values) => {
      if (!errors) {
        const transferQuery = {
          amount: `${fixedNumber(parseFloat(values.amount), 3)} ${values.currency}`,
          memo,
        };

        if (isFromSavings) transferQuery.request_id = Date.now();

        if (guestUserRegex.test(values.to)) {
          transferQuery.to = BANK_ACCOUNT;
          transferQuery.memo = {
            ...(transferQuery.memo || { id: guestTransferId[this.state.currency]?.guestTransfer }),
            to: values.to,
          };
        } else {
          transferQuery.to = values.to;
          if (values.memo) transferQuery.memo = values.memo;
        }

        if (app) transferQuery.memo = { ...(transferQuery.memo || {}), app };
        if (app && overpaymentRefund && isGuest) transferQuery.app = app;
        if (isTip) transferQuery.memo = memo;

        if (!isString(transferQuery.memo)) transferQuery.memo = JSON.stringify(transferQuery.memo);
        const isHiveCurrency = Object.keys(Transfer.CURRENCIES).includes(this.state.currency);
        let contractAction = 'transfer';

        if (isToSavings) contractAction = 'transfer_to_savings';
        if (isFromSavings) contractAction = 'transfer_from_savings';
        const json = JSON.stringify({
          contractName: 'tokens',
          contractAction,
          contractPayload: {
            symbol: this.state.currency,
            to: transferQuery.to,
            memo: transferQuery.memo,
            quantity: fixedNumber(
              parseFloat(values.amount),
              this.getFraction(this.state.currency),
            ).toString(),
          },
        });

        if (hiveAuth) {
          const brodc = () =>
            isHiveCurrency
              ? api.broadcast([['transfer', { ...transferQuery, from: user.name }]], null, 'active')
              : api.broadcast(
                  [
                    [
                      'custom_json',
                      {
                        required_auths: [user.name],
                        required_posting_auths: [],
                        id: 'ssc-mainnet-hive',
                        json,
                      },
                    ],
                  ],
                  null,
                  'active',
                );

          this.setState({ waiting: true });

          brodc().then(() => {
            this.setState({ waiting: false });
            this.props.closeTransfer();
          });
        } else {
          if (isGuest) {
            const isHive = Object.keys(Transfer.CURRENCIES).includes(this.state.currency);
            const transferMethod = isHive ? sendGuestTransfer : sendGuestTransferWAIV;

            transferMethod({
              ...transferQuery,
              amount: isHive ? transferQuery.amount : +values.amount,
              account: sponsor,
              id: this.props.manageWebsites ? 'websitesPaymentGuest' : 'transferFromGuest',
            }).then(res => {
              if (res.result || res.id) {
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
            const transferMethod = isHiveCurrency
              ? window &&
                window.open(
                  `https://hivesigner.com/sign/${contractAction}?${createQuery(transferQuery)}`,
                  '_blank',
                )
              : window &&
                window.open(
                  `https://hivesigner.com/sign/custom_json?authority=active&required_auths=["${
                    user.name
                  }"]&required_posting_auths=[]&${createQuery({
                    id: 'ssc-mainnet-hive',
                    json,
                  })}`,
                  '_blank',
                );

            transferMethod.focus();
          }

          if (includes(params, matchPath)) {
            sendPendingTransferAction({ sponsor, userName, amount, transactionId, memo });
            setTimeout(() => getPayables(), 1000);
          }
          this.props.closeTransfer();
        }
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
    const { intl, authenticated } = this.props;
    const currentValue = fixedNumber(parseFloat(value), this.getFraction(this.state.currency));

    if (value <= 0) {
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

    const selectedBalance = this.getTokensBalanceList()[this.state.currency];

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

  showSelectedUser = () => {
    const { user, to, hiveBeneficiaryAccount, isGuest, form, amount, match } = this.props;
    const { searchName } = this.state;
    const userName = isEmpty(searchName) ? to : searchName;
    const isCurrentUser = user.name === match.params.name;
    const guestWithBeneficiary = isGuest && hiveBeneficiaryAccount;
    const account = guestWithBeneficiary && !this.props.to ? hiveBeneficiaryAccount : userName;

    if (guestWithBeneficiary && !form.getFieldValue('to') && !this.props.to) {
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
        {!guestWithBeneficiary && !amount && isCurrentUser && !to && (
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

  estimatedValue = amount => {
    const hiveRateInUsd = this.props?.rates?.HIVE;

    if (Object.keys(Transfer.CURRENCIES).includes(this.state.currency)) {
      const currRate = this.state.currency === 'HIVE' ? hiveRateInUsd : this.props?.rates?.HBD;

      return currRate * amount;
    }

    return this.props.rates[this.state.currency] * amount * hiveRateInUsd;
  };

  handleAmountChange = event => {
    const { value } = event.target;

    this.setState({
      inputValue: value,
      currentEstimate: this.estimatedValue(value),
    });

    this.props.form.setFieldsValue({
      amount: value,
    });
    this.props.form.validateFields(['amount']);
  };

  handleCloseLinkHiveAccountModal = () => {
    this.props.openLinkHiveAccountModal(false);
    this.props.closeTransfer();
  };

  render() {
    const {
      intl,
      visible,
      authenticated,
      user,
      memo,
      isGuest,
      amount,
      hiveBeneficiaryAccount,
      isTip,
      sendTo,
      isToSavings,
      isFromSavings,
    } = this.props;
    const { isSelected, searchBarValue, isClosedFind } = this.state;
    const { getFieldDecorator, getFieldValue, resetFields } = this.props.form;
    const currAmount = this.getTokensBalanceList()[this.state.currency];
    let userBalances = [
      { symbol: 'HIVE', balance: parseFloat(user.balance) },
      { symbol: 'HBD', balance: parseFloat(user.hbd_balance) },
    ];
    const savingsTransactions = isToSavings || isFromSavings;
    const isChangesDisabled = (!!memo && this.props.amount) || this.props.isVipTickets;
    const isChangesDisabledToken = !!memo || this.props.amount || this.props.isVipTickets;
    const amountClassList = classNames('balance', {
      'balance--disabled': isChangesDisabled,
    });
    const maxClassList = classNames('TokenSelect__max-button', {
      'max-btn--disabled': isChangesDisabled,
    });
    const to = !searchBarValue && isClosedFind ? resetFields('to') : getFieldValue('to');
    const guestName = to && guestUserRegex.test(to);
    const currentBalance = isFromSavings ? parseFloat(user.savings_balance) : currAmount;

    const memoPlaceHolder = isTip
      ? get(memo, 'message', memo)
      : intl.formatMessage({
          id: 'memo_placeholder',
          defaultMessage: 'Additional message to include in this payment (optional)',
        });

    if (isGuest || guestName) {
      userBalances = [
        { symbol: 'HIVE', balance: parseFloat(user.balance) },
        {
          symbol: 'WAIV',
          balance: +this.props.user?.waivBalance || 0,
        },
      ];
    }

    if (!isEmpty(this.props.tokensList) && !isGuest && !guestName) {
      userBalances = uniqWith([...userBalances, ...this.props.tokensList], 'symbol').sort(
        (a, b) => {
          if (a.symbol === 'WAIV') return -1;
          if (b.symbol === 'WAIV') return 1;
          if (!b.balance || !a.balance) return a.symbol > b.symbol ? 1 : -1;

          return b.balance - a.balance;
        },
      );
    }
    const currencies = savingsTransactions
      ? userBalances?.filter(i => i.symbol === 'HIVE')
      : userBalances;

    const amountRegex = /^[0-9]*\.?[0-9]{0,8}$/;
    const amountRegexHiveHbdHp = /^[0-9]*\.?[0-9]{0,3}$/;
    const hbdHiveCurrency =
      Transfer.CURRENCIES.HBD === this.state.currency ||
      Transfer.CURRENCIES.HIVE === this.state.currency;
    const validationPattern = hbdHiveCurrency ? amountRegexHiveHbdHp : amountRegex;
    const numberOfCharacters = hbdHiveCurrency ? 3 : 8;
    let title = intl.formatMessage({
      id: 'transfer_modal_title',
      defaultMessage: 'Transfer funds',
    });

    if (savingsTransactions) {
      title = intl.formatMessage({
        id: isToSavings ? 'transfer_to_saving' : 'transfer_from_savings_title',
        defaultMessage: isToSavings ? 'Deposit to Savings' : 'Transfer from savings',
      });
    }

    return (isGuest && (this.props.to || hiveBeneficiaryAccount)) || !isGuest ? (
      <Modal
        visible={visible}
        title={title}
        okText={intl.formatMessage({ id: 'continue', defaultMessage: 'Continue' })}
        cancelText={intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
        okButtonProps={{
          loading: this.state.waiting,
        }}
        onOk={this.handleContinueClick}
        onCancel={this.handleCancelClick}
        wrapClassName="Transfer__wrapper"
      >
        <Form className="Transfer" hideRequiredMark>
          {!savingsTransactions && (
            <Form.Item label={<FormattedMessage id="to" defaultMessage="To" />}>
              {getFieldDecorator('to', {
                initialValue: to,
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
          )}
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
                initialValue: amount,
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
                    pattern: validationPattern,
                    message: intl.formatMessage(
                      {
                        id: 'amount_error_format_places',
                        defaultMessage:
                          'Incorrect format. Use comma or dot as decimal separator. Use at most {numberOfCharacters} decimal places.',
                      },
                      { numberOfCharacters },
                    ),
                  },
                  { validator: this.validateBalance },
                ],
              })(
                <Input
                  autocomplete="off"
                  className="Transfer__border"
                  disabled={isChangesDisabled && amount}
                  onChange={this.handleAmountChange}
                  placeholder={intl.formatMessage({
                    id: 'amount_placeholder',
                    defaultMessage: 'How much do you want to send',
                  })}
                  suffix={
                    <span
                      className={maxClassList}
                      onClick={!isChangesDisabled && this.handleClickMax}
                    >
                      <FormattedMessage id="max" defaultMessage="max" />
                    </span>
                  }
                />,
              )}
              {getFieldDecorator('currency', {
                initialValue: this.state.currency || this.props.walletType,
              })(
                <Select
                  className="Transfer__currency"
                  onChange={this.handleCurrencyChange}
                  disabled={isChangesDisabledToken || (this.props.manageWebsites && isGuest)}
                  dropdownClassName={'Transfer__currency-list'}
                >
                  {currencies.map(token => (
                    <Select.Option
                      key={token.symbol}
                      onClick={() => {
                        this.setState({
                          balance: token.balance,
                          balanceInHive: token.balance * token.rate,
                        });
                      }}
                      className="Transfer__currency-item"
                    >
                      <span>{token.symbol}</span>
                      <span className="Transfer__currency-balance">
                        {savingsTransactions
                          ? `${currentBalance} ${this.state.currency}`
                          : fixedNumber(token.balance)}
                      </span>
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </InputGroup>
          </Form.Item>
          <div className={'Transfer__info-text'}>
            {authenticated && (
              <React.Fragment>
                <FormattedMessage id="balance_amount" defaultMessage="Your balance" />:
                <span
                  role="presentation"
                  onClick={e => {
                    if (!isChangesDisabled) this.handleBalanceClick(e);
                  }}
                  className={amountClassList}
                >
                  {' '}
                  {currentBalance} {this.state.currency}
                </span>
              </React.Fragment>
            )}
          </div>
          {!savingsTransactions && (
            <div className={'Transfer__info-text'}>
              <FormattedMessage
                id="estimated_value"
                defaultMessage="Estimated transaction value: {estimate}"
                values={{
                  estimate: (
                    <span role="presentation" className="estimate">
                      <USDDisplay
                        value={amount ? this.estimatedValue(amount) : this.state.currentEstimate}
                      />
                    </span>
                  ),
                }}
              />
            </div>
          )}
          {!savingsTransactions && (
            <Form.Item
              label={<FormattedMessage id="memo_optional" defaultMessage="Memo (optional)" />}
            >
              {memo ? (
                <div className="Transfer__memo">
                  {typeof memo === 'object' ? JSON.stringify(memo) : memo}
                </div>
              ) : (
                getFieldDecorator('memo', {
                  rules: [{ validator: this.validateMemo }],
                })(
                  <Input.TextArea
                    disabled={sendTo || isChangesDisabled || (this.props.manageWebsites && isGuest)}
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    placeHolder={memoPlaceHolder}
                  />,
                )
              )}
            </Form.Item>
          )}
          {savingsTransactions && (
            <div>
              <b>Notice:</b>
              <p className={'Transfer__info-text bold'}>
                Please note that the deposit to the savings account is instant, whereas the
                withdrawal from the savings account takes 3 days.
              </p>
              <p className={'Transfer__info-text bold'}>
                {' '}
                Hive witnesses offers 20% APR interest on HBD deposits in Savings. Interest is paid
                on deposits that are more than 30 days old. Interest is calculated and paid at the
                time of withdrawal from Savings.
              </p>
            </div>
          )}
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
        handleClose={this.handleCloseLinkHiveAccountModal}
        showModal={visible}
        hiveBeneficiaryAccount={this.state.hiveBeneficiaryAccount}
      />
    );
  }
}
