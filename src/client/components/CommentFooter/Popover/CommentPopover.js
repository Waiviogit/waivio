import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { useSelector } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import { ReactSVG } from 'react-svg';
import PopoverMenu from '../../PopoverMenu/PopoverMenu';
import Popover from '../../Popover';
import PopoverMenuItem from '../../PopoverMenu/PopoverMenuItem';
import { getDownvotes } from '../../../helpers/voteHelpers';
import { getAuthenticatedUserName } from '../../../reducers';

const CommentPopover = ({ comment, children, handlePopoverClick }) => {
  const { pendingDisLike } = comment;
  const authUser = useSelector(getAuthenticatedUserName);
  const isFlagged = getDownvotes(comment.active_votes).some(({ voter }) => voter === authUser);
  const popoverMenu = [
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
  ];

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
  }).isRequired,
  children: PropTypes.node.isRequired,
  handlePopoverClick: PropTypes.func.isRequired,
};

CommentPopover.defaultProps = {};

export default CommentPopover;
