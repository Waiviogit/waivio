import { Input, Select, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { round } from 'lodash';
import { useSelector } from 'react-redux';
import { getRatesList } from '../../../../store/ratesStore/ratesSelector';
import USDDisplay from '../../../components/Utils/USDDisplay';

import './PowerSwitcher.less';

const powerToCurrency = {
  WP: 'WAIV',
  // HP: 'HIVE',
};

const PowerSwitcher = props => {
  const [currency, setCurrency] = useState(props.defaultType);
  const rates = useSelector(getRatesList);
  const convertCurrency = curr => (curr === 'WAIV' && props.powerVote ? 'WP' : curr);
  const hbdHiveHpCurrency = currency === 'HBD' || currency === 'HIVE' || currency === 'HP';
  const amountRegex = /^[0-9]*\.?[0-9]{0,8}$/;
  const amountRegexHiveHbdHp = /^[0-9]*\.?[0-9]{0,3}$/;
  const validationPattern = hbdHiveHpCurrency ? amountRegexHiveHbdHp : amountRegex;
  const numberOfCharacters = hbdHiveHpCurrency ? 3 : 8;

  useEffect(() => {
    if (props.onAmoundValidate) props.onAmoundValidate();
  }, [currency]);

  const validateBalance = (rule, value, callback) => {
    const { intl } = props;
    const currentValue = parseFloat(value);

    if (value && currentValue <= 0) {
      callback([
        new Error(
          intl.formatMessage({
            id: 'amount_error_zero',
          }),
        ),
      ]);

      return;
    }

    if (currentValue !== 0 && currentValue > props.currencyList[currency]) {
      callback([new Error(intl.formatMessage({ id: 'amount_error_funds' }))]);
    } else {
      callback();
    }
  };

  return (
    <React.Fragment>
      <Form.Item className="PowerSwitcher__row">
        {props.getFieldDecorator('amount', {
          initialValue: round(props.defaultAmount, 3) || 0,
          rules: [
            {
              required: true,
              message: props.intl.formatMessage({
                id: 'amount_error_empty',
              }),
            },
            {
              pattern: validationPattern,
              message: props.intl.formatMessage(
                {
                  id: 'amount_error_format_places',
                },
                { numberOfCharacters },
              ),
            },
            { validator: validateBalance },
          ],
        })(
          <Input
            onChange={e => {
              if (props.handleAmountChange) props.handleAmountChange(e);
            }}
            type="number"
            className={
              props.powerUpOrDown ? 'PowerSwitcher__up-down-amount' : 'PowerSwitcher__amount'
            }
            suffix={
              <span
                className="PowerSwitcher__max-button"
                onClick={() =>
                  props.handleBalanceClick(props.currencyList[convertCurrency(currency)])
                }
              >
                <FormattedMessage id="max" defaultMessage="max" />
              </span>
            }
          />,
        )}
        {props.getFieldDecorator('currency', {
          initialValue: convertCurrency(props.defaultType),
        })(
          <Select
            className="PowerSwitcher__currency"
            disabled={props.selestDisable}
            onChange={key => setCurrency(key)}
          >
            {Object.entries(props.currencyList).map(token => {
              if (!token[1]) return null;

              return (
                <Select.Option key={token[0]} className="PowerSwitcher__options">
                  <span>{token[0]}</span>
                  <span className="PowerSwitcher__currency-balance">
                    {round(convertCurrency(token[1]), 3)}
                  </span>
                </Select.Option>
              );
            })}
          </Select>,
        )}
      </Form.Item>
      <FormattedMessage id="balance_amount" defaultMessage="Your balance" />:{' '}
      <span
        role="presentation"
        onClick={() => props.handleBalanceClick(props.currencyList[convertCurrency(currency)])}
        className="PowerSwitcher__current-currency-balance"
      >
        {props.currencyList[convertCurrency(currency)]} {convertCurrency(currency)}
      </span>
      {props.withEst && (
        <div>
          <FormattedMessage id="est_amount" defaultMessage="Est. amount" />:{' '}
          <USDDisplay
            value={
              props.getFieldValue('amount') *
              rates.HIVE *
              (['HIVE', 'HP'].includes(currency)
                ? 1
                : rates[powerToCurrency[currency] || currency] || 1)
            }
          />
        </div>
      )}
    </React.Fragment>
  );
};

PowerSwitcher.propTypes = {
  intl: PropTypes.shape().isRequired,
  defaultType: PropTypes.string.isRequired,
  defaultAmount: PropTypes.number.isRequired,
  currencyList: PropTypes.shape().isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldValue: PropTypes.func.isRequired,
  withEst: PropTypes.bool.isRequired,
  selestDisable: PropTypes.bool,
  powerUpOrDown: PropTypes.bool,
  powerVote: PropTypes.bool,
  handleBalanceClick: PropTypes.func.isRequired,
  handleAmountChange: PropTypes.func.isRequired,
  onAmoundValidate: PropTypes.func.isRequired,
};

PowerSwitcher.defaultProps = {
  powerVote: false,
  selestDisable: false,
  powerUpOrDown: false,
};

export default injectIntl(PowerSwitcher);
