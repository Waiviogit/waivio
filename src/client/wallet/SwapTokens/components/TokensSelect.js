import { Select } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

const TokensSelect = props => (
  <div className={props.inputWrapClassList}>
    <input
      value={props.amount}
      onChange={e => props.handleChangeValue(e.currentTarget.value)}
      type="number"
      className="SwapTokens__input"
    />
    <Select
      className="SwapTokens__selector"
      showSearch
      value={props.symbol}
      filterOption={(input, option) => option.key.toLowerCase().includes(input.toLowerCase())}
    >
      {props.list.map(swap => (
        <Select.Option
          className="SwapTokens__selector-option"
          onClick={() => props.setToken(swap)}
          key={swap.symbol}
        >
          <span>{swap.symbol}</span>
          <span className="SwapTokens__selector-balance">{swap.balance}</span>
        </Select.Option>
      ))}
    </Select>
  </div>
);

TokensSelect.propTypes = {
  handleChangeValue: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  inputWrapClassList: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
};

export default TokensSelect;
