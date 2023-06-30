import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import FeedMasonry from './FeedMasonry';
import { getUserProfileBlog } from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

const UserBlogFeed = () => {
  const { name } = useParams();
  const authUserName = useSelector(getAuthenticatedUserName);
  const [posts, setPosts] = useState();
  const [hasMore, setHasMore] = useState();
  const [loading, setLoading] = useState(true);

  const getPosts = skip => getUserProfileBlog(name, authUserName, { limit: 20, skip });

  useEffect(() => {
    getPosts(0).then(res => {
      setPosts(res.posts);
      setHasMore(res.hasMore);
      setLoading(false);
    });
  }, [name]);

  const loadMore = () => {
    setLoading(true);
    getPosts(posts?.length).then(res => {
      setPosts([...posts, ...res.posts]);
      setHasMore(res.hasMore);
      setLoading(false);
    });
  };

  return <FeedMasonry loading={loading} posts={posts} hasMore={hasMore} loadMore={loadMore} />;
};

export default UserBlogFeed;
