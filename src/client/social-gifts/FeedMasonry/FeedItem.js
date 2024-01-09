import React, { useEffect, useState } from 'react';
import { isEmpty, take, truncate } from 'lodash';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { getProxyImageURL } from '../../../common/helpers/image';
import { getPreviewLoadingFromState } from '../../../store/feedStore/feedSelectors';
import CustomImage from '../../components/Image/Image';
import PostFeedEmbed from '../../components/Story/PostFeedEmbed';
import Avatar from '../../components/Avatar';
import { showPostModal } from '../../../store/appStore/appActions';
import Payout from '../../components/StoryFooter/Payout';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { votePost } from '../../../store/postsStore/postActions';
import { getVotePercent } from '../../../store/settingsStore/settingsSelectors';
import { getUpvotes } from '../../../common/helpers/voteHelpers';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getPendingLikes } from '../../../store/postsStore/postsSelectors';
import { sendTiktokPriview } from '../../../waivioApi/ApiClient';

const FeedItem = ({ post, photoQuantity, preview }) => {
  const imagePath = post?.imagePath;
  const embeds = post?.embeds;
  const lastIndex = imagePath?.length - 1;
  const withoutImage = isEmpty(imagePath);
  const dispatch = useDispatch();
  const defaultVotePersent = useSelector(getVotePercent);
  const authUserName = useSelector(getAuthenticatedUserName);
  const previewLoading = useSelector(getPreviewLoadingFromState);
  const pendingVote = useSelector(getPendingLikes)[post.id];
  const isLiked = getUpvotes(post.active_votes).some(
    vote => vote.voter === authUserName && !vote.fake,
  );
  const pendingLike =
    pendingVote && (pendingVote.weight > 0 || (pendingVote.weight === 0 && isLiked));

  const isTiktok = embeds[0]?.provider_name === 'TikTok';
  const [thumbnail, setThumbnail] = useState(preview);

  const handleLike = () => {
    const authorName = post.guestInfo ? post.root_author : post.author;

    dispatch(votePost(post.id, authorName, post.permlink, isLiked ? 0 : defaultVotePersent));
  };

  useEffect(() => {
    if (isTiktok && !previewLoading) {
      if (!preview) {
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

  const handleShowPostModal = () => {
    if (window?.gtag) window.gtag('event', 'view_post', { debug_mode: true });
    dispatch(showPostModal(post));
  };
  const likesCount = getUpvotes(post.active_votes).length;

  return (
    <div className="FeedMasonry__item">
      {isEmpty(embeds) ? (
        <div className="FeedMasonry__imgWrap">
          {take(imagePath, photoQuantity)?.map((image, index) => (
            <CustomImage
              className={classNames('FeedMasonry__img', {
                'FeedMasonry__img--bottom':
                  lastIndex && (index === photoQuantity - 1 || index === lastIndex),
                'FeedMasonry__img--top': lastIndex && !index,
                'FeedMasonry__img--only': !lastIndex,
              })}
              onClick={handleShowPostModal}
              src={image}
              alt={''}
              key={post?.title}
            />
          ))}
        </div>
      ) : (
        <div
          className={classNames('FeedMasonry__videoContainer', {
            'FeedMasonry__videoContainer--withImage': !withoutImage,
            'FeedMasonry__videoContainer--tiktok': isTiktok,
          })}
        >
          <PostFeedEmbed
            key="embed"
            isSocial
            embed={isTiktok ? { ...embeds[0], thumbnail: preview || thumbnail } : embeds[0]}
          />
          {!withoutImage && (
            <img
              className={classNames('FeedMasonry__img', 'FeedMasonry__img--bottom')}
              src={getProxyImageURL(imagePath[0])}
              alt={''}
              key={post?.title}
              onClick={handleShowPostModal}
            />
          )}
        </div>
      )}
      <div className={'FeedMasonry__postInfo'}>
        <div className="FeedMasonry__title" onClick={handleShowPostModal}>
          {truncate(post?.title, {
            length: isMobile() ? 70 : 80,
            separator: '...',
          })}
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
          <Link className="FeedMasonry__icon" to={`/@${post?.author}/${post?.permlink}`}>
            <span className={'iconfont icon-send'} />
          </Link>
        </div>
        <Payout post={post} />
      </div>
    </div>
  );
};

FeedItem.propTypes = {
  post: PropTypes.shape({
    author: PropTypes.string,
    permlink: PropTypes.string,
    title: PropTypes.string,
    active_votes: PropTypes.arrayOf(),
    reblogged_users: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.number,
    imagePath: PropTypes.arrayOf(),
    embeds: PropTypes.arrayOf(),
    guestInfo: PropTypes.shape({}),
    root_author: PropTypes.string,
    id: PropTypes.string,
  }),
  photoQuantity: PropTypes.number,
  preview: PropTypes.string,
};

export default FeedItem;
