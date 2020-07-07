import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import Popover from '../Popover';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import { dropCategory, replaceBotWithGuestName } from '../../helpers/postHelpers';
import { getFacebookShareURL, getTwitterShareURL } from '../../helpers/socialProfiles';

import './PostPopoverMenu.less';

const propTypes = {
  pendingFlag: PropTypes.bool,
  pendingFollow: PropTypes.bool,
  pendingBookmark: PropTypes.bool,
  saving: PropTypes.bool,
  postState: PropTypes.shape({
    isReported: PropTypes.bool,
    userFollowed: PropTypes.bool,
    isSaved: PropTypes.bool,
  }).isRequired,
  intl: PropTypes.shape().isRequired,
  post: PropTypes.shape({
    guestInfo: PropTypes.shape({
      userId: PropTypes.string,
    }),
    author: PropTypes.string,
    url: PropTypes.string,
    title: PropTypes.string,
    author_original: PropTypes.string,
  }).isRequired,
  handlePostPopoverMenuClick: PropTypes.func,
  ownPost: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

const defaultProps = {
  pendingFlag: false,
  pendingFollow: false,
  pendingBookmark: false,
  saving: false,
  ownPost: false,
  handlePostPopoverMenuClick: () => {},
};

const PostPopoverMenu = ({
  pendingFlag,
  pendingFollow,
  pendingBookmark,
  saving,
  postState,
  intl,
  post,
  handlePostPopoverMenuClick,
  ownPost,
  children,
}) => {
  const { isReported, userFollowed, isSaved } = postState;
  const { guestInfo, author, url, title, author_original: authorOriginal } = post;
  let followText = '';
  const postAuthor = (guestInfo && guestInfo.userId) || author;
  const baseURL = window ? window.location.origin : 'https://waivio.com';
  const postURL = `${baseURL}${replaceBotWithGuestName(dropCategory(url), guestInfo)}`;
  const twitterText = `"${encodeURIComponent(title)}" by @${postAuthor}`;
  const twitterShareURL = getTwitterShareURL(twitterText, postURL);
  const facebookShareURL = getFacebookShareURL(postURL);

  if (userFollowed && !pendingFollow) {
    followText = intl.formatMessage(
      { id: 'unfollow_username', defaultMessage: 'Unfollow {username}' },
      { username: postAuthor },
    );
  } else if (userFollowed && pendingFollow) {
    followText = intl.formatMessage(
      { id: 'unfollow_username', defaultMessage: 'Unfollow {username}' },
      { username: postAuthor },
    );
  } else if (!userFollowed && !pendingFollow) {
    followText = intl.formatMessage(
      { id: 'follow_username', defaultMessage: 'Follow {username}' },
      { username: postAuthor },
    );
  } else if (!userFollowed && pendingFollow) {
    followText = intl.formatMessage(
      { id: 'follow_username', defaultMessage: 'Follow {username}' },
      { username: postAuthor },
    );
  }

  let popoverMenu = [];

  if (ownPost && !authorOriginal) {
    popoverMenu = [
      ...popoverMenu,
      <PopoverMenuItem key="edit">
        {saving ? <Icon type="loading" /> : <i className="iconfont icon-write" />}
        <FormattedMessage id="edit_post" defaultMessage="Edit post" />
      </PopoverMenuItem>,
    ];
  }

  if (!ownPost) {
    popoverMenu = [
      ...popoverMenu,
      <PopoverMenuItem key="follow" disabled={pendingFollow}>
        {pendingFollow ? <Icon type="loading" /> : <i className="iconfont icon-people" />}
        {followText}
      </PopoverMenuItem>,
    ];
  }

  popoverMenu = [
    ...popoverMenu,
    <PopoverMenuItem key="save">
      {pendingBookmark ? <Icon type="loading" /> : <i className="iconfont icon-collection" />}
      <FormattedMessage
        id={isSaved ? 'unsave_post' : 'save_post'}
        defaultMessage={isSaved ? 'Unsave post' : 'Save post'}
      />
    </PopoverMenuItem>,
    <PopoverMenuItem key="report">
      {pendingFlag ? (
        <Icon type="loading" />
      ) : (
        <i
          className={classNames('iconfont', {
            'icon-flag': !isReported,
            'icon-flag_fill': isReported,
          })}
        />
      )}
      {isReported ? (
        <FormattedMessage id="unflag_post" defaultMessage="Unflag post" />
      ) : (
        <FormattedMessage id="flag_post" defaultMessage="Flag post" />
      )}
    </PopoverMenuItem>,
  ];

  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      content={
        <React.Fragment>
          <PopoverMenu onSelect={handlePostPopoverMenuClick} bold={false}>
            {popoverMenu}
          </PopoverMenu>
          <a
            key="share-facebook"
            href={facebookShareURL}
            rel="noopener noreferrer"
            target="_blank"
            className="Popover__shared-link"
          >
            <i className="iconfont icon-facebook" />
            <FormattedMessage id="share_facebook" defaultMessage="Share to Facebook" />
          </a>
          <a
            key="share-twitter"
            href={twitterShareURL}
            rel="noopener noreferrer"
            target="_blank"
            className="Popover__shared-link"
          >
            <i className="iconfont icon-twitter" />
            <FormattedMessage id="share_twitter" defaultMessage="Share to Twitter" />
          </a>
        </React.Fragment>
      }
    >
      {children}
    </Popover>
  );
};

PostPopoverMenu.propTypes = propTypes;
PostPopoverMenu.defaultProps = defaultProps;

export default PostPopoverMenu;
