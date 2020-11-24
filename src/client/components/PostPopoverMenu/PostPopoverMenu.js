import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import { get, isEmpty } from 'lodash';
import { getSocialInfoPost } from '../../../waivioApi/ApiClient';
import Popover from '../Popover';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import { dropCategory, replaceBotWithGuestName } from '../../helpers/postHelpers';
import { getFacebookShareURL, getTwitterShareURL } from '../../helpers/socialProfiles';
import { isPostCashout } from '../../vendor/steemitHelpers';

import './PostPopoverMenu.less';

const propTypes = {
  pendingFlag: PropTypes.bool,
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
    youFollows: PropTypes.bool,
    loading: PropTypes.bool,
    wobjects: PropTypes.shape(),
    tags: PropTypes.shape(),
    cities: PropTypes.shape(),
    userTwitter: PropTypes.shape(),
    wobjectsTwitter: PropTypes.shape(),
  }).isRequired,
  handlePostPopoverMenuClick: PropTypes.func,
  ownPost: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

const defaultProps = {
  pendingFlag: false,
  pendingBookmark: false,
  saving: false,
  ownPost: false,
  handlePostPopoverMenuClick: () => {},
};

const PostPopoverMenu = ({
  pendingFlag,
  pendingBookmark,
  saving,
  postState,
  intl,
  post,
  handlePostPopoverMenuClick,
  ownPost,
  children,
}) => {
  const { isReported, isSaved } = postState;
  const {
    guestInfo,
    author,
    url,
    title,
    author_original: authorOriginal,
    youFollows: userFollowed,
    loading,
  } = post;

  const [popoverVisible, setPopoverVisible] = useState(false);
  let followText = '';
  const postAuthor = (guestInfo && guestInfo.userId) || author;
  const baseURL = window ? window.location.origin : 'https://waivio.com';

  const handleShare = async isTwitter => {
    const authorPost = get(post, ['guestInfo', 'userId'], '') || post.author;
    const permlink = get(post, 'permlink', '');
    const socialInfoPost = await getSocialInfoPost(authorPost, permlink);
    const hashtags = !isEmpty(socialInfoPost)
      ? [...socialInfoPost.tags, ...socialInfoPost.cities]
      : [];
    const authorTwitter = !isEmpty(socialInfoPost.userTwitter)
      ? `by@${socialInfoPost.userTwitter}`
      : '';
    const objectTwitter = !isEmpty(socialInfoPost.wobjectsTwitter)
      ? `@${socialInfoPost.wobjectsTwitter}`
      : '';
    const postURL = `${baseURL}${replaceBotWithGuestName(dropCategory(url), guestInfo)}`;

    if (isTwitter) {
      const shareTextSocialTwitter = `"${encodeURIComponent(
        title,
      )}" ${authorTwitter} ${objectTwitter}`;
      const twitterShareURL = getTwitterShareURL(shareTextSocialTwitter, postURL, hashtags);
      window.open(twitterShareURL);
    } else {
      const facebookShareURL = getFacebookShareURL(postURL);
      window.open(facebookShareURL);
    }
  };

  const activePost = !isPostCashout(post);

  if (userFollowed) {
    followText = intl.formatMessage(
      { id: 'unfollow_username', defaultMessage: 'Unfollow {username}' },
      { username: postAuthor },
    );
  } else {
    followText = intl.formatMessage(
      { id: 'follow_username', defaultMessage: 'Follow {username}' },
      { username: postAuthor },
    );
  }

  const isTwitter = true;

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
      <PopoverMenuItem key="follow" disabled={loading}>
        {loading ? <Icon type="loading" /> : <i className="iconfont icon-people" />}
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
  ];

  if (activePost)
    popoverMenu.push(
      <PopoverMenuItem key="report">
        {pendingFlag ? (
          <Icon type="loading" />
        ) : (
          <i className={`iconfont icon-flag${isReported ? '_fill' : ''}`} />
        )}
        {isReported ? (
          <FormattedMessage id="unflag_post" defaultMessage="Unflag post" />
        ) : (
          <FormattedMessage id="flag_post" defaultMessage="Flag post" />
        )}
      </PopoverMenuItem>,
    );
  console.log(popoverVisible);
  return (
    <Popover
      visible={popoverVisible}
      onVisibleChange={() => setPopoverVisible(!popoverVisible)}
      placement="bottomRight"
      trigger="click"
      overlayStyle={{ position: 'fixed' }}
      content={
        <React.Fragment>
          <PopoverMenu onSelect={handlePostPopoverMenuClick} bold={false}>
            {popoverMenu}
          </PopoverMenu>
          <a
            role="presentation"
            key="share-facebook"
            rel="noopener noreferrer"
            target="_blank"
            className="Popover__shared-link"
            onClick={e => {
              e.preventDefault();
              handleShare();
            }}
          >
            <i className="iconfont icon-facebook" />
            <FormattedMessage id="share_facebook" defaultMessage="Share to Facebook" />
          </a>
          <a
            role="presentation"
            key="share-twitter"
            rel="noopener noreferrer"
            target="_blank"
            className="Popover__shared-link"
            onClick={e => {
              e.preventDefault();
              handleShare(isTwitter);
            }}
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
