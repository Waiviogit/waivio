import { Input, Select } from 'antd';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get, isEmpty, round } from 'lodash';
import classNames from 'classnames';
import './TokenSelect.less';

const TokensSelect = props => {
  const balance = props.token?.balance || 0;
  const presicion = balance > 0.001 ? 3 : 6;
  const inputWrapClassList = classNames('TokenSelect__inputWrap', {
    'TokenSelect__inputWrap--error': props.isError,
    'TokenSelect__inputWrap--disabled': props.disabled,
  });

  const setUserBalance = () => {
    if (!props.disabled) props.handleClickBalance(balance);
  };

  return (
    <React.Fragment>
      <div className={inputWrapClassList}>
        <Input
          value={props.amount}
          placeholder={'0'}
          onChange={e => props.handleChangeValue(e.currentTarget.value)}
          type="number"
          className="TokenSelect__input"
          suffix={
            <span className="TokenSelect__max-button" onClick={setUserBalance}>
              <FormattedMessage id="max" defaultMessage="max" />
            </span>
          }
          disabled={props.disabled}
        />
        <Select
          className="TokenSelect__selector"
          showSearch
          value={props.token?.symbol}
          disabled={isEmpty(props.list) || props.disabled}
          filterOption={(input, option) => option.key.toLowerCase().includes(input.toLowerCase())}
        >
          {props.list.map(swap => (
            <Select.Option
              className="TokenSelect__selector-option"
              onClick={() => props.setToken(swap)}
              key={swap.symbol}
            >
              <span>{swap.symbol}</span>
              <span className="TokenSelect__selector-balance">
                {round(swap.balance, presicion)}
              </span>
            </Select.Option>
          ))}
        </Select>
      </div>
      {props.isError && <p className="TokenSelect__invalid">Insufficient funds.</p>}{' '}
      <p>
        <FormattedMessage id="your_balance" defaultMessage="Your balance" />:{' '}
        {!isEmpty(props.token) && (
          <span className="TokenSelect__balance" onClick={setUserBalance}>
            {balance} {get(props.token, 'symbol')}
          </span>
        )}
      </p>
    </React.Fragment>
  );
};

TokensSelect.propTypes = {
  handleChangeValue: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  handleClickBalance: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  amount: PropTypes.number.isRequired,
  token: PropTypes.shape({
    symbol: PropTypes.string,
    balance: PropTypes.string,
  }).isRequired,
  isError: PropTypes.bool,
};

TokensSelect.defaultProps = {
  isError: false,
  list: [],
};

export default TokensSelect;
