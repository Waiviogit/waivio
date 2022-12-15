import { Button, Dropdown, Icon, Menu } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';

import {
  openPowerUpOrDown,
  openTransfer,
  openWithdraw,
  toggleDelegateModal,
  toggleDepositModal,
} from '../../../../../store/walletStore/walletActions';
import {
  setDepositeSymbol,
  toggleWithdrawModal,
} from '../../../../../store/depositeWithdrawStore/depositeWithdrawAction';
import { getAuthenticatedUserName } from '../../../../../store/authStore/authSelectors';
import delegationModalTypes from '../../../../../common/constants/delegationModalTypes';
import { toggleModal } from '../../../../../store/swapStore/swapActions';

import './WalletActions.less';

const WalletAction = props => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const math = useRouteMatch();

  if (authUserName !== math.params.name) return null;

  const dispatch = useDispatch();
  const withoutOptions = isEmpty(props.options) && isEmpty(props.withdrawCurrencyOption);
  const classListButton = classNames('WalletAction__button', {
    'WalletAction__button--withoutSelect': withoutOptions,
  });
  const classListSelect = classNames('WalletAction__select', {
    'WalletAction__select--withoutButton': !props.mainKey,
  });

  const config = {
    power_up: () => dispatch(openPowerUpOrDown()),
    power_down: () => dispatch(openPowerUpOrDown(true)),
    transfer: () => dispatch(openTransfer('', 0, props.mainCurrency)),
    swap: () => dispatch(toggleModal(true, props.mainCurrency)),
    delegate: () =>
      dispatch(toggleDelegateModal(delegationModalTypes.DELEGATION, props.mainCurrency)),
  };

  return (
    <div className="WalletAction">
      {props.mainKey && (
        <Button className={classListButton} onClick={config[props.mainKey]}>
          {props.intl.formatMessage({ id: props.mainKey })}
        </Button>
      )}
      {!withoutOptions && (
        <Dropdown
          arrow
          trigger={'click'}
          placement={'bottomRight'}
          overlay={
            <Menu className={'WalletAction__select-dropdown'}>
              {props.options.map(opt => {
                if (opt === 'convert') return null;

                return (
                  <Menu.Item onClick={() => config[opt]()} key={opt}>
                    {props.intl.formatMessage({ id: opt })}
                  </Menu.Item>
                );
              })}
              {!isEmpty(props.swapCurrencyOptions) &&
                props.swapCurrencyOptions.map(cyrrency => (
                  <Menu.Item
                    key={`convert:${cyrrency}`}
                    onClick={() => {
                      dispatch(toggleDepositModal(true));
                      dispatch(setDepositeSymbol(props.mainCurrency));
                    }}
                  >
                    {props.intl.formatMessage({ id: 'convert' })} {cyrrency}
                  </Menu.Item>
                ))}
              {!isEmpty(props.withdrawCurrencyOption) &&
                props.withdrawCurrencyOption.map(cyrrency => (
                  <Menu.Item
                    key={`withdraw:${cyrrency}`}
                    onClick={() => {
                      if (props.mainCurrency === 'HIVE') {
                        dispatch(openWithdraw(cyrrency));
                      } else {
                        dispatch(toggleWithdrawModal(true, props.mainCurrency, cyrrency));
                      }
                    }}
                  >
                    {props.intl.formatMessage({ id: 'withdraw' })} to {cyrrency}
                  </Menu.Item>
                ))}
            </Menu>
          }
        >
          <Button
            className={classListSelect}
            title={props.intl.formatMessage({ id: props.mainKey })}
          >
            <Icon type="caret-down" />
          </Button>
        </Dropdown>
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
  withdrawCurrencyOption: PropTypes.arrayOf(PropTypes.string),
  options: PropTypes.arrayOf(PropTypes.string),
};

WalletAction.defaultProps = {
  swapCurrencyOptions: [],
  options: [],
};

export default injectIntl(WalletAction);
