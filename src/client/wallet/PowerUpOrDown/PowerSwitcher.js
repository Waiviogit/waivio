import { Input, Select, Form } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

const PowerSwitcher = props => {
  const [currency, setCurrency] = useState(props.defaultType);
  const amountRegex = /^[0-9]*\.?[0-9]{0,3}$/;

  const validateBalance = (rule, value, callback) => {
    const { intl } = props;

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

    if (currentValue !== 0 && currentValue > props.currencyList[currency]) {
      callback([
        new Error(
          intl.formatMessage({ id: 'amount_error_funds', defaultMessage: 'Insufficient funds.' }),
        ),
      ]);
    } else {
      callback();
    }
  };

  return (
    <React.Fragment>
      <Form.Item className="PowerUpOrDown__row">
        {props.getFieldDecorator('amount', {
          initialValue: 0,
          rules: [
            {
              required: true,
              message: props.intl.formatMessage({
                id: 'amount_error_empty',
                defaultMessage: 'Amount is required.',
              }),
            },
            {
              pattern: amountRegex,
              message: props.intl.formatMessage({
                id: 'amount_error_format',
                defaultMessage:
                  'Incorrect format. Use comma or dot as decimal separator. Use at most 3 decimal places.',
              }),
            },
            { validator: validateBalance },
          ],
        })(<Input onChange={props.handleAmountChange} className="PowerUpOrDown__amount" />)}
        {props.getFieldDecorator('currency', {
          initialValue: props.defaultType,
        })(
          <Select className="PowerUpOrDown__currency" onChange={key => setCurrency(key)}>
            {Object.entries(props.currencyList).map(token => (
              <Select.Option key={token[0]} className="PowerUpOrDown__options">
                <span>{token[0]}</span>
                <span className="PowerUpOrDown__currency-balance">{token[1]}</span>
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <FormattedMessage id="balance_amount" defaultMessage="Your balance" />:{' '}
      <span
        role="presentation"
        onClick={() => props.handleBalanceClick(props.currencyList[currency])}
        className="PowerUpOrDown__current-currency-balance"
      >
        {props.currencyList[currency]} {currency}
      </span>
    </React.Fragment>
  );
};

PowerSwitcher.propTypes = {
  intl: PropTypes.shape().isRequired,
  defaultType: PropTypes.string.isRequired,
  currencyList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  handleBalanceClick: PropTypes.func.isRequired,
  handleAmountChange: PropTypes.func.isRequired,
};

export default injectIntl(PowerSwitcher);
