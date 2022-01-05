import { Input, Select } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';

const TokensSelect = props => {
  const setUserBalance = () => props.handleClickBalance(get(props.token, 'balance', 0));

  return (
    <React.Fragment>
      <div className={props.inputWrapClassList}>
        <Input
          value={props.amount}
          placeholder={'0'}
          onChange={e => props.handleChangeValue(e.currentTarget.value)}
          type="number"
          className="SwapTokens__input"
          suffix={
            <span className="SwapTokens__max-button" onClick={setUserBalance}>
              max
            </span>
          }
        />
        <Select
          className="SwapTokens__selector"
          showSearch
          value={props.token.symbol}
          disabled={isEmpty(props.list)}
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
      {props.isError && <p className="invalid">Insufficient funds.</p>}{' '}
      <p>
        Your balance:{' '}
        <span className="SwapTokens__balance" onClick={setUserBalance}>
          {get(props.token, 'balance', 0)} {get(props.token, 'symbol')}
        </span>
      </p>
    </React.Fragment>
  );
};

TokensSelect.propTypes = {
  handleChangeValue: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
  handleClickBalance: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  inputWrapClassList: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  token: PropTypes.shape({
    symbol: PropTypes.string,
  }).isRequired,
  isError: PropTypes.bool,
};

TokensSelect.defaultProps = {
  isError: false,
  list: [],
};

export default TokensSelect;
