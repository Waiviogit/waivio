import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import { FormattedMessage } from 'react-intl';
import { ReactSVG } from 'react-svg';
import PopoverMenu from '../../PopoverMenu/PopoverMenu';
import Popover from '../../Popover';
import PopoverMenuItem from '../../PopoverMenu/PopoverMenuItem';
import { isPostCashout } from '../../../vendor/steemitHelpers';

const CommentPopover = ({ comment, children, handlePopoverClick, own }) => {
  const { pendingDisLike, isFlagged } = comment;
  let popoverMenu = [];

  if (!own) {
    popoverMenu = [
      <PopoverMenuItem key="hide" disabled={pendingDisLike}>
        {comment.loadingHide ? (
          <Icon type="loading" />
        ) : (
          <ReactSVG
            className={`hide-button ${comment.isHide ? 'hide-button--fill' : ''}`}
            wrapper="span"
            src="/images/icons/eye-hide.svg"
          />
        )}
        <FormattedMessage
          id={comment.isHide ? 'unhide_comment' : 'hide_comment'}
          defaultMessage={comment.isHide ? 'Unhide comment' : 'Hide comment'}
        />
      </PopoverMenuItem>,
      <PopoverMenuItem key="mute" disabled={pendingDisLike}>
        {comment.loadingMute ? (
          <Icon type="loading" />
        ) : (
          <ReactSVG
            className={`hide-button ${comment.isMute ? 'hide-button--fill' : ''}`}
            wrapper="span"
            src="/images/icons/mute-user.svg"
          />
        )}
        <FormattedMessage
          id={comment.isMute ? 'unmute' : 'mute'}
          defaultMessage={comment.isMute ? 'Unmute' : 'Mute'}
        />{' '}
        {comment.author}
      </PopoverMenuItem>,
    ];
  }

  if (!isPostCashout(comment)) {
    popoverMenu = [
      ...popoverMenu,
      <PopoverMenuItem key="flag" disabled={comment.loadingHide}>
        {pendingDisLike ? (
          <Icon type="loading" />
        ) : (
          <i className={`iconfont icon-flag${isFlagged ? '_fill' : ''}`} />
        )}
        <FormattedMessage
          id={isFlagged ? 'unflag_comment' : 'flag_comment'}
          defaultMessage={isFlagged ? 'Unflag comment' : 'Flag comment'}
        />
      </PopoverMenuItem>,
    ];
  }

  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      content={
        <React.Fragment>
          <PopoverMenu onSelect={handlePopoverClick} bold={false}>
            {popoverMenu}
          </PopoverMenu>
        </React.Fragment>
      }
    >
      {children}
    </Popover>
  );
};

CommentPopover.propTypes = {
  comment: PropTypes.shape({
    active_votes: PropTypes.arrayOf,
    author: PropTypes.string,
    isHide: PropTypes.bool,
    pendingDisLike: PropTypes.bool,
    loadingHide: PropTypes.bool,
    isFlagged: PropTypes.bool,
    loadingMute: PropTypes.bool,
    isMute: PropTypes.bool,
  }).isRequired,
  children: PropTypes.node.isRequired,
  handlePopoverClick: PropTypes.func.isRequired,
  own: PropTypes.bool.isRequired,
};

CommentPopover.defaultProps = {};

export default CommentPopover;
