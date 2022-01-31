import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import { get, isEmpty } from 'lodash';
import { ReactSVG } from 'react-svg';
import Popover from '../Popover';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import { dropCategory, replaceBotWithGuestName } from '../../../common/helpers/postHelpers';
import { getFacebookShareURL, getTwitterShareURL } from '../../../common/helpers/socialProfiles';
import { isPostCashout } from '../../vendor/steemitHelpers';
import { getSocialInfoPost as getSocialInfoPostAction } from '../../../store/postsStore/postActions';
import { getAuthenticatedUserName, isGuestUser } from '../../../store/authStore/authSelectors';
import { isMobile } from '../../../common/helpers/apiHelpers';

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
    isHide: PropTypes.bool,
    url: PropTypes.string,
    title: PropTypes.string,
    author_original: PropTypes.string,
    active_votes: PropTypes.arrayOf(
      PropTypes.shape({
        sponsor: PropTypes.bool,
      }),
    ),
    net_rshares_WAIV: PropTypes.number,
    permlink: PropTypes.string,
    net_rshares: PropTypes.number,
    children: PropTypes.number,
    youFollows: PropTypes.bool,
    loading: PropTypes.bool,
    loadingHide: PropTypes.bool,
    loadingMute: PropTypes.bool,
    muted: PropTypes.bool,
    tags: PropTypes.shape(),
    cities: PropTypes.shape(),
    userTwitter: PropTypes.shape(),
    wobjectsTwitter: PropTypes.shape(),
  }).isRequired,
  handlePostPopoverMenuClick: PropTypes.func,
  ownPost: PropTypes.bool,
  children: PropTypes.node.isRequired,
  isGuest: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  getSocialInfoPost: PropTypes.func,
  userComments: PropTypes.bool,
};

const defaultProps = {
  pendingFlag: false,
  pendingBookmark: false,
  saving: false,
  ownPost: false,
  handlePostPopoverMenuClick: () => {},
  getSocialInfoPost: () => {},
  userComments: false,
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
  isGuest,
  userName,
  getSocialInfoPost,
  userComments,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isReported, isSaved } = postState;
  const hasOnlySponsorLike =
    post.active_votes.length === 1 && post.active_votes.some(vote => vote.sponsor);
  const withoutLike = (!post.net_rshares_WAIV && !post.net_rshares) || hasOnlySponsorLike;
  const canDeletePost = ownPost && withoutLike && !post.children && !isGuest;
  const {
    guestInfo,
    author,
    url,
    title,
    author_original: authorOriginal,
    youFollows: userFollowed,
    loading,
  } = post;
  let followText = '';
  const postAuthor = (guestInfo && guestInfo.userId) || author;
  const baseURL = typeof window !== 'undefined' ? window.location.origin : 'https://waivio.com';

  const handleSelect = key => {
    switch (key) {
      case 'delete':
        return setIsOpen(true);

      default:
        return handlePostPopoverMenuClick(key);
    }
  };

  const handleDeletePost = () => {
    window.open(
      `https://hivesigner.com/sign/delete_comment?author=${author}&permlink=${post.permlink}`,
      '_blank',
    );
    setIsOpen(false);
  };

  const handleShare = isTwitter => {
    const authorPost = get(post, ['guestInfo', 'userId'], '') || post.author;
    const permlink = get(post, 'permlink', '');

    if (!userComments) {
      getSocialInfoPost(authorPost, permlink).then(res => {
        const socialInfoPost = res.value;
        const hashtags = !isEmpty(socialInfoPost)
          ? [...socialInfoPost.tags, ...socialInfoPost.cities]
          : [];
        const authorTwitter = !isEmpty(socialInfoPost.userTwitter)
          ? `by @${socialInfoPost.userTwitter}`
          : `by ${postAuthor}`;
        const objectTwitter = !isEmpty(socialInfoPost.wobjectsTwitter)
          ? `@${socialInfoPost.wobjectsTwitter}`
          : '';
        const postName = !isGuest && userName ? `?ref=${userName}` : '';
        const postURL = `${baseURL}${replaceBotWithGuestName(
          dropCategory(url),
          guestInfo,
        )}${postName}`;

        if (isTwitter) {
          const shareTextSocialTwitter = `"${encodeURIComponent(
            title,
          )}" ${authorTwitter} ${objectTwitter}`;
          const twitterShareURL = getTwitterShareURL(shareTextSocialTwitter, postURL, hashtags);

          window.location.assign(twitterShareURL);
        } else {
          const facebookShareURL = getFacebookShareURL(postURL);

          window.location.assign(facebookShareURL);
        }
      });
    } else {
      const postURL = `${baseURL}${replaceBotWithGuestName(dropCategory(url), guestInfo)}`;

      if (isTwitter) {
        const shareTextSocialTwitter = `"${encodeURIComponent(title)}"`;
        const twitterShareURL = getTwitterShareURL(shareTextSocialTwitter, postURL);

        window.location.assign(twitterShareURL);
      } else {
        const facebookShareURL = getFacebookShareURL(postURL);

        window.location.assign(facebookShareURL);
      }
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

  if (canDeletePost) {
    popoverMenu = [
      ...popoverMenu,
      <PopoverMenuItem key="delete">
        <Icon type="delete" />
        <FormattedMessage id="delete_post" defaultMessage="Delete post" />
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
      <PopoverMenuItem key="hide" disabled={loading}>
        {post.loadingHide ? (
          <Icon type="loading" />
        ) : (
          <ReactSVG
            className={`hide-button ${post.isHide ? 'hide-button--fill' : ''}`}
            wrapper="span"
            src="/images/icons/eye-hide.svg"
          />
        )}
        <FormattedMessage
          id={post.isHide ? 'unhide_post' : 'hide_post'}
          defaultMessage={post.isHide ? 'Unhide post' : 'Hide post'}
        />
      </PopoverMenuItem>,
      <PopoverMenuItem key="mute" disabled={loading}>
        {post.loadingMute ? (
          <Icon type="loading" />
        ) : (
          <ReactSVG
            className={`hide-button ${post.muted ? 'hide-button--fill' : ''}`}
            wrapper="span"
            src="/images/icons/mute-user.svg"
          />
        )}
        <FormattedMessage
          id={post.muted ? 'unmute' : 'mute'}
          defaultMessage={post.muted ? 'Unmute' : 'Mute'}
        />{' '}
        {post.author}
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

  return (
    <React.Fragment>
      <Popover
        placement="bottomRight"
        trigger={isMobile() ? 'click' : 'hover'}
        content={
          <React.Fragment>
            <PopoverMenu onSelect={handleSelect} bold={false}>
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
      <Modal
        title={'Delete post'}
        okText={'Delete'}
        visible={isOpen}
        onCancel={() => setIsOpen(false)}
        onOk={handleDeletePost}
        wrapClassName={'Popover__modal'}
      >
        Would you like permanently delete your post?
      </Modal>
    </React.Fragment>
  );
};

PostPopoverMenu.propTypes = propTypes;
PostPopoverMenu.defaultProps = defaultProps;

export default connect(
  state => ({
    isGuest: isGuestUser(state),
    userName: getAuthenticatedUserName(state),
  }),
  {
    getSocialInfoPost: getSocialInfoPostAction,
  },
)(PostPopoverMenu);
