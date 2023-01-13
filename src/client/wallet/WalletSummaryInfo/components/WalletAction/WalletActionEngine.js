import { Button, Dropdown, Icon, Menu } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';

import { toggleWithdrawModal } from '../../../../../store/depositeWithdrawStore/depositeWithdrawAction';
import { getAuthenticatedUserName } from '../../../../../store/authStore/authSelectors';
import { toggleModal } from '../../../../../store/swapStore/swapActions';

import './WalletActions.less';

const WalletActionEngine = props => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const math = useRouteMatch();

  if (authUserName !== math.params.name) return null;

  const dispatch = useDispatch();
  const withoutOptions = isEmpty(props.options) && isEmpty(props.withdrawCurrencyOption);
  const classListButton = classNames('WalletAction__button', {
    'WalletAction__button--withoutSelect': withoutOptions,
  });

  const config = {
    swap: () => dispatch(toggleModal(true, props.mainCurrency)),
    withdraw: () => dispatch(toggleWithdrawModal(true, props.mainCurrency)),
  };

  return (
    <div className="WalletAction">
      <Button
        className={classListButton}
        onClick={() => {
          dispatch(toggleModal(true, props.mainCurrency, 'WAIV'));
        }}
      >
        Swap to WAIV
      </Button>
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
              {!isEmpty(props.withdrawCurrencyOption) &&
                props.withdrawCurrencyOption.map(cyrrency => (
                  <Menu.Item
                    key={`withdraw:${cyrrency}`}
                    onClick={() => {
                      dispatch(toggleWithdrawModal(true, props.mainCurrency, cyrrency));
                    }}
                  >
                    {props.intl.formatMessage({ id: 'withdraw' })} to {cyrrency}
                  </Menu.Item>
                ))}
            </Menu>
          }
        >
          <Button className={'WalletAction__select'}>
            <Icon type="caret-down" />
          </Button>
        </Dropdown>
      )}
    </div>
  );
};

WalletActionEngine.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  mainCurrency: PropTypes.string.isRequired,
  withdrawCurrencyOption: PropTypes.arrayOf(PropTypes.string),
  options: PropTypes.arrayOf(PropTypes.string),
};

WalletActionEngine.defaultProps = {
  swapCurrencyOptions: [],
  options: [],
};

export default injectIntl(WalletActionEngine);
