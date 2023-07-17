import React, { useEffect, useState } from 'react';
import { isEmpty, take, truncate } from 'lodash';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { getProxyImageURL } from '../../../common/helpers/image';
import PostFeedEmbed from '../../components/Story/PostFeedEmbed';
import Avatar from '../../components/Avatar';
import { showPostModal } from '../../../store/appStore/appActions';
import Payout from '../../components/StoryFooter/Payout';
import { isMobile } from '../../../common/helpers/apiHelpers';

const FeedItem = ({ post, photoQuantity }) => {
  const imagePath = post?.imagePath;
  const embeds = post?.embeds;
  const lastIndex = imagePath?.length - 1;
  const withoutImage = isEmpty(imagePath);
  const dispatch = useDispatch();
  const isTiktok = embeds[0]?.provider_name === 'TikTok';
  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    if (isTiktok) {
      fetch(
        `https://www.tiktok.com/oembed?url=https://www.tiktok.com/${embeds[0].url.replace(
          /\?.*/,
          '',
        )}`,
      )
        .then(res => res.json())
        .then(res => {
          setThumbnail(res.thumbnail_url);
        });
    }
  }, []);

  if (withoutImage && isEmpty(embeds)) return null;
  if (isTiktok && !thumbnail) return null;

  const handleShowPostModal = () => dispatch(showPostModal(post));

  return (
    <div className="FeedMasonry__item">
      {isEmpty(embeds) ? (
        <div className="FeedMasonry__imgWrap">
          {take(imagePath, photoQuantity)?.map((image, index) => (
            <img
              className={classNames('FeedMasonry__img', {
                'FeedMasonry__img--bottom':
                  lastIndex && (index === photoQuantity - 1 || index === lastIndex),
                'FeedMasonry__img--top': lastIndex && !index,
                'FeedMasonry__img--only': !lastIndex,
              })}
              onClick={handleShowPostModal}
              src={getProxyImageURL(image)}
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
            embed={isTiktok ? { ...embeds[0], thumbnail } : embeds[0]}
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
          {Boolean(post.active_votes.length) && (
            <span className="FeedMasonry__icon">
              <i className="iconfont icon-praise_fill" /> <span>{post.active_votes.length}</span>
            </span>
          )}
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
  }),
  photoQuantity: PropTypes.number,
};

export default FeedItem;
