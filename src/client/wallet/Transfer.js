import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import classNames from 'classnames';
import { get, isNull, isEmpty, debounce, size, map, forEach } from 'lodash';
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
  getTransferTo,
  isGuestUser,
  getAutoCompleteSearchResults,
  getSearchUsersResults,
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
import listOfObjectTypes from '../../common/constants/listOfObjectTypes';
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
    autoCompleteSearchResults: getAutoCompleteSearchResults(state),
    searchByUser: getSearchUsersResults(state),
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
    screenSize: PropTypes.string,
    isGuest: PropTypes.bool,
    notify: PropTypes.func,
    searchAutoComplete: PropTypes.func.isRequired,
    searchObjectsAutoCompete: PropTypes.func.isRequired,
    searchUsersAutoCompete: PropTypes.func.isRequired,
    searchObjectTypesAutoCompete: PropTypes.func.isRequired,
    resetSearchAutoCompete: PropTypes.func.isRequired,
    autoCompleteSearchResults: PropTypes.oneOfType([
      PropTypes.shape(),
      PropTypes.arrayOf(PropTypes.shape()),
    ]),
    searchByUser: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    to: '',
    visible: false,
    amount: 0,
    memo: '',
    currency: 'HIVE',
    closeTransfer: () => {},
    screenSize: 'large',
    isGuest: false,
    notify: () => {},
    autoCompleteSearchResults: {},
    searchByUser: [],
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
    WOBJ: 'wobj',
    TYPE: 'type',
    SELECT_BAR: 'searchSelectBar',
  };

  constructor(props) {
    super(props);

    this.handleAutoCompleteSearch = this.handleAutoCompleteSearch.bind(this);
    this.handleSelectOnAutoCompleteDropdown = this.handleSelectOnAutoCompleteDropdown.bind(this);
    this.handleOnChangeForAutoComplete = this.handleOnChangeForAutoComplete.bind(this);
    this.hideAutoCompleteDropdown = this.hideAutoCompleteDropdown.bind(this);
  }

  state = {
    currency: Transfer.CURRENCIES.HIVE,
    oldAmount: undefined,
    searchBarValue: '',
    searchData: '',
    currentItem: 'All',
    dropdownOpen: false,
  };

  componentDidMount() {
    const { cryptosPriceHistory, getCryptoPriceHistory: getCryptoPriceHistoryAction } = this.props;
    const currentHiveRate = get(cryptosPriceHistory, 'HIVE.priceDetails.currentUSDPrice', null);
    const currentHBDRate = get(cryptosPriceHistory, 'HBD.priceDetails.currentUSDPrice', null);

    if (isNull(currentHiveRate) || isNull(currentHBDRate))
      getCryptoPriceHistoryAction([HIVE.coinGeckoId, HBD.coinGeckoId]);
  }

  componentWillReceiveProps(nextProps) {
    const { form, to, amount, currency } = this.props;
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

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.searchBarValue !== this.state.searchBarValue &&
      this.state.searchBarValue !== ''
    ) {
      this.debouncedSearchByUser(this.state.searchBarValue);
      this.debouncedSearchByObjectTypes(this.state.searchBarValue);
    }
  }

  debouncedSearch = debounce(value => this.props.searchAutoComplete(value, 3, 15), 300);

  debouncedSearchByObject = debounce((searchString, objType) =>
    this.props.searchObjectsAutoCompete(searchString, objType),
  );

  debouncedSearchByUser = debounce(searchString => this.props.searchUsersAutoCompete(searchString));

  debouncedSearchByObjectTypes = debounce(searchString =>
    this.props.searchObjectTypesAutoCompete(searchString),
  );

  handleAutoCompleteSearch(value) {
    this.debouncedSearch(value);
    this.setState({ dropdownOpen: true });
  }

  handleSelectOnAutoCompleteDropdown(value, data) {
    if (data.props.marker === Transfer.markers.SELECT_BAR) {
      const optionValue = value.split('#')[1];

      if (value === `${Transfer.markers.SELECT_BAR}#All`) {
        this.setState({
          searchData: '',
          dropdownOpen: true,
          currentItem: optionValue,
        });

        return;
      }
      const nextState = {
        searchData: {
          subtype: optionValue,
          type: data.props.type,
        },
        dropdownOpen: true,
        currentItem: optionValue,
      };

      if (data.props.type === 'wobject') {
        this.setState(nextState);
        this.debouncedSearchByObject(this.state.searchBarValue, optionValue);

        return;
      }

      if (data.props.type === 'user' || data.props.type === 'type') {
        this.setState(nextState);

        return;
      }
    }
    // eslint-disable-next-line no-unused-vars
    let redirectUrl = '';

    switch (data.props.marker) {
      case Transfer.markers.USER:
        redirectUrl = `/@${value.replace('user', '')}`;
        break;
      case Transfer.markers.WOBJ:
        redirectUrl = `/object/${value.replace('wobj', '')}`;
        break;
      default:
        redirectUrl = `/discover-objects/${value.replace('type', '')}`;
    }

    // this.props.history.push(redirectUrl);
    this.setState({ dropdownOpen: false });
    this.hideAutoCompleteDropdown();
  }

  hideAutoCompleteDropdown() {
    this.setState({ searchBarActive: false }, this.props.resetSearchAutoCompete);
  }

  handleOnChangeForAutoComplete(value, data) {
    if (!value) {
      this.setState({
        searchBarValue: '',
        searchData: '',
        currentItem: '',
      });
    }

    if (value[0] === '@') {
      this.setState({
        searchBarValue: value,
        searchData: {
          subtype: 'Users',
          type: 'user',
        },
        currentItem: 'Users',
      });
    } else if (
      data.props.marker === Transfer.markers.TYPE ||
      data.props.marker === Transfer.markers.USER ||
      data.props.marker === Transfer.markers.WOBJ
    )
      this.setState({ searchBarValue: '' });
    else if (data.props.marker !== Transfer.markers.SELECT_BAR) {
      this.setState({ searchBarValue: value, searchData: '', currentItem: 'All' });
    }
  }

  usersSearchLayout(accounts) {
    return (
      <AutoComplete.OptGroup
        key="usersTitle"
        label={this.renderTitle(
          this.props.intl.formatMessage({
            id: 'users_search_title',
            defaultMessage: 'Users',
          }),
          size(accounts),
        )}
      >
        {map(
          accounts,
          option =>
            option && (
              <AutoComplete.Option
                marker={Transfer.markers.USER}
                key={option.account}
                value={option.account}
                className="Topnav__search-autocomplete"
              >
                <div className="Topnav__search-content-wrap">
                  <Avatar username={option.account} size={40} />
                  <div className="Topnav__search-content">{option.account}</div>
                </div>
              </AutoComplete.Option>
            ),
        )}
      </AutoComplete.OptGroup>
    );
  }

  prepareOptions(searchResults) {
    const { searchData } = this.state;
    const { searchByUser } = this.props;
    const dataSource = [];

    if (!isEmpty(searchResults)) {
      dataSource.push(this.searchSelectBar(searchResults));
    }
    if (!searchData) {
      if (!isEmpty(searchResults.users))
        dataSource.push(this.usersSearchLayout(searchResults.users));
    } else if (searchData.type === 'user') {
      dataSource.push(this.usersSearchLayout(searchByUser.slice(0, 15)));
    }

    return dataSource;
  }

  searchSelectBar = searchResults => {
    const options = this.getTranformSearchCountData(searchResults);

    return (
      <AutoComplete.OptGroup key={Transfer.markers.SELECT_BAR} label=" ">
        {map(options, option => (
          <AutoComplete.Option
            marker={Transfer.markers.SELECT_BAR}
            key={`type${option.name}`}
            value={`${Transfer.markers.SELECT_BAR}#${option.name}`}
            type={option.type}
            className={this.changeItemClass(option.name)}
          >
            {`${option.name}(${option.count})`}
          </AutoComplete.Option>
        ))}
      </AutoComplete.OptGroup>
    );
  };

  renderTitle = title => <span>{title}</span>;

  getTranformSearchCountData = searchResults => {
    const { objectTypesCount, wobjectsCounts, usersCount } = searchResults;

    const wobjectAllCount = wobjectsCounts
      ? wobjectsCounts.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0)
      : null;
    const countAllSearch = objectTypesCount + usersCount + wobjectAllCount;
    const countArr = [{ name: 'All', count: countAllSearch }];

    if (!isEmpty(wobjectsCounts)) {
      const wobjList = listOfObjectTypes.reduce((acc, i) => {
        const index = wobjectsCounts.findIndex(obj => obj.object_type === i);

        if (index >= 0) {
          acc.push(wobjectsCounts[index]);
        }

        return acc;
      }, []);

      forEach(wobjList, current => {
        const obj = {};

        obj.name = current.object_type;
        obj.count = current.count;
        obj.type = 'wobject';
        countArr.push(obj);
      });
    }
    if (usersCount) {
      countArr.push({ name: 'Users', count: usersCount, type: 'user' });
    }
  };

  changeItemClass = key =>
    classNames('ant-select-dropdown-menu-item', {
      'Topnav__search-selected-active': this.state.currentItem === key,
    });

  handleSearchAllResultsClick = () => {
    const { searchData, searchBarValue } = this.state;

    this.handleOnBlur();
    let redirectUrl = '';

    switch (searchData.type) {
      case 'wobject':
        redirectUrl = `/discover-objects/${searchData.subtype}?search=${searchBarValue}`;
        break;
      case 'user':
        redirectUrl = `/discover/${searchBarValue.replace('@', '')}`;
        break;
      case 'type':
      default:
        redirectUrl = `/discover-objects?search=${searchBarValue}`;
        break;
    }
    return redirectUrl;
  };

  handleOnBlur = () => {
    this.setState({
      dropdownOpen: false,
    });
  };

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
    const { form, isGuest, memo } = this.props;
    form.validateFields({ force: true }, (errors, values) => {
      if (!errors) {
        const transferQuery = {
          amount: `${parseFloat(values.amount).toFixed(3)} ${values.currency}`,
        };

        if (guestUserRegex.test(values.to)) {
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
    const guestName = guestUserRegex.test(value);
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

  render() {
    const {
      intl,
      visible,
      authenticated,
      user,
      memo,
      screenSize,
      isGuest,
      autoCompleteSearchResults,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const isMobile = screenSize.includes('xsmall') || screenSize.includes('small');
    const to = getFieldValue('to');
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

    const dropdownOptions = this.prepareOptions(autoCompleteSearchResults);

    const downBar = (
      <AutoComplete.Option disabled key="all" className="Topnav__search-all-results">
        <div
          className="search-btn"
          onClick={this.handleSearchAllResultsClick}
          role="presentation"
          title={this.state.searchBarValue.length > 60 ? this.state.searchBarValue : ''}
        />
      </AutoComplete.Option>
    );

    const formattedAutoCompleteDropdown = isEmpty(dropdownOptions)
      ? dropdownOptions
      : dropdownOptions.concat([downBar]);

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
              <AutoComplete
                dropdownClassName="Transfer__search-dropdown-container"
                dataSource={formattedAutoCompleteDropdown}
                onSearch={this.handleAutoCompleteSearch}
                onSelect={this.handleSelectOnAutoCompleteDropdown}
                onChange={this.handleOnChangeForAutoComplete}
                defaultActiveFirstOption={false}
                dropdownMatchSelectWidth={false}
                optionLabelProp="value"
                dropdownStyle={{ color: 'red' }}
                value={this.state.searchBarValue}
                open={this.state.dropdownOpen}
                onFocus={this.handleOnFocus}
                placeholder={intl.formatMessage({
                  id: 'to_placeholder',
                  defaultMessage: 'Payment recipient',
                })}
              />,
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
                      {currentBalance}
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
