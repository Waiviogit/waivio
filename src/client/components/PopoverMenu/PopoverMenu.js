import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import PopoverMenuItem from './PopoverMenuItem';
import './PopoverMenu.less';
import './PopoverMenuItem.less';

const PopoverMenu = ({
  children,
  onSelect,
  bold,
  intl,
  isLoadingPlatform,
  platformName,
  toggleModalBroker,
  handleMoreMenuVisibleChange,
  toggleModalDeposit,
}) => {
  const brokerOnClickHandler = () => {
    handleMoreMenuVisibleChange(false);
    toggleModalBroker();
  };

  const depositOnClickHandler = () => {
    handleMoreMenuVisibleChange(false);
    toggleModalDeposit();
  };

  return (
    <ul className="PopoverMenu">
      <li className="PopoverMenu full-screen-hidden">
        <div className="PopoverMenu__connect-container">
          {platformName !== 'widgets' && !isLoadingPlatform ? (
            <div className="PopoverMenu__connect-container-logout">
              <img
                role="presentation"
                title={platformName}
                onClick={brokerOnClickHandler}
                className="st-header__image"
                src={`/images/investarena/${platformName}.png`}
                alt="broker"
              />
              <Button type="primary" onClick={depositOnClickHandler}>
                {intl.formatMessage({ id: 'headerAuthorized.deposit', defaultMessage: 'Deposit' })}
              </Button>
            </div>
          ) : (
            <Button type="primary" onClick={brokerOnClickHandler}>
              {intl.formatMessage({
                id: 'headerAuthorized.connectToBroker',
                defaultMessage: 'Connect to broker',
              })}
            </Button>
          )}
        </div>
      </li>
      {React.Children.map(children, child => {
        const { children: itemChildren, ...otherProps } = child.props;

        return (
          <PopoverMenuItem
            key={child.key}
            {...otherProps}
            itemKey={child.key}
            bold={bold}
            onClick={() => onSelect(child.key)}
          >
            {child.props.children}
          </PopoverMenuItem>
        );
      })}
    </ul>
  );
};

PopoverMenu.propTypes = {
  children: PropTypes.node,
  onSelect: PropTypes.func,
  bold: PropTypes.bool,
  intl: PropTypes.shape(),
  platformName: PropTypes.string,
  isLoadingPlatform: PropTypes.bool,
  toggleModalBroker: PropTypes.func,
  handleMoreMenuVisibleChange: PropTypes.func,
  toggleModalDeposit: PropTypes.func,
};

PopoverMenu.defaultProps = {
  children: null,
  onSelect: () => {},
  bold: true,
  intl: {},
  platformName: '',
  isLoadingPlatform: false,
  toggleModalBroker: () => {},
  handleMoreMenuVisibleChange: () => {},
  toggleModalDeposit: () => {},
};

export default PopoverMenu;
export { PopoverMenuItem };
