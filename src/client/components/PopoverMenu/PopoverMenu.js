import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import PopoverMenuItem from './PopoverMenuItem';
import './PopoverMenu.less';

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
      <li>
        {platformName !== 'widgets' && !isLoadingPlatform ? (
          <React.Fragment>
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
          </React.Fragment>
        ) : (
          <Button type="primary" onClick={brokerOnClickHandler}>
            {intl.formatMessage({
              id: 'headerAuthorized.connectToBroker',
              defaultMessage: 'Connect to broker',
            })}
          </Button>
        )}
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
  intl: PropTypes.shape().isRequired,
  platformName: PropTypes.string.isRequired,
  isLoadingPlatform: PropTypes.bool.isRequired,
  toggleModalBroker: PropTypes.func.isRequired,
  handleMoreMenuVisibleChange: PropTypes.func.isRequired,
  toggleModalDeposit: PropTypes.func.isRequired
};

PopoverMenu.defaultProps = {
  children: null,
  onSelect: () => {},
  bold: true,
};

export default PopoverMenu;
export { PopoverMenuItem };
