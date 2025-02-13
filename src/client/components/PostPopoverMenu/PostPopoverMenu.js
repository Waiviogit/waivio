import Cookie from 'js-cookie';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Icon, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import { get, isEmpty, isNil, has } from 'lodash';
import { ReactSVG } from 'react-svg';
import { useHistory, useRouteMatch } from 'react-router';
import api from '../../steemConnectAPI';
import Popover from '../Popover';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import { dropCategory, replaceBotWithGuestName } from '../../../common/helpers/postHelpers';
import { getFacebookShareURL, getTwitterShareURL } from '../../../common/helpers/socialProfiles';
import { isPostCashout } from '../../vendor/steemitHelpers';
import {
  getSocialInfoPost as getSocialInfoPostAction,
  handleHidePost,
  handleRemovePost,
} from '../../../store/postsStore/postActions';
import { getAuthenticatedUserName, isGuestUser } from '../../../store/authStore/authSelectors';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { deletePost, getObjectInfo } from '../../../waivioApi/ApiClient';
import AppendModal from '../../object/AppendModal/AppendModal';
import { objectFields } from '../../../common/constants/listOfFields';
import ids from '../../newRewards/BlackList/constants';
import { changeBlackAndWhiteLists } from '../../../store/rewardsStore/rewardsActions';
import { getIsSocial, getUsedLocale } from '../../../store/appStore/appSelectors';
import { getIsEditMode } from '../../../store/wObjectStore/wObjectSelectors';
import RemoveObjFomPost from '../RemoveObjFomPost/RemoveObjFomPost';

import './PostPopoverMenu.less';

const PostPopoverMenu = ({
  pendingFlag,
  pendingBookmark,
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
  disableRemove,
  isSocial,
  isThread,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPin, setIsPin] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [openRejectCapm, setOpenRejectCapm] = useState(false);
  const [loadingTras, setLoading] = useState(false);
  const [wobjName, setWobjName] = useState('');
  const [inBlackList, setInBlackList] = useState(post.blacklisted);
  const [loadingType, setLoadingType] = useState('');
  const locale = useSelector(getUsedLocale);
  const history = useHistory();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const isEditMode = useSelector(getIsEditMode);
  const wobjAuthorPermlink = match.params.name;
  const hidePinRemove =
    isThread ||
    !match.url.includes(`/${wobjAuthorPermlink}`) ||
    (isSocial && !match.url.includes(`/${wobjAuthorPermlink}`)) ||
    (isSocial && !isEditMode);

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
    let currKey = key;

    if (key.includes('rejectReservation')) {
      const parseKey = key.split('/');

      currKey = parseKey[0];
    }

    switch (currKey) {
      case 'delete':
        return setIsOpen(true);
      case 'pin':
        !isNil(wobjAuthorPermlink) &&
          getObjectInfo([wobjAuthorPermlink], locale).then(res =>
            setWobjName(res.wobjects[0].name),
          );
        setIsVisible(false);

        return setIsPin(true);
      case 'remove':
        !isNil(wobjAuthorPermlink) &&
          getObjectInfo([wobjAuthorPermlink], locale).then(res =>
            setWobjName(res.wobjects[0].name),
          );
        dispatch(handleRemovePost(post));
        setIsVisible(false);

        return setIsRemove(true);

      case 'hide':
        return dispatch(handleHidePost(post));
      case 'edit':
        setIsVisible(false);

        return handlePostPopoverMenuClick(key);

      case 'rejectCampaign': {
        setIsVisible(false);

        return setOpenRejectCapm(true);
      }

      case 'blackList':
        setLoadingType('blackList');
        const methodType = inBlackList ? ids.blackList.remove : ids.blackList.add;

        dispatch(changeBlackAndWhiteLists(methodType, [post?.author])).then(() => {
          setInBlackList(!inBlackList);
          setLoadingType('');
        });

        return () => setIsVisible(false);

      default:
        return handlePostPopoverMenuClick(key);
    }
  };

  const handleDeletePost = () => {
    if (Cookie.get('auth')) {
      setLoading(true);
      api
        .broadcast([
          [
            'delete_comment',
            {
              author,
              permlink: post.permlink,
            },
          ],
        ])
        .then(() => {
          setIsOpen(false);
          setLoading(false);
        });
    } else {
      if (isGuest) {
        deletePost({ root_author: post.root_author, permlink: post.permlink, userName });
      } else if (typeof window !== 'undefined')
        window.open(
          `https://hivesigner.com/sign/delete_comment?author=${author}&permlink=${post.permlink}`,
          '_blank',
        );

      setIsOpen(false);
    }
  };

  const handleShare = isTwitter => {
    const authorPost = get(post, ['guestInfo', 'userId'], '') || post.author;
    const permlink = get(post, 'permlink', '');

    if (!userComments && !isThread) {
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

          if (typeof window !== 'undefined') window.open(twitterShareURL, '_blank').focus();
        } else {
          const facebookShareURL = getFacebookShareURL(postURL);

          if (typeof window !== 'undefined') window.open(facebookShareURL, '_blank').focus();
        }
      });
    } else {
      const postURL = isThread
        ? `${baseURL}/@${author}/${permlink}`
        : `${baseURL}${replaceBotWithGuestName(dropCategory(url), guestInfo)}`;

      if (isTwitter) {
        const shareTextSocialTwitter = `"${
          isThread ? encodeURIComponent(post.body) : encodeURIComponent(title)
        }"`;
        const twitterShareURL = getTwitterShareURL(shareTextSocialTwitter, postURL);

        if (typeof window !== 'undefined') window.open(twitterShareURL, '_blank').focus();
      } else {
        const facebookShareURL = getFacebookShareURL(postURL);

        if (typeof window !== 'undefined') window.open(facebookShareURL, '_blank').focus();
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
        <i className="iconfont icon-write" />
        <FormattedMessage
          id={isThread ? 'edit_thread' : 'edit_post'}
          defaultMessage={isThread ? 'Edit thread' : 'Edit post'}
        />
      </PopoverMenuItem>,
      <PopoverMenuItem key="pin" disabled={loading} invisible={hidePinRemove}>
        <Icon className="hide-button popoverIcon ml1px" type="pushpin" />
        <span className="ml1">
          <FormattedMessage id="object_field_pin" defaultMessage="Pin" />
        </span>
      </PopoverMenuItem>,
      <PopoverMenuItem key="remove" disabled={loading || disableRemove} invisible={hidePinRemove}>
        <Icon type="close-circle" className="hide-button popoverIcon ml1px" />
        <span className="ml1">
          <FormattedMessage id="object_field_remove" defaultMessage="Remove" />
        </span>
      </PopoverMenuItem>,
    ];
  }

  if (canDeletePost) {
    popoverMenu = [
      ...popoverMenu,
      <PopoverMenuItem key="delete">
        <Icon type="delete" />
        <FormattedMessage
          id={isThread ? 'delete_thread' : 'delete_post'}
          defaultMessage={isThread ? 'Delete thread' : 'Delete post'}
        />
      </PopoverMenuItem>,
    ];
  }

  if (!ownPost) {
    popoverMenu = [
      ...popoverMenu,
      <PopoverMenuItem key="follow" disabled={loading} invisible={isThread}>
        {loading ? <Icon type="loading" /> : <i className="iconfont icon-people" />}
        {followText}
      </PopoverMenuItem>,
      <PopoverMenuItem key="pin" disabled={loading} invisible={hidePinRemove}>
        <Icon className="hide-button popoverIcon ml1px" type="pushpin" />
        <span className="ml1">
          <FormattedMessage id="object_field_pin" defaultMessage="Pin" />
        </span>
      </PopoverMenuItem>,
      <PopoverMenuItem key="remove" disabled={loading || disableRemove} invisible={hidePinRemove}>
        <Icon type="close-circle" className="hide-button popoverIcon ml1px" />
        <span className="ml1">
          <FormattedMessage id="object_field_remove" defaultMessage="Remove" />
        </span>
      </PopoverMenuItem>,
      <PopoverMenuItem key="hide" disabled={loading} invisible={isThread || isGuest}>
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
          <FormattedMessage
            id={isThread ? 'unflag_thread' : 'unflag_post'}
            defaultMessage={isThread ? 'Unflag thread' : 'Unflag post'}
          />
        ) : (
          <FormattedMessage
            id={isThread ? 'flag_thread' : 'flag_post'}
            defaultMessage={isThread ? 'Flag thread' : 'Flag post'}
          />
        )}
      </PopoverMenuItem>,
    );

  if (!isEmpty(post?.campaigns)) {
    popoverMenu = [
      ...popoverMenu,
      <PopoverMenuItem key={'rejectCampaign'}>
        <Icon type="stop" /> Reject review
      </PopoverMenuItem>,
      <PopoverMenuItem key={'blackList'}>
        {loadingType === 'blackList' ? <Icon type={'loading'} /> : <Icon type="user-add" />}{' '}
        {inBlackList
          ? `Remove @${post?.author} from blacklist`
          : `Add @${post?.author} to blacklist`}
      </PopoverMenuItem>,
    ];
  }

  return (
    <React.Fragment>
      <Popover
        onVisibleChange={() => setIsVisible(!isVisible)}
        visible={isVisible}
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
              className="Popover__shared-link PopoverMenuItem PopoverMenuItem__centered-text"
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
              className="Popover__shared-link PopoverMenuItem PopoverMenuItem__centered-text"
              onClick={e => {
                e.preventDefault();
                handleShare(isTwitter);
              }}
            >
              <ReactSVG
                className={'twitter-icon'}
                src="/images/icons/twitter-x.svg"
                wrapper={'span'}
              />
              <FormattedMessage id="share_x" defaultMessage="Share to X" />
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
        okButtonProps={{
          loading: loadingTras,
        }}
      >
        Would you like permanently delete your post?
      </Modal>
      {!isEmpty(post?.campaigns) && (
        <RemoveObjFomPost
          onClose={() => setOpenRejectCapm(false)}
          visible={openRejectCapm}
          campaigns={post.campaigns}
          linkedObj={post.wobjects}
          post={post}
        />
      )}
      {isPin &&
        (post.pin || post.hasPinUpdate || has(post, 'currentUserPin') ? (
          history.push(`/object/${wobjAuthorPermlink}/updates/pin?search=${post.id}`)
        ) : (
          <AppendModal
            objName={wobjName}
            post={post}
            showModal={isPin}
            hideModal={() => setIsPin(false)}
            field={objectFields.pin}
          />
        ))}
      {isRemove &&
        (post.hasRemoveUpdate ? (
          history.push(`/object/${wobjAuthorPermlink}/updates/remove?search=${post.id}`)
        ) : (
          <AppendModal
            post={post}
            objName={wobjName}
            showModal={isRemove}
            hideModal={() => setIsRemove(false)}
            field={objectFields.remove}
          />
        ))}
    </React.Fragment>
  );
};

PostPopoverMenu.propTypes = {
  pendingFlag: PropTypes.bool,
  isSocial: PropTypes.bool,
  pendingBookmark: PropTypes.bool,
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
    campaigns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    wobjects: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    author: PropTypes.string,
    body: PropTypes.string,
    guideName: PropTypes.string,
    root_author: PropTypes.string,
    isHide: PropTypes.bool,
    blacklisted: PropTypes.bool,
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
    pin: PropTypes.bool,
    hasPinUpdate: PropTypes.bool,
    hasRemoveUpdate: PropTypes.bool,
    id: PropTypes.string,
    loadingMute: PropTypes.bool,
    muted: PropTypes.bool,
    tags: PropTypes.shape(),
    cities: PropTypes.shape(),
    userTwitter: PropTypes.shape(),
    wobjectsTwitter: PropTypes.shape(),
  }).isRequired,
  handlePostPopoverMenuClick: PropTypes.func,
  ownPost: PropTypes.bool,
  disableRemove: PropTypes.bool,
  children: PropTypes.node.isRequired,
  isGuest: PropTypes.bool.isRequired,
  userName: PropTypes.string,
  getSocialInfoPost: PropTypes.func,
  userComments: PropTypes.bool,
  isThread: PropTypes.bool,
};
PostPopoverMenu.defaultProps = {
  pendingFlag: false,
  pendingBookmark: false,
  ownPost: false,
  handlePostPopoverMenuClick: () => {},
  getSocialInfoPost: () => {},
  userComments: false,
  isThread: false,
};

export default connect(
  state => ({
    isGuest: isGuestUser(state),
    userName: getAuthenticatedUserName(state),
    isSocial: getIsSocial(state),
  }),
  {
    getSocialInfoPost: getSocialInfoPostAction,
  },
)(PostPopoverMenu);
