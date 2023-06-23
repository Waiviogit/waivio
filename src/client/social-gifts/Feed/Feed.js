import React, { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import InfiniteSroll from 'react-infinite-scroller';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getUserProfileBlog } from '../../../waivioApi/ApiClient';

import './Feed.less';
import FeedItem from './FeedItem';

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
        {posts?.map(post => (
          <FeedItem key={`${post.author}/${post?.permlink}`} post={post} />
        ))}
      </Masonry>
    </InfiniteSroll>
  );
};

export default Feed;
