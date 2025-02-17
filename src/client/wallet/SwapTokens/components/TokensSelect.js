import { Input, Select } from 'antd';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get, isEmpty, round } from 'lodash';
import classNames from 'classnames';
import './TokenSelect.less';

const TokensSelect = props => {
  const { customClassSelect } = props;
  const balance = props.token?.balance || 0;
  const presicion = balance > 0.001 ? 3 : 6;
  const inputWrapClassList = classNames('TokenSelect__inputWrap', {
    'TokenSelect__inputWrap--error': props.isError,
    'TokenSelect__inputWrap--disabled': props.disabled,
  });
  const selectClassList = classNames('TokenSelect__selector', {
    ...(customClassSelect && { [customClassSelect]: true }),
  });

  const balanceClassList = classNames('TokenSelect__balance', {
    'TokenSelect__balance--disabled': props.disabled,
  });

  const maxButtonClassList = classNames('TokenSelect__max-button', {
    'TokenSelect__max-button--disabled': props.disabled,
  });

  const setUserBalance = () => {
    if (!props.disabled) props.handleClickBalance(balance);
  };

  return (
    <>
      <div className={inputWrapClassList}>
        <Input
          value={props.amount}
          placeholder={'0'}
          onChange={e => props.handleChangeValue(e.currentTarget.value)}
          type="number"
          className="TokenSelect__input"
          suffix={
            props.hideMax ? null : (
              <span className={maxButtonClassList} onClick={setUserBalance}>
                <FormattedMessage id="max" defaultMessage="max" />
              </span>
            )
          }
          disabled={props.disabled}
        />
        <Select
          loading={props.isLoading}
          className={selectClassList}
          showSearch
          value={props.token?.symbol}
          disabled={isEmpty(props.list) || props.disabled || props.disabledSelect}
          filterOption={(input, option) => option.key.toLowerCase().includes(input.toLowerCase())}
        >
          {props.list.map(swap => (
            <Select.Option
              className="TokenSelect__selector-option"
              onClick={() => props.setToken(swap)}
              key={swap.title || swap.symbol}
            >
              <span>{swap.title || swap.symbol}</span>
              <span className="TokenSelect__selector-balance">
                {!swap.title && round(swap.balance, presicion)}
              </span>
            </Select.Option>
          ))}
        </Select>
      </div>
      {props.isError && <p className="TokenSelect__invalid">Insufficient funds.</p>}{' '}
      {props.addErrorHiveWithdraw && balance < 0.001 && (
        <p className="TokenSelect__invalid"> Your balance is less than 0.001 HIVE.</p>
      )}{' '}
      {!props.hideBalance && (
        <p>
          <FormattedMessage id="your_balance" defaultMessage="Your balance" />:{' '}
          {!isEmpty(props.token) && (
            <span className={balanceClassList} onClick={setUserBalance}>
              {balance} {get(props.token, 'symbol')}
            </span>
          )}
        </p>
      )}
    </>
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
  hideMax: PropTypes.bool,
  hideBalance: PropTypes.bool,
  isLoading: PropTypes.bool,
  disabledSelect: PropTypes.bool,
  addErrorHiveWithdraw: PropTypes.bool,
  customClassSelect: PropTypes.string,
};

TokensSelect.defaultProps = {
  isError: false,
  addErrorHiveWithdraw: false,
  list: [],
  isLoading: false,
  hideBalance: false,
  hideMax: false,
  disableBalance: false,
  disableBtnMax: false,
  disabledSelect: false,
  customClassSelect: '',
};

export default TokensSelect;
