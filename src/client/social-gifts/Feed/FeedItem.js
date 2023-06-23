import React from 'react';
import { isEmpty } from 'lodash';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getProxyImageURL } from '../../../common/helpers/image';
import PostFeedEmbed from '../../components/Story/PostFeedEmbed';
import Avatar from '../../components/Avatar';
import { getImageForPreview, getVideoForPreview } from '../../../common/helpers/postHelpers';

const FeedItem = ({ post }) => {
  const imagePath = getImageForPreview(post);
  const embeds = getVideoForPreview(post);
  const lastIndex = imagePath?.length - 1;

  if (isEmpty(imagePath) && isEmpty(embeds)) return null;

  return (
    <div className="Feed__item">
      {!isEmpty(imagePath) ? (
        <div className="Feed__imgWrap">
          {imagePath?.map((image, index) => (
            <img
              className={classNames('Feed__img', {
                'Feed__img--bottom': lastIndex && lastIndex === index,
                'Feed__img--top': lastIndex && !index,
                'Feed__img--only': !lastIndex,
              })}
              src={getProxyImageURL(image)}
              alt={''}
              key={post?.title}
            />
          ))}
        </div>
      ) : (
        <PostFeedEmbed key="embed" embed={embeds[0]} />
      )}
      <div className={'Feed__postInfo'}>
        <div className="Feed__title">{post?.title}</div>
        <Link to={`/@${post?.author}`} className="Feed__authorInfo">
          <Avatar username={post?.author} size={35} /> {post?.author}
        </Link>
      </div>
    </div>
  );
};

FeedItem.propTypes = {
  post: PropTypes.shape({
    author: PropTypes.string,
    permlink: PropTypes.string,
    title: PropTypes.string,
  }),
};

export default FeedItem;
