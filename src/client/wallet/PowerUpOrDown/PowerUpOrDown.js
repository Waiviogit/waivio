import Cookie from 'js-cookie';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Modal } from 'antd';
import { round } from 'lodash';
import { closePowerUpOrDown } from '../../../store/walletStore/walletActions';
import formatter from '../../../common/helpers/steemitFormatter';
import { createQuery } from '../../../common/helpers/apiHelpers';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
} from '../../../store/authStore/authSelectors';
import {
  getCurrentWalletType,
  getIsPowerDown,
  getIsPowerUpOrDownVisible,
  getTokenRatesInUSD,
  getTokensBalanceListForTransfer,
  getTotalVestingFundSteem,
  getTotalVestingShares,
  getUserCurrencyBalance,
} from '../../../store/walletStore/walletSelectors';
import api from '../../steemConnectAPI';
import PowerSwitcher from './PowerSwitcher/PowerSwitcher';

import './PowerUpOrDown.less';
import { getUser } from '../../../store/usersStore/usersSelectors';

@injectIntl
@connect(
  state => ({
    visible: getIsPowerUpOrDownVisible(state),
    user: {
      ...getAuthenticatedUser(state),
      ...getUser(state, getAuthenticatedUserName(state)),
    },
    totalVestingShares: getTotalVestingShares(state),
    totalVestingFundSteem: getTotalVestingFundSteem(state),
    down: getIsPowerDown(state),
    waivCurrencyInfo: getUserCurrencyBalance(state, 'WAIV'),
    tokensList: getTokensBalanceListForTransfer(state),
    rates: getTokenRatesInUSD(state, 'WAIV'),
    walletType: getCurrentWalletType(state),
  }),
  {
    closePowerUpOrDown,
  },
)
@Form.create()
export default class PowerUpOrDown extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    waivCurrencyInfo: PropTypes.shape({
      stake: PropTypes.string,
      balance: PropTypes.string,
    }).isRequired,
    tokensList: PropTypes.arrayOf(
      PropTypes.shape({
        stake: PropTypes.string,
        balance: PropTypes.string,
      }),
    ).isRequired,
    visible: PropTypes.bool.isRequired,
    closePowerUpOrDown: PropTypes.func.isRequired,
    user: PropTypes.shape().isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    walletType: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    down: PropTypes.bool.isRequired,
  };

  state = {
    disabled: true,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.down !== this.props.down) {
      this.props.form.setFieldsValue({
        amount: '',
      });
    }
  }

  handleBalanceClick = balance => {
    this.props.form.setFieldsValue({ amount: balance });
    this.setState({ disabled: false });
  };

  stakinTokensList = key =>
    this.props.tokensList.reduce((acc, curr) => {
      if (curr.stakingEnabled && +curr[key] && curr.symbol !== 'WAIV') {
        return {
          ...acc,
          [curr.symbol]: curr[key],
        };
      }

      return acc;
    }, {});

  handleContinueClick = () => {
    const { form, user, down, totalVestingShares, totalVestingFundSteem } = this.props;

    form.validateFields({ force: true }, (errors, values) => {
      const hiveAuth = Cookie.get('auth');
      const isHiveCurrency = ['HIVE', 'HP'].includes(values.currency);
      const vests = round(
        values.amount / formatter.vestToSteem(1, totalVestingShares, totalVestingFundSteem),
        6,
      );

      if (!errors) {
        const transferQuery = down
          ? {
              account: user.name,
              vesting_shares: `${vests} VESTS`,
            }
          : {
              amount: `${parseFloat(values.amount).toFixed(3)} HIVE`,
              to: user.name,
              from: user.name,
            };

        const operatin = down ? 'withdraw-vesting' : 'transfer-to-vesting';
        const json = JSON.stringify({
          contractName: 'tokens',
          contractAction: down ? 'unstake' : 'stake',
          contractPayload: {
            symbol: values.currency === 'WP' ? 'WAIV' : values.currency,
            to: user.name,
            quantity: parseFloat(values.amount).toString(),
          },
        });

        if (hiveAuth) {
          const brodc = () =>
            isHiveCurrency
              ? api.broadcast(
                  [[down ? 'withdraw_vesting' : 'transfer_to_vesting', { ...transferQuery }]],
                  null,
                  'active',
                )
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
            this.props.closePowerUpOrDown();
          });
        } else {
          const win = isHiveCurrency
            ? window &&
              window.open(
                `https://hivesigner.com/sign/${operatin}?${createQuery(transferQuery)}`,
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

          win.focus();
          this.props.closePowerUpOrDown();
        }
      }
    });
  };

  handleCancelClick = () => this.props.closePowerUpOrDown();

  validateAmount = () => {
    this.props.form.validateFields(['amount'], err => {
      this.setState({ disabled: Boolean(err) });
    });
  };

  handleAmountChange = event => {
    const { value } = event.target;

    this.props.form.setFieldsValue({ amount: value });
    this.validateAmount(value);
  };

  currencyList = () => {
    if (this.props.down) {
      return {
        WP: this.props.waivCurrencyInfo?.stake,
        HP: round(
          formatter.vestToSteem(
            parseFloat(this.props.user.vesting_shares) -
              parseFloat(this.props.user.delegated_vesting_shares),
            this.props.totalVestingShares,
            this.props.totalVestingFundSteem,
          ),
          3,
        ),
        ...this.stakinTokensList('stake'),
      };
    }

    return {
      WAIV: this.props.waivCurrencyInfo?.balance,
      HIVE: round(parseFloat(this.props.user.balance), 3),
      ...this.stakinTokensList('balance'),
    };
  };

  defaultCurrency = () => {
    if (this.props.down) {
      const powerNames = {
        HIVE: 'HP',
        WAIV: 'WP',
      };

      return powerNames[this.props.walletType] || powerNames.WAIV;
    }

    return this.props.walletType === 'ENGINE' || this.props.walletType === 'rebalancing'
      ? 'WAIV'
      : this.props.walletType;
  };

  render() {
    const { intl, visible, down } = this.props;

    const { getFieldDecorator } = this.props.form;
    const title = !down
      ? intl.formatMessage({ id: 'power_up', defaultMessage: 'Power up' })
      : intl.formatMessage({ id: 'power_down', defaultMessage: 'Power down' });

    return (
      <Modal
        visible={visible}
        title={title}
        okText={intl.formatMessage({ id: 'continue', defaultMessage: 'Continue' })}
        cancelText={intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
        onOk={this.handleContinueClick}
        onCancel={this.handleCancelClick}
        okButtonProps={{
          disabled: this.state.disabled,
          loading: this.state.waiting,
        }}
        wrapClassName="PowerSwitcher__wrapper"
      >
        {visible && (
          <Form className="PowerUpOrDown" hideRequiredMark>
            <Form.Item label={<FormattedMessage id="amount" defaultMessage="Amount" />}>
              <PowerSwitcher
                powerUpOrDown
                onChange={this.validateAmount}
                handleAmountChange={this.handleAmountChange}
                handleBalanceClick={this.handleBalanceClick}
                getFieldDecorator={getFieldDecorator}
                currencyList={this.currencyList()}
                defaultType={this.defaultCurrency()}
                onAmoundValidate={this.validateAmount}
                powerVote={down}
              />
            </Form.Item>
          </Form>
        )}
        <div className="PowerUpOrDown__notice">
          <h4>
            <FormattedMessage id="notice" defaultMessage="Notice" />:
          </h4>
          <FormattedMessage
            id="power_up_or_down_info_part1"
            defaultMessage="Please note that Power Up (staking) is instant, while Power Down (unstaking) takes time"
          />
          :
          <ul>
            <li>
              {' '}
              -{' '}
              <FormattedMessage
                id="waiv_power_info"
                defaultMessage="4 weeks for Waiv Power (WP);"
              />{' '}
            </li>
            <li>
              {' '}
              -{' '}
              <FormattedMessage
                id="hive_power_info"
                defaultMessage="13 weeks for Hive Power (HP)."
              />{' '}
            </li>
          </ul>
          <FormattedMessage
            id="power_up_or_down_info_part2"
            defaultMessage=" Staked funds are released each week for the specified period in equal amounts."
          />
        </div>
        <FormattedMessage id="transfer_modal_info" />
      </Modal>
    );
  }
}
