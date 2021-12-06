import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Modal } from 'antd';
import { round } from 'lodash';
import { closePowerUpOrDown } from '../../../store/walletStore/walletActions';
import formatter from '../../helpers/steemitFormatter';
import { createQuery } from '../../helpers/apiHelpers';
import { getAuthenticatedUser } from '../../../store/authStore/authSelectors';
import {
  getCurrentWalletType,
  getIsPowerDown,
  getIsPowerUpOrDownVisible,
  getTokenRatesInUSD,
  getTotalVestingFundSteem,
  getTotalVestingShares,
  getUserCurrencyBalance,
} from '../../../store/walletStore/walletSelectors';
import PowerDown from './PowerDown';

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
    visible: PropTypes.bool.isRequired,
    closePowerUpOrDown: PropTypes.func.isRequired,
    user: PropTypes.shape().isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    walletType: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    down: PropTypes.bool.isRequired,
  };

  static amountRegex = /^[0-9]*\.?[0-9]{0,3}$/;

  state = {
    oldAmount: undefined,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.down !== this.props.down) {
      this.props.form.setFieldsValue({
        amount: '',
      });
    }
  }

  handleBalanceClick = balance => {
    this.setState({ oldAmount: balance });
    this.props.form.setFieldsValue({ amount: balance });
  };

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
              amount: `${round(parseFloat(values.amount), 3)} HIVE`,
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
                    symbol: this.props.walletType,
                    to: user.name,
                    quantity: round(parseFloat(values.amount), 3).toString(),
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

  handleAmountChange = event => {
    const { value } = event.target;

    this.props.form.setFieldsValue({ amount: value });
    this.props.form.validateFields(['amount']);
  };

  currencyList = () => {
    if (this.props.down) {
      return {
        HP: round(
          formatter.vestToSteem(
            parseFloat(this.props.user.vesting_shares) -
              parseFloat(this.props.user.delegated_vesting_shares),
            this.props.totalVestingShares,
            this.props.totalVestingFundSteem,
          ),
          3,
        ),
        WP: round(this.props.waivCurrencyInfo.stake, 3),
      };
    }

    return {
      HIVE: round(parseFloat(this.props.user.balance), 3),
      WAIV: round(this.props.waivCurrencyInfo.balance, 3),
    };
  };

  defaultCurrency = () => {
    if (this.props.down) {
      const powerNames = {
        HIVE: 'HP',
        WAIV: 'WP',
      };

      return powerNames[this.props.walletType];
    }

    return this.props.walletType;
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
      >
        {visible && (
          <Form className="PowerUpOrDown" hideRequiredMark>
            <Form.Item label={<FormattedMessage id="amount" defaultMessage="Amount" />}>
              <PowerDown
                handleAmountChange={this.handleAmountChange}
                handleBalanceClick={this.handleBalanceClick}
                getFieldDecorator={getFieldDecorator}
                currencyList={this.currencyList()}
                defaultType={this.defaultCurrency()}
              />
            </Form.Item>
          </Form>
        )}
        <div>
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
