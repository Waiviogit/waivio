import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import PopoverContainer from '../Popover';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';

const BurgerMenu = props => {
  const { isGuest, onMenuItemClick } = props;

  const [burgerMenuVisible, setBurgerMenuVisible] = useState(false);

  const handleBurgerMenuSelect = key => {
    setBurgerMenuVisible(false);
    onMenuItemClick(key);
  };

  const handleBurgerMenuVisibleChange = visible => setBurgerMenuVisible(visible);

  return (
    <PopoverContainer
      placement="bottom"
      trigger="click"
      visible={burgerMenuVisible}
      onVisibleChange={handleBurgerMenuVisibleChange}
      overlayStyle={{ position: 'fixed' }}
      content={
        <PopoverMenu onSelect={handleBurgerMenuSelect}>
          {!isGuest && (
            <PopoverMenuItem key="activity" mobileScreenHidden>
              <FormattedMessage id="activity" defaultMessage="Activity" />
            </PopoverMenuItem>
          )}
          <PopoverMenuItem key="bookmarks" mobileScreenHidden>
            <FormattedMessage id="bookmarks" defaultMessage="Bookmarks" />
          </PopoverMenuItem>
          <PopoverMenuItem key="drafts">
            <FormattedMessage id="drafts" defaultMessage="Drafts" />
          </PopoverMenuItem>
          <PopoverMenuItem key="settings">
            <FormattedMessage id="settings" defaultMessage="Settings" />
          </PopoverMenuItem>
          <PopoverMenuItem key="wallet">
            <FormattedMessage id="wallet" defaultMessage="Wallet" />
          </PopoverMenuItem>
          <PopoverMenuItem key="logout">
            <FormattedMessage id="logout" defaultMessage="Logout" />
          </PopoverMenuItem>
        </PopoverMenu>
      }
    >
      <a className="Topnav__link Topnav__link--menu">
        <Icon type="menu" className="iconfont icon-menu" />
      </a>
    </PopoverContainer>
  );
};
BurgerMenu.propTypes = {
  isGuest: PropTypes.bool.isRequired,
  onMenuItemClick: PropTypes.func.isRequired,
};

export default BurgerMenu;
