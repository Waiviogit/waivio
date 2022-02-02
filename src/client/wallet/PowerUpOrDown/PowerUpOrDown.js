import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Modal } from 'antd';
import { round } from 'lodash';
import { closePowerUpOrDown } from '../../../store/walletStore/walletActions';
import formatter from '../../../common/helpers/steemitFormatter';
import { createQuery } from '../../../common/helpers/apiHelpers';
import { getAuthenticatedUser } from '../../../store/authStore/authSelectors';
import {
  getCurrentWalletType,
  getIsPowerDown,
  getIsPowerUpOrDownVisible,
  getTokenRatesInUSD,
  getTokensBalanceList,
  getTotalVestingFundSteem,
  getTotalVestingShares,
  getUserCurrencyBalance,
} from '../../../store/walletStore/walletSelectors';
import PowerSwitcher from './PowerSwitcher';

import './PowerUpOrDown.less';

@injectIntl
@connect(
  state => ({
    visible: getIsPowerUpOrDownVisible(state),
    user: getAuthenticatedUser(state),
    totalVestingShares: getTotalVestingShares(state),
    totalVestingFundSteem: getTotalVestingFundSteem(state),
    down: getIsPowerDown(state),
    waivCurrencyInfo: getUserCurrencyBalance(state, 'WAIV'),
    tokensList: getTokensBalanceList(state),
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

  handleBalanceClick = balance => this.props.form.setFieldsValue({ amount: balance });

  stakinTokensList = key =>
    this.props.tokensList.reduce((acc, curr) => {
      if ((curr.stakingEnabled && +curr[key]) || curr.symbol === 'WAIV') {
        return {
          ...acc,
          [curr.symbol]: round(curr[key], 5),
        };
      }

      return acc;
    }, {});

  handleContinueClick = () => {
    const { form, user, down, totalVestingShares, totalVestingFundSteem } = this.props;

    form.validateFields({ force: true }, (errors, values) => {
      const vests = round(
        values.amount / formatter.vestToSteem(1, totalVestingShares, totalVestingFundSteem),
        6,
      );

      if (!errors) {
        const transferQuery = down
          ? {
              vesting_shares: `${vests} VESTS`,
            }
          : {
              amount: `${round(parseFloat(values.amount), 5)} HIVE`,
              to: user.name,
            };

        const win = ['HIVE', 'HP'].includes(values.currency)
          ? window.open(
              `https://hivesigner.com/sign/${
                down ? 'withdraw-vesting' : 'transfer-to-vesting'
              }?${createQuery(transferQuery)}`,
              '_blank',
            )
          : window.open(
              `https://hivesigner.com/sign/custom_json?authority=active&required_auths=["${
                user.name
              }"]&required_posting_auths=[]&${createQuery({
                id: 'ssc-mainnet-hive',
                json: JSON.stringify({
                  contractName: 'tokens',
                  contractAction: down ? 'unstake' : 'stake',
                  contractPayload: {
                    symbol: values.currency,
                    to: user.name,
                    quantity: round(parseFloat(values.amount), 5).toString(),
                  },
                }),
              })}`,
              '_blank',
            );

        win.focus();
        this.props.closePowerUpOrDown();
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
        WP: round(this.props.waivCurrencyInfo.stake, 3),
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
      WAIV: round(this.props.waivCurrencyInfo.balance, 3),
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

    return this.props.walletType === 'ENGINE' ? 'WAIV' : this.props.walletType;
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
        }}
      >
        {visible && (
          <Form className="PowerUpOrDown" hideRequiredMark>
            <Form.Item label={<FormattedMessage id="amount" defaultMessage="Amount" />}>
              <PowerSwitcher
                handleAmountChange={this.handleAmountChange}
                handleBalanceClick={this.handleBalanceClick}
                getFieldDecorator={getFieldDecorator}
                currencyList={this.currencyList()}
                defaultType={this.defaultCurrency()}
                onAmoundValidate={this.validateAmount}
              />
            </Form.Item>
          </Form>
        )}
        <div className="PowerUpOrDown__notice">
          <h4>Notice:</h4>
          Please note that Power Up (staking) is instant, while Power Down (unstaking) takes time:
          <ul>
            <li> - 4 weeks for Waiv Power (WP);</li>
            <li> - 13 weeks for Hive Power (HP).</li>
          </ul>
          Staked funds are released each week for the specified period in equal amounts.
        </div>
        <FormattedMessage id="transfer_modal_info" />
      </Modal>
    );
  }
}
