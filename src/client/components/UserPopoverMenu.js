import React from 'react';
import { Icon } from 'antd';
import { useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { includes } from 'lodash';
import { getAuthenticatedUserName } from '../reducers';
import PopoverMenu, { PopoverMenuItem } from './PopoverMenu/PopoverMenu';
import Popover from './Popover';

const UserPopoverMenu = ({ handleMuteCurrUser, user, handleUnMuteUserBlog }) => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const currentUserMuted = includes(user.mutedBy, authUserName);
  const handlePopoverClick = key => {
    switch (key) {
      case 'mute':
        return handleMuteCurrUser();
      case 'unmute':
        return handleUnMuteUserBlog(user);
      default:
        return null;
    }
  };
  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      content={
        <React.Fragment>
          <PopoverMenu onSelect={handlePopoverClick} bold={false} trigger="hover">
            {[
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
            ]}
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
};

UserPopoverMenu.defaultProps = {
  user: {},
  handleMuteCurrUser: () => {},
  handleUnMuteUserBlog: () => {},
};

export default UserPopoverMenu;
