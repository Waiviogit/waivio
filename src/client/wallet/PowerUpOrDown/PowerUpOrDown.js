import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Input, Modal, Select } from 'antd';
import { round } from 'lodash';
import { closePowerUpOrDown } from '../../../store/walletStore/walletActions';
import formatter from '../../helpers/steemitFormatter';
import { createQuery } from '../../helpers/apiHelpers';
import { getAuthenticatedUser } from '../../../store/authStore/authSelectors';
import {
  getCurrentWalletType,
  getIsPowerDown,
  getIsPowerUpOrDownVisible,
  getTotalVestingFundSteem,
  getTotalVestingShares,
} from '../../../store/walletStore/walletSelectors';

import './PowerUpOrDown.less';

@injectIntl
@connect(
  state => ({
    visible: getIsPowerUpOrDownVisible(state),
    user: getAuthenticatedUser(state),
    totalVestingShares: getTotalVestingShares(state),
    totalVestingFundSteem: getTotalVestingFundSteem(state),
    down: getIsPowerDown(state),
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
    visible: PropTypes.bool.isRequired,
    closePowerUpOrDown: PropTypes.func.isRequired,
    user: PropTypes.shape().isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    down: PropTypes.bool.isRequired,
    walletType: PropTypes.string.isRequired,
  };

  static amountRegex = /^[0-9]*\.?[0-9]{0,3}$/;

  state = {
    oldAmount: undefined,
    currency: this.props.walletType,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.down !== this.props.down) {
      this.props.form.setFieldsValue({
        amount: '',
      });
    }
  }

  getAvailableBalance = () => {
    const { user, down, totalVestingShares, totalVestingFundSteem } = this.props;

    return down
      ? formatter.vestToSteem(
          parseFloat(user.vesting_shares) - parseFloat(user.delegated_vesting_shares),
          totalVestingShares,
          totalVestingFundSteem,
        )
      : parseFloat(user.balance);
  };

  handleBalanceClick = event => {
    const value = parseFloat(event.currentTarget.innerText);

    this.setState({
      oldAmount: value,
    });
    this.props.form.setFieldsValue({
      amount: value,
    });
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

        const win = window.open(
          `https://hivesigner.com/sign/${
            down ? 'withdraw-vesting' : 'transfer-to-vesting'
          }?${createQuery(transferQuery)}`,
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
    const { oldAmount } = this.state;

    this.setState({
      oldAmount: PowerUpOrDown.amountRegex.test(value) ? value : oldAmount,
    });
    this.props.form.setFieldsValue({
      amount: PowerUpOrDown.amountRegex.test(value) ? value : oldAmount,
    });
    this.props.form.validateFields(['amount']);
  };

  validateBalance = (rule, value, callback) => {
    const { intl } = this.props;

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

    if (currentValue !== 0 && currentValue > this.getAvailableBalance()) {
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
        <Form className="PowerUpOrDown" hideRequiredMark>
          <Form.Item label={<FormattedMessage id="amount" defaultMessage="Amount" />}>
            <div className="PowerUpOrDown__row">
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
                    pattern: PowerUpOrDown.amountRegex,
                    message: intl.formatMessage({
                      id: 'amount_error_format',
                      defaultMessage:
                        'Incorrect format. Use comma or dot as decimal separator. Use at most 3 decimal places.',
                    }),
                  },
                  { validator: this.validateBalance },
                ],
              })(<Input onChange={this.handleAmountChange} className="PowerUpOrDown__amount" />)}
              {getFieldDecorator('currency', {
                // rules: [],
                initialValue: this.props.walletType,
              })(
                <Select
                  className="PowerUpOrDown__currency"
                  onChange={currency => this.setState({ currency })}
                >
                  {['HIVE', 'WAIV'].map(token => (
                    <Select.Option key={token}>
                      <span>{token}</span>
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </div>
          </Form.Item>
        </Form>
        <FormattedMessage id="balance_amount" defaultMessage="Your balance" />:{' '}
        <span role="presentation" onClick={this.handleBalanceClick} className="balance">
          {Math.floor(this.getAvailableBalance())} {down ? 'HP' : this.state.currency}
        </span>
        {/*<FormattedMessage*/}
        {/*  id="transfer_modal_info"*/}
        {/*  defaultMessage="Click the button below to be redirected to SteemConnect to complete your transaction."*/}
        {/*/>*/}
      </Modal>
    );
  }
}
