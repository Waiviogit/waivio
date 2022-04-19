import React from 'react';
import { Icon } from 'antd';
import { ReactSVG } from 'react-svg';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import MuteUserIcon from '@icons/mute-user.svg';

import PopoverMenu, { PopoverMenuItem } from './PopoverMenu/PopoverMenu';
import withAuthAction from '../auth/withAuthActions';

import Popover from './Popover';

const UserPopoverMenu = ({ handleMuteCurrUser, user, handleUnMuteUserBlog, onActionInitiated }) => {
  const currentUserMuted = user.muted;

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

  const handlePopoverChoice = key => onActionInitiated(() => handlePopoverClick(key));

  return (
    <Popover
      placement="bottomRight"
      trigger="hover"
      content={
        <React.Fragment>
          <PopoverMenu onSelect={handlePopoverChoice} bold={false} trigger="hover">
            {[
              <PopoverMenuItem key={currentUserMuted ? 'unmute' : 'mute'}>
                {user.muteLoading ? (
                  <Icon type="loading" />
                ) : (
                  <ReactSVG
                    className={`hide-button ${currentUserMuted ? 'hide-button--fill' : ''}`}
                    wrapper="span"
                    src={MuteUserIcon}
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
  onActionInitiated: PropTypes.func,
};

UserPopoverMenu.defaultProps = {
  user: {},
  handleMuteCurrUser: () => {},
  handleUnMuteUserBlog: () => {},
  onActionInitiated: () => {},
};

export default withAuthAction(UserPopoverMenu);
