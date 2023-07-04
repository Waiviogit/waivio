import React from 'react';
import { isEmpty, take, truncate } from 'lodash';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Icon } from 'antd';
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

  if (withoutImage && isEmpty(embeds)) return null;

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
            'FeedMasonry__videoContainer--tiktok': embeds[0]?.provider_name === 'TikTok',
          })}
        >
          <PostFeedEmbed key="embed" embed={embeds[0]} />
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
        <div className="FeedMasonry__likeWrap">
          {Boolean(post.active_votes.length) && (
            <span className="FeedMasonry__icon">
              <Icon type="like" /> {post.active_votes.length}
            </span>
          )}
          {Boolean(post.children) && (
            <span className="FeedMasonry__icon">
              <i className="iconfont icon-message_fill" /> {post.children}
            </span>
          )}
          {Boolean(post?.reblogged_users?.length) && (
            <span className="FeedMasonry__icon">
              <i className="iconfont icon-share1" /> {post?.reblogged_users?.length}
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
