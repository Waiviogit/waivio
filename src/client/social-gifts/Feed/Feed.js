import React, { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import InfiniteSroll from 'react-infinite-scroller';
import { isEmpty } from 'lodash';
import classNames from 'classnames';

import PostFeedEmbed from '../../components/Story/PostFeedEmbed';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getUserProfileBlog } from '../../../waivioApi/ApiClient';
import { getImageForPreview, getVideoForPreview } from '../../../common/helpers/postHelpers';
import Avatar from '../../components/Avatar';
import { getProxyImageURL } from '../../../common/helpers/image';

import './Feed.less';

const limit = 20;

const Feed = () => {
  const { name } = useParams();
  const authUserName = useSelector(getAuthenticatedUserName);
  const [posts, setPosts] = useState();
  const [hasMore, setHasMore] = useState();
  const breakpointColumnsObj = {
    default: 5,
    1100: 4,
    700: 3,
    500: 2,
  };

  useEffect(() => {
    getUserProfileBlog(name, authUserName, { limit, skip: 0 }).then(res => {
      setPosts(res.posts);
      setHasMore(res.hasMore);
    });
  }, [name]);

  const loadMore = () => {
    getUserProfileBlog(name, authUserName, { limit, skip: posts?.length }).then(res => {
      setPosts([...posts, ...res.posts]);
      setHasMore(res.hasMore);
    });
  };

  return (
    <InfiniteSroll hasMore={hasMore} loadMore={loadMore}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="Feed my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {posts?.map(post => {
          const imagePath = getImageForPreview(post);
          const embeds = getVideoForPreview(post);
          const lastIndex = imagePath?.length - 1;

          if (isEmpty(imagePath) && isEmpty(embeds)) return null;

          return (
            <div className="Feed__item" key={`${post.author}/${post?.permlink}`}>
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
                      alt={post?.title}
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
        })}
      </Masonry>
    </InfiniteSroll>
  );
};

export default Feed;
