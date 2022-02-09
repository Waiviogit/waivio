import { Button, Select } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import {
  openPowerUpOrDown,
  openTransfer,
  toggleDepositModal,
} from '../../../../store/walletStore/walletActions';
import {
  setDepositeSymbol,
  toggleWithdrawModal,
} from '../../../../store/depositeWithdrawStore/depositeWithdrawAction';

import './WalletActions.less';

const WalletAction = props => {
  const dispatch = useDispatch();
  const withoutOptions = isEmpty(props.options);
  const classListButton = classNames('WalletAction__button', {
    'WalletAction__button--withoutSelect': withoutOptions,
  });
  const classListSelect = classNames('WalletAction__select', {
    'WalletAction__select--withoutButton': !props.mainKey,
  });

  const config = {
    power_up: () => dispatch(openPowerUpOrDown()),
    power_down: () => dispatch(openPowerUpOrDown(false)),
    transfer: () => dispatch(openTransfer('', 0, props.mainCurrency)),
    swap: () => dispatch(toggleDepositModal(true)),
    withdraw: () => dispatch(toggleWithdrawModal(true)),
  };

  return (
    <div className="WalletAction">
      {props.mainKey && (
        <Button className={classListButton} onClick={config[props.mainKey]}>
          {props.intl.formatMessage({ id: props.mainKey })}
        </Button>
      )}
      {!withoutOptions && (
        <Select
          className={classListSelect}
          value={null}
          dropdownClassName="WalletAction__select-dropdown"
          onSelect={key => {
            if (key.includes('convert')) {
              dispatch(toggleDepositModal(true));
              dispatch(setDepositeSymbol(props.mainCurrency));
            } else {
              config[key]();
            }
          }}
        >
          {props.options.map(opt => {
            if (opt === 'convert') return null;

            return <Select.Option key={opt}>{props.intl.formatMessage({ id: opt })}</Select.Option>;
          })}
          {!isEmpty(props.swapCurrencyOptions) &&
            props.swapCurrencyOptions.map(cyrrency => (
              <Select.Option key={`convert:${cyrrency}`}>
                {props.intl.formatMessage({ id: 'convert' })} {cyrrency}
              </Select.Option>
            ))}
        </Select>
      )}
    </div>
  );
};

WalletAction.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  mainKey: PropTypes.string.isRequired,
  mainCurrency: PropTypes.string.isRequired,
  swapCurrencyOptions: PropTypes.arrayOf(PropTypes.string),
  options: PropTypes.arrayOf(PropTypes.string),
};

WalletAction.defaultProps = {
  swapCurrencyOptions: [],
  options: [],
};

export default injectIntl(WalletAction);
