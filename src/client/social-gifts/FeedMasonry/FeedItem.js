import React, { useEffect, useState } from 'react';
import { has, isEmpty, take, truncate } from 'lodash';
import classNames from 'classnames';
import { ReactSVG } from 'react-svg';
import { useRouteMatch } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon, Tooltip } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { getProxyImageURL } from '../../../common/helpers/image';
import {
  getPinnedPostsUrls,
  getPreviewLoadingFromState,
} from '../../../store/feedStore/feedSelectors';
import CustomImage from '../../components/Image/Image';
import PostFeedEmbed from '../../components/Story/PostFeedEmbed';
import Avatar from '../../components/Avatar';
import { showPostModal } from '../../../store/appStore/appActions';
import Payout from '../../components/StoryFooter/Payout';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { handlePinPost, votePost } from '../../../store/postsStore/postActions';
import { getVotePercent } from '../../../store/settingsStore/settingsSelectors';
import { getUpvotes } from '../../../common/helpers/voteHelpers';
import { getAuthenticatedUser, getIsAuthenticated } from '../../../store/authStore/authSelectors';
import { getPendingLikes } from '../../../store/postsStore/postsSelectors';
import { sendTiktokPriview } from '../../../waivioApi/ApiClient';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import { setAuthorityForObject } from '../../../store/appendStore/appendActions';

const FeedItem = ({ post, photoQuantity, preview, isReviewsPage }) => {
  const imagePath = post?.imagePath;
  const embeds = post?.embeds;
  const lastIndex = imagePath?.length - 1;
  const is3speak = embeds[0]?.provider_name === '3Speak';
  const withoutImage = is3speak ? imagePath.length === 1 || isEmpty(imagePath) : isEmpty(imagePath);
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const user = useSelector(getAuthenticatedUser);
  const isAuthUser = useSelector(getIsAuthenticated);
  const defaultVotePersent = useSelector(getVotePercent);
  const wobject = useSelector(getObject);
  const userVotingPower = useSelector(getVotePercent);
  const pinnedPostsUrls = useSelector(getPinnedPostsUrls);
  const previewLoading = useSelector(getPreviewLoadingFromState);
  const pendingVote = useSelector(getPendingLikes)[post.id];
  const currentUserPin = pinnedPostsUrls.includes(post.url);
  const tooltipTitle = (
    <FormattedMessage
      id={currentUserPin ? 'unpin' : 'pin'}
      defaultMessage={currentUserPin ? 'Unpin' : 'Pin'}
    />
  );
  const pinClassName =
    post?.pin || (has(post, 'currentUserPin') && !post.currentUserPin)
      ? 'pin-grey'
      : 'pin-outlined';
  const isLiked = getUpvotes(post.active_votes).some(
    vote => vote.voter === user.name && !vote.fake,
  );
  const pendingLike =
    pendingVote && (pendingVote.weight > 0 || (pendingVote.weight === 0 && isLiked));

  const isTiktok = embeds[0]?.provider_name === 'TikTok';
  const [thumbnail, setThumbnail] = useState(preview);

  const handleLike = () => {
    const authorName = post.guestInfo ? post.root_author : post.author;

    dispatch(votePost(post.id, authorName, post.permlink, isLiked ? 0 : defaultVotePersent));
  };
  const pinPost = () => {
    dispatch(setAuthorityForObject(wobject, match));
    dispatch(handlePinPost(post, pinnedPostsUrls, user, match, wobject, userVotingPower));
  };

  useEffect(() => {
    if (isTiktok && !previewLoading) {
      if (!preview || !thumbnail) {
        fetch(
          `https://www.tiktok.com/oembed?url=https://www.tiktok.com/${embeds[0].url.replace(
            /\?.*/,
            '',
          )}`,
        )
          .then(data => data.json())
          .then(data => {
            setThumbnail(data.thumbnail_url);
            sendTiktokPriview(embeds[0].url, data.thumbnail_url);
          });
      }
    }
  }, []);

  if (withoutImage && isEmpty(embeds)) return null;
  if (isTiktok && !(thumbnail || preview)) return null;

  const handleShowPostModal = e => {
    e.preventDefault();

    if (typeof window !== 'undefined' && window?.gtag)
      window.gtag('event', 'view_post', { debug_mode: false });
    dispatch(showPostModal(post));
  };
  const likesCount = getUpvotes(post.active_votes).length;
  let embed = embeds[0];

  if (isTiktok) {
    embed = { ...embeds[0], thumbnail: preview || thumbnail };
  }

  if (is3speak) {
    embed = {
      ...embeds[0],
      thumbnail: imagePath[0],
    };
  }

  return (
    <div className={isReviewsPage && isAuthUser ? 'FeedMasonry__item-with-pin' : ''}>
      {isReviewsPage && isAuthUser && (
        <Tooltip
          placement="topLeft"
          title={tooltipTitle}
          overlayClassName="PinContainer"
          overlayStyle={{ top: '10px' }}
        >
          <ReactSVG
            className={currentUserPin ? 'pin-website-color' : pinClassName}
            wrapper="span"
            src="/images/icons/pin-outlined.svg"
            onClick={pinPost}
          />
        </Tooltip>
      )}
      <div className={'FeedMasonry__item'}>
        {isEmpty(embeds) ? (
          <div className="FeedMasonry__imgWrap">
            {take(imagePath, photoQuantity)?.map((image, index) => {
              if (image === '') return null;

              return (
                <CustomImage
                  className={classNames('FeedMasonry__img', {
                    'FeedMasonry__img--bottom':
                      lastIndex && (index === photoQuantity - 1 || index === lastIndex),
                    'FeedMasonry__img--top': lastIndex && !index,
                    'FeedMasonry__img--only': !lastIndex,
                  })}
                  onClick={handleShowPostModal}
                  src={image}
                  alt={post.title}
                  key={image}
                />
              );
            })}
          </div>
        ) : (
          <div
            className={classNames('FeedMasonry__videoContainer', {
              'FeedMasonry__videoContainer--withImage': !withoutImage,
              'FeedMasonry__videoContainer--tiktok': isTiktok,
            })}
          >
            {embed && <PostFeedEmbed key="embed" isSocial embed={embed} />}
            {!withoutImage && (
              <img
                className={classNames('FeedMasonry__img', 'FeedMasonry__img--bottom')}
                src={getProxyImageURL(imagePath[0])}
                alt={post.title}
                key={imagePath[0]}
                onClick={handleShowPostModal}
              />
            )}
          </div>
        )}
        <div className={'FeedMasonry__postInfo'}>
          <div className="FeedMasonry__titleWrap">
            <a
              className="FeedMasonry__title"
              href={`/@${post?.author}/${post?.permlink}`}
              onClick={handleShowPostModal}
              rel="noopener noreferrer"
              target="_blank"
            >
              {truncate(post?.title, {
                length: isMobile() ? 70 : 80,
                separator: '...',
              })}{' '}
            </a>
          </div>
          <Link to={`/@${post?.author}`} className="FeedMasonry__authorInfo">
            <Avatar username={post?.author} size={25} /> {post?.author}
          </Link>
        </div>
        <div className="FeedMasonry__likeWrap">
          <div className="FeedMasonry__postWrap">
            <span className="FeedMasonry__icon FeedMasonry__icon--cursor" onClick={handleLike}>
              {pendingLike ? (
                <Icon type="loading" />
              ) : (
                <i
                  className={classNames('iconfont icon-praise_fill', {
                    'iconfont--withMyLike': isLiked,
                  })}
                />
              )}{' '}
              {Boolean(likesCount) && <span>{likesCount}</span>}
            </span>
            {Boolean(post.children) && (
              <span className="FeedMasonry__icon">
                <i className="iconfont icon-message_fill" /> <span>{post.children}</span>
              </span>
            )}
            {Boolean(post?.reblogged_users?.length) && (
              <span className="FeedMasonry__icon FeedMasonry__icon--reblog">
                <i className="iconfont icon-share1" /> <span>{post?.reblogged_users?.length}</span>
              </span>
            )}
          </div>
          <Payout post={post} />
        </div>
      </div>
    </div>
  );
};

FeedItem.propTypes = {
  post: PropTypes.shape({
    author: PropTypes.string,
    url: PropTypes.string,
    currentUserPin: PropTypes.bool,
    pin: PropTypes.bool,
    json_metadata: PropTypes.string,
    permlink: PropTypes.string,
    title: PropTypes.string,
    active_votes: PropTypes.arrayOf(PropTypes.shape({})),
    reblogged_users: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.number,
    imagePath: PropTypes.arrayOf(PropTypes.string),
    embeds: PropTypes.arrayOf(PropTypes.shape({})),
    guestInfo: PropTypes.shape({}),
    root_author: PropTypes.string,
    id: PropTypes.string,
  }),
  photoQuantity: PropTypes.number,
  preview: PropTypes.string,
  isReviewsPage: PropTypes.bool,
};

export default FeedItem;
