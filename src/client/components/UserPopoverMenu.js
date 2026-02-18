import Cookie from 'js-cookie';
import React from 'react';
import { Icon } from 'antd';
import { ReactSVG } from 'react-svg';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import PopoverMenu, { PopoverMenuItem } from './PopoverMenu/PopoverMenu';
import withAuthAction from '../auth/withAuthActions';

import Popover from './Popover';

const UserPopoverMenu = ({
  handleMuteCurrUser,
  user,
  handleUnMuteUserBlog,
  onRestrictClick,
  onReinstateClick,
  onActionInitiated,
  authUserName,
}) => {
  const currentUserMuted = user.muted;
  const appAdmins = Cookie.get('appAdmins');
  const isAdministrator = appAdmins?.includes(authUserName);

  const handlePopoverClick = key => {
    switch (key) {
      case 'mute':
        return handleMuteCurrUser();
      case 'unmute':
        return handleUnMuteUserBlog(user);
      case 'restrict':
        return onRestrictClick();
      case 'reinstate':
        return onReinstateClick();
      default:
        return null;
    }
  };

  const handlePopoverChoice = key => onActionInitiated(() => handlePopoverClick(key));

  const menuItems = [];

  if (user.restricted) {
    menuItems.push(
      <PopoverMenuItem key="reinstate">
        {user.restrictLoading ? <Icon type="loading" /> : <Icon type="check-circle" />}
        <FormattedMessage id="reinstate" defaultMessage="Reinstate" /> {user.name}
      </PopoverMenuItem>,
    );
  } else {
    menuItems.push(
      <PopoverMenuItem key={currentUserMuted ? 'unmute' : 'mute'}>
        {user.muteLoading ? (
          <Icon type="loading" />
        ) : (
          <ReactSVG
            className={`hide-button ${currentUserMuted ? 'hide-button--fill' : ''}`}
            wrapper="span"
            src="/images/icons/mute-user.svg"
          />
        )}
        <FormattedMessage
          id={currentUserMuted ? 'unmute' : 'mute'}
          defaultMessage={currentUserMuted ? 'Unmute' : 'Mute'}
        />{' '}
        {user.name}
      </PopoverMenuItem>,
    );

    if (isAdministrator) {
      menuItems.push(
        <PopoverMenuItem key="restrict">
          <Icon type="stop" />
          <FormattedMessage id="restrict" defaultMessage="Restrict" /> {user.name}
        </PopoverMenuItem>,
      );
    }
  }

  return (
    <Popover
      placement="bottomRight"
      trigger="hover"
      content={
        <React.Fragment>
          <PopoverMenu onSelect={handlePopoverChoice} bold={false} trigger="hover">
            {menuItems}
          </PopoverMenu>
        </React.Fragment>
      }
    >
      <Icon type="ellipsis" className="UserHeader__ellipsis" />
    </Popover>
  );
};

UserPopoverMenu.propTypes = {
  user: PropTypes.shape(),
  handleMuteCurrUser: PropTypes.func,
  handleUnMuteUserBlog: PropTypes.func,
  onRestrictClick: PropTypes.func,
  onReinstateClick: PropTypes.func,
  onActionInitiated: PropTypes.func,
  authUserName: PropTypes.string,
};

UserPopoverMenu.defaultProps = {
  user: {},
  handleMuteCurrUser: () => {},
  handleUnMuteUserBlog: () => {},
  handleRestrictUserBlog: () => {},
  onRestrictClick: () => {},
  onReinstateClick: () => {},
  onActionInitiated: () => {},
};

export default withAuthAction(UserPopoverMenu);
