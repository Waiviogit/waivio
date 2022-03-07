import { Input, Select } from 'antd';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';
import classNames from 'classnames';
import './TokenSelect.less';

const TokensSelect = props => {
  const inputWrapClassList = classNames('TokenSelect__inputWrap', {
    'TokenSelect__inputWrap--error': props.isError,
  });
  const setUserBalance = () => props.handleClickBalance(get(props.token, 'balance', 0));

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
        />
        <Select
          className="TokenSelect__selector"
          showSearch
          value={get(props.token, 'symbol', '')}
          disabled={isEmpty(props.list)}
          filterOption={(input, option) => option.key.toLowerCase().includes(input.toLowerCase())}
        >
          {props.list.map(swap => (
            <Select.Option
              className="TokenSelect__selector-option"
              onClick={() => props.setToken(swap)}
              key={swap.symbol}
            >
              <span>{swap.symbol}</span>
              <span className="TokenSelect__selector-balance">{swap.balance}</span>
            </Select.Option>
          ))}
        </Select>
      </div>
      {props.isError && <p className="TokenSelect__invalid">Insufficient funds.</p>}{' '}
      <p>
        <FormattedMessage id="your_balance" defaultMessage="Your balance" />:{' '}
        {!isEmpty(props.token) && (
          <span className="TokenSelect__balance" onClick={setUserBalance}>
            {get(props.token, 'balance', 0)} {get(props.token, 'symbol')}
          </span>
        )}
      </p>
    </React.Fragment>
  );
};

TokensSelect.propTypes = {
  handleChangeValue: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
  handleClickBalance: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape()).isRequired,
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
